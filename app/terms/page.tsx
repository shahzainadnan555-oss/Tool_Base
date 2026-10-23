import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Terms of Service for Tool Base at toolbaseworld.com: acceptable use, free tools, uploaded content, limitations, privacy, and contact.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These Terms of Service explain the rules for using Tool Base. By accessing or using the website, you agree to these Terms."
      effectiveDate="October 23, 2026"
      sections={[
        {
          heading: "1. Introduction",
          paragraphs: [
            "Tool Base operates the website at [https://www.toolbaseworld.com/](https://www.toolbaseworld.com/). Tool Base provides free online utilities that help visitors convert, compress, edit, generate, calculate, and transform files and other content.",
            "These Terms govern your use of the public website, tool pages, guides, and related informational pages. If you do not agree with these Terms, do not use the website.",
          ],
        },
        {
          heading: "2. Eligibility and Acceptable Use",
          paragraphs: [
            "You must use Tool Base lawfully and responsibly. You agree not to misuse the website or interfere with its normal operation.",
          ],
          bullets: [
            "Do not attempt unauthorized access to systems, accounts, or data that you do not have permission to use.",
            "Do not upload malware, harmful code, or content intended to disrupt browsers, devices, or the website.",
            "Do not overload, scrape, or automate access in a way that harms availability or security.",
            "Do not use Tool Base to violate applicable law or the rights of others, including privacy and intellectual-property rights.",
            "Do not use tools to process content you are not allowed to process.",
          ],
        },
        {
          heading: "3. Description of Services",
          paragraphs: [
            "Tool Base offers a library of online tools across categories such as image tools, PDF tools, document and data tools, audio tools, video tools, text tools, developer tools, security and encoding tools, calculators and converters, generators, typing and productivity helpers, design tools, and other utilities.",
            "Each tool page describes the specific job that tool is designed to perform. Supported formats, settings, formulas, processing methods, and technical limits can differ from tool to tool. The on-page description, inputs, notices, and related documentation for a tool take priority over any general summary on this page.",
            "Browse the full catalog from [All Tools](/tools) and category pages from [Categories](/categories).",
          ],
        },
        {
          heading: "4. Free Access and Accounts",
          paragraphs: [
            "The public Tool Base tools covered by these Terms are offered without a required account, signup, subscription, or payment step.",
            "Tool Base does not currently sell access tiers or process payments for the public tool catalog. If paid features are introduced later, they will be described clearly before use and these Terms will be updated.",
          ],
        },
        {
          heading: "5. Uploaded Files and User Content",
          paragraphs: [
            "You are responsible for the files, text, numbers, and other information you enter or upload. You must have the rights and permissions needed to process that content.",
            "Tool Base does not claim ownership of the files or text you provide. You keep responsibility for your source files, downloaded outputs, and how you use them.",
            "Many Tool Base tools are designed to process inputs in your browser session. Pages still load website assets, and some tools download supporting libraries, workers, codecs, or models needed to run. Processing methods can vary by tool. Review the Privacy Policy and the individual tool page for relevant details: [Privacy Policy](/privacy).",
            "Do not upload unlawful content. Keep your own copies of important originals and outputs.",
          ],
        },
        {
          heading: "6. Tool Results and Limitations",
          paragraphs: [
            "Results depend on your inputs, the selected tool, supported formats, browser capabilities, available memory, settings, and other technical limits.",
            "Tool Base does not guarantee perfect accuracy, universal format compatibility, uninterrupted availability, or error-free processing. Always review important outputs before relying on them for critical work, publishing, financial decisions, academic records, or legal documents.",
            "Additional limitations are described in the [Disclaimer](/disclaimer).",
          ],
        },
        {
          heading: "7. Intellectual Property",
          paragraphs: [
            "Tool Base branding, logos, website design, original site copy, and Tool Base-created software materials are owned by Tool Base or its licensors, subject to applicable law and third-party licenses.",
            "Content you provide remains your responsibility. Outputs derived from your inputs do not transfer ownership of Tool Base’s branding or site materials to you.",
            "Third-party libraries, fonts, codecs, models, and similar components remain subject to their own licenses and terms.",
          ],
        },
        {
          heading: "8. Third-Party Services",
          paragraphs: [
            "Tool Base may load third-party runtime components required by specific tools, such as media-processing libraries or workers.",
            "The website loads the Google AdSense publisher script. Advertising and related measurement technologies are governed by Google’s policies in addition to these Terms.",
            "External links and third-party websites are not controlled by Tool Base. Their terms and privacy practices apply separately.",
          ],
        },
        {
          heading: "9. Availability and Changes",
          paragraphs: [
            "Tools may be updated, temporarily unavailable, limited, or removed for maintenance, improvement, security, or operational reasons.",
            "Browser updates, device limits, network conditions, and third-party runtime dependencies can also affect availability or performance.",
          ],
        },
        {
          heading: "10. Privacy",
          paragraphs: [
            "How Tool Base handles information is described in the [Privacy Policy](https://www.toolbaseworld.com/privacy). By using the website, you also acknowledge that policy.",
          ],
        },
        {
          heading: "11. Warranties and Liability",
          paragraphs: [
            "Tool Base is provided on an “as is” and “as available” basis to the fullest extent permitted by applicable law. Tool Base does not make warranties of uninterrupted service, merchantability, fitness for a particular purpose, or non-infringement beyond what applicable law requires.",
            "To the fullest extent permitted by applicable law, Tool Base is not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or business arising from your use of the website or tools.",
            "Nothing in these Terms is intended to exclude or limit rights or remedies that cannot lawfully be excluded or limited. If a court finds part of these Terms unenforceable, the remaining parts continue to apply.",
          ],
        },
        {
          heading: "12. Suspension and Changes to Terms",
          paragraphs: [
            "Tool Base may restrict or suspend access to the website or individual tools when reasonably needed to address misuse, security concerns, legal requirements, or operational problems.",
            "We may update these Terms from time to time. The revised Terms will be posted on this page with an updated effective date. Continued use after publication means you accept the updated Terms as posted.",
          ],
        },
        {
          heading: "13. Contact",
          paragraphs: [
            "Questions about these Terms can be sent through the [Contact](/contact) page or by emailing [support@toolbaseworld.com](mailto:support@toolbaseworld.com).",
            "These Terms are intended for users of the Tool Base website. They do not create a partnership, employment, or agency relationship.",
          ],
        },
      ]}
    />
  );
}
