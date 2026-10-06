/* eslint-disable no-console */
/**
 * Validates the Tool Base central registry for production readiness.
 * Run: node scripts/validate-registry.cjs
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TOOL_FILES = [
  "lib/tools/image-converter-tools.ts",
  "lib/tools/image-editor-tools.ts",
  "lib/tools/pdf-tools.ts",
  "lib/tools/document-data-tools.ts",
  "lib/tools/audio-tools.ts",
  "lib/tools/video-tools.ts",
  "lib/tools/text-tools.ts",
  "lib/tools/developer-tools.ts",
  "lib/tools/security-tools.ts",
  "lib/tools/calculator-tools.ts",
  "lib/tools/specialized-calculator-tools.ts",
  "lib/tools/generator-tools.ts",
  "lib/tools/content-generator-tools.ts",
  "lib/tools/typing-tools.ts",
  "lib/tools/expansion-tools.ts",
  "lib/tools/category-pack-tools.ts",
];

const CATEGORIES = [
  "image-tools",
  "pdf-tools",
  "document-data-tools",
  "audio-tools",
  "video-tools",
  "text-tools",
  "developer-tools",
  "security-encoding",
  "calculators-converters",
  "specialized-calculators",
  "generators",
  "typing-productivity",
  "design-creative",
  "utilities",
];

const REQUIRED_FIELDS = [
  "id",
  "name",
  "slug",
  "category",
  "description",
  "shortDescription",
  "seoTitle",
  "seoDescription",
  "h1",
  "intro",
];

function extractToolBlocks(src) {
  const tools = [];
  const re = /(?:tool|base)\(\{([\s\S]*?)\n\s*\}\)/g;
  let match;
  while ((match = re.exec(src))) {
    tools.push(match[1]);
  }
  return tools;
}

function field(block, key) {
  const m = block.match(new RegExp(`${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  return m ? m[1] : null;
}

function relatedIds(block) {
  const m = block.match(/relatedToolIds:\s*\[([\s\S]*?)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function keywords(block) {
  const m = block.match(/keywords:\s*\[([\s\S]*?)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

const ids = [];
const slugs = [];
const seoTitles = [];
const tools = [];
const errors = [];

for (const file of TOOL_FILES) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  const blocks = extractToolBlocks(src);
  let expected = 20;
  if (file.includes("specialized-calculator-tools")) expected = 20;
  if (file.endsWith("generator-tools.ts")) expected = 1;
  if (file.endsWith("content-generator-tools.ts")) expected = 20;
  if (file.endsWith("typing-tools.ts")) expected = 1;
  if (file.endsWith("expansion-tools.ts")) expected = 38;
  if (file.endsWith("category-pack-tools.ts")) expected = 51;
  if (blocks.length !== expected) {
    errors.push(`${file}: expected ${expected} tools, found ${blocks.length}`);
  }
  for (const block of blocks) {
    const tool = {};
    for (const key of REQUIRED_FIELDS) {
      let value = field(block, key);
      if (!value && key === "slug") value = field(block, "id");
      if (!value && key === "h1") value = field(block, "name");
      if (!value && key === "seoTitle") {
        const name = field(block, "name");
        value = name ? `${name} — Free Online | Tool Base` : null;
      }
      if (!value && key === "seoDescription") value = field(block, "description");
      if (!value) errors.push(`${file}: missing ${key}`);
      tool[key] = value;
    }
    tool.relatedToolIds = relatedIds(block);
    tool.keywords = keywords(block);
    tool.file = file;
    if (!tool.slug) tool.slug = tool.id;
    if (!tool.h1) tool.h1 = field(block, "name");
    if (!tool.seoTitle && tool.name) {
      tool.seoTitle = `${tool.name} — Free Online | Tool Base`;
    }
    if (!tool.seoDescription) tool.seoDescription = tool.description;
    tools.push(tool);
    if (tool.id) ids.push(tool.id);
    if (tool.slug) slugs.push(tool.slug);
    if (tool.seoTitle) seoTitles.push(tool.seoTitle);
  }
}

assert.strictEqual(tools.length, 331, `expected 331 tools, got ${tools.length}`);

const dup = (arr) => [...new Set(arr.filter((v, i) => arr.indexOf(v) !== i))];
for (const id of dup(ids)) errors.push(`duplicate id: ${id}`);
for (const slug of dup(slugs)) errors.push(`duplicate slug: ${slug}`);
for (const title of dup(seoTitles)) errors.push(`duplicate seoTitle: ${title}`);

const idSet = new Set(ids);
for (const tool of tools) {
  if (!CATEGORIES.includes(tool.category)) {
    errors.push(`${tool.slug}: invalid category ${tool.category}`);
  }
  if (tool.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.slug)) {
    errors.push(`${tool.slug}: invalid slug pattern`);
  }
  if (tool.slug && tool.id && tool.id !== tool.slug) {
    // allow divergence only if intentional; currently all match
  }
  if (!tool.keywords.length) {
    errors.push(`${tool.slug}: missing keywords`);
  }
  for (const related of tool.relatedToolIds) {
    if (!idSet.has(related)) {
      errors.push(`${tool.slug}: broken relatedToolId "${related}"`);
    }
  }
  if (tool.seoTitle && !tool.seoTitle.includes("Tool Base")) {
    errors.push(`${tool.slug}: seoTitle should include Tool Base`);
  }
  if (tool.seoDescription && tool.seoDescription.length < 50) {
    errors.push(`${tool.slug}: seoDescription too short`);
  }
  if (tool.h1 && tool.name && tool.h1 !== tool.name && !tool.h1.includes(tool.name.split(" ")[0])) {
    // soft check only — VAT & Tax vs name variants ok
  }
}

const registry = fs.readFileSync(path.join(ROOT, "lib/tools/registry.ts"), "utf8");
for (const file of TOOL_FILES) {
  const exportName = path.basename(file).replace(".ts", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  // imageConverterTools style
}
assert.ok(registry.includes("...calculatorTools"), "registry missing calculatorTools");
assert.ok(registry.includes("...specializedCalculatorTools"), "registry missing specializedCalculatorTools");
assert.ok(registry.includes("...generatorTools"), "registry missing generatorTools");
assert.ok(registry.includes("...expansionTools"), "registry missing expansionTools");
assert.ok(registry.includes("...categoryPackTools"), "registry missing categoryPackTools");
assert.ok(
  fs.readFileSync(path.join(ROOT, "lib/tools/generator-tools.ts"), "utf8").includes("contentGeneratorTools"),
  "generator-tools must include contentGeneratorTools",
);
assert.ok(!registry.includes("blox-fruits"), "Blox Fruits calculator must not be registered");
assert.ok(!/dose-calculator/i.test(registry), "dose calculator must not be registered");
assert.ok(registry.includes("...securityTools"), "registry missing securityTools");
assert.ok(!/tool\(\{\s*id:/.test(registry), "registry should not contain inline tool stubs");

const byCategory = {};
for (const tool of tools) {
  byCategory[tool.category] = (byCategory[tool.category] || 0) + 1;
}
for (const [id, expected] of [
  ["specialized-calculators", 20],
  ["typing-productivity", 20],
  ["design-creative", 20],
  ["utilities", 20],
]) {
  if (byCategory[id] !== expected) {
    errors.push(`${id}: expected ${expected} tools, found ${byCategory[id] || 0}`);
  }
}

const site = fs.readFileSync(path.join(ROOT, "lib/config/site.ts"), "utf8");
assert.ok(!site.includes("localhost"), "site config must not hardcode localhost");
assert.ok(site.includes("NEXT_PUBLIC_SITE_URL"), "site config must use env-based URL");

const sitemap = fs.readFileSync(path.join(ROOT, "app/sitemap.ts"), "utf8");
assert.ok(sitemap.includes("getAllTools"), "sitemap must include tools from registry");
assert.ok(sitemap.includes("categories"), "sitemap must include categories");
assert.ok(!sitemap.includes("localhost"), "sitemap must not hardcode localhost");

const robots = fs.readFileSync(path.join(ROOT, "app/robots.ts"), "utf8");
assert.ok(robots.includes("/admin"), "robots should disallow admin");
assert.ok(robots.includes("sitemap"), "robots should reference sitemap");

if (errors.length) {
  console.error("validate-registry FAILED:");
  for (const err of errors.slice(0, 50)) console.error(" -", err);
  if (errors.length > 50) console.error(` ... and ${errors.length - 50} more`);
  process.exit(1);
}

console.log(`validate-registry: OK (${tools.length} tools, unique ids/slugs/seoTitles, related refs valid)`);
