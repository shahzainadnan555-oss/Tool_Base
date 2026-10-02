"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/search/SearchBar";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/tools", label: "All Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/popular", label: "Popular" },
  { href: "/new", label: "New Tools" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pathForMenu, setPathForMenu] = useState(pathname);

  if (pathForMenu !== pathname) {
    setPathForMenu(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-tm-border/80 bg-white/95 backdrop-blur">
      <div className="tm-container flex h-16 items-center gap-4 md:h-[4.25rem]">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/tools" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                  active
                    ? "bg-tm-soft text-tm-accent"
                    : "text-tm-text hover:bg-tm-soft hover:text-tm-accent",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden w-full max-w-sm md:block">
          <SearchBar compact />
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-tm-border text-tm-text md:ml-0 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <Icon name={mobileOpen ? "close" : "menu"} />
        </button>
      </div>

      <MobileNav
        open={mobileOpen}
        items={navItems}
        onNavigate={() => setMobileOpen(false)}
      />
    </header>
  );
}
