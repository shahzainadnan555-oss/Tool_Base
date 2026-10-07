import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools/types";
import { getCategoryById } from "@/lib/tools/categories";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

interface SearchResultsProps {
  query: string;
  results: ToolDefinition[];
  activeIndex?: number;
  onSelect: (tool: ToolDefinition) => void;
  onSearchAll: () => void;
  onBrowseAll?: () => void;
  listId?: string;
}

export function SearchResults({
  query,
  results,
  activeIndex = 0,
  onSelect,
  onSearchAll,
  onBrowseAll,
  listId,
}: SearchResultsProps) {
  return (
    <div
      id={listId}
      role="listbox"
      className="absolute inset-x-0 z-50 mt-2 max-h-[min(22rem,70dvh)] w-full overflow-auto overscroll-contain rounded-2xl border border-tm-border bg-tm-elevated p-2 shadow-[var(--tm-shadow-lg)]"
    >
      {results.length ? (
        <ul className="space-y-0.5">
          {results.map((tool, index) => {
            const category = getCategoryById(tool.category);
            return (
              <li key={tool.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={cn(
                    "flex w-full min-w-0 items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors sm:py-2.5",
                    index === activeIndex ? "bg-tm-surface-2" : "hover:bg-tm-soft",
                  )}
                  onClick={() => onSelect(tool)}
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tm-soft text-tm-accent">
                    <Icon name={tool.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold break-words text-tm-text">
                      {tool.name}
                    </span>
                    <span className="mt-0.5 flex min-w-0 flex-col gap-1 text-sm font-medium text-tm-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                      {category ? (
                        <span className="w-fit rounded-md bg-tm-soft px-1.5 py-0.5 text-xs font-bold text-tm-accent">
                          {category.name}
                        </span>
                      ) : null}
                      <span className="line-clamp-2 sm:truncate">
                        {tool.shortDescription}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-3 py-4 text-sm font-medium text-tm-muted">
          No tools found for “{query.trim()}”. Try another keyword or{" "}
          <Link href="/tools" className="font-bold text-tm-accent" onClick={onBrowseAll}>
            browse all tools
          </Link>
          .
        </p>
      )}
      <button
        type="button"
        className="mt-1 w-full rounded-xl px-3 py-3 text-left text-sm font-bold text-tm-accent hover:bg-tm-soft sm:py-2.5"
        onClick={onSearchAll}
      >
        Search all tools for “{query.trim()}”
      </button>
    </div>
  );
}
