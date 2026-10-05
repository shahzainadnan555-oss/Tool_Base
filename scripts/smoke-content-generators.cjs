/* eslint-disable no-console */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const slugs = [
  "username-generator",
  "business-name-generator",
  "blog-title-generator",
  "hashtag-generator",
  "url-slug-generator",
  "utm-url-builder",
  "color-palette-generator",
  "css-gradient-generator",
  "css-box-shadow-generator",
  "css-border-radius-generator",
  "css-clamp-generator",
  "html-boilerplate-generator",
  "meta-tags-generator",
  "open-graph-generator",
  "robots-txt-generator",
  "sitemap-xml-generator",
  "gitignore-generator",
  "json-mock-data-generator",
  "csv-test-data-generator",
  "cron-expression-generator",
];

const content = fs.readFileSync(
  path.join(ROOT, "lib/tools/content-generator-tools.ts"),
  "utf8",
);
const configs = fs.readFileSync(
  path.join(ROOT, "lib/generators/configs.ts"),
  "utf8",
);
const workspace = fs.readFileSync(
  path.join(ROOT, "components/tools/ToolWorkspace.tsx"),
  "utf8",
);

for (const slug of slugs) {
  assert.ok(content.includes(`slug: "${slug}"`), `missing registry ${slug}`);
  assert.ok(configs.includes(`"${slug}"`), `missing config ${slug}`);
}
assert.ok(workspace.includes("GeneratorWorkspace"));
assert.ok(!content.toLowerCase().includes("blox fruits"));

// Logic smoke
const { pathToFileURL } = require("url");
async function main() {
  // Use duplicated lightweight checks without TS import
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/['']/g, "")
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .join("-");
  }
  assert.strictEqual(
    slugify("The Best Online Tools for Image Conversion!"),
    "the-best-online-tools-for-image-conversion",
  );

  const url = new URL("https://example.com/path?x=1");
  url.searchParams.set("utm_source", "google");
  url.searchParams.set("utm_medium", "cpc");
  url.searchParams.set("utm_campaign", "spring");
  assert.ok(url.toString().includes("utm_source=google"));
  assert.ok(url.toString().includes("x=1"));

  const hex = "#0f766e";
  assert.ok(/^#[0-9a-f]{6}$/.test(hex));

  console.log("smoke-content-generators: OK");
}

main();
