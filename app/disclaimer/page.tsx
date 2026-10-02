import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description:
    "Important limits on ToolMyra tool results, calculators, conversions, and informational content.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="ToolMyra provides practical online utilities and informational content. Please read these limits before relying on results for important decisions."
      sections={[
        {
          heading: "General information",
          body: "ToolMyra content and tools are for general practical use. They are not a substitute for professional legal, financial, medical, tax, engineering, or other licensed advice.",
        },
        {
          heading: "Tool results",
          body: "Conversion, compression, formatting, generation, encoding, and similar outputs should be reviewed before important use. File fidelity, quality tradeoffs, and format support vary by tool and input. ToolMyra does not guarantee that every output will meet every workflow or archival requirement.",
        },
        {
          heading: "Calculators and converters",
          body: "Calculators provide general mathematical or unit-conversion results based on the formulas and conventions documented on each tool page. Tax and VAT calculators are general math helpers, not jurisdiction-specific tax advice. Date, age, and time-zone tools use calendar-aware or platform timezone rules as described on those pages; edge cases such as DST gaps can still occur.",
        },
        {
          heading: "Security and encoding utilities",
          body: "Hashing, encoding, JWT decoding, password generation, and related utilities are provided for convenience. JWT decoding does not verify signatures. Password strength depends on options and available randomness. Do not treat tool output as a security audit.",
        },
        {
          heading: "No fabricated social proof",
          body: "ToolMyra does not present fake reviews, fake testimonials, fake user counts, or fake popularity statistics as evidence of quality.",
        },
        {
          heading: "Your responsibility",
          body: "You remain responsible for how you use downloaded files, generated content, and calculated results, including compliance with laws and third-party rights.",
        },
      ]}
    />
  );
}
