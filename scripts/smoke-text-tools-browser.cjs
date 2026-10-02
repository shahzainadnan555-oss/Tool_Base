/**
 * Browser smoke for all 20 text tools against a running Next server.
 * Usage: TOOLMYRA_BASE=http://127.0.0.1:3000 node scripts/smoke-text-tools-browser.cjs
 */
const { chromium } = require("playwright");

const BASE = process.env.TOOLMYRA_BASE || "http://127.0.0.1:3000";

const TOOLS = [
  { slug: "word-counter", h1: "Word Counter", live: true, type: "stats" },
  { slug: "character-counter", h1: "Character Counter", live: true, type: "stats" },
  { slug: "sentence-counter", h1: "Sentence Counter", live: true, type: "stats" },
  { slug: "paragraph-counter", h1: "Paragraph Counter", live: true, type: "stats" },
  { slug: "reading-time-calculator", h1: "Reading Time Calculator", live: true, type: "stats" },
  { slug: "text-case-converter", h1: "Text Case Converter", live: true, type: "io" },
  { slug: "uppercase-converter", h1: "Uppercase Converter", live: true, type: "io", expectOut: "HELLO WORLD" },
  { slug: "lowercase-converter", h1: "Lowercase Converter", live: true, type: "io", input: "HELLO WORLD", expectOut: "hello world" },
  { slug: "title-case-converter", h1: "Title Case Converter", live: true, type: "io" },
  { slug: "sentence-case-converter", h1: "Sentence Case Converter", live: true, type: "io" },
  { slug: "remove-extra-spaces", h1: "Remove Extra Spaces", live: true, type: "io", input: "hello    world" },
  { slug: "remove-duplicate-lines", h1: "Remove Duplicate Lines", live: true, type: "io", input: "apple\nbanana\napple\norange", expectOut: "apple\nbanana\norange" },
  { slug: "sort-lines", h1: "Sort Lines Alphabetically", live: true, type: "io", input: "banana\napple\ncherry" },
  { slug: "reverse-text", h1: "Reverse Text", live: true, type: "io", input: "Hello", expectOut: "olleH" },
  { slug: "reverse-words", h1: "Reverse Words", live: true, type: "io", input: "Hello world from ToolMyra", expectOut: "ToolMyra from world Hello" },
  { slug: "text-repeater", h1: "Text Repeater", live: false, type: "repeat", input: "Hi", action: "Repeat Text" },
  { slug: "text-cleaner", h1: "Text Cleaner", live: true, type: "io", input: "  hello   \n\n\n  world  " },
  { slug: "find-and-replace", h1: "Find & Replace Tool", live: false, type: "replace", input: "hello hello", action: "Replace" },
  { slug: "text-diff-checker", h1: "Text Diff Checker", live: true, type: "diff" },
  { slug: "lorem-ipsum-generator", h1: "Lorem Ipsum Generator", live: false, type: "generate", action: "Generate" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const failures = [];

  for (const tool of TOOLS) {
    const url = `${BASE}/tools/${tool.slug}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector("h1", { timeout: 30000 });
      const h1 = (await page.locator("h1").first().textContent())?.trim();
      if (h1 !== tool.h1) throw new Error(`H1 mismatch: got "${h1}"`);

      const title = await page.title();
      if (!title.includes(tool.h1.split(" ")[0]) && !title.includes("ToolMyra")) {
        throw new Error(`Unexpected title: ${title}`);
      }

      // No report UI in workspace
      const reportInMain = await page.locator("main").getByText(/Report a Problem|Report Tool/i).count();
      if (reportInMain > 0) throw new Error("Report UI found in tool page main");

      if (tool.type === "generate") {
        await page.getByRole("button", { name: tool.action }).click();
        await page.waitForTimeout(200);
        const out = await page.locator("textarea").first().inputValue();
        if (!out || out.length < 10) throw new Error("Lorem generate produced empty output");
      } else if (tool.type === "diff") {
        const areas = page.locator("textarea");
        await areas.nth(0).fill("line one\nline two");
        await areas.nth(1).fill("line one\nline changed");
        await page.waitForTimeout(300);
        const added = await page.getByText("Added:", { exact: false }).count();
        const removed = await page.getByText("Removed:", { exact: false }).count();
        // sr-only labels
        if (added + removed < 1) {
          // visual +/− may still be present
          const plus = await page.locator("text=+").count();
          if (plus < 1) throw new Error("Diff view did not render changes");
        }
      } else if (tool.type === "replace") {
        await page.locator("textarea").first().fill(tool.input);
        await page.getByPlaceholder("Text to find").fill("hello");
        await page.getByPlaceholder("Replacement text").fill("hi");
        await page.getByRole("button", { name: tool.action }).click();
        await page.waitForTimeout(200);
        const out = await page.locator("textarea").nth(1).inputValue();
        if (!out.includes("hi")) throw new Error(`Replace failed: ${out}`);
      } else if (tool.type === "repeat") {
        await page.locator("textarea").first().fill(tool.input);
        await page.getByRole("button", { name: tool.action }).click();
        await page.waitForTimeout(200);
        const out = await page.locator("textarea").nth(1).inputValue();
        if (!out.includes("Hi")) throw new Error(`Repeat failed: ${out}`);
      } else {
        const input = tool.input || "Hello world";
        await page.locator("textarea").first().fill(input);
        await page.waitForTimeout(250);
        if (tool.type === "stats") {
          const words = await page.getByText("Words", { exact: true }).count();
          if (!words) throw new Error("Stats bar missing Words");
        } else if (tool.type === "io") {
          const out = await page.locator("textarea").nth(1).inputValue();
          if (tool.expectOut != null && out !== tool.expectOut) {
            throw new Error(`Output mismatch for ${tool.slug}: got ${JSON.stringify(out)}`);
          }
          if (!out && input) throw new Error("Empty output");
        }
      }

      // Clear works
      const clear = page.getByRole("button", { name: "Clear" });
      if (await clear.count()) await clear.click();

      console.log(`OK  /tools/${tool.slug}`);
    } catch (err) {
      failures.push(`${tool.slug}: ${err.message}`);
      console.error(`FAIL /tools/${tool.slug}: ${err.message}`);
    }
  }

  // Search regression
  try {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const search = page.locator('input[type="search"]').first();
    await search.waitFor({ state: "visible", timeout: 15000 });
    await search.click();
    await search.fill("");
    await search.pressSequentially("case", { delay: 40 });
    await page.getByRole("option", { name: /Text Case Converter/i }).waitFor({
      state: "visible",
      timeout: 15000,
    });
    for (const name of ["Text Case Converter", "Uppercase Converter", "Lowercase Converter"]) {
      const option = page.getByRole("option", { name: new RegExp(name, "i") });
      if ((await option.count()) === 0) throw new Error(`Search missing ${name}`);
    }
    console.log("OK  search: case");
  } catch (err) {
    failures.push(`search: ${err.message}`);
    console.error(`FAIL search: ${err.message}`);
  }

  // Category page
  try {
    await page.goto(`${BASE}/categories/text-tools`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    if (!body.includes("Word Counter")) throw new Error("Category missing Word Counter");
    if (!body.includes("Lorem Ipsum Generator")) throw new Error("Category missing Lorem");
    console.log("OK  /categories/text-tools");
  } catch (err) {
    failures.push(`category: ${err.message}`);
    console.error(`FAIL category: ${err.message}`);
  }

  await browser.close();
  if (failures.length) {
    console.error(`\n${failures.length} failure(s)`);
    process.exit(1);
  }
  console.log("\nAll text tool browser smokes passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
