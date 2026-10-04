import type { Metadata } from "next";
import { CategoryCard } from "@/components/tools/CategoryCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { categories } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "Tool Categories — Image, PDF, Audio, Video & More",
  description:
    "Explore Tool Base categories including image tools, PDF tools, audio tools, video tools, text tools, developer utilities, security tools, and calculators.",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <header className="max-w-3xl">
        <h1 className="tm-h1">Explore Tool Base Categories</h1>
        <p className="tm-lead mt-4">
          Browse free online tools by category. Each category page includes an introduction,
          searchable tool listing, and internal links to related utilities.
        </p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            toolCount={getToolsByCategory(category.id).length}
            titledAs="h2"
          />
        ))}
      </div>
    </div>
  );
}
