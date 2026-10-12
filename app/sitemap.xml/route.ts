import { buildCuratedSitemapXml } from "@/lib/seo/curated-sitemap";

export const dynamic = "force-static";

/** Explicit XML response — avoids MetadataRoute quirks that can confuse Googlebot. */
export function GET() {
  const xml = buildCuratedSitemapXml();
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
