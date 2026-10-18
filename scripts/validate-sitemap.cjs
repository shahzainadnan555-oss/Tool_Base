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

const PRESERVED_URLS = [
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
  `${HOST}/tools/jpg-to-png`,
  `${HOST}/tools/image-compressor`,
  `${HOST}/tools/pdf-compressor`,
  `${HOST}/tools/word-counter`,
  `${HOST}/tools/qr-code-generator`,
  `${HOST}/tools/typing-speed-test`,
];

const REQUIRED_BLOGS = [
  `${HOST}/blogs/image-conversion-and-optimization-guide`,
  `${HOST}/blogs/pdf-tools-guide`,
  `${HOST}/blogs/video-audio-conversion-guide`,
  `${HOST}/blogs/developer-and-text-tools-guide`,
  `${HOST}/blogs/calculators-and-converters-guide`,
  `${HOST}/blogs/online-file-and-data-tools-guide`,
  `${HOST}/blogs/volume-calculator-guide`,
];

function loadCuratedPaths() {
  const source = fs.readFileSync(
    path.join(ROOT, "lib/seo/curated-sitemap.ts"),
    "utf8",
  );
  const match = source.match(
    /export const CURATED_SITEMAP_PATHS = \[([\s\S]*?)\] as const;/,
  );
  assert.ok(match, "could not parse CURATED_SITEMAP_PATHS");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

const curatedPaths = loadCuratedPaths();
const indexXml = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
const coreXml = fs.readFileSync(
  path.join(ROOT, "public/sitemaps/sitemap-core.xml"),
  "utf8",
);
const robots = fs.readFileSync(path.join(ROOT, "app/robots.ts"), "utf8");

assert.ok(
  !fs.existsSync(path.join(ROOT, "app/sitemap.ts")),
  "app/sitemap.ts must not compete with public/sitemap.xml",
);

const parser = new XMLParser({ ignoreAttributes: false });
const indexDoc = parser.parse(indexXml);
const coreDoc = parser.parse(coreXml);

assert.ok(indexDoc.sitemapindex, "root sitemap.xml must be a sitemapindex");
const childLoc = indexDoc.sitemapindex.sitemap.loc;
assert.strictEqual(
  childLoc,
  `${HOST}/sitemaps/sitemap-core.xml`,
  "index must point at core child sitemap",
);

assert.ok(coreDoc.urlset, "core sitemap must be a urlset");
const urlNodes = Array.isArray(coreDoc.urlset.url)
  ? coreDoc.urlset.url
  : [coreDoc.urlset.url];
const locs = urlNodes.map((n) => n.loc);

assert.strictEqual(
  locs.length,
  curatedPaths.length,
  "core sitemap URL count must match CURATED_SITEMAP_PATHS",
);
assert.ok(locs.length >= 100, "expected a substantially expanded curated sitemap");
assert.strictEqual(new Set(locs).size, locs.length, "duplicate loc entries");
assert.ok(
  locs.every((u) => typeof u === "string" && u.startsWith(HOST)),
  "all locs must use production host",
);
assert.ok(
  !locs.some((u) => /localhost|tool-base\.app|vercel\.app/i.test(u)),
  "no dev/staging hosts",
);

for (const u of PRESERVED_URLS) {
  assert.ok(locs.includes(u), `missing preserved URL ${u}`);
}
for (const u of REQUIRED_BLOGS) {
  assert.ok(locs.includes(u), `missing blog URL ${u}`);
}

const expectedFromSource = curatedPaths.map((p) =>
  p === "/" ? HOST : `${HOST}${p}`,
);
assert.deepStrictEqual(
  locs,
  expectedFromSource,
  "public core sitemap must match curated-sitemap.ts order/content",
);

assert.ok(
  robots.includes('productionAbsoluteUrl("/sitemap.xml")') ||
    robots.includes(`${HOST}/sitemap.xml`),
  "robots must declare production sitemap",
);
assert.ok(robots.includes("/sitemap.xml"), "robots should allow sitemap path");
assert.ok(robots.includes("/sitemaps/"), "robots should allow child sitemap directory");

const blogCount = locs.filter((u) => u.includes("/blogs/")).length;
const toolCount = locs.filter(
  (u) =>
    u.startsWith(`${HOST}/tools/`) &&
    u !== `${HOST}/tools/calculators`,
).length;

console.log(
  `validate-sitemap: OK (index → core, ${locs.length} unique URLs, ${blogCount} blogs, ${toolCount} tools, ${PRESERVED_URLS.length} preserved)`,
);
