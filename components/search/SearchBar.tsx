"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { getSearchSuggestions } from "@/lib/tools/search";
import type { ToolDefinition } from "@/lib/tools/types";
import { SearchResults } from "@/components/search/SearchResults";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}

export function SearchBar({
  className,
  placeholder = "Search tools…",
  autoFocus = false,
  compact = false,
  onNavigate,
}: SearchBarProps) {
  const inputId = useId();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(() => getSearchSuggestions(query, 8), [query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function commitSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;

    trackEvent("search_used", { query: trimmed, resultCount: suggestions.length });
    setOpen(false);
    onNavigate?.();
    router.push(`/tools?q=${encodeURIComponent(trimmed)}`);
  }

  function goToTool(tool: ToolDefinition) {
    trackEvent("search_used", { query, selectedTool: tool.slug });
    setOpen(false);
    onNavigate?.();
    router.push(tool.route);
    setQuery(tool.name);
  }

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <label htmlFor={inputId} className="sr-only">
        Search Tool Base tools
      </label>
      <div className={cn(compact ? "relative" : "tm-search-shell")}>
        {compact ? (
          <>
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-tm-muted"
            />
            <input
              id={inputId}
              type="search"
              value={query}
              autoFocus={autoFocus}
              autoComplete="off"
              placeholder={placeholder}
              className="tm-input min-h-10 !pl-10 !pr-16 text-sm"
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
                setActiveIndex(0);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => handleKeyDown(event)}
              aria-autocomplete="list"
              aria-controls={`${inputId}-results`}
              aria-expanded={open && query.trim().length > 0}
              role="combobox"
            />
            {query ? (
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-bold text-tm-muted hover:bg-tm-soft hover:text-tm-text"
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </>
        ) : (
          <>
            <Icon name="search" className="h-5 w-5 shrink-0 text-tm-muted" />
            <input
              id={inputId}
              type="search"
              value={query}
              autoFocus={autoFocus}
              autoComplete="off"
              placeholder={placeholder}
              className="tm-input flex-1"
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
                setActiveIndex(0);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => handleKeyDown(event)}
              aria-autocomplete="list"
              aria-controls={`${inputId}-results`}
              aria-expanded={open && query.trim().length > 0}
              role="combobox"
            />
            {query ? (
              <button
                type="button"
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold text-tm-muted hover:bg-tm-soft hover:text-tm-text"
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : (
              <button
                type="button"
                className="tm-btn tm-btn-primary shrink-0 !min-h-10 !px-4"
                onClick={() => commitSearch(query)}
              >
                Search
              </button>
            )}
          </>
        )}
      </div>

      {open && query.trim().length > 0 ? (
        <SearchResults
          listId={`${inputId}-results`}
          query={query}
          results={suggestions}
          activeIndex={activeIndex}
          onSelect={goToTool}
          onSearchAll={() => commitSearch(query)}
          onBrowseAll={onNavigate}
        />
      ) : null}
    </div>
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        Math.min(index + 1, Math.max(suggestions.length - 1, 0)),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = suggestions[activeIndex];
      if (open && active) {
        goToTool(active);
      } else {
        commitSearch(query);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }
}
