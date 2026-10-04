/**
 * Smoke-test a representative subset of audio tools with Playwright.
 * Requires: npm run build && npm run start -- -p 3456
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.TOOLBASE_BASE || "http://127.0.0.1:3456";
const OUT = "/tmp/toolmyra-audio-out";
const SAMPLES = "/tmp/toolmyra-audio-samples";

function ensureDirs() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(SAMPLES, { recursive: true });
}

function writeWavTone(filePath, seconds = 1, freq = 440) {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * seconds);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.35;
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.floor(sample * 32767))), 44 + i * 2);
  }
  fs.writeFileSync(filePath, buffer);
}

async function waitReady(page, text, timeout = 120000) {
  await page.waitForSelector(`text=${text}`, { timeout });
}

async function uploadAndRun(page, slug, action, filePath, expectDownloadExt) {
  await page.goto(`${BASE}/tools/${slug}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('input[type="file"]', { timeout: 45000 });
  const h1 = await page.locator("h1").first().textContent();
  if (!h1 || !h1.trim()) throw new Error("Missing H1");

  // Search bar regression on tool page (navbar)
  const search = page.locator('input[type="search"]').first();
  if (await search.count()) {
    const box = await search.boundingBox();
    if (!box || box.width < 80) throw new Error("Search bar layout broken");
  }

  await page.locator('input[type="file"]').first().setInputFiles(filePath);
  await page.waitForSelector("text=Selected audio", { timeout: 20000 });

  const loadersBefore = await page.locator("text=/Converting|Processing|Compressing|Trimming|Cutting|Joining|Adjusting|Changing|Generating|Removing|Reading/i").count();

  await page.getByRole("button", { name: action, exact: true }).click();

  // Only one processing indicator should appear during the job
  await page.waitForTimeout(400);
  const progressBlocks = page.locator('[aria-live="polite"], text=/…|\\.\\.\\./');
  // Wait for result
  await waitReady(page, "Result ready", 180000);

  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 20000 }),
    page.getByRole("button", { name: "Download", exact: true }).click(),
  ]);
  const name = download.suggestedFilename();
  if (!name.toLowerCase().endsWith(`.${expectDownloadExt}`)) {
    throw new Error(`Unexpected filename ${name}`);
  }
  if (/\.(mp3|wav|ogg|flac|m4a|aac)\.\1$/i.test(name)) {
    throw new Error(`Double extension ${name}`);
  }
  const savePath = path.join(OUT, `${slug}-${name}`);
  await download.saveAs(savePath);
  const size = fs.statSync(savePath).size;
  if (size < 32) throw new Error(`Tiny output ${size}`);

  // Magic checks for a few formats
  const buf = fs.readFileSync(savePath);
  if (expectDownloadExt === "wav" && buf.toString("ascii", 0, 4) !== "RIFF") {
    throw new Error("Invalid WAV magic");
  }
  if (expectDownloadExt === "mp3" && !(buf[0] === 0xff || buf.toString("ascii", 0, 3) === "ID3")) {
    throw new Error("Invalid MP3 magic");
  }
  if (expectDownloadExt === "png" && !(buf[0] === 0x89 && buf[1] === 0x50)) {
    throw new Error("Invalid PNG magic");
  }

  await page.getByRole("button", { name: /Convert Another Audio|Start Over|Check Another Audio/i }).click();
  await page.waitForSelector('input[type="file"]', { timeout: 15000 });

  return { name, size, h1, loadersBefore };
}

(async () => {
  ensureDirs();
  const wavPath = path.join(SAMPLES, "tone.wav");
  const wav2Path = path.join(SAMPLES, "tone-b.wav");
  writeWavTone(wavPath, 1.2, 440);
  writeWavTone(wav2Path, 0.8, 554);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  page.on("pageerror", (err) => console.log("PAGE_ERR", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE_ERR", msg.text());
  });

  let fails = 0;
  const results = [];

  async function run(label, fn) {
    try {
      const info = await fn();
      console.log("OK", label, info.name || "", info.size || "");
      results.push(label);
    } catch (error) {
      console.log("FAIL", label, error.message);
      fails += 1;
    }
  }

  // First convert WAV→MP3 to get an mp3 sample for other tools
  let mp3Path = path.join(SAMPLES, "tone.mp3");
  await run("wav-to-mp3", async () => {
    const info = await uploadAndRun(page, "wav-to-mp3", "Convert to MP3", wavPath, "mp3");
    // copy download for later
    const downloaded = fs.readdirSync(OUT).find((f) => f.startsWith("wav-to-mp3-") && f.endsWith(".mp3"));
    if (!downloaded) throw new Error("Missing mp3 sample");
    fs.copyFileSync(path.join(OUT, downloaded), mp3Path);
    return info;
  });

  if (!fs.existsSync(mp3Path) || fs.statSync(mp3Path).size < 32) {
    console.log("Cannot continue without MP3 sample");
    await browser.close();
    process.exit(1);
  }

  await run("mp3-to-wav", () =>
    uploadAndRun(page, "mp3-to-wav", "Convert to WAV", mp3Path, "wav"),
  );
  await run("mp3-to-ogg", () =>
    uploadAndRun(page, "mp3-to-ogg", "Convert to OGG", mp3Path, "ogg"),
  );
  await run("mp3-to-flac", () =>
    uploadAndRun(page, "mp3-to-flac", "Convert to FLAC", mp3Path, "flac"),
  );
  await run("mp3-to-aac", () =>
    uploadAndRun(page, "mp3-to-aac", "Convert to AAC", mp3Path, "aac"),
  );
  await run("mp3-to-m4a", () =>
    uploadAndRun(page, "mp3-to-m4a", "Convert to M4A", mp3Path, "m4a"),
  );
  await run("audio-compressor", () =>
    uploadAndRun(page, "audio-compressor", "Compress Audio", mp3Path, "mp3"),
  );
  await run("audio-volume-booster", () =>
    uploadAndRun(page, "audio-volume-booster", "Boost Volume", mp3Path, "mp3"),
  );
  await run("audio-speed-changer", async () => {
    await page.goto(`${BASE}/tools/audio-speed-changer`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]', { timeout: 45000 });
    await page.locator('input[type="file"]').first().setInputFiles(mp3Path);
    await page.waitForSelector("text=Selected audio");
    await page.getByRole("button", { name: "1.5x", exact: true }).click();
    await page.getByRole("button", { name: "Change Speed", exact: true }).click();
    await waitReady(page, "Result ready", 180000);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download", exact: true }).click(),
    ]);
    const name = download.suggestedFilename();
    const savePath = path.join(OUT, `speed-${name}`);
    await download.saveAs(savePath);
    return { name, size: fs.statSync(savePath).size };
  });
  await run("audio-trimmer", async () => {
    await page.goto(`${BASE}/tools/audio-trimmer`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]', { timeout: 45000 });
    await page.locator('input[type="file"]').first().setInputFiles(mp3Path);
    await page.waitForSelector("text=Selected audio");
    await page.locator('label:has-text("Start") input').fill("0.1");
    await page.locator('label:has-text("End") input').fill("0.7");
    await page.getByRole("button", { name: "Trim Audio", exact: true }).click();
    await waitReady(page, "Result ready", 180000);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download", exact: true }).click(),
    ]);
    const name = download.suggestedFilename();
    const savePath = path.join(OUT, `trim-${name}`);
    await download.saveAs(savePath);
    return { name, size: fs.statSync(savePath).size };
  });
  await run("audio-joiner", async () => {
    await page.goto(`${BASE}/tools/audio-joiner`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]', { timeout: 45000 });
    await page.locator('input[type="file"]').first().setInputFiles([wavPath, wav2Path]);
    await page.waitForSelector("text=Selected files");
    await page.getByRole("button", { name: "Join Audio", exact: true }).click();
    await waitReady(page, "Result ready", 180000);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download", exact: true }).click(),
    ]);
    const name = download.suggestedFilename();
    const savePath = path.join(OUT, `join-${name}`);
    await download.saveAs(savePath);
    return { name, size: fs.statSync(savePath).size };
  });
  await run("audio-waveform-generator", () =>
    uploadAndRun(page, "audio-waveform-generator", "Generate Waveform", mp3Path, "png"),
  );
  await run("audio-metadata-viewer", async () => {
    await page.goto(`${BASE}/tools/audio-metadata-viewer`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]', { timeout: 45000 });
    await page.locator('input[type="file"]').first().setInputFiles(mp3Path);
    await page.waitForSelector("text=Audio metadata", { timeout: 60000 });
    const rows = await page.locator("table tbody tr").count();
    const hasFileName = await page.getByText("File name").count();
    if (rows < 1 && hasFileName < 1) throw new Error("No metadata rows");
    return { name: "metadata", size: Math.max(rows, hasFileName) };
  });
  await run("silence-remover", () =>
    uploadAndRun(page, "silence-remover", "Remove Silence", mp3Path, "mp3"),
  );
  await run("audio-pitch-changer", () =>
    uploadAndRun(page, "audio-pitch-changer", "Change Pitch", mp3Path, "mp3"),
  );
  await run("audio-cutter", async () => {
    await page.goto(`${BASE}/tools/audio-cutter`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="file"]', { timeout: 45000 });
    await page.locator('input[type="file"]').first().setInputFiles(mp3Path);
    await page.waitForSelector("text=Selected audio");
    await page.getByRole("button", { name: "Play Selected Region", exact: true }).waitFor({ timeout: 10000 });
    await page.locator('label:has-text("End") input').fill("0.6");
    await page.getByRole("button", { name: "Cut Audio", exact: true }).click();
    await waitReady(page, "Result ready", 180000);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download", exact: true }).click(),
    ]);
    const name = download.suggestedFilename();
    const savePath = path.join(OUT, `cut-${name}`);
    await download.saveAs(savePath);
    return { name, size: fs.statSync(savePath).size };
  });

  // Global UI regression spots
  await run("search-ui", async () => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    const input = page.locator('input[type="search"]').first();
    await input.fill("mp3 to wav");
    await page.waitForSelector("text=MP3 to WAV", { timeout: 10000 });
    const styles = await input.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight };
    });
    const pl = parseFloat(styles.paddingLeft);
    const pr = parseFloat(styles.paddingRight);
    if (pl < 36 || pr < 64) throw new Error(`Search padding regression pl=${pl} pr=${pr}`);
    return { name: "search", size: Math.round(pl + pr) };
  });

  await run("audio-category", async () => {
    await page.goto(`${BASE}/categories/audio-tools`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("text=Audio Tools");
    const links = await page.locator('a[href^="/tools/"]').count();
    if (links < 20) throw new Error(`Expected 20+ tool links, got ${links}`);
    return { name: "category", size: links };
  });

  await browser.close();
  console.log("PASSED", results.length, "FUNCTIONAL_FAILS", fails);
  process.exit(fails ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
