"use client";

import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";

interface MobileNavProps {
  open: boolean;
  items: Array<{ href: string; label: string }>;
  onNavigate: () => void;
}

export function MobileNav({ open, items, onNavigate }: MobileNavProps) {
  if (!open) return null;

  return (
    <div id="mobile-nav" className="border-t border-tm-border bg-tm-white lg:hidden">
      <div className="tm-container space-y-4 py-4">
        <SearchBar onNavigate={onNavigate} />
        <nav aria-label="Mobile" className="grid gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-base font-bold text-tm-text hover:bg-tm-soft"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
