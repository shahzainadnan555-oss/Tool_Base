import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { categories } from "@/lib/tools/categories";

const popularTools = [
  { href: "/tools/jpg-to-png", label: "JPG to PNG" },
  { href: "/tools/image-compressor", label: "Image Compressor" },
  { href: "/tools/pdf-compressor", label: "PDF Compressor" },
  { href: "/tools/word-counter", label: "Word Counter" },
  { href: "/tools/qr-code-generator", label: "QR Code Generator" },
  { href: "/tools/typing-speed-test", label: "Typing Speed Test" },
];

const resourceLinks = [
  { href: "/tools", label: "All Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/blogs", label: "Guides" },
  { href: "/popular", label: "Featured Tools" },
  { href: "/new", label: "New Tools" },
  { href: "/about", label: "About" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  const categoryLinks = categories
    .filter((category) =>
      [
        "image-tools",
        "pdf-tools",
        "text-tools",
        "developer-tools",
        "security-encoding",
        "calculators-converters",
        "generators",
        "design-creative",
        "typing-productivity",
        "utilities",
      ].includes(category.id),
    )
    .map((category) => ({
      href: category.route,
      label: category.name,
    }));

  return (
    <footer className="tm-footer mt-auto border-t border-white/10 text-tm-on-brand">
      <div className="tm-container py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo tone="dark" />
            <p className="mt-5 max-w-sm text-sm font-medium leading-relaxed text-[var(--tm-footer-muted)]">
              Tool Base is a free collection of online tools for converting, compressing,
              editing, generating, and calculating — organized so you can find the right
              utility quickly.
            </p>
          </div>

          <FooterColumn title="Categories" links={categoryLinks} className="lg:col-span-3" />
          <FooterColumn title="Popular Tools" links={popularTools} className="lg:col-span-2" />
          <FooterColumn title="Resources" links={resourceLinks} className="lg:col-span-2" />
          <FooterColumn title="Legal" links={legalLinks} className="lg:col-span-1" />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm font-medium text-[var(--tm-footer-muted)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Tool Base. All rights reserved.</p>
          <p>Free to use. No account required.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-bold tracking-[0.08em] text-[var(--tm-footer-link)] uppercase">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center text-sm font-semibold text-[var(--tm-footer-muted)] transition-colors hover:text-tm-on-brand"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
