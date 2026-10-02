import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admin",
  description: "Internal ToolMyra admin area.",
  path: "/admin",
  noIndex: true,
});

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/suggestions", label: "Suggestions" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-tm-soft">
      <div className="border-b border-tm-border bg-tm-navy text-white">
        <div className="tm-container flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <p className="text-sm font-bold tracking-wide text-blue-200 uppercase">
              Internal only
            </p>
            <p className="text-xl font-extrabold">ToolMyra Admin</p>
          </div>
          <Link href="/" className="text-sm font-bold text-blue-100 hover:text-white">
            Back to public site
          </Link>
        </div>
      </div>
      <div className="tm-container grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-tm-border bg-white p-4">
          <nav aria-label="Admin" className="grid gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-bold text-tm-text hover:bg-tm-soft hover:text-tm-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
