import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { categories } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "Admin · Categories",
  description: "Category management foundation for ToolMyra.",
  path: "/admin/categories",
  noIndex: true,
});

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="tm-h1">Category management</h1>
      <p className="tm-lead mt-4">
        Category definitions and current registry counts for internal planning.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <article key={category.id} className="rounded-2xl border border-tm-border bg-white p-5">
            <h2 className="tm-h3">{category.name}</h2>
            <p className="mt-2 text-sm font-medium text-tm-muted">{category.description}</p>
            <p className="mt-4 text-sm font-bold text-tm-accent">
              {getToolsByCategory(category.id).length} tools
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
