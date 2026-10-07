import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getAllTools, getNewTools, getPopularTools } from "@/lib/tools/registry";
import { categories } from "@/lib/tools/categories";
import { getAllBlogPosts } from "@/lib/blog/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Dashboard",
  description: "Internal Tool Base admin foundation. Not linked from public navigation.",
  path: "/admin",
  noIndex: true,
});

const sections = [
  { href: "/admin/tools", label: "Tool management", description: "Review tool registry entries and status." },
  { href: "/admin/categories", label: "Category management", description: "Inspect category structure and counts." },
  { href: "/admin/suggestions", label: "Tool suggestions", description: "UI foundation for incoming ideas." },
  { href: "/admin/reports", label: "Tool reports", description: "UI foundation for problem reports." },
  { href: "/admin/content", label: "Content management", description: "Manage informational page scaffolding." },
  { href: "/admin/faq", label: "FAQ management", description: "Review FAQ content architecture." },
  { href: "/admin/blog", label: "Blog / guides", description: "Manage guide listing foundation." },
];

export default function AdminHomePage() {
  const tools = getAllTools();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="tm-h1">Admin overview</h1>
        <p className="tm-lead mt-4 max-w-3xl">
          Internal frontend foundation for Tool Base operations. This area is not linked from
          public navigation and is excluded from robots indexing. Data shown here is derived
          from local registries and mock UI state only.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Tools in registry" value={String(tools.length)} />
        <Stat label="Popular tools" value={String(getPopularTools().length)} />
        <Stat label="New tools" value={String(getNewTools().length)} />
        <Stat label="Categories" value={String(categories.length)} />
        <Stat label="Guide articles" value={String(getAllBlogPosts().length)} />
      </section>

      <section>
        <h2 className="tm-h2">Admin sections</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-tm-border bg-tm-elevated p-5 transition-colors hover:border-tm-accent"
            >
              <h3 className="tm-h3">{section.label}</h3>
              <p className="mt-2 text-sm font-medium text-tm-muted">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-tm-border bg-tm-elevated p-5">
      <p className="text-sm font-bold text-tm-muted">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-tm-text">{value}</p>
    </div>
  );
}
