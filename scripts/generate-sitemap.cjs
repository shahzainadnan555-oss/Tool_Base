/* eslint-disable no-console */
/**
 * Writes static sitemap XML into public/ for reliable Googlebot / GSC fetching.
 * Keep path lists in sync with lib/seo/curated-sitemap.ts.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PRODUCTION_SITE_URL = "https://www.toolbaseworld.com";
const CORE_SITEMAP_PATH = "/sitemaps/sitemap-core.xml";

const CURATED_SITEMAP_PATHS = [
  "/",
  "/tools",
  "/categories",
  "/tools/calculators",
  "/blogs",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/tools/jpg-to-png",
  "/tools/image-compressor",
  "/tools/pdf-compressor",
  "/tools/word-counter",
  "/tools/qr-code-generator",
  "/tools/typing-speed-test",
];

function productionAbsoluteUrl(p = "/") {
  const normalized = p.startsWith("/") ? p : `/${p}`;
  return `${PRODUCTION_SITE_URL}${normalized === "/" ? "" : normalized}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrlset() {
  const urls = CURATED_SITEMAP_PATHS.map((p) => {
    const loc = productionAbsoluteUrl(p);
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
  }).join("\n");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

function buildIndex() {
  const child = productionAbsoluteUrl(CORE_SITEMAP_PATH);
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    `  <sitemap>`,
    `    <loc>${escapeXml(child)}</loc>`,
    `  </sitemap>`,
    `</sitemapindex>`,
    ``,
  ].join("\n");
}

const publicDir = path.join(ROOT, "public");
const sitemapsDir = path.join(publicDir, "sitemaps");
fs.mkdirSync(sitemapsDir, { recursive: true });

const indexPath = path.join(publicDir, "sitemap.xml");
const corePath = path.join(sitemapsDir, "sitemap-core.xml");
fs.writeFileSync(indexPath, buildIndex());
fs.writeFileSync(corePath, buildUrlset());

console.log(`Wrote ${indexPath}`);
console.log(`Wrote ${corePath} (${CURATED_SITEMAP_PATHS.length} URLs)`);
