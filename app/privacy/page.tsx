import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How Tool Base handles files, text inputs, cookies, analytics readiness, advertising readiness, and browser-based tool processing.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy describes how Tool Base handles information in the current public product. It reflects the present implementation and will be updated if processing, hosting, analytics, or advertising details change."
      sections={[
        {
          heading: "Information Tool Base May Process",
          body: "Depending on the tool you use, Tool Base may process text, numbers, dates, configuration options, or files that you choose to provide in order to complete a task. The public product does not require login credentials or payment information. Suggestion and report forms may capture the non-sensitive details you choose to enter (such as a tool idea, category, or issue description) as local UI or analytics events when those forms are submitted.",
        },
        {
          heading: "Uploaded Files and User-Provided Content",
          body: "Many Tool Base utilities are designed to process inputs in your browser session so you can produce a downloadable or copyable result. That does not mean zero network activity: pages still load Tool Base assets, and some tools download supporting libraries, models, workers, or codecs needed to run. Tool Base does not claim that every tool never uses the network, and it does not claim that every file is never uploaded in all cases. If a specific tool uploads files to Tool Base servers or uses a distinct processing path, that tool’s page should describe the relevant behavior. Always review the tool page for the utility you are using.",
        },
        {
          heading: "How Tool Base Uses Information",
          body: "Inputs you provide are used to operate the selected tool and return a result in that session. Tool Base also uses technical information needed to serve pages and assets. If analytics are connected later, Tool Base may use non-sensitive product events (for example that a tool was opened or a search was used) to understand site usage. Analytics must not receive passwords, JWTs, uploaded file contents, full document bodies, private text payloads, or other sensitive tool inputs.",
        },
        {
          heading: "Cookies and Similar Technologies",
          body: "Tool Base may use essential storage required for the site to function, such as preferences needed for basic UI behavior. Non-essential cookies or similar technologies for analytics or advertising are not hardwired into the public UI by default. If they are enabled in the future, this policy will be updated and appropriate consent controls will be presented where required.",
        },
        {
          heading: "Analytics",
          body: "Tool Base includes an analytics abstraction that can be connected to a provider later. No analytics provider is hardwired into the public experience by default. Until a provider is connected and documented here, analytics events may only be available in development logging or unused provider hooks. When analytics become active, they should remain limited to useful anonymous product events.",
        },
        {
          heading: "Advertising",
          body: "Tool Base may display third-party advertising in the future, such as through a Google AdSense or similar program, if and when that integration is actually configured. Advertising is not active in the current public product simply because this policy mentions readiness. If advertising is enabled, ads may use cookies or similar technologies, including for measurement or personalization where permitted, and applicable consent requirements will be followed for regions that require them.",
        },
        {
          heading: "Third-Party Services",
          body: "The site may load third-party runtime components required by specific tools (for example media-processing libraries or workers). Future analytics or advertising partners would be third parties with their own technologies and policies. Tool Base will identify material third-party services here when they are actually deployed for analytics or advertising.",
        },
        {
          heading: "Data Retention",
          body: "For browser-processed tools, inputs and outputs generally remain under your browser session control unless you download, copy, or share them yourself. Tool Base aims to avoid unnecessary long-term retention of tool inputs. Suggestion and report UI events are not permanently stored in a Tool Base inbox until a dedicated backend exists. If server-side processing is introduced for a tool, retention details for that tool will be disclosed on the relevant page and reflected here.",
        },
        {
          heading: "Security",
          body: "Tool Base takes practical steps to keep the public site secure, but no website can guarantee absolute security. Treat uploaded and downloaded files carefully, especially when they contain personal or confidential information. Do not submit secrets or sensitive credentials into tools that are not intended for that purpose.",
        },
        {
          heading: "Children and Age-Related Considerations Where Relevant",
          body: "Tool Base is a general-purpose utility site and is not directed at children under 13. Do not submit personal information about children through the site. If advertising or analytics that involve age-related restrictions are enabled later, Tool Base will update this policy and related controls as needed.",
        },
        {
          heading: "Changes to This Privacy Policy",
          body: "We may update this policy as the product changes. Continued use of Tool Base after an update means you accept the revised policy as published on this page. Material changes to analytics, advertising, or file-handling practices should be reflected here when those practices become active.",
        },
      ]}
    />
  );
}
