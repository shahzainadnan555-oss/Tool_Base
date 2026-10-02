import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { categories } from "@/lib/tools/categories";

const toolLinks = [
  { href: "/tools", label: "All Tools" },
  { href: "/popular", label: "Popular Tools" },
  { href: "/new", label: "New Tools" },
];

const contentLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-tm-border bg-tm-navy text-white">
      <div className="tm-container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo tone="dark" />
            <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-slate-300">
              Free online tools for converting, compressing, editing, generating, and
              calculating — with no account required.
            </p>
          </div>

          <FooterColumn title="Tools" links={toolLinks} />
          <FooterColumn
            title="Categories"
            links={categories.map((category) => ({
              href: category.route,
              label: category.name,
            }))}
          />
          <FooterColumn title="Content" links={contentLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm font-medium text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ToolMyra. All rights reserved.</p>
          <p>Completely free. No sign-up required.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-sm font-bold tracking-wide text-white uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-semibold text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
