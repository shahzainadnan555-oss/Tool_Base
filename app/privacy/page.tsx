import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy Policy for Tool Base: how uploads, browser storage, contact messages, Google AdSense, and related information are handled at toolbaseworld.com.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This Privacy Policy explains how Tool Base handles information when you use https://www.toolbaseworld.com/. It reflects the current public product and will be updated when material practices change."
      effectiveDate="October 23, 2026"
      sections={[
        {
          heading: "1. Who We Are",
          paragraphs: [
            "Tool Base operates the website at [https://www.toolbaseworld.com/](https://www.toolbaseworld.com/). For privacy questions, use [Contact](/contact) or email [support@toolbaseworld.com](mailto:support@toolbaseworld.com).",
          ],
        },
        {
          heading: "2. Information We May Process",
          paragraphs: [
            "Tool Base may process different kinds of information depending on how you use the site:",
          ],
          bullets: [
            "Tool inputs you choose to provide, such as text, numbers, settings, or files, so a selected tool can return a result.",
            "Contact details you choose to include when you compose a message to support, such as your name, email address, and message text.",
            "Technical information created when your browser requests pages and assets, which hosting and network providers may log as part of normal website delivery.",
            "Browser storage used for preferences or tool features, such as local notes or favorites where a tool offers that capability.",
            "Information processed by third-party advertising technologies when Google AdSense or related services run on the site.",
          ],
        },
        {
          heading: "3. Uploaded Files and Tool Processing",
          paragraphs: [
            "Tool Base tools are generally designed to process inputs in your browser session so you can download or copy a result. Declared tool processing modes in the current public catalog are browser-oriented.",
            "Browser-oriented processing does not mean zero network activity. Pages still load Tool Base assets. Some tools download supporting libraries, workers, codecs, or models needed to run. Your browser may also exchange routine traffic with advertising or hosting providers.",
            "Tool Base does not claim that every file is never transmitted, logged, or cached in every environment. Hosting infrastructure, content delivery, browser caches, and third-party scripts can involve network requests outside the tool’s core calculation or conversion logic.",
            "If a specific tool later uses a different processing path, that tool’s page should describe the relevant behavior, and this Privacy Policy should be updated.",
            "Do not submit passwords, private keys, payment card numbers, medical records, or other highly sensitive data into tools that are not designed for secure handling of that information.",
          ],
        },
        {
          heading: "4. Contact Form and Email",
          paragraphs: [
            "The [Contact](/contact) page helps you prepare a message to [support@toolbaseworld.com](mailto:support@toolbaseworld.com).",
            "When you submit the contact form, Tool Base opens a prefilled Gmail compose window (or falls back to another email method if needed). The message is sent only if you choose to send it through Gmail or another email client. Tool Base does not automatically transmit the contact form contents from the website to an inbox by itself.",
            "If you send an email, the contents of that email and related delivery metadata are handled by your email provider and by the mailbox that receives the message.",
          ],
        },
        {
          heading: "5. Cookies, Browser Storage, and Similar Technologies",
          paragraphs: [
            "Tool Base and third parties may use cookies, local storage, and similar technologies.",
          ],
          bullets: [
            "Essential site operation: pages and scripts needed to display and run the website.",
            "Local preferences and tool features: some utilities may store values in browser local storage, such as notepad text or font favorites, so a feature can continue working in your browser.",
            "Consent foundation: the codebase includes optional consent storage. A public consent banner is shown only when explicitly enabled by configuration.",
            "Advertising technologies: Google AdSense and related Google services may set or read cookies and similar identifiers for advertising, measurement, and personalization where permitted.",
          ],
        },
        {
          heading: "6. Google AdSense and Advertising",
          paragraphs: [
            "Tool Base loads the Google AdSense publisher script site-wide using publisher client ID ca-pub-4195370214127581. When Google serves ads for this site, Google and its partners may use cookies, web beacons, IP addresses, or similar identifiers in connection with advertising, measurement, and personalization, as applicable.",
            "Learn how Google uses data on partner sites: [How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites?hl=en).",
            "Google’s advertising and publisher privacy expectations are described in the [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en).",
            "You may also review Google account ad settings and your browser controls for cookie and advertising choices. Availability of choices can vary by region and product.",
            "For visitors in the EEA, UK, or Switzerland, Google may require a certified consent management platform before personalized ads are served. Tool Base includes a consent foundation, but a certified CMP is not claimed as deployed by this Privacy Policy alone. If additional consent implementation is required for your region, it should be completed separately from this document.",
          ],
        },
        {
          heading: "7. Analytics",
          paragraphs: [
            "Tool Base includes an internal analytics event abstraction used for product events such as searches or tool interactions in development logging and provider hooks.",
            "No separate third-party analytics provider (such as Google Analytics) is hardwired into the public source as an always-on measurement suite. If a named analytics provider is connected later, this policy will be updated to identify it.",
            "Advertising measurement associated with Google AdSense is separate from that internal analytics abstraction and is covered in the advertising section above.",
          ],
        },
        {
          heading: "8. How Information Is Used",
          paragraphs: [
            "Information is used to:",
          ],
          bullets: [
            "Operate the selected tool and return a result in that session.",
            "Serve pages, assets, and supporting libraries.",
            "Respond to support messages you choose to send.",
            "Maintain and improve the website.",
            "Support advertising and related measurement through Google AdSense where ads are served.",
          ],
        },
        {
          heading: "9. Sharing, Retention, and Security",
          paragraphs: [
            "Tool Base may share information with service providers that help host, deliver, or secure the website, and with advertising partners such as Google when advertising technologies run.",
            "For browser-processed tool inputs, results generally remain under your browser session control unless you download, copy, share, or otherwise transfer them. Tool Base does not operate a permanent public inbox for uploaded tool files in the current product.",
            "Hosting logs, email systems, browser storage, caches, and third-party advertising systems can retain technical or advertising-related data according to their own practices. Exact retention periods for every infrastructure layer are not inventable from the front-end source alone.",
            "Tool Base takes practical steps to keep the public site secure, but no website can guarantee absolute security. Protect your own device, backups, and sensitive files.",
          ],
        },
        {
          heading: "10. Your Choices and Privacy Rights",
          paragraphs: [
            "Depending on where you live, you may have rights to request access, correction, deletion, or other actions regarding personal information, subject to applicable law.",
            "To make a privacy request, contact [support@toolbaseworld.com](mailto:support@toolbaseworld.com) or use the [Contact](/contact) page. Tool Base will consider requests as required by applicable law and may need information to verify the request.",
            "This Privacy Policy does not claim compliance with every privacy statute worldwide.",
          ],
        },
        {
          heading: "11. Children’s Privacy",
          paragraphs: [
            "Tool Base is a general-purpose utility website and is not directed at children. Do not submit personal information about children through the site if you are not authorized to do so.",
            "If you believe a child has provided personal information inappropriately, contact [support@toolbaseworld.com](mailto:support@toolbaseworld.com).",
          ],
        },
        {
          heading: "12. External Links",
          paragraphs: [
            "The website may link to third-party sites and services, including Google policy pages and Gmail. Those third parties have their own privacy practices. Tool Base is not responsible for the content or privacy controls of external sites.",
          ],
        },
        {
          heading: "13. Changes to This Privacy Policy",
          paragraphs: [
            "We may update this Privacy Policy as the product changes. The revised policy will be posted on this page with an updated effective date. Continued use after publication means you accept the revised policy as posted.",
            "Material changes to advertising, analytics, contact handling, or file-processing practices should be reflected here when those practices change.",
          ],
        },
        {
          heading: "14. Contact",
          paragraphs: [
            "Website: [https://www.toolbaseworld.com/](https://www.toolbaseworld.com/)",
            "Contact page: [https://www.toolbaseworld.com/contact](https://www.toolbaseworld.com/contact)",
            "Email: [support@toolbaseworld.com](mailto:support@toolbaseworld.com)",
          ],
        },
      ]}
    />
  );
}
