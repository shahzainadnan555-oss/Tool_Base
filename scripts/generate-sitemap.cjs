/* eslint-disable no-console */
/**
 * Writes public/sitemap.xml from the curated production URL list.
 * Keep this in sync with lib/seo/curated-sitemap.ts.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PRODUCTION_SITE_URL = "https://www.toolbaseworld.com";

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

const urls = CURATED_SITEMAP_PATHS.map((p) => {
  const loc = productionAbsoluteUrl(p);
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
}).join("\n");

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  urls,
  `</urlset>`,
  ``,
].join("\n");

const out = path.join(ROOT, "public", "sitemap.xml");
fs.writeFileSync(out, xml);
console.log(`Wrote ${out} (${CURATED_SITEMAP_PATHS.length} URLs)`);
