/**
 * Browser smoke for security/encoding tools.
 * TOOLBASE_BASE=http://localhost:3000 node scripts/smoke-security-tools-browser.cjs
 */
const { chromium } = require("playwright");

const BASE = process.env.TOOLBASE_BASE || "http://localhost:3000";

const TOOLS = [
  { slug: "sha256-hash-generator", h1: "SHA-256 Hash Generator", input: "abc", action: "Generate Hash", expect: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" },
  { slug: "sha512-hash-generator", h1: "SHA-512 Hash Generator", input: "abc", action: "Generate Hash" },
  { slug: "md5-hash-generator", h1: "MD5 Hash Generator", input: "abc", action: "Generate Hash", expect: "900150983cd24fb0d6963f7d28e17f72" },
  { slug: "sha1-hash-generator", h1: "SHA-1 Hash Generator", input: "abc", action: "Generate Hash" },
  { slug: "uuid-generator", h1: "UUID Generator", action: "Generate UUIDs" },
  { slug: "password-generator", h1: "Secure Password Generator", action: "Generate Password" },
  { slug: "random-string-generator", h1: "Random String Generator", action: "Generate" },
  { slug: "random-number-generator", h1: "Random Number Generator", action: "Generate" },
  { slug: "hex-to-text", h1: "Hex to Text Converter", input: "48 65 6c 6c 6f", live: true, expect: "Hello" },
  { slug: "text-to-hex", h1: "Text to Hex Converter", input: "Hello", live: true, expect: "48 65 6c 6c 6f" },
  { slug: "binary-to-text", h1: "Binary to Text Converter", input: "01001000 01101001", live: true, expect: "Hi" },
  { slug: "text-to-binary", h1: "Text to Binary Converter", input: "A", live: true, expect: "01000001" },
  { slug: "decimal-to-binary", h1: "Decimal to Binary Converter", input: "10", live: true, expect: "1010" },
  { slug: "binary-to-decimal", h1: "Binary to Decimal Converter", input: "1010", live: true, expect: "10" },
  { slug: "base32-encoder-decoder", h1: "Base32 Encoder/Decoder", input: "Hi", action: "Convert" },
  { slug: "base64-file-converter", h1: "Base64 File Converter", skipRun: true },
  { slug: "jwt-decoder", h1: "JWT Decoder", action: "Decode JWT", jwt: true },
  { slug: "unix-timestamp-generator", h1: "Unix Timestamp Generator", action: "Generate Timestamp" },
  { slug: "unix-timestamp-converter", h1: "Unix Timestamp Converter", input: "0", live: true, expectText: "UTC" },
  { slug: "qr-code-generator", h1: "QR Code Generator", input: "https://tool-base.app", action: "Generate QR Code", qr: true },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const failures = [];

  for (const tool of TOOLS) {
    try {
      await page.goto(`${BASE}/tools/${tool.slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("h1", { timeout: 30000 });
      const h1 = (await page.locator("h1").first().textContent())?.trim();
      if (h1 !== tool.h1) throw new Error(`H1 mismatch: ${h1}`);

      if ((await page.locator("main").getByText(/Report a Problem|Report Tool/i).count()) > 0) {
        throw new Error("Report UI present");
      }

      if (tool.skipRun) {
        await page.waitForSelector('input[type="file"]', { timeout: 30000 });
      } else if (tool.jwt) {
          const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
          const payload = Buffer.from(JSON.stringify({ sub: "1", name: "Tool Base" })).toString("base64url");
          await page.waitForSelector("textarea", { timeout: 30000 });
          await page.locator("textarea").first().fill(`${header}.${payload}.sig`);
          await page.getByRole("button", { name: tool.action }).click();
          await page.waitForTimeout(400);
          const body = await page.locator("main").innerText();
          if (!body.includes("Decoded — Not Verified") || !body.includes("Tool Base")) {
            throw new Error("JWT decode failed");
          }
        } else if (tool.qr) {
          await page.waitForSelector("textarea", { timeout: 30000 });
          await page.locator("textarea").first().fill(tool.input);
          await page.getByRole("button", { name: tool.action }).click();
          await page.waitForSelector('img[alt="Generated QR code"]', { timeout: 20000 });
        } else if (tool.action && !tool.live) {
          if (tool.input) {
            await page.waitForSelector("textarea", { timeout: 30000 });
            await page.locator("textarea").first().fill(tool.input);
          }
          await page.getByRole("button", { name: tool.action }).click();
          await page.waitForTimeout(500);
          if (tool.expect) {
            const areas = page.locator("textarea");
            const count = await areas.count();
            const out = count > 1 ? await areas.nth(1).inputValue() : await areas.first().inputValue();
            if (!out.includes(tool.expect)) throw new Error(`Output mismatch: ${out}`);
          } else {
            const areas = page.locator("textarea");
            const count = await areas.count();
            const out = count > 1 ? await areas.nth(count - 1).inputValue() : await areas.first().inputValue();
            if (!out) throw new Error("Empty output");
          }
        } else if (tool.live) {
          await page.waitForSelector("textarea", { timeout: 30000 });
          await page.locator("textarea").first().fill(tool.input);
          await page.waitForTimeout(400);
          if (tool.expectText) {
            const body = await page.locator("main").innerText();
            if (!body.includes(tool.expectText)) throw new Error(`Missing ${tool.expectText}`);
          }
          if (tool.expect) {
            const out = await page.locator("textarea").nth(1).inputValue();
            if (!out.includes(tool.expect)) throw new Error(`Output mismatch: ${out}`);
          }
        }

      const clear = page.locator("main").getByRole("button", { name: "Clear", exact: true });
      if (await clear.count()) await clear.click();
      console.log(`OK  /tools/${tool.slug}`);
    } catch (err) {
      failures.push(`${tool.slug}: ${err.message}`);
      console.error(`FAIL /tools/${tool.slug}: ${err.message}`);
    }
  }

  try {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const search = page.locator('input[type="search"]').first();
    await search.click();
    await search.fill("");
    await search.pressSequentially("hash", { delay: 25 });
    await page.getByRole("option", { name: /SHA-256/i }).waitFor({ state: "visible", timeout: 15000 });
    console.log("OK  search: hash");
  } catch (err) {
    failures.push(`search: ${err.message}`);
    console.error(`FAIL search: ${err.message}`);
  }

  try {
    await page.goto(`${BASE}/categories/security-encoding`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    if (!body.includes("SHA-256") || !body.includes("QR Code Generator")) throw new Error("category incomplete");
    console.log("OK  /categories/security-encoding");
  } catch (err) {
    failures.push(`category: ${err.message}`);
    console.error(`FAIL category: ${err.message}`);
  }

  for (const path of ["/", "/tools/json-formatter", "/tools/word-counter"]) {
    const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
    if (!res || res.status() >= 400) failures.push(`regression ${path}`);
    else console.log(`OK  regression ${path}`);
  }

  await browser.close();
  if (failures.length) {
    console.error(`\n${failures.length} failure(s)`);
    process.exit(1);
  }
  console.log("\nAll security tool browser smokes passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
