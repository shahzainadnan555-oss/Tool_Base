import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Tool Base",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F7FAFF",
    // Keep browser chrome light on mobile/tablet (never navy/dark).
    theme_color: "#F7FAFF",
    lang: "en",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
