"use client";

import { browseSections } from "@/lib/tools/browse";
import { Icon } from "@/components/ui/Icon";

export function CategoryNav() {
  return (
    <nav
      aria-label="Tool categories"
      className="sticky top-16 z-30 border-b border-tm-border bg-tm-white/95 backdrop-blur md:top-[4.25rem]"
    >
      <div className="tm-container">
        <ul className="flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {browseSections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-tm-border bg-tm-soft px-3 py-2 text-sm font-bold text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent"
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
