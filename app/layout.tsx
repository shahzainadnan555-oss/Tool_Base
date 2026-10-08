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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-tm-soft font-sans text-tm-text antialiased selection:bg-tm-accent/20">
        <JsonLd data={websiteJsonLd()} />
        <Navbar />
        <main className="min-w-0 flex-1">{children}</main>
        <SiteFooter />
        <ConsentRoot />
      </body>
    </html>
  );
}
