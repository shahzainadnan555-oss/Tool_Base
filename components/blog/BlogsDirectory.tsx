"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/blog/types";

interface BlogsDirectoryProps {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
}

export function BlogsDirectory({ posts, categories, tags }: BlogsDirectoryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== "all" && post.category !== category) return false;
      if (tag !== "all" && !post.tags.includes(tag)) return false;
      if (!q) return true;
      const hay = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, category, tag]);

  const featured = filtered[0];
  const rest = filtered;

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-3 rounded-2xl border border-tm-border bg-tm-white p-4 md:grid-cols-3">
        <label className="text-sm font-bold text-tm-text">
          Search guides
          <input
            className="tm-input mt-2"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles and topics…"
          />
        </label>
        <label className="text-sm font-bold text-tm-text">
          Category
          <select
            className="tm-input mt-2"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold text-tm-text">
          Topic
          <select
            className="tm-input mt-2"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          >
            <option value="all">All topics</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {featured ? (
        <section>
          <h2 className="tm-h2">Featured guide</h2>
          <div className="mt-4">
            <BlogCard post={featured} featured />
          </div>
        </section>
      ) : (
        <p className="rounded-2xl border border-tm-border bg-tm-white px-4 py-6 text-sm font-medium text-tm-muted">
          No guides match that filter. Try another search or topic.
        </p>
      )}

      {rest.length ? (
        <section>
          <h2 className="tm-h2">All guides</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {rest.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
