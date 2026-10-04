import type { Metadata } from "next";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ExploreAllSection } from "@/components/home/ExploreAllSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { Hero } from "@/components/home/Hero";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PopularToolsSection } from "@/components/home/PopularToolsSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { WhyToolBaseSection } from "@/components/home/WhyToolBaseSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { homepageFaq } from "@/lib/content/homepage-faq";
import { createPageMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Tool Base — Free Online Tools, Converters & Utilities",
  absoluteTitle: true,
  description:
    "Tool Base provides free online tools for converting, compressing, editing, generating, calculating, and transforming images, PDFs, audio, video, text, and more. No sign-up required.",
  path: "/",
  keywords: [
    "free online tools",
    "online converters",
    "image tools",
    "pdf tools",
    "audio tools",
    "video tools",
    "text tools",
    "developer tools",
    "calculators",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(homepageFaq)} />
      <Hero />
      <TrustStrip />
      <PopularToolsSection />
      <CategoriesSection />
      <WhyToolBaseSection />
      <HowItWorksSection />
      <HomeFaqSection />
      <ExploreAllSection />
      <FinalCtaSection />
    </>
  );
}
