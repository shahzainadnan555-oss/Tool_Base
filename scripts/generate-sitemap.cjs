/* eslint-disable no-console */
/**
 * Writes static sitemap XML into public/ for reliable Googlebot / GSC fetching.
 * Path list source of truth: lib/seo/curated-sitemap.ts
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PRODUCTION_SITE_URL = "https://www.toolbaseworld.com";
const CORE_SITEMAP_PATH = "/sitemaps/sitemap-core.xml";

function loadCuratedPaths() {
  const source = fs.readFileSync(
    path.join(ROOT, "lib/seo/curated-sitemap.ts"),
    "utf8",
  );
  const match = source.match(
    /export const CURATED_SITEMAP_PATHS = \[([\s\S]*?)\] as const;/,
  );
  if (!match) {
    throw new Error("Could not parse CURATED_SITEMAP_PATHS from curated-sitemap.ts");
  }
  const paths = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (paths.length === 0) {
    throw new Error("CURATED_SITEMAP_PATHS is empty");
  }
  return paths;
}

const CURATED_SITEMAP_PATHS = loadCuratedPaths();

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
