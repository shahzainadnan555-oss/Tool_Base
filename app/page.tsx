import type { Metadata } from "next";
import { CategoryNav } from "@/components/home/CategoryNav";
import { CategoryToolSections } from "@/components/home/CategoryToolSections";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { Hero } from "@/components/home/Hero";
import { HomeBlogSection } from "@/components/home/HomeBlogSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PopularToolsSection } from "@/components/home/PopularToolsSection";
import { TrustStrip } from "@/components/home/TrustStrip";
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
      <section className="border-b border-tm-border bg-tm-soft pt-10 pb-2 md:pt-12">
        <div className="tm-container mb-6 max-w-3xl">
          <h2 className="tm-h2">Explore Tools by Category</h2>
          <p className="tm-lead mt-3">
            Jump to a category below, then open View All when you want the complete set.
          </p>
        </div>
        <CategoryNav />
      </section>
      <section className="tm-section bg-tm-soft">
        <div className="tm-container">
          <CategoryToolSections />
        </div>
      </section>
      <HowItWorksSection />
      <HomeBlogSection />
      <HomeFaqSection />
      <FinalCtaSection />
    </>
  );
}
