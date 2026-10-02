import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description:
    "Important limits on ToolMyra tool results, calculators, conversions, media processing, and informational content.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="ToolMyra provides practical online utilities and informational content. Please read these limits before relying on results for important decisions."
      sections={[
        {
          heading: "General Information",
          body: "ToolMyra content and tools are for general practical use. They are not a substitute for professional legal, financial, medical, tax, engineering, or other licensed advice.",
        },
        {
          heading: "Calculator Results",
          body: "Calculators provide mathematical results based on the formulas and user inputs shown on each tool page. Results are estimates or exact arithmetic outputs of those formulas, not personalized professional advice. Always check that you entered the correct values and that the chosen formula matches your need.",
        },
        {
          heading: "File Conversion Limitations",
          body: "File conversions depend on source quality, format support, and browser or library capabilities. Unusual, corrupted, password-protected, or highly specialized files may fail or produce incomplete results. Review converted outputs before important use.",
        },
        {
          heading: "Image and Media Processing",
          body: "Image, audio, and video tools may change quality, dimensions, bitrate, metadata, or container details during conversion, compression, cropping, trimming, or related operations. Compression and format changes often involve tradeoffs between file size and fidelity. ToolMyra does not guarantee that every output will meet archival, broadcast, or print requirements.",
        },
        {
          heading: "AI-Assisted Tools",
          body: "Some tools may use machine-learning models or similar assistance (for example background removal). Results can vary by image complexity, lighting, edges, and model limits. Treat AI-assisted outputs as helpful drafts that you should review before publishing or sharing.",
        },
        {
          heading: "Tax and Financial Calculations",
          body: "Tax, VAT, tip, interest, and similar calculators are general mathematical helpers. They are not jurisdiction-specific tax advice, accounting advice, or financial planning advice. Local rules, exemptions, rounding conventions, and filing requirements can differ.",
        },
        {
          heading: "Accuracy and Verification",
          body: "ToolMyra aims to provide useful, carefully implemented utilities, but results can still contain errors or edge-case limitations. Verify critical conversions, calculations, documents, and media before relying on them.",
        },
        {
          heading: "Third-Party Services",
          body: "Certain tools depend on third-party open-source libraries or runtime components. Future analytics or advertising partners, if enabled, would also be third parties. ToolMyra is not responsible for third-party policies or outages outside its control.",
        },
        {
          heading: "No Fabricated Social Proof",
          body: "ToolMyra does not present fake reviews, fake testimonials, fake user counts, or fake popularity statistics as evidence of quality.",
        },
        {
          heading: "Your Responsibility",
          body: "You remain responsible for how you use downloaded files, generated content, and calculated results, including compliance with laws and third-party rights.",
        },
      ]}
    />
  );
}