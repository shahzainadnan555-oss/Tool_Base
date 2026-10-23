/* eslint-disable no-console */
/**
 * Development-only content quality signals for Tool Base public tools.
 * Run: node scripts/audit-content-quality.cjs
 * Does not publish to the website or sitemap.
 */
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = path.join(__dirname, "..");

function loadFormulaToolBuilder() {
  const source = fs.readFileSync(
    path.join(ROOT, "lib/tools/formula-calculator-tools.ts"),
    "utf8",
  );
  assert.ok(
    source.includes("buildIntro") && source.includes("tipsHeading"),
    "formula tools should generate tool-specific intros and tips headings",
  );
}

function scanPlaceholders() {
  const roots = ["components", "lib/tools", "app"];
  const hits = [];
  const patterns = [
    /Loading converter…/g,
    /workspace will be connected/gi,
    /coming soon/gi,
    /lorem ipsum/gi,
  ];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(ts|tsx|js|jsx|md)$/.test(entry.name)) continue;
      const text = fs.readFileSync(full, "utf8");
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(text)) {
          hits.push(`${path.relative(ROOT, full)} :: ${pattern}`);
        }
      }
    }
  }

  for (const root of roots) walk(path.join(ROOT, root));
  return hits;
}

function scanThinPrivacyFaqs() {
  const dir = path.join(ROOT, "lib/tools");
  const thin = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".ts")) continue;
    const file = path.join(dir, name);
    const text = fs.readFileSync(file, "utf8");
    if (
      /question:\s*"Private\?"/.test(text) ||
      /answer:\s*"Yes\. Processing stays\."/.test(text) ||
      /answer:\s*"Yes\. Hashing stays\."/.test(text) ||
      /answer:\s*"Yes\. Validation stays\."/.test(text)
    ) {
      thin.push(path.relative(ROOT, file));
    }
  }
  return thin;
}

loadFormulaToolBuilder();
const placeholders = scanPlaceholders().filter(
  (hit) => !hit.includes("LoadingState.tsx") && !hit.includes("audit-content"),
);
const thinPrivacy = scanThinPrivacyFaqs();

console.log("audit-content-quality:");
console.log("- formula tool builder: OK");
console.log(`- placeholder-like hits (informational): ${placeholders.length}`);
for (const hit of placeholders.slice(0, 20)) console.log("  ", hit);
console.log(`- thin privacy FAQ leftovers: ${thinPrivacy.length}`);
assert.strictEqual(thinPrivacy.length, 0, "thin privacy FAQs remain");
console.log("audit-content-quality: OK");
