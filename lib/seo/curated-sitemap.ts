/**
 * Curated production sitemap — main pages + Contact Us + six priority tools.
 * Always uses the canonical production host so a mis-set NEXT_PUBLIC_SITE_URL
 * cannot publish wrong-domain URLs to Google Search Console.
 *
 * Structure (FabStitch-inspired, adapted for a small curated set):
 * - /sitemap.xml → sitemapindex
 * - /sitemaps/sitemap-core.xml → urlset with all curated page URLs
 */
export const PRODUCTION_SITE_URL = "https://www.toolbaseworld.com";

export const CURATED_SITEMAP_PATHS = [
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
] as const;

export const CORE_SITEMAP_PATH = "/sitemaps/sitemap-core.xml";

export function productionAbsoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PRODUCTION_SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function buildCuratedUrlsetXml(): string {
  const urls = CURATED_SITEMAP_PATHS.map((path) => {
    const loc = productionAbsoluteUrl(path);
    return [`  <url>`, `    <loc>${escapeXml(loc)}</loc>`, `  </url>`].join("\n");
  }).join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

export function buildSitemapIndexXml(): string {
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

/** @deprecated Prefer buildCuratedUrlsetXml / buildSitemapIndexXml */
export function buildCuratedSitemapXml(): string {
  return buildCuratedUrlsetXml();
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
