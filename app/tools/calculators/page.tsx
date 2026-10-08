import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolCard } from "@/components/tools/ToolCard";
import { SearchBar } from "@/components/search/SearchBar";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import {
  formulaCalculatorCatalog,
  SUBCATEGORY_LABELS,
  type FormulaSubcategory,
} from "@/lib/formula-calculators";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "Online Calculators",
  description:
    "Browse Tool Base financial, math, date, construction, electrical, transportation, and education calculators with clear formulas and mobile-friendly tools.",
  path: "/tools/calculators",
  keywords: [
    "online calculators",
    "financial calculators",
    "math calculators",
    "mortgage calculator",
    "scientific calculator",
  ],
});

const ORDER: FormulaSubcategory[] = [
  "financial",
  "math",
  "date-time",
  "construction",
  "measurement",
  "electrical",
  "internet",
  "transportation",
  "education",
  "other",
];

export default function CalculatorsHubPage() {
  const formulaSlugs = new Set(formulaCalculatorCatalog.map((item) => item.slug));
  const everyday = getToolsByCategory("calculators-converters").filter(
    (tool) => tool.category === "calculators-converters" && !formulaSlugs.has(tool.slug),
  );
  // getToolsByCategory("calculators-converters") merges specialized; pull specialized directly.
  const specialized = getToolsByCategory("specialized-calculators").filter(
    (tool) => tool.category === "specialized-calculators",
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Online Calculators", path: "/tools/calculators" },
        ])}
      />
      <div className="tm-container py-10 md:py-14">
        <header className="max-w-3xl">
          <p className="text-sm font-bold tracking-wide text-tm-accent uppercase">
            Tool Base
          </p>
          <h1 className="tm-h1 mt-2">Online Calculators</h1>
          <p className="mt-4 text-base font-medium text-tm-muted md:text-lg">
            Explore original Tool Base calculators organized by category. Search by
            name or keyword, then open a focused workspace with validation, formulas,
            and mobile-friendly inputs.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar placeholder="Search calculators…" />
          </div>
        </header>

        <nav
          aria-label="Calculator categories"
          className="mt-10 flex flex-wrap gap-2"
        >
          {ORDER.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="rounded-xl border border-tm-border bg-tm-elevated px-3 py-2 text-sm font-bold text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent"
            >
              {SUBCATEGORY_LABELS[key]}
            </a>
          ))}
          <a
            href="#everyday"
            className="rounded-xl border border-tm-border bg-tm-elevated px-3 py-2 text-sm font-bold text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent"
          >
            Everyday & converters
          </a>
          <a
            href="#specialized"
            className="rounded-xl border border-tm-border bg-tm-elevated px-3 py-2 text-sm font-bold text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent"
          >
            Specialized
          </a>
        </nav>

        <div className="mt-12 space-y-14">
          {ORDER.map((key) => {
            const tools = formulaCalculatorCatalog
              .filter((item) => item.subcategory === key)
              .map((item) => getToolBySlug(item.slug))
              .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
            if (!tools.length) return null;
            return (
              <section key={key} id={key} className="scroll-mt-28">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="tm-h2">{SUBCATEGORY_LABELS[key]}</h2>
                    <p className="mt-2 text-sm font-medium text-tm-muted">
                      {tools.length} calculators
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} compact />
                  ))}
                </div>
              </section>
            );
          })}

          <section id="everyday" className="scroll-mt-28">
            <h2 className="tm-h2">Everyday Calculators & Converters</h2>
            <p className="mt-2 text-sm font-medium text-tm-muted">
              Core Tool Base converters and everyday math helpers.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {everyday.slice(0, 20).map((tool) => (
                <ToolCard key={tool.id} tool={tool} compact />
              ))}
            </div>
            <Link
              href="/categories/calculators-converters"
              className="mt-4 inline-flex text-sm font-bold text-tm-accent"
            >
              View all converters →
            </Link>
          </section>

          <section id="specialized" className="scroll-mt-28">
            <h2 className="tm-h2">Specialized Calculators</h2>
            <p className="mt-2 text-sm font-medium text-tm-muted">
              GPA, AP scores, auto, tax, retirement, and other focused estimators.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {specialized.map((tool) => (
                <ToolCard key={tool.id} tool={tool} compact />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
