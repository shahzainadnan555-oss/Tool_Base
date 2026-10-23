import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description:
    "Disclaimer for Tool Base online tools: limits on calculators, conversions, generated documents, security utilities, and third-party services.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="This Disclaimer explains important limits of Tool Base’s online tools and informational content. Read it together with the Terms of Service and Privacy Policy."
      effectiveDate="October 23, 2026"
      sections={[
        {
          heading: "1. General Information",
          paragraphs: [
            "Tool Base at [https://www.toolbaseworld.com/](https://www.toolbaseworld.com/) provides free online utilities and educational guides for common digital tasks.",
            "Tool Base content is for general practical use. It is not a substitute for professional legal, financial, tax, accounting, medical, engineering, academic, or other licensed advice.",
          ],
        },
        {
          heading: "2. Accuracy of Results",
          paragraphs: [
            "Outputs depend on the values or files you provide, the selected tool, supported formats, settings, browser capabilities, available memory, and other technical limits.",
            "Tool Base does not guarantee that every result is complete, optimal, or free from error. Review important outputs before relying on them.",
          ],
        },
        {
          heading: "3. Calculators and Financial or Academic Estimates",
          paragraphs: [
            "Calculators apply the formulas and assumptions shown on each tool page to the inputs you enter. Examples include mortgage, loan, interest-rate, 401(k), Roth IRA, percentage, unit-conversion, GPA, and similar estimators.",
            "Financial and investment-related calculators provide educational estimates. They are not personalized financial, investment, tax, accounting, or legal advice, and they are not loan offers, plan quotes, or guarantees of future returns.",
            "Academic estimators, such as GPA or score helpers, are not official school, exam-board, or College Board results.",
            "Always confirm that the formula and assumptions match your situation before making decisions.",
          ],
        },
        {
          heading: "4. File Conversion and Editing",
          paragraphs: [
            "Image, PDF, document, audio, and video tools may change quality, dimensions, bitrate, metadata, layout, transparency, fonts, or container details during conversion, compression, cropping, trimming, merging, or related operations.",
            "Unusual, corrupted, password-protected, incomplete, or highly specialized files may fail or produce incomplete results.",
            "Keep original files when the result matters. Review converted or edited outputs before sharing, printing, archiving, or submitting them elsewhere.",
          ],
        },
        {
          heading: "5. Availability and Technical Limitations",
          paragraphs: [
            "Compatibility can vary by browser, device, operating system, file size, codec support, and available memory. Large files or complex operations may be slower or may fail on some devices.",
            "Tools may be temporarily unavailable during maintenance, updates, network issues, or third-party runtime problems.",
          ],
        },
        {
          heading: "6. Generated Content and Documents",
          paragraphs: [
            "Some Tool Base utilities generate starter text or documents, such as policy templates, invoices, names, or markup snippets.",
            "Generated material is a starting point only. It may require editing and professional review before public or commercial use. Generated legal or policy text is not professional legal advice and should not be published unchanged without review.",
          ],
        },
        {
          heading: "7. Security and Encoding Tools",
          paragraphs: [
            "Hashing, encoding, decoding, password-generation, and related utilities have specific technical purposes. Encoding is not the same as encryption. Hashing is not reversible password recovery. A generated password is only as safe as the way you store and use it.",
            "Do not treat every security or encoding tool as suitable protection for highly sensitive information. Use purpose-built security products and professional guidance when the stakes are high.",
          ],
        },
        {
          heading: "8. Machine-Learning Assisted Features",
          paragraphs: [
            "Some tools may use machine-learning models or similar assistance, such as background removal. Results can vary with image complexity, edges, lighting, and model limits. Treat assisted outputs as drafts that you should review before publishing.",
          ],
        },
        {
          heading: "9. Third-Party Services",
          paragraphs: [
            "Tool Base may load third-party libraries, workers, codecs, or models required by specific tools. The site also loads Google AdSense advertising technology.",
            "Tool Base does not control third-party websites, ad networks, email providers, or external policies. Their availability, content, and practices can change independently of Tool Base.",
          ],
        },
        {
          heading: "10. Responsibility and Applicable Law",
          paragraphs: [
            "You remain responsible for how you use downloaded files, generated content, and calculated results, including compliance with laws and third-party rights.",
            "To the fullest extent permitted by applicable law, Tool Base is not responsible for decisions made solely on the basis of tool outputs. Nothing in this Disclaimer excludes rights or remedies that cannot lawfully be excluded.",
            "Related terms appear in the [Terms of Service](/terms). Privacy practices appear in the [Privacy Policy](/privacy).",
          ],
        },
        {
          heading: "11. Contact",
          paragraphs: [
            "Questions about this Disclaimer can be sent through [Contact](https://www.toolbaseworld.com/contact) or by emailing [support@toolbaseworld.com](mailto:support@toolbaseworld.com).",
          ],
        },
      ]}
    />
  );
}
