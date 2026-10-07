import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admin · Content",
  description: "Content management foundation for Tool Base informational pages.",
  path: "/admin/content",
  noIndex: true,
});

const pages = [
  { path: "/about", label: "About" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
  { path: "/disclaimer", label: "Disclaimer" },
];

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="tm-h1">Content management</h1>
      <p className="tm-lead mt-4">
        Informational page inventory for future CMS integration. Current pages are
        code-managed.
      </p>
      <ul className="mt-8 space-y-3">
        {pages.map((page) => (
          <li
            key={page.path}
            className="rounded-2xl border border-tm-border bg-tm-elevated px-4 py-3 font-semibold text-tm-text"
          >
            {page.label}
            <span className="ml-2 text-sm font-medium text-tm-muted">{page.path}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
