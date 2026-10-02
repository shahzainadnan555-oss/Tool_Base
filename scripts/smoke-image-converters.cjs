const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "http://127.0.0.1:3456";
const SAMPLES = "/tmp/toolmyra-samples";
const DOWNLOADS = "/tmp/toolmyra-downloads";

const cases = [
  { slug: "jpg-to-png", file: "sample.jpg", outExt: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { slug: "png-to-jpg", file: "transparent.png", outExt: "jpg", magic: [0xff, 0xd8, 0xff] },
  { slug: "jpg-to-webp", file: "sample.jpg", outExt: "webp", magic: null },
  { slug: "webp-to-jpg", file: "generated.webp", outExt: "jpg", magic: [0xff, 0xd8, 0xff], needsWebp: true },
  { slug: "png-to-webp", file: "sample.png", outExt: "webp", magic: null },
  { slug: "webp-to-png", file: "generated.webp", outExt: "png", magic: [0x89, 0x50, 0x4e, 0x47], needsWebp: true },
  { slug: "gif-to-png", file: "sample.gif", outExt: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { slug: "gif-to-jpg", file: "sample.gif", outExt: "jpg", magic: [0xff, 0xd8, 0xff] },
  { slug: "bmp-to-jpg", file: "sample.bmp", outExt: "jpg", magic: [0xff, 0xd8, 0xff] },
  { slug: "bmp-to-png", file: "sample.bmp", outExt: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { slug: "tiff-to-jpg", file: "sample.tiff", outExt: "jpg", magic: [0xff, 0xd8, 0xff] },
  { slug: "tiff-to-png", file: "sample.tiff", outExt: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { slug: "svg-to-png", file: "sample.svg", outExt: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { slug: "png-to-svg", file: "sample.png", outExt: "svg", magicText: "<svg" },
  { slug: "svg-to-jpg", file: "sample.svg", outExt: "jpg", magic: [0xff, 0xd8, 0xff] },
  { slug: "ico-to-png", file: "sample.ico", outExt: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { slug: "png-to-ico", file: "sample.png", outExt: "ico", magic: [0x00, 0x00, 0x01, 0x00] },
  { slug: "avif-to-jpg", file: "generated.avif", outExt: "jpg", magic: [0xff, 0xd8, 0xff], needsAvif: true },
];

function startsWith(buf, magic) {
  return magic.every((b, i) => buf[i] === b);
}

async function ensureWebp(page) {
  const out = path.join(SAMPLES, "generated.webp");
  if (fs.existsSync(out) && fs.statSync(out).size > 20) return;
  const b64 = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, 0, 48, 48);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.9));
    if (!blob) return null;
    const ab = await blob.arrayBuffer();
    let s = "";
    const bytes = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  });
  if (!b64) throw new Error("Could not generate WebP sample in Chrome");
  fs.writeFileSync(out, Buffer.from(b64, "base64"));
}

async function ensureAvif(page) {
  const out = path.join(SAMPLES, "generated.avif");
  if (fs.existsSync(out) && fs.statSync(out).size > 20) return;
  const b64 = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(0, 0, 48, 48);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/avif", 0.8));
    if (!blob) return null;
    const ab = await blob.arrayBuffer();
    let s = "";
    const bytes = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  });
  if (!b64) throw new Error("Could not generate AVIF sample in Chrome");
  fs.writeFileSync(out, Buffer.from(b64, "base64"));
}

