/**
 * Smoke-test developer tool processors + registry wiring.
 * Run: node --import tsx scripts/smoke-developer-tools.cjs  OR npx tsx -e ...
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const EXPECTED = [
  "json-formatter",
  "json-validator",
  "json-minifier",
  "html-formatter",
  "html-minifier",
  "css-formatter",
  "css-minifier",
  "javascript-formatter",
  "javascript-minifier",
  "xml-formatter",
  "xml-validator",
  "sql-formatter",
  "sql-minifier",
  "regex-tester",
  "regex-generator",
  "base64-encoder",
  "base64-decoder",
  "url-encoder",
  "url-decoder",
  "html-entity-encoder",
];

const configsSrc = fs.readFileSync(path.join(__dirname, "../lib/developer/configs.ts"), "utf8");
const slugs = [...configsSrc.matchAll(/"([a-z0-9-]+)":\s*make\(/g)].map((m) => m[1]);
assert.strictEqual(slugs.length, 20, `expected 20 configs, got ${slugs.length}`);
for (const slug of EXPECTED) {
  assert.ok(slugs.includes(slug), `missing config ${slug}`);
}

const registry = fs.readFileSync(path.join(__dirname, "../lib/tools/registry.ts"), "utf8");
assert.ok(registry.includes('from "./developer-tools"'));
assert.ok(registry.includes("...developerTools"));
assert.ok(!registry.includes('id: "base64-encode"'), "old base64-encode stub should be removed");
assert.ok(!/id: "json-formatter"/.test(registry.split("developerTools")[0] || ""), "stub json-formatter should be removed from inline registry");

const toolsSrc = fs.readFileSync(path.join(__dirname, "../lib/tools/developer-tools.ts"), "utf8");
for (const slug of EXPECTED) {
  assert.ok(toolsSrc.includes(`slug: "${slug}"`), `developer-tools missing ${slug}`);
}

const page = fs.readFileSync(path.join(__dirname, "../app/tools/[slug]/page.tsx"), "utf8");
assert.ok(page.includes("isDeveloperToolSlug"));

const workspace = fs.readFileSync(
  path.join(__dirname, "../components/tools/ToolWorkspace.tsx"),
  "utf8",
);
assert.ok(workspace.includes("DeveloperToolWorkspace"));
assert.ok(workspace.includes("getDeveloperToolConfig"));

console.log("smoke-developer-tools wiring: OK");
