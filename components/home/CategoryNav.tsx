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
          ? "sticky top-14 z-30 border-b border-tm-border bg-tm-white/92 backdrop-blur-xl md:top-14"
          : "border-b border-tm-border bg-tm-white"
      }
    >
      <div className="tm-container">
        <ul className="tm-scrollbar-none flex gap-2 overflow-x-auto py-3">
          {browseSections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={hrefPrefix === "route" ? section.href : `#${section.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-tm-border bg-tm-soft px-3.5 py-2 text-sm font-bold text-tm-text transition-all hover:border-tm-accent hover:bg-tm-surface-2 hover:text-tm-accent"
              >
                <Icon name={section.icon} className="h-4 w-4 text-tm-accent" />
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