async function convertOnce(page, testCase) {
  const url = `${BASE}/tools/${testCase.slug}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1 }).waitFor();

  // no report UI
  if (await page.getByText("Report a Problem").count()) {
    throw new Error("Report UI should not appear on image converters");
  }

  const filePath = path.join(SAMPLES, testCase.file);
  const input = page.locator('input[type="file"]').first();
  await input.setInputFiles(filePath);

  if (testCase.expectError) {
    await page.locator("p[role='alert']").waitFor({ timeout: 5000 });
    return { ok: true, note: "expected validation error" };
  }

  await page.getByRole("button", { name: "Convert", exact: true }).click();
  const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
  await page.getByRole("button", { name: "Download", exact: true }).click();
  const download = await downloadPromise;
  const suggested = download.suggestedFilename();
  if (!suggested.toLowerCase().endsWith(`.${testCase.outExt}`)) {
    throw new Error(`Bad filename ${suggested}, expected .${testCase.outExt}`);
  }
  if (/\.(jpg|png|gif|webp|svg|bmp|tif|tiff|ico)\.(png|jpg|webp|svg|ico)$/i.test(suggested)) {
    throw new Error(`Double extension filename: ${suggested}`);
  }

  const target = path.join(DOWNLOADS, `${testCase.slug}-${suggested}`);
  await download.saveAs(target);
  const buf = fs.readFileSync(target);
  if (buf.length < 8) throw new Error("Downloaded file too small");
  if (testCase.magic && !startsWith(buf, testCase.magic)) {
    throw new Error(`Magic mismatch for ${testCase.slug}: ${buf.slice(0, 8).toString("hex")}`);
  }
  if (testCase.magicText && !buf.toString("utf8").includes(testCase.magicText)) {
    throw new Error(`Missing text marker in ${testCase.slug}`);
  }
  return { ok: true, file: suggested, bytes: buf.length };
}

(async () => {
  fs.mkdirSync(DOWNLOADS, { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const page = await browser.newPage({ acceptDownloads: true });

  // homepage regression
  await page.goto(BASE, { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").allTextContents();
  if (h1.length !== 1 || !h1[0].includes("Every Tool You Need")) {
    throw new Error(`Homepage H1 regression: ${JSON.stringify(h1)}`);
  }

  await ensureWebp(page);
  await ensureAvif(page);

  const results = [];
  for (const testCase of cases) {
    try {
      const result = await convertOnce(page, testCase);
      results.push({ slug: testCase.slug, status: "pass", ...result });
      console.log("PASS", testCase.slug, result.file || result.note || "");
    } catch (error) {
      results.push({ slug: testCase.slug, status: "fail", error: String(error) });
      console.error("FAIL", testCase.slug, error);
    }
  }

  // heic page loads (no sample available in CI-like env)
  await page.goto(`${BASE}/tools/heic-to-jpg`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: "HEIC to JPG Converter" }).waitFor();
  await page.getByText("Upload Your Image").waitFor();
  results.push({ slug: "heic-to-jpg", status: "pass", note: "page/workspace ok" });
  console.log("PASS heic-to-jpg page/workspace ok");

  await page.goto(`${BASE}/tools/heic-to-png`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: "HEIC to PNG Converter" }).waitFor();
  results.push({ slug: "heic-to-png", status: "pass", note: "page/workspace ok" });
  console.log("PASS heic-to-png page/workspace ok");

  // search discovers new tools
  await page.goto(`${BASE}/tools?q=heic`, { waitUntil: "networkidle" });
  const body = await page.textContent("body");
  if (!body.includes("HEIC to JPG") || !body.includes("HEIC to PNG")) {
    throw new Error("Search/registry did not list HEIC tools");
  }
  console.log("PASS search heic");

  await page.goto(`${BASE}/categories/image-tools`, { waitUntil: "networkidle" });
  const cat = await page.textContent("body");
  for (const slug of ["gif-to-png", "avif-to-jpg", "png-to-ico", "tiff-to-png"]) {
    if (!cat.toLowerCase().includes(slug.replace(/-/g, " ").split(" ")[0])) {
      // softer check: ensure tool cards exist by name fragments
    }
  }
  if (!cat.includes("GIF to PNG") || !cat.includes("AVIF to JPG") || !cat.includes("PNG to ICO")) {
    throw new Error("Image category missing new tools");
  }
  console.log("PASS category image-tools");

  await browser.close();

  const failed = results.filter((r) => r.status === "fail");
  console.log(JSON.stringify({ passed: results.length - failed.length, failed: failed.length, results }, null, 2));
  if (failed.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
