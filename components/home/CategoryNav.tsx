"use client";

import { browseSections } from "@/lib/tools/browse";
import { Icon } from "@/components/ui/Icon";

export function CategoryNav({
  sticky = true,
  hrefPrefix = "#",
}: {
  sticky?: boolean;
  /** Use "#" for homepage anchors, or omit for category routes via section.href */
  hrefPrefix?: "#" | "route";
}) {
  return (
    <nav
      id="categories"
      aria-label="Tool categories"
      className={
        sticky
          ? "sticky top-14 z-30 border-b border-tm-border bg-tm-elevated/94 backdrop-blur-xl"
          : "border-b border-tm-border bg-tm-elevated"
      }
    >
      <div className="tm-container">
        <ul className="tm-chip-scroll tm-scrollbar-none py-3">
          {browseSections.map((section) => (
            <li key={section.id}>
              <a
                href={hrefPrefix === "route" ? section.href : `#${section.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-tm-border bg-tm-soft px-3.5 py-2 text-sm font-bold text-tm-text transition-colors hover:border-tm-accent hover:bg-tm-surface-2 hover:text-tm-accent"
              >
                <Icon name={section.icon} className="h-4 w-4 shrink-0 text-tm-accent" />
                <span className="whitespace-nowrap">{section.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
