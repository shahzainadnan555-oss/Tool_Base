import type { Metadata } from "next";
import { CategoryCard } from "@/components/tools/CategoryCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { categories } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "Tool Categories — Image, PDF, Audio, Video & More",
  description:
    "Explore Tool Base categories including image tools, PDF tools, audio tools, video tools, text tools, developer utilities, security tools, calculators, generators, and typing tools.",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <div className="pb-14">
      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
          <header className="mt-4 max-w-3xl">
            <p className="tm-eyebrow">Browse</p>
            <h1 className="tm-h1 mt-4">Explore Tool Base Categories</h1>
            <p className="tm-lead mt-4">
              Browse free online tools by category. Each category page includes an introduction,
              searchable tool listing, and links to related utilities.
            </p>
          </header>
        </div>
      </div>
      <div className="tm-container mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
