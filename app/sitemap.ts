import type { MetadataRoute } from "next";
import { CURATED_SITEMAP_PATHS, productionAbsoluteUrl } from "@/lib/seo/curated-sitemap";

/**
 * Curated production sitemap.
 * URLs always use https://www.toolbaseworld.com so NEXT_PUBLIC_SITE_URL
 * misconfiguration cannot publish a wrong host into Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return CURATED_SITEMAP_PATHS.map((path) => ({
    url: productionAbsoluteUrl(path),
  }));
}
