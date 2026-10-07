"use client";

import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { browseSections } from "@/lib/tools/browse";
import { Icon } from "@/components/ui/Icon";

interface MobileNavProps {
  open: boolean;
  items: Array<{ href: string; label: string }>;
  onNavigate: () => void;
}

export function MobileNav({ open, items, onNavigate }: MobileNavProps) {
  if (!open) return null;

  return (
    <div
      id="mobile-nav"
      className="tm-animate-fade-in border-t border-tm-border bg-tm-white lg:hidden"
    >
      <div className="tm-container max-h-[min(78vh,36rem)] space-y-5 overflow-y-auto py-4">
        <SearchBar placeholder="Search for a tool…" onNavigate={onNavigate} />

        <nav aria-label="Mobile" className="grid gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-base font-bold text-tm-text transition-colors hover:bg-tm-soft hover:text-tm-accent"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div>
          <p className="px-1 text-xs font-bold tracking-wide text-tm-muted uppercase">
            Categories
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {browseSections.slice(0, 10).map((section) => (
              <li key={section.id}>
                <Link
                  href={section.href}
                  className="flex items-center gap-2 rounded-xl border border-tm-border bg-tm-soft px-3 py-2.5 text-sm font-bold text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent"
                  onClick={onNavigate}
                >
                  <Icon name={section.icon} className="h-4 w-4 shrink-0 text-tm-accent" />
                  <span className="truncate">{section.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
