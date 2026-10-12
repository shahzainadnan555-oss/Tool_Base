import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";

/**
 * Curated production sitemap — main site pages + Contact Us + six priority tools.
 * Intentionally does NOT include the full tool registry.
 */
const CURATED_PATHS = [
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
  // Six priority tool detail pages (verified existing, working routes)
  "/tools/jpg-to-png",
  "/tools/image-compressor",
  "/tools/pdf-compressor",
  "/tools/word-counter",
  "/tools/qr-code-generator",
  "/tools/typing-speed-test",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return CURATED_PATHS.map((path) => ({
    url: absoluteUrl(path),
  }));
}
