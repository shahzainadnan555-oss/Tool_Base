import { CategoryCard } from "@/components/tools/CategoryCard";
import { categories } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";

export function CategoriesSection() {
  return (
    <section className="tm-section bg-tm-white">
      <div className="tm-container">
        <div className="max-w-3xl">
          <h2 className="tm-h2">Explore Tool Base Categories</h2>
          <p className="tm-lead mt-4">
            Browse free online tools by category — from image and PDF utilities to audio,
            video, text, developer, security, calculator, and generator tools.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              toolCount={getToolsByCategory(category.id).length}
              titledAs="h3"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
