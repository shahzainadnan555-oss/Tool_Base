import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools/types";
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
      className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-tm-border bg-tm-elevated p-2 shadow-[var(--tm-shadow-lg)]"
    >
      {results.length ? (
        <ul className="space-y-1">
          {results.map((tool, index) => (
            <li key={tool.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  index === activeIndex ? "bg-tm-soft" : "hover:bg-tm-soft",
                )}
                onClick={() => onSelect(tool)}
              >
                <Icon name={tool.icon} className="mt-0.5 text-tm-accent" />
                <span>
                  <span className="block font-bold text-tm-text">{tool.name}</span>
                  <span className="block text-sm font-medium text-tm-muted">
                    {tool.shortDescription}
                  </span>
                </span>
              </button>
            </li>
          ))}
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
        className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-tm-accent hover:bg-tm-soft"
        onClick={onSearchAll}
      >
        Search all tools for “{query.trim()}”
      </button>
    </div>
  );
}
