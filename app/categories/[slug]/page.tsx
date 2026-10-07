import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/structured-data";
import {
  categories,
  getAllCategorySlugs,
  getCategoryBySlug,
} from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";
import type { ToolDefinition } from "@/lib/tools/types";

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
      description: "The requested Tool Base category could not be found.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: category.seoTitle.replace(" | Tool Base", ""),
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
  const featured = tools.filter((item) => item.popular).slice(0, 8);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: category.name, path: category.route },
        ])}
      />
      {category.faq?.length ? <JsonLd data={faqJsonLd(category.faq)} /> : null}

      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-10 md:py-14">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: category.name },
            ]}
          />
          <header className="mt-4 max-w-3xl">
            <p className="tm-eyebrow">Category</p>
            <h1 className="tm-h1 mt-4">{category.h1}</h1>
            <p className="tm-lead mt-4">{category.intro}</p>
            <p className="mt-3 text-sm font-bold text-tm-muted">
              {tools.length} {tools.length === 1 ? "tool" : "tools"} in this category
            </p>
          </header>
        </div>
      </div>

      <div className="tm-container py-10 md:py-12">
        {featured.length ? (
          <section>
            <h2 className="tm-h2">Featured {category.name}</h2>
            <div className="mt-5">
              <ToolGrid tools={featured} />
            </div>
          </section>
        ) : null}

        <section className={featured.length ? "mt-12" : ""}>
          <h2 className="tm-h2" id="category-tools">
            All {category.name}
          </h2>
          <div className="mt-5">
            {category.id === "specialized-calculators" ? (
              <SpecializedCalculatorGroups tools={tools} />
            ) : (
              <ToolsDirectory
                tools={tools}
                initialCategory={category.id}
                headingId="category-tools"
              />
            )}
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="tm-h2">Related categories</h2>
          <p className="mt-3 text-base font-medium text-tm-muted">
            Explore neighboring Tool Base categories for related workflows.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {categories
              .filter((item) => item.id !== category.id)
              .slice(0, 8)
              .map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.route}
                    className="inline-flex rounded-xl border border-tm-border bg-tm-elevated px-3.5 py-2 text-sm font-bold text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        {category.faq?.length ? (
          <section className="mt-14 max-w-3xl">
            <h2 className="tm-h2">Frequently Asked Questions</h2>
            <dl className="mt-6 space-y-5">
              {category.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-tm-border bg-tm-elevated p-5"
                >
                  <dt className="text-lg font-bold text-tm-text">{item.question}</dt>
                  <dd className="mt-2 text-base font-medium text-tm-muted">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>
    </>
  );
}

const SPECIALIZED_GROUPS = [
  { title: "Auto & Insurance", slugs: ["totaled-car-value-calculator"] },
  { title: "Property & Tax", slugs: ["capital-gains-tax-calculator-on-sale-of-property"] },
  {
    title: "Education",
    slugs: [
      "middle-school-gpa-calculator",
      "college-gpa-calculator",
      "high-school-gpa-calculator",
      "weighted-gpa-calculator",
      "final-grade-needed-calculator",
      "weighted-grade-calculator",
      "ap-chem-score-calculator",
      "ap-bio-score-calculator",
      "ap-calc-bc-score-calculator",
      "ap-lit-score-calculator",
      "ap-english-language-score-calculator",
      "ap-us-history-score-calculator",
      "ap-world-history-score-calculator",
      "ap-psychology-score-calculator",
    ],
  },
  {
    title: "Retirement & Finance",
    slugs: [
      "retirement-calculator-dave-ramsey",
      "car-loan-payment-calculator",
      "sales-commission-calculator",
    ],
  },
  { title: "Home Services", slugs: ["tree-removal-cost-calculator"] },
] as const;

function SpecializedCalculatorGroups({ tools }: { tools: ToolDefinition[] }) {
  const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  return (
    <div className="space-y-10">
      {SPECIALIZED_GROUPS.map((group) => {
        const groupTools = group.slugs
          .map((slug) => bySlug.get(slug))
          .filter((tool): tool is ToolDefinition => Boolean(tool));
        if (!groupTools.length) return null;
        return (
          <section key={group.title}>
            <h3 className="tm-h3">{group.title}</h3>
            <div className="mt-4">
              <ToolGrid tools={groupTools} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
