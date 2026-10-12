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

export default function ContactPage() {
  return (
    <div className="pb-14">
      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
          <header className="mt-4 max-w-2xl">
            <h1 className="tm-h1 mt-2">Contact Us</h1>
            <p className="tm-lead mt-4">
              Have a question or feedback? Write your message below and send it to our support team.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-5 inline-flex min-h-11 items-center text-lg font-extrabold text-tm-accent hover:text-tm-accent-hover"
            >
              {SUPPORT_EMAIL}
            </a>
          </header>
        </div>
      </div>

      <div className="tm-container mt-10 max-w-2xl">
        <ContactForm />
      </div>
    </div>
  );
}
