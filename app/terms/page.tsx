import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Terms for using ToolMyra’s free online tools, including acceptable use, availability, limitations, and disclaimer of warranties.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms govern your use of the ToolMyra website and public tools. By using ToolMyra, you agree to these terms."
      sections={[
        {
          heading: "About the Service",
          body: "ToolMyra provides free online utilities for converting, compressing, editing, generating, calculating, and transforming files and content. Features, limits, and tool availability may change as the platform evolves.",
        },
        {
          heading: "Use of ToolMyra",
          body: "You may use ToolMyra’s public tools for lawful personal or business purposes consistent with these terms. Public tools are offered without mandatory login, signup, subscription, or payment. Optional features may be added later and will be described clearly if introduced.",
        },
        {
          heading: "User Responsibilities",
          body: "You are responsible for the files, text, and values you process and for how you use downloaded or copied results. Do not upload unlawful content. Review important outputs before relying on them for critical work.",
        },
        {
          heading: "Tool Availability",
          body: "ToolMyra may add, change, pause, or remove tools at any time. Temporary interruptions can occur due to maintenance, browser limits, network conditions, or third-party runtime dependencies used by specific tools.",
        },
        {
          heading: "Tool Limitations",
          body: "Tools may have limits related to file size, format support, browser capability, processing time, memory, or output quality. Calculators return results based on the formulas and inputs documented on each tool page. Media and document conversions can involve quality tradeoffs or incomplete support for unusual files.",
        },
        {
          heading: "File and Content Responsibility",
          body: "You must have the right to process any file or content you submit. Do not use ToolMyra to process content that infringes others’ rights or violates applicable law. You remain responsible for retaining your own copies of important source files and outputs.",
        },
        {
          heading: "Intellectual Property",
          body: "ToolMyra branding, site design, and original site content belong to ToolMyra or its licensors. Tool outputs derived from your inputs remain your responsibility. Third-party libraries used by tools remain subject to their own licenses.",
        },
        {
          heading: "Prohibited Misuse",
          body: "Do not use ToolMyra to break the law, distribute malware, abuse infrastructure, attempt unauthorized access, overload the service, scrape the site in a way that harms availability, or evade security controls. Do not use tools to harm others.",
        },
        {
          heading: "Third-Party Services",
          body: "Some tools rely on third-party open-source or runtime components loaded in the browser. Future analytics or advertising services, if enabled, would also be third-party technologies. Those services are governed by their own terms and policies in addition to these terms.",
        },
        {
          heading: "Changes to the Service",
          body: "We may update the website, tools, and these terms from time to time. Continued use after changes means you accept the updated terms as published on this page.",
        },
        {
          heading: "Disclaimer of Warranties",
          body: "ToolMyra is provided “as is” and “as available.” ToolMyra does not warrant uninterrupted availability, error-free results, or fitness for a particular purpose. Always verify critical conversions, calculations, and documents independently.",
        },
        {
          heading: "Limitation of Liability",
          body: "To the fullest extent permitted by law, ToolMyra is not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or business arising from your use of the site or tools.",
        },
      ]}
    />
  );
}
