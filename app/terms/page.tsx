import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Use",
  description:
    "Terms for using ToolMyra’s free online tools, including acceptable use, availability, and disclaimer of warranties.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="These terms govern your use of the ToolMyra website and public tools. By using ToolMyra, you agree to these terms."
      sections={[
        {
          heading: "Acceptance",
          body: "By accessing or using ToolMyra, you agree to use the site and tools responsibly and in accordance with applicable law. If you do not agree, do not use the service.",
        },
        {
          heading: "Service description",
          body: "ToolMyra provides free online utilities for converting, compressing, editing, generating, calculating, and transforming files and content. Features, limits, and tool availability may change as the platform evolves.",
        },
        {
          heading: "No account required",
          body: "Public tools are offered without mandatory login, signup, subscription, or payment. ToolMyra may add optional account features later; any change will be described clearly.",
        },
        {
          heading: "Acceptable use",
          body: "Do not use ToolMyra to break the law, distribute malware, abuse infrastructure, attempt unauthorized access, overload the service, or upload content you do not have the right to process. Do not use tools to harm others or to evade security controls.",
        },
        {
          heading: "Your content and outputs",
          body: "You are responsible for the files and text you process and for how you use downloaded or copied results. Do not upload unlawful content. Review important outputs before relying on them.",
        },
        {
          heading: "Intellectual property",
          body: "ToolMyra branding, site design, and original site content belong to ToolMyra or its licensors. Tool outputs derived from your inputs remain your responsibility; third-party libraries used by tools remain subject to their own licenses.",
        },
        {
          heading: "Disclaimer of warranties",
          body: "ToolMyra is provided “as is” and “as available.” ToolMyra does not warrant uninterrupted availability, error-free results, or fitness for a particular purpose. Always verify critical conversions, calculations, and documents independently.",
        },
        {
          heading: "Limitation of liability",
          body: "To the fullest extent permitted by law, ToolMyra is not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or business arising from your use of the site or tools.",
        },
        {
          heading: "Changes",
          body: "We may update these terms from time to time. Continued use after changes means you accept the updated terms. The date of material updates should be reflected when published.",
        },
        {
          heading: "Contact",
          body: "Questions about these terms can be sent to support@toolmyra.com.",
        },
      ]}
    />
  );
}
