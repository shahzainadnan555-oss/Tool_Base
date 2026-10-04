/**
 * Browser smoke for developer tools.
 * TOOLBASE_BASE=http://localhost:3000 node scripts/smoke-developer-tools-browser.cjs
 */
const { chromium } = require("playwright");

const BASE = process.env.TOOLBASE_BASE || "http://localhost:3000";

const TOOLS = [
  {
    slug: "json-formatter",
    h1: "JSON Formatter",
    input: '{"name":"Tool Base","active":true}',
    action: "Format JSON",
    expect: '"name"',
  },
  {
    slug: "json-validator",
    h1: "JSON Validator",
    input: '{"ok":true}',
    live: true,
    expectText: "Valid JSON",
  },
  {
    slug: "json-minifier",
    h1: "JSON Minifier",
    input: '{\n  "name": "Tool Base"\n}',
    action: "Minify JSON",
    expect: '{"name":"Tool Base"}',
  },
  {
    slug: "html-formatter",
    h1: "HTML Formatter",
    input: "<div><span>Hello</span></div>",
    action: "Format HTML",
  },
  {
    slug: "html-minifier",
    h1: "HTML Minifier",
    input: "<div>  <span> Hello </span>  </div>",
    action: "Minify HTML",
  },
  {
    slug: "css-formatter",
    h1: "CSS Formatter",
    input: "body{margin:0;padding:0;}",
    action: "Format CSS",
  },
  {
    slug: "css-minifier",
    h1: "CSS Minifier",
    input: "body { margin: 0; padding: 0; }",
    action: "Minify CSS",
  },
  {
    slug: "javascript-formatter",
    h1: "JavaScript Formatter",
    input: "const add=(a,b)=>{return a+b;}",
    action: "Format JavaScript",
  },
  {
    slug: "javascript-minifier",
    h1: "JavaScript Minifier",
    input: "const add = (a, b) => { return a + b; };",
    action: "Minify JavaScript",
  },
  {
    slug: "xml-formatter",
    h1: "XML Formatter",
    input: "<root><item id=\"1\">Tool Base</item></root>",
    action: "Format XML",
  },
  {
    slug: "xml-validator",
    h1: "XML Validator",
    input: "<root><item/></root>",
    live: true,
    expectText: "Valid XML",
  },
  {
    slug: "sql-formatter",
    h1: "SQL Formatter",
    input: "SELECT id, name FROM users WHERE active = true ORDER BY name;",
    action: "Format SQL",
  },
  {
    slug: "sql-minifier",
    h1: "SQL Minifier",
    input: "SELECT id, name FROM users WHERE active = true;",
    action: "Minify SQL",
  },
  {
    slug: "regex-tester",
    h1: "Regex Tester",
    pattern: "hello",
    input: "hello Tool Base hello",
    action: "Test Regex",
    expectText: "Matches:",
  },
  {
    slug: "regex-generator",
    h1: "Regex Generator",
    action: "Generate Regex",
    expectOut: true,
  },
  {
    slug: "base64-encoder",
    h1: "Base64 Encoder",
    input: "Hello Tool Base",
    live: true,
  },
  {
    slug: "base64-decoder",
    h1: "Base64 Decoder",
    input: "SGVsbG8gVG9vbE15cmE=",
    live: true,
    expect: "Hello Tool Base",
  },
  {
    slug: "url-encoder",
    h1: "URL Encoder",
    input: "hello world",
    live: true,
    expect: "hello%20world",
  },
  {
    slug: "url-decoder",
    h1: "URL Decoder",
    input: "hello%20world",
    live: true,
    expect: "hello world",
  },
  {
    slug: "html-entity-encoder",
    h1: "HTML Entity Encoder",
    input: "<div>Hello & welcome</div>",
    live: true,
    expect: "&lt;div&gt;Hello &amp; welcome&lt;/div&gt;",
  },
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

      const report = await page.locator("main").getByText(/Report a Problem|Report Tool/i).count();
      if (report > 0) throw new Error("Report UI present");

      if (tool.slug === "regex-tester") {
        await page.waitForSelector("textarea", { timeout: 30000 });
        await page.locator('input[placeholder], input.font-mono, input').filter({ hasNot: page.locator('[type=checkbox]') }).first().fill(tool.pattern);
        // Prefer labeled pattern input
        const pattern = page.locator("label:has-text('Pattern') input");
        if (await pattern.count()) await pattern.fill(tool.pattern);
        await page.locator("textarea").first().fill(tool.input);
        await page.getByRole("button", { name: tool.action }).click();
        await page.waitForTimeout(400);
        const body = await page.locator("main").innerText();
        if (!body.includes(tool.expectText)) throw new Error("Regex matches missing");
      } else if (tool.slug === "regex-generator") {
        await page.getByRole("button", { name: tool.action }).click();
        await page.waitForTimeout(300);
        const out = await page.locator("textarea").first().inputValue();
        if (!out) throw new Error("No generated regex");
      } else {
        await page.waitForSelector("textarea", { timeout: 30000 });
        await page.locator("textarea").first().fill(tool.input || "");
        if (tool.action) {
          await page.getByRole("button", { name: tool.action }).click();
          await page.waitForTimeout(600);
        } else {
          await page.waitForTimeout(400);
        }
        if (tool.expectText) {
          const body = await page.locator("main").innerText();
          if (!body.includes(tool.expectText)) throw new Error(`Missing ${tool.expectText}`);
        }
        if (tool.expect) {
          const areas = page.locator("textarea");
          const count = await areas.count();
          const out = count > 1 ? await areas.nth(1).inputValue() : await areas.first().inputValue();
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
    await search.pressSequentially("json", { delay: 30 });
    await page.getByRole("option", { name: /JSON Formatter/i }).waitFor({ state: "visible", timeout: 15000 });
    for (const name of ["JSON Formatter", "JSON Validator", "JSON Minifier"]) {
      if ((await page.getByRole("option", { name: new RegExp(name, "i") }).count()) === 0) {
        throw new Error(`Search missing ${name}`);
      }
    }
    console.log("OK  search: json");
  } catch (err) {
    failures.push(`search: ${err.message}`);
    console.error(`FAIL search: ${err.message}`);
  }

  try {
    await page.goto(`${BASE}/categories/developer-tools`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    if (!body.includes("JSON Formatter") || !body.includes("Regex Tester")) {
      throw new Error("Category missing tools");
    }
    console.log("OK  /categories/developer-tools");
  } catch (err) {
    failures.push(`category: ${err.message}`);
    console.error(`FAIL category: ${err.message}`);
  }

  // Light regression
  for (const path of ["/", "/tools/word-counter", "/tools/jpg-to-png"]) {
    const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
    if (!res || res.status() >= 400) failures.push(`regression ${path}`);
    else console.log(`OK  regression ${path}`);
  }

  await browser.close();
  if (failures.length) {
    console.error(`\n${failures.length} failure(s)`);
    process.exit(1);
  }
  console.log("\nAll developer tool browser smokes passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
