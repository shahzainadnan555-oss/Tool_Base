"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/search/SearchBar";
import { Icon } from "@/components/ui/Icon";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/tools", label: "Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [pathForMenu, setPathForMenu] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

  if (pathForMenu !== pathname) {
    setPathForMenu(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (mobileSearchOpen) setMobileSearchOpen(false);
  }

  if (!isMobile && (mobileOpen || mobileSearchOpen)) {
    if (mobileOpen) setMobileOpen(false);
    if (mobileSearchOpen) setMobileSearchOpen(false);
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

  useEffect(() => {
    if (!mobileSearchOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileSearchOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileSearchOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-tm-elevated/92 backdrop-blur-xl transition-[box-shadow,background-color,border-color] duration-200",
        scrolled
          ? "border-tm-border shadow-[0_1px_0_rgba(11,22,53,0.04),0_8px_24px_rgba(11,22,53,0.04)]"
          : "border-tm-border/70",
      )}
    >
      <div
        className={cn(
          "tm-container flex items-center gap-2 sm:gap-3 md:gap-5",
          scrolled ? "h-14" : "h-16 md:h-[4.25rem]",
        )}
      >
        <Logo compact={scrolled} />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
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

        <div className="relative z-20 ml-auto flex shrink-0 items-center gap-1.5 md:ml-0">
          {isMobile ? (
            <button
              type="button"
              className="tm-icon-btn tm-icon-btn-show border border-tm-border bg-tm-elevated text-tm-text hover:border-tm-accent hover:text-tm-accent"
              aria-expanded={mobileSearchOpen}
              aria-controls="mobile-search-panel"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setMobileSearchOpen((value) => !value);
                setMobileOpen(false);
              }}
            >
              <Icon
                name={mobileSearchOpen ? "close" : "search"}
                className="h-5 w-5"
              />
            </button>
          ) : null}

          <ThemeToggle className="tm-icon-btn tm-icon-btn-show border border-tm-border bg-tm-elevated text-tm-text hover:border-tm-accent hover:text-tm-accent" />

          {isMobile ? (
            <button
              type="button"
              className="tm-icon-btn tm-icon-btn-show border border-tm-border bg-tm-elevated text-tm-text hover:border-tm-accent hover:text-tm-accent"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setMobileOpen((value) => !value);
                setMobileSearchOpen(false);
              }}
            >
              <Icon name={mobileOpen ? "close" : "menu"} className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>

      {isMobile && mobileSearchOpen ? (
        <div
          id="mobile-search-panel"
          className="border-t border-tm-border bg-tm-elevated py-3"
        >
          <div className="tm-container">
            <SearchBar
              autoFocus
              placeholder="Search for a tool…"
              onNavigate={() => setMobileSearchOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <MobileNav
        open={isMobile && mobileOpen}
        items={navItems}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
