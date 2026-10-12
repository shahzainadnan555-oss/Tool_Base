import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ConsentRoot } from "@/components/consent/ConsentRoot";
import { Navbar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { createRootMetadata } from "@/lib/seo/metadata";
import { websiteJsonLd } from "@/lib/seo/structured-data";
import { themeInitScript } from "@/lib/theme/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = createRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  // Never advertise dark — mobile Safari uses this for chrome / auto-dark.
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7FAFF" },
    { media: "(prefers-color-scheme: dark)", color: "#F7FAFF" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} light h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Permanent Light Mode on every device, including OS Dark Mode. */}
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Google AdSense site-wide code (exact publisher snippet, once in head). */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4195370214127581"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-[#F7FAFF] font-sans text-[#101828] antialiased">
        <JsonLd data={websiteJsonLd()} />
        <Navbar />
        <main className="min-w-0 flex-1 bg-[#F7FAFF]">{children}</main>
        <SiteFooter />
        <ConsentRoot />
      </body>
    </html>
  );
}
