import type { MetadataRoute } from "next";
import { PRODUCTION_SITE_URL, productionAbsoluteUrl } from "@/lib/seo/curated-sitemap";

/**
 * robots.txt — FabStitch-inspired explicit Allow for sitemap paths,
 * with Tool Base's own curated public surface.
 */
export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = productionAbsoluteUrl("/sitemap.xml");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/sitemap.xml", "/sitemaps/"],
        disallow: ["/admin", "/admin/", "/not-found-admin", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/sitemap.xml", "/sitemaps/"],
        disallow: ["/admin", "/admin/", "/not-found-admin", "/api/"],
      },
      {
        userAgent: "Google-InspectionTool",
        allow: ["/", "/sitemap.xml", "/sitemaps/"],
        disallow: ["/admin", "/admin/", "/not-found-admin", "/api/"],
      },
    ],
    sitemap: sitemapUrl,
    // Bare hostname only (Yandex Host directive). Google ignores Host.
    host: new URL(PRODUCTION_SITE_URL).host,
  };
}
