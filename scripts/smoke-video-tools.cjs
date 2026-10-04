/**
 * Smoke-test representative video tools.
 * Requires: npm run build && npm run start -- -p 3456
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.TOOLBASE_BASE || "http://127.0.0.1:3456";
const OUT = "/tmp/toolmyra-video-out";
const SAMPLES = "/tmp/toolmyra-video-samples";

function ensureDirs() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(SAMPLES, { recursive: true });
}

async function makeSampleWebm(page) {
  const out = path.join(SAMPLES, "sample.webm");
  if (fs.existsSync(out) && fs.statSync(out).size > 1000) return out;
  const b64 = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    const stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    const done = new Promise((resolve) => {
      recorder.onstop = () => resolve(undefined);
    });
    recorder.start();
    let frame = 0;
    await new Promise((resolve) => {
      const tick = () => {
        ctx.fillStyle = frame % 2 === 0 ? "#1d4ed8" : "#0f172a";
        ctx.fillRect(0, 0, 320, 240);
        ctx.fillStyle = "#fff";
        ctx.font = "28px sans-serif";
        ctx.fillText(`TM ${frame}`, 100, 120);
        frame += 1;
        if (frame < 20) requestAnimationFrame(tick);
        else resolve(undefined);
      };
      tick();
    });
    await new Promise((r) => setTimeout(r, 200));
    recorder.stop();
    await done;
    const blob = new Blob(chunks, { type: "video/webm" });
    const ab = await blob.arrayBuffer();
    let s = "";
    const bytes = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i += 1) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  });
  fs.writeFileSync(out, Buffer.from(b64, "base64"));
  return out;
}

async function uploadAndRun(page, slug, action, filePath, expectExt) {
  await page.goto(`${BASE}/tools/${slug}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('input[type="file"]', { timeout: 45000 });
  const h1 = await page.locator("h1").first().textContent();
  if (!h1?.trim()) throw new Error("Missing H1");
  await page.locator('input[type="file"]').first().setInputFiles(filePath);
  await page.waitForSelector("text=Selected video", { timeout: 30000 });
  await page.getByRole("button", { name: action, exact: true }).click();
  await page.getByText("Result ready").waitFor({ timeout: 240000 });
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 20000 }),
    page.getByRole("button", { name: "Download", exact: true }).click(),
  ]);
  const name = download.suggestedFilename();
  if (!name.toLowerCase().endsWith(`.${expectExt}`)) {
    throw new Error(`Unexpected filename ${name}`);
  }
  if (/\.(mp4|webm|gif|mp3|wav|png)\.\1$/i.test(name)) {
    throw new Error(`Double extension ${name}`);
  }
  const savePath = path.join(OUT, `${slug}-${name}`);
  await download.saveAs(savePath);
  const size = fs.statSync(savePath).size;
  if (size < 32) throw new Error(`Tiny output ${size}`);
  await page.getByRole("button", { name: /Convert Another Video|Start Over|Extract Another|Check Another/i }).click();
  await page.waitForSelector('input[type="file"]', { timeout: 15000 });
  return { name, size, h1 };
}

(async () => {
  ensureDirs();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  page.on("pageerror", (err) => console.log("PAGE_ERR", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE_ERR", msg.text());
  });

  let fails = 0;
  async function run(label, fn) {
    try {
      const info = await fn();
      console.log("OK", label, info.name || "", info.size || "");
    } catch (error) {
      console.log("FAIL", label, error.message);
      fails += 1;
    }
  }

  const helper = await browser.newPage();
  await helper.goto("about:blank");
  const webmPath = await makeSampleWebm(helper);
  await helper.close();
  console.log("sample", webmPath, fs.statSync(webmPath).size);

  let mp4Path = path.join(SAMPLES, "sample.mp4");
  await run("webm-to-mp4", async () => {
    const info = await uploadAndRun(page, "webm-to-mp4", "Convert to MP4", webmPath, "mp4");
    const downloaded = fs
      .readdirSync(OUT)
      .find((f) => f.startsWith("webm-to-mp4-") && f.endsWith(".mp4"));
    if (!downloaded) throw new Error("Missing mp4 sample");
    fs.copyFileSync(path.join(OUT, downloaded), mp4Path);
    return info;
  });

  if (!fs.existsSync(mp4Path) || fs.statSync(mp4Path).size < 32) {
    console.log("Cannot continue without MP4 sample");
    await browser.close();
    process.exit(1);
  }

  await run("mp4-to-webm", () =>
    uploadAndRun(page, "mp4-to-webm", "Convert to WebM", mp4Path, "webm"),
  );
  await run("video-compressor", () =>
    uploadAndRun(page, "video-compressor", "Compress Video", mp4Path, "mp4"),
  );
  await run("video-resizer", async () => {
    await page.goto(`${BASE}/tools/video-resizer`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]');
    await page.locator('input[type="file"]').first().setInputFiles(mp4Path);
    await page.waitForSelector("text=Selected video");
    await page.getByRole("button", { name: "640×360", exact: true }).click();
    await page.getByRole("button", { name: "Resize Video", exact: true }).click();
    await page.getByText("Result ready").waitFor({ timeout: 240000 });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download", exact: true }).click(),
    ]);
    const name = download.suggestedFilename();
    const savePath = path.join(OUT, `resize-${name}`);
    await download.saveAs(savePath);
    return { name, size: fs.statSync(savePath).size };
  });
  await run("video-trimmer", async () => {
    await page.goto(`${BASE}/tools/video-trimmer`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]');
    await page.locator('input[type="file"]').first().setInputFiles(mp4Path);
    await page.waitForSelector("text=Selected video");
    await page.locator('label:has-text("Start") input').fill("0");
    await page.locator('label:has-text("End") input').fill("0.8");
    await page.getByRole("button", { name: "Trim Video", exact: true }).click();
    await page.getByText("Result ready").waitFor({ timeout: 240000 });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download", exact: true }).click(),
    ]);
    const name = download.suggestedFilename();
    const savePath = path.join(OUT, `trim-${name}`);
    await download.saveAs(savePath);
    return { name, size: fs.statSync(savePath).size };
  });
  await run("video-rotator", () =>
    uploadAndRun(page, "video-rotator", "Rotate Video", mp4Path, "mp4"),
  );
  await run("video-thumbnail-extractor", () =>
    uploadAndRun(page, "video-thumbnail-extractor", "Download Thumbnail", mp4Path, "png"),
  );
  await run("video-metadata-viewer", async () => {
    await page.goto(`${BASE}/tools/video-metadata-viewer`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]');
    await page.locator('input[type="file"]').first().setInputFiles(mp4Path);
    await page.waitForSelector("table tbody tr", { timeout: 60000 });
    const rows = await page.locator("table tbody tr").count();
    if (rows < 3) throw new Error(`Expected metadata rows, got ${rows}`);
    return { name: "metadata", size: rows };
  });
  await run("mp4-to-gif", async () => {
    await page.goto(`${BASE}/tools/mp4-to-gif`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]');
    await page.locator('input[type="file"]').first().setInputFiles(mp4Path);
    await page.waitForSelector("text=Selected video");
    await page.locator('label:has-text("End") input').fill("0.8");
    await page.getByRole("button", { name: "Convert to GIF", exact: true }).click();
    await page.getByText("Result ready").waitFor({ timeout: 240000 });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download", exact: true }).click(),
    ]);
    const name = download.suggestedFilename();
    const savePath = path.join(OUT, `gif-${name}`);
    await download.saveAs(savePath);
    const buf = fs.readFileSync(savePath);
    if (buf.toString("ascii", 0, 3) !== "GIF") throw new Error("Invalid GIF magic");
    return { name, size: buf.length };
  });

  // Search + category regression
  await run("search-ui", async () => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    const input = page.locator('input[type="search"]').first();
    const styles = await input.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { pl: parseFloat(cs.paddingLeft), pr: parseFloat(cs.paddingRight) };
    });
    if (styles.pl < 36 || styles.pr < 64) {
      throw new Error(`Search padding regression pl=${styles.pl} pr=${styles.pr}`);
    }
    await input.fill("compress");
    await page.waitForSelector("text=Video Compressor", { timeout: 10000 });
    await input.fill("gif");
    await page.waitForSelector("text=MP4 to GIF", { timeout: 10000 });
    return { name: "search", size: Math.round(styles.pl + styles.pr) };
  });

  await run("video-category", async () => {
    await page.goto(`${BASE}/categories/video-tools`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("text=Video Tools");
    const links = await page.locator('a[href^="/tools/"]').count();
    if (links < 20) throw new Error(`Expected 20+ tool links, got ${links}`);
    return { name: "category", size: links };
  });

  await run("audio-still-works", async () => {
    await page.goto(`${BASE}/tools/mp3-to-wav`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]', { timeout: 30000 });
    return { name: "audio-route", size: 1 };
  });

  await browser.close();
  console.log("FUNCTIONAL_FAILS", fails);
  process.exit(fails ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
