"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { SearchBar } from "@/components/search/SearchBar";
import { browseSections } from "@/lib/tools/browse";
import { Icon } from "@/components/ui/Icon";

interface MobileNavProps {
  open: boolean;
  items: Array<{ href: string; label: string }>;
  onClose: () => void;
}

export function MobileNav({ open, items, onClose }: MobileNavProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 0);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="md:hidden" role="presentation">
      <button
        type="button"
        className="fixed inset-0 z-[60] border-0 bg-[var(--tm-overlay)]"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,22rem)] max-w-full flex-col border-l border-tm-border bg-tm-elevated pb-[env(safe-area-inset-bottom)] shadow-[var(--tm-shadow-lg)] pt-[env(safe-area-inset-top)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-tm-border px-4 py-3">
          <p id={titleId} className="text-base font-extrabold text-tm-text">
            Menu
          </p>
          <button
            ref={closeRef}
            type="button"
            className="tm-icon-btn border border-tm-border bg-tm-soft text-tm-text hover:border-tm-accent hover:text-tm-accent"
            aria-label="Close menu"
            onClick={onClose}
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4">
          <SearchBar placeholder="Search for a tool…" onNavigate={onClose} />

          <nav aria-label="Mobile" className="grid gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3.5 text-base font-bold text-tm-text transition-colors hover:bg-tm-soft hover:text-tm-accent"
                onClick={onClose}
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
              {browseSections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={section.href}
                    className="flex min-h-11 items-center gap-2 rounded-xl border border-tm-border bg-tm-soft px-3 py-2.5 text-sm font-bold text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent"
                    onClick={onClose}
                  >
                    <Icon
                      name={section.icon}
                      className="h-4 w-4 shrink-0 text-tm-accent"
                    />
                    <span className="truncate">{section.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
