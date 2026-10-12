import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SUPPORT_EMAIL, supportMailto } from "@/lib/config/support";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us | Tool Base",
  description:
    "Contact Tool Base for questions, feedback, or help with our online tools. Email support@toolbaseworld.com or use the inquiry form.",
  path: "/contact",
  absoluteTitle: true,
});

const faqs = [
  {
    question: "What should I include in my message?",
    answer:
      "Share the tool name or page URL, what you were trying to do, and what went wrong. Screenshots or sample steps help us review the issue faster.",
  },
  {
    question: "Do you provide phone support?",
    answer:
      "No. Tool Base support is handled by email at support@toolbaseworld.com so we can review details carefully.",
  },
  {
    question: "Where can I find guides while I wait?",
    answer:
      "Browse the Tool Base Guides section for how-to articles on converters, compressors, and everyday utilities.",
  },
];

export default function ContactPage() {
  return (
    <div className="pb-14">
      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
          <header className="mt-4 max-w-3xl">
            <p className="tm-eyebrow">Support</p>
            <h1 className="tm-h1 mt-4">Contact Us</h1>
            <p className="tm-lead mt-4">
              Have a question, found an issue, or need help using one of our tools? Send us a
              message and our support team will review your inquiry.
            </p>
          </header>
        </div>
      </div>

      <div className="tm-container mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-8">
          <section className="tm-panel p-5 sm:p-6" aria-labelledby="support-email-heading">
            <h2 id="support-email-heading" className="tm-h3">
              Email support
            </h2>
            <p className="mt-3 text-base font-medium leading-relaxed text-tm-muted">
              Prefer to write directly? Reach Tool Base at:
            </p>
            <a
              href={supportMailto()}
              className="mt-4 inline-flex min-h-11 items-center break-all text-lg font-extrabold text-tm-accent hover:text-tm-accent-hover"
            >
              {SUPPORT_EMAIL}
            </a>
            <p className="mt-3 text-sm font-medium text-tm-muted">
              We review inquiries as capacity allows. Response times vary based on volume and the
              complexity of the request.
            </p>
          </section>

          <section aria-labelledby="inquiry-form-heading">
            <h2 id="inquiry-form-heading" className="tm-h2">
              Inquiry form
            </h2>
            <p className="mt-3 mb-5 text-base font-medium leading-relaxed text-tm-muted">
              Fill in the form below. When you submit, your email app opens with a prefilled message
              addressed to {SUPPORT_EMAIL}.
            </p>
            <ContactForm />
          </section>
        </div>

        <aside className="space-y-6 lg:pt-1">
          <section className="tm-panel p-5" aria-labelledby="help-links-heading">
            <h2 id="help-links-heading" className="tm-h3">
              Helpful links
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm font-bold">
              <li>
                <Link href="/blogs" className="text-tm-accent hover:text-tm-accent-hover">
                  Guides &amp; help articles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-tm-accent hover:text-tm-accent-hover">
                  About Tool Base
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-tm-accent hover:text-tm-accent-hover">
                  Browse all tools
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-tm-accent hover:text-tm-accent-hover">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-tm-accent hover:text-tm-accent-hover">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-tm-accent hover:text-tm-accent-hover">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </section>

          <section className="tm-panel p-5" aria-labelledby="contact-faq-heading">
            <h2 id="contact-faq-heading" className="tm-h3">
              Contact FAQ
            </h2>
            <div className="mt-4 space-y-4">
              {faqs.map((item) => (
                <div key={item.question}>
                  <h3 className="text-sm font-extrabold text-tm-text">{item.question}</h3>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-tm-muted">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
