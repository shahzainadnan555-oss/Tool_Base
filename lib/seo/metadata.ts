import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/config/site";

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
  keywords?: string[];
  absoluteTitle?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  image = siteConfig.ogImage,
  keywords,
  absoluteTitle = false,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function createRootMetadata(): Metadata {
  const defaultOg = absoluteUrl(siteConfig.ogImage);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: "Tool Base — Free Online Tools, Converters & Utilities",
      template: "%s | Tool Base",
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    icons: {
      icon: [{ url: "/icon", type: "image/png", sizes: "64x64" }],
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
      shortcut: [{ url: "/icon", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: siteConfig.url,
      title: "Tool Base — Free Online Tools, Converters & Utilities",
      description: siteConfig.description,
      images: [
        {
          url: defaultOg,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tool Base — Free Online Tools, Converters & Utilities",
      description: siteConfig.description,
      images: [defaultOg],
      ...(siteConfig.twitterHandle
        ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle }
        : {}),
    },
    verification: siteConfig.googleSiteVerification
      ? { google: siteConfig.googleSiteVerification }
      : undefined,
    robots: {
      index: true,
      follow: true,
    },
  };
}
