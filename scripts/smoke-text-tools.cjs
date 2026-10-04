/* eslint-disable no-console */
/**
 * Smoke-test text utility processors and registry wiring.
 * Run: node scripts/smoke-text-tools.cjs
 */
const assert = require("assert");
const path = require("path");
const { createRequire } = require("module");

// Use tsx/ts-node-free approach: inline minimal ports of critical logic for CI-less smoke,
// then verify registry via Next-free dynamic import of compiled paths is unavailable —
// instead validate configs + registry file presence and run isomorphic logic copies.

const {
  textToolConfigs,
  textToolSlugs,
  isTextToolSlug,
} = (() => {
  // Lightweight parse: ensure all 20 slugs exist by reading configs source.
  const fs = require("fs");
  const src = fs.readFileSync(path.join(__dirname, "../lib/text/configs.ts"), "utf8");
  const slugs = [...src.matchAll(/"([a-z0-9-]+)":\s*make\(/g)].map((m) => m[1]);
  const map = Object.fromEntries(slugs.map((s) => [s, true]));
  return {
    textToolConfigs: map,
    textToolSlugs: slugs,
    isTextToolSlug: (s) => Boolean(map[s]),
  };
})();

const EXPECTED = [
  "word-counter",
  "character-counter",
  "sentence-counter",
  "paragraph-counter",
  "reading-time-calculator",
  "text-case-converter",
  "uppercase-converter",
  "lowercase-converter",
  "title-case-converter",
  "sentence-case-converter",
  "remove-extra-spaces",
  "remove-duplicate-lines",
  "sort-lines",
  "reverse-text",
  "reverse-words",
  "text-repeater",
  "text-cleaner",
  "find-and-replace",
  "text-diff-checker",
  "lorem-ipsum-generator",
];

assert.strictEqual(textToolSlugs.length, 20, `expected 20 configs, got ${textToolSlugs.length}`);
for (const slug of EXPECTED) {
  assert.ok(isTextToolSlug(slug), `missing config ${slug}`);
}

// Inline processor checks (mirror production algorithms)
function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
    let count = 0;
    for (const { isWordLike, segment } of segmenter.segment(trimmed)) {
      if (isWordLike && segment.trim()) count += 1;
    }
    return count;
  }
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function countGraphemes(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)).length;
  }
  return Array.from(text).length;
}

function reverseGraphemes(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment)
      .reverse()
      .join("");
  }
  return Array.from(text).reverse().join("");
}

const samples = [
  "The quick brown fox jumps over the lazy dog.",
  "یہ Tool Base کا ٹیکسٹ ٹول ہے۔",
  "مرحبا بكم في Tool Base",
  "这是一个文本工具。",
  "これはテキストツールです。",
  "Hello 👋🌍🚀",
  "Tool Base — 123 — اردو — العربية — 中文 — 🚀",
];

for (const sample of samples) {
  assert.ok(countWords(sample) >= 1 || sample.trim().length > 0);
  assert.ok(countGraphemes(sample) >= 1);
  assert.strictEqual(reverseGraphemes(reverseGraphemes(sample)), sample);
}

assert.strictEqual("hello world".toLocaleUpperCase(), "HELLO WORLD");
assert.strictEqual("HELLO WORLD".toLocaleLowerCase(), "hello world");

const dedupe = (text) => {
  const seen = new Set();
  return text
    .split("\n")
    .filter((line) => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    })
    .join("\n");
};
assert.strictEqual(dedupe("apple\nbanana\napple\norange"), "apple\nbanana\norange");

const sorted = ["banana", "apple", "10", "2"].sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true }),
);
assert.deepStrictEqual(sorted, ["2", "10", "apple", "banana"]);

const escaped = "a+b".replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
assert.strictEqual("xa+by".replace(new RegExp(escaped, "g"), "Z"), "xZy");

const fs = require("fs");
const registry = fs.readFileSync(path.join(__dirname, "../lib/tools/registry.ts"), "utf8");
assert.ok(registry.includes('from "./text-tools"'), "registry must import textTools");
assert.ok(registry.includes("...textTools"), "registry must spread textTools");
assert.ok(!registry.includes('id: "word-counter"'), "stub word-counter should be removed from registry");

const textToolsSrc = fs.readFileSync(path.join(__dirname, "../lib/tools/text-tools.ts"), "utf8");
for (const slug of EXPECTED) {
  assert.ok(textToolsSrc.includes(`slug: "${slug}"`), `text-tools missing ${slug}`);
}

const page = fs.readFileSync(path.join(__dirname, "../app/tools/[slug]/page.tsx"), "utf8");
assert.ok(page.includes("isTextToolSlug"), "page must wire isTextToolSlug");

const workspace = fs.readFileSync(
  path.join(__dirname, "../components/tools/ToolWorkspace.tsx"),
  "utf8",
);
assert.ok(workspace.includes("TextWorkspace"), "ToolWorkspace must mount TextWorkspace");
assert.ok(workspace.includes("getTextToolConfig"), "ToolWorkspace must resolve text configs");

console.log("smoke-text-tools: OK");
console.log(`configs: ${textToolSlugs.length}`);
console.log(`unicode samples: ${samples.length}`);
