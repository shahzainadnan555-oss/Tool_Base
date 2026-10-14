import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SUPPORT_EMAIL } from "@/lib/config/support";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us | Tool Base",
  description:
    "Contact Tool Base for questions or feedback. Email support@toolbaseworld.com or send a message through Gmail.",
  path: "/contact",
  absoluteTitle: true,
});

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4.5 6.75h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.25v-9a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="m4 8 7.35 5.15a1.5 1.5 0 0 0 1.7 0L20.4 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="pb-16">
      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-8 md:py-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        </div>
      </div>

      <div className="tm-container py-10 md:py-14">
        <section
          aria-labelledby="contact-heading"
          className="mx-auto max-w-5xl rounded-[1.75rem] border border-tm-border bg-tm-elevated p-6 shadow-[var(--tm-shadow)] sm:p-8 md:p-10 lg:p-12"
        >
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-16">
            <aside className="max-w-md lg:pt-2">
              <h1 id="contact-heading" className="tm-h1">
                Let&apos;s Talk
              </h1>
              <p className="tm-lead mt-4">
                Have a question, suggestion, or feedback about Tool Base? We&apos;d love to hear from
                you. Send us a message and our team will be happy to hear from you.
              </p>

              <div className="mt-8 space-y-3">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-tm-border bg-tm-soft px-4 py-3 text-base font-extrabold text-tm-accent transition-colors hover:border-tm-accent hover:text-tm-accent-hover"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tm-soft text-tm-accent ring-1 ring-tm-border">
                    <EnvelopeIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 break-all">{SUPPORT_EMAIL}</span>
                </a>
                <p className="text-sm font-medium leading-relaxed text-tm-muted">
                  We welcome your questions, feedback, and suggestions.
                </p>
              </div>
            </aside>

            <div className="min-w-0">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
