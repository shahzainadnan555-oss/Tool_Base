/* eslint-disable no-console */
/**
 * Validates the curated static sitemap XML committed under public/.
 * Run: node scripts/validate-sitemap.cjs
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");

const ROOT = path.join(__dirname, "..");
const HOST = "https://www.toolbaseworld.com";
const EXPECTED_MAIN = [
  `${HOST}`,
  `${HOST}/tools`,
  `${HOST}/categories`,
  `${HOST}/tools/calculators`,
  `${HOST}/blogs`,
  `${HOST}/about`,
  `${HOST}/contact`,
  `${HOST}/privacy`,
  `${HOST}/terms`,
  `${HOST}/disclaimer`,
];
const EXPECTED_TOOLS = [
  `${HOST}/tools/jpg-to-png`,
  `${HOST}/tools/image-compressor`,
  `${HOST}/tools/pdf-compressor`,
  `${HOST}/tools/word-counter`,
  `${HOST}/tools/qr-code-generator`,
  `${HOST}/tools/typing-speed-test`,
];

const indexXml = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
const coreXml = fs.readFileSync(path.join(ROOT, "public/sitemaps/sitemap-core.xml"), "utf8");
const robots = fs.readFileSync(path.join(ROOT, "app/robots.ts"), "utf8");

assert.ok(!fs.existsSync(path.join(ROOT, "app/sitemap.ts")), "app/sitemap.ts must not compete with public/sitemap.xml");

const parser = new XMLParser({ ignoreAttributes: false });
const indexDoc = parser.parse(indexXml);
const coreDoc = parser.parse(coreXml);

assert.ok(indexDoc.sitemapindex, "root sitemap.xml must be a sitemapindex");
const childLoc = indexDoc.sitemapindex.sitemap.loc;
assert.strictEqual(childLoc, `${HOST}/sitemaps/sitemap-core.xml`, "index must point at core child sitemap");

assert.ok(coreDoc.urlset, "core sitemap must be a urlset");
const urlNodes = Array.isArray(coreDoc.urlset.url) ? coreDoc.urlset.url : [coreDoc.urlset.url];
const locs = urlNodes.map((n) => n.loc);
assert.strictEqual(locs.length, EXPECTED_MAIN.length + EXPECTED_TOOLS.length, "unexpected URL count");
assert.strictEqual(new Set(locs).size, locs.length, "duplicate loc entries");
assert.ok(locs.every((u) => typeof u === "string" && u.startsWith(HOST)), "all locs must use production host");
assert.ok(!locs.some((u) => /localhost|tool-base\.app|vercel\.app/i.test(u)), "no dev/staging hosts");

for (const u of EXPECTED_MAIN) assert.ok(locs.includes(u), `missing main page ${u}`);
for (const u of EXPECTED_TOOLS) assert.ok(locs.includes(u), `missing tool page ${u}`);

assert.strictEqual(EXPECTED_TOOLS.length, 6, "expected tool list must contain exactly six tools");
assert.ok(
  EXPECTED_TOOLS.every((u) => locs.includes(u)),
  "must include exactly the six selected tool detail pages",
);
assert.ok(
  !locs.includes(`${HOST}/tools/calculators`) || EXPECTED_MAIN.includes(`${HOST}/tools/calculators`),
  "calculators directory is a main page, not a tool detail page",
);

assert.ok(
  robots.includes('productionAbsoluteUrl("/sitemap.xml")') || robots.includes(`${HOST}/sitemap.xml`),
  "robots must declare production sitemap",
);
assert.ok(robots.includes("/sitemap.xml"), "robots should allow sitemap path");
assert.ok(robots.includes("/sitemaps/"), "robots should allow child sitemap directory");

console.log(
  `validate-sitemap: OK (index → core, ${EXPECTED_MAIN.length} main pages, ${EXPECTED_TOOLS.length} tools, ${locs.length} total)`,
);
