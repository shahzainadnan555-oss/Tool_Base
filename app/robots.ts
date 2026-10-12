import type { MetadataRoute } from "next";
import { PRODUCTION_SITE_URL, productionAbsoluteUrl } from "@/lib/seo/curated-sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/not-found-admin"],
      },
    ],
    sitemap: productionAbsoluteUrl("/sitemap.xml"),
    // Bare hostname only (Yandex Host directive). Google ignores Host.
    host: new URL(PRODUCTION_SITE_URL).host,
  };
}
