import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About ToolMyra",
  description:
    "Learn what ToolMyra is: a free online utility platform for converting, compressing, editing, generating, and calculating — with no account required.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <article className="max-w-3xl">
        <h1 className="tm-h1">About ToolMyra</h1>
        <p className="tm-lead mt-4">
          ToolMyra is a free online utility platform designed to help people convert,
          compress, generate, calculate, edit, and transform files and content without
          creating an account.
        </p>

        <h2 className="tm-h2 mt-10">Our approach</h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          The product experience is intentionally simple: visit, find a tool, use it, and
          download or copy the result. ToolMyra does not require login, signup, subscription,
          or payment to use its public tools.
        </p>

        <h2 className="tm-h2 mt-10">What you can do</h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          ToolMyra is organized around practical categories such as image tools, PDF tools,
          audio tools, video tools, text tools, developer utilities, security and encoding
          tools, and calculators and converters.
        </p>

        <h2 className="tm-h2 mt-10">Built for consistency</h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          New tools are added through a central registry so navigation, search, SEO
          structure, accessibility, and related-tool recommendations stay consistent across
          the catalog.
        </p>

        <p className="mt-8 text-base font-medium text-tm-muted">
          Ready to try something?{" "}
          <Link href="/tools" className="font-bold text-tm-accent hover:text-tm-accent-hover">
            Explore all online tools
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
