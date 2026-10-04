"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/search/SearchBar";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "All Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/popular", label: "Popular" },
  { href: "/new", label: "New Tools" },
  { href: "/blogs", label: "Blogs" },
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
    <header className="sticky top-0 z-40 border-b border-tm-border/80 bg-tm-white/95 backdrop-blur">
      <div className="tm-container flex h-16 items-center gap-3 md:h-[4.25rem] md:gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-sm font-bold transition-colors",
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

        <div className="ml-auto hidden min-w-0 max-w-xs flex-1 md:block lg:max-w-sm">
          <SearchBar compact />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-tm-border text-tm-text xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <MobileNav
        open={mobileOpen}
        items={navItems}
        onNavigate={() => setMobileOpen(false)}
      />
    </header>
  );
}
