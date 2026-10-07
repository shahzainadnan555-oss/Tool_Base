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
  { href: "/tools", label: "Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pathForMenu, setPathForMenu] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-tm-white/90 backdrop-blur-xl transition-[height,box-shadow,background-color] duration-200",
        scrolled
          ? "border-tm-border shadow-[0_1px_0_rgba(11,22,53,0.04),0_8px_24px_rgba(11,22,53,0.04)]"
          : "border-tm-border/70",
      )}
    >
      <div
        className={cn(
          "tm-container flex items-center gap-3 transition-[height] duration-200 md:gap-5",
          scrolled ? "h-14 md:h-14" : "h-16 md:h-[4.25rem]",
        )}
      >
        <Logo compact={scrolled} />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                  active
                    ? "bg-tm-surface-2 text-tm-accent"
                    : "text-tm-text hover:bg-tm-soft hover:text-tm-accent",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden min-w-0 max-w-[17rem] flex-1 md:block lg:max-w-xs xl:max-w-sm">
          <SearchBar compact placeholder="Search tools…" />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-tm-border bg-tm-elevated text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent lg:hidden"
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
