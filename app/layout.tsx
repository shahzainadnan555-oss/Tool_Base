import type { Metadata } from "next";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-tm-soft font-sans text-tm-text antialiased selection:bg-tm-accent/20">
        <JsonLd data={websiteJsonLd()} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ConsentRoot />
      </body>
    </html>
  );
}
