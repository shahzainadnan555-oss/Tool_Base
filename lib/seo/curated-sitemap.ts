/**
 * Curated production sitemap — main pages + Contact Us + six priority tools.
 * Always uses the canonical production host so a mis-set NEXT_PUBLIC_SITE_URL
 * cannot publish wrong-domain URLs to Google Search Console.
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

export function productionAbsoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PRODUCTION_SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function buildCuratedSitemapXml(): string {
  const urls = CURATED_SITEMAP_PATHS.map((path) => {
    const loc = productionAbsoluteUrl(path);
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

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
