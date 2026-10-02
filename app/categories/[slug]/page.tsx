import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import {
  getAllCategorySlugs,
  getCategoryBySlug,
} from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return createPageMetadata({
      title: "Category Not Found",
      description: "The requested ToolMyra category could not be found.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: category.seoTitle.replace(" | ToolMyra", ""),
    description: category.seoDescription,
    path: category.route,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const tools = getToolsByCategory(category.id);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: category.name, path: category.route },
        ])}
      />
      <div className="tm-container py-10 md:py-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />
        <header className="max-w-3xl">
          <h1 className="tm-h1">{category.h1}</h1>
          <p className="tm-lead mt-4">{category.intro}</p>
          <p className="mt-3 text-sm font-bold text-tm-muted">
            {tools.length} {tools.length === 1 ? "tool" : "tools"} in this category
          </p>
        </header>
        <div className="mt-8">
          <ToolsDirectory
            tools={tools}
            initialCategory={category.id}
            headingId="category-tools"
          />
        </div>
      </div>
    </>
  );
}
