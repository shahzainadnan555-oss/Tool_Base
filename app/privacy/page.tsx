import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How ToolMyra handles files, text inputs, analytics readiness, contact messages, and browser-based tool processing.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy describes how ToolMyra handles information in the current public product. It reflects the present implementation and will be updated if processing, hosting, or analytics details change."
      sections={[
        {
          heading: "Overview",
          body: "ToolMyra provides free public utilities that you can use without creating an account. Many tools process files and text in your browser on your device. Some tools may still download supporting libraries, models, or workers over the network so the tool can run. Tool pages describe the processing model for each utility.",
        },
        {
          heading: "Information you provide",
          body: "Depending on the tool, you may enter text, numbers, dates, or upload files needed to complete a task. ToolMyra’s public experience does not require login credentials or payment information. Contact and suggestion forms may collect the details you choose to send (such as a name, email address, or message) when you open an email draft or submit a suggestion event.",
        },
        {
          heading: "Browser-based processing",
          body: "For tools designed to run in the browser, your source files are intended to be processed locally in that browser session to produce a result. That does not mean zero network activity: the page may still load ToolMyra assets and, for some tools, third-party runtime components required for conversion or editing. ToolMyra does not claim that every tool never uses the network.",
        },
        {
          heading: "Server processing",
          body: "If a future or specific tool uploads files to ToolMyra servers, that tool page will state so clearly, including how uploads are used. The current registry marks tools with a processing mode so disclosures can stay accurate.",
        },
        {
          heading: "Analytics and cookies",
          body: "ToolMyra includes an analytics abstraction that can be connected to a privacy-conscious provider later. No analytics provider is hardwired into the public UI by default. If non-essential analytics cookies or similar technologies are enabled, ToolMyra will document them here and provide consent controls where required. Analytics must not receive passwords, JWTs, uploaded file contents, or other sensitive tool inputs.",
        },
        {
          heading: "Contact and suggestions",
          body: "Messages you send through your email client go to the address you choose to contact. Suggestion and report UI events may record non-sensitive metadata (such as category or issue type) if analytics is connected. Until a backend inbox exists, suggestion forms do not permanently store submissions on ToolMyra servers.",
        },
        {
          heading: "Accounts and payments",
          body: "The public ToolMyra product does not require signup, login, subscription, or payment information.",
        },
        {
          heading: "Retention and security",
          body: "Browser-processed inputs remain under your browser session control unless you download or share the output yourself. ToolMyra aims to avoid unnecessary retention of tool inputs. No website can guarantee absolute security; use common caution with sensitive files.",
        },
        {
          heading: "Children",
          body: "ToolMyra is a general-purpose utility site and is not directed at children under 13. Do not submit personal information about children through contact channels.",
        },
        {
          heading: "Updates and contact",
          body: "We may update this policy as the product changes. For privacy questions, contact support@toolmyra.com.",
        },
      ]}
    />
  );
}
