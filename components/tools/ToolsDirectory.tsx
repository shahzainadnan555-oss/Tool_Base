"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Button } from "@/components/ui/Button";
import { categories } from "@/lib/tools/categories";
import { searchTools } from "@/lib/tools/search";
import type { CategoryId, ToolDefinition } from "@/lib/tools/types";
import { cn } from "@/lib/utils/cn";

type SortMode = "featured" | "az" | "popular" | "new";

interface ToolsDirectoryProps {
  tools: ToolDefinition[];
  initialQuery?: string;
  initialCategory?: CategoryId | "all";
  headingId?: string;
}

export function ToolsDirectory({
  tools,
  initialQuery = "",
  initialCategory = "all",
  headingId,
}: ToolsDirectoryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryId | "all">(initialCategory);
  const [sort, setSort] = useState<SortMode>("featured");

  const filtered = useMemo(() => {
    let list = tools;

    if (category !== "all") {
      list = list.filter((tool) => tool.category === category);
    }

    if (query.trim()) {
      const matchedIds = new Set(searchTools(query).map((result) => result.tool.id));
      list = list.filter((tool) => matchedIds.has(tool.id));
    }

    if (sort === "popular") {
      list = list.filter((tool) => tool.popular);
    } else if (sort === "new") {
      list = list.filter((tool) => tool.new);
    }

    if (sort === "az" || sort === "featured") {
      list = [...list].sort((a, b) => {
        if (sort === "featured") {
          if (a.popular !== b.popular) return a.popular ? -1 : 1;
          if (a.new !== b.new) return a.new ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    }

    return list;
  }, [tools, category, query, sort]);

  return (
    <div>
      <div className="rounded-3xl border border-tm-border bg-tm-white p-4 md:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <label htmlFor="tools-search" className="mb-2 block text-sm font-bold text-tm-text">
              Search tools
            </label>
            <input
              id="tools-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, category, or keyword"
              className="tm-input"
              aria-describedby={headingId}
            />
          </div>
          <div>
            <label htmlFor="tools-category" className="mb-2 block text-sm font-bold text-tm-text">
              Category
            </label>
            <select
              id="tools-category"
              className="tm-input"
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryId | "all")}
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tools-sort" className="mb-2 block text-sm font-bold text-tm-text">
              Filter & sort
            </label>
            <select
              id="tools-sort"
              className="tm-input"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
            >
              <option value="featured">Featured</option>
              <option value="popular">Popular</option>
              <option value="new">New Tools</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["featured", "All"],
              ["popular", "Popular"],
              ["new", "New"],
              ["az", "A–Z"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-bold transition-colors",
                sort === value
                  ? "bg-tm-accent text-white"
                  : "bg-tm-soft text-tm-text hover:bg-blue-50 hover:text-tm-accent",
              )}
              onClick={() => setSort(value)}
            >
              {label}
            </button>
          ))}
          {query || category !== "all" || sort !== "featured" ? (
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-tm-muted hover:bg-tm-soft hover:text-tm-text"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setSort("featured");
              }}
            >
              Reset filters
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-tm-muted" aria-live="polite">
          Showing {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
        </p>
      </div>

      <div className="mt-5">
        {filtered.length ? (
          <ToolGrid tools={filtered} />
        ) : (
          <EmptyState
            title="No tools matched your filters"
            description="Try a different keyword, clear filters, or browse the full directory."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setSort("featured");
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
