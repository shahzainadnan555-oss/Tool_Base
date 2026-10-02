import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/feedback/ContactForm";
import { SuggestTool } from "@/components/feedback/SuggestTool";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact ToolMyra",
  description:
    "Contact ToolMyra for questions, feedback, or tool suggestions. Open an email draft or share a tool idea without unnecessary personal information.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <article className="max-w-2xl">
          <h1 className="tm-h1">Contact</h1>
          <p className="tm-lead mt-4">
            Reach ToolMyra for feedback, support questions, or tool ideas. Use the email
            form to open a draft in your email app, or share a tool suggestion below.
          </p>

          <h2 className="tm-h2 mt-10">Email</h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
            Prefer to write directly? Email{" "}
            <a
              href="mailto:support@toolmyra.com"
              className="font-bold text-tm-accent hover:text-tm-accent-hover"
            >
              support@toolmyra.com
            </a>
            .
          </p>

          <h2 className="tm-h2 mt-10">What to include</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base font-medium text-tm-muted">
            <li>The tool name or page URL, if relevant</li>
            <li>What you expected to happen</li>
            <li>What happened instead</li>
            <li>Device and browser details for technical issues</li>
          </ul>

          <h2 className="tm-h2 mt-10">Privacy note</h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
            Please avoid sending passwords, private documents, or sensitive personal data
            unless a support process explicitly asks for them.
          </p>
        </article>

        <div className="space-y-6">
          <ContactForm />
          <SuggestTool />
        </div>
      </div>
    </div>
  );
}
