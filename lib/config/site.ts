export const siteConfig = {
  name: "Tool Base",
  tagline: "Every Tool You Need. One Simple Place.",
  description:
    "Tool Base provides free online tools for converting, compressing, editing, generating, calculating, and transforming images, PDFs, audio, video, text, and more. No sign-up required.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://tool-base.app",
  locale: "en_US",
  twitterHandle: undefined as string | undefined,
  /** Served by app/opengraph-image.tsx — do not point at a missing static file. */
  ogImage: "/opengraph-image",
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
} as const;

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}
