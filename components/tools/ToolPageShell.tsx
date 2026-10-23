import Link from "next/link";
import { ExamplesBlock } from "@/components/ui/ExamplesBlock";
import { FAQ } from "@/components/ui/FAQ";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ReportTool } from "@/components/feedback/ReportTool";
import { getCategoryById } from "@/lib/tools/categories";
import type { ToolDefinition } from "@/lib/tools/types";

interface ToolPageShellProps {
  tool: ToolDefinition;
  workspace?: React.ReactNode;
}

export function ToolPageShell({ tool, workspace }: ToolPageShellProps) {
  const category = getCategoryById(tool.category);
  const showReport = !tool.hideReport;

  return (
    <div className="tm-container min-w-0 py-6 sm:py-8 md:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(category
            ? [{ label: category.name, href: category.route }]
            : [{ label: "All Tools", href: "/tools" }]),
          { label: tool.name },
        ]}
      />

      <header className="max-w-3xl">
        <p className="tm-eyebrow">{category?.name ?? "Online Tool"}</p>
        <h1 className="tm-h1 mt-4">{tool.h1}</h1>
        <p className="tm-lead mt-4">{tool.intro}</p>
        {tool.guide ? (
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-tm-muted">
            {tool.guide.text}{" "}
            <Link
              href={tool.guide.href}
              className="font-bold text-tm-accent hover:text-tm-accent-hover"
            >
              {tool.guide.label}
            </Link>
          </p>
        ) : null}
      </header>

      <section
        aria-label={`${tool.name} workspace`}
        className="tm-panel mt-6 min-w-0 overflow-hidden p-4 sm:mt-8 sm:p-5 md:p-8"
      >
        {workspace ?? (
          <div className="rounded-2xl border border-dashed border-tm-border bg-tm-soft px-5 py-12 text-center">
            <p className="text-lg font-bold text-tm-text">{tool.name} workspace</p>
            <p className="mx-auto mt-3 max-w-xl text-base font-medium text-tm-muted">
              The interactive processor for this tool will be connected in a later update.
              The page structure, SEO content, and related tools are ready now.
            </p>
          </div>
        )}
      </section>

      <div className="mt-14 space-y-14">
        <section>
          <h2 className="tm-h2">{tool.howToHeading ?? `How to Use ${tool.name}`}</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {tool.howToSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-tm-border bg-tm-elevated p-5"
              >
                <p className="text-sm font-bold text-tm-accent">Step {index + 1}</p>
                <h3 className="tm-h3 mt-2">{step.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-tm-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="tm-h2">{tool.featuresHeading ?? "Features"}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {tool.features.map((feature) => (
              <li
                key={feature}
                className="rounded-xl border border-tm-border bg-tm-elevated px-4 py-3 text-sm font-semibold text-tm-text"
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {hasUsefulDetailCards(tool) ? (
          <section>
            <h2 className="tm-h2">
              {tool.supportedFormatsHeading ?? "Supported Formats / Details"}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <DetailCard
                title={isCalculatorLike(tool) ? "Inputs" : "Input formats"}
                items={tool.inputFormats}
              />
              <DetailCard
                title={isCalculatorLike(tool) ? "Results" : "Output formats"}
                items={tool.outputFormats}
              />
              <DetailCard
                title={isCalculatorLike(tool) ? "Details" : "Supported formats"}
                items={uniqueDetailItems(tool)}
              />
            </div>
          </section>
        ) : null}

        {tool.examples?.length ? <ExamplesBlock examples={tool.examples} /> : null}

        {tool.tips?.length ? (
          <section>
            <h2 className="tm-h2">{tool.tipsHeading ?? "Tips"}</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {tool.tips.map((tip) => (
                <li
                  key={tip}
                  className="rounded-xl border border-tm-border bg-tm-elevated px-4 py-3 text-sm font-semibold text-tm-text"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <FAQ items={tool.faq} />

        <RelatedTools tool={tool} heading={tool.relatedToolsHeading} />

        {showReport ? (
          <section className="grid gap-4 lg:grid-cols-2">
            <ReportTool toolName={tool.name} toolSlug={tool.slug} />
            <div className="rounded-2xl border border-tm-border bg-tm-soft p-5">
              <h3 className="text-base font-bold text-tm-text">Need another utility?</h3>
              <p className="mt-2 text-sm font-medium text-tm-muted">
                Browse related converters and utilities, or explore the full Tool Base directory.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {category ? (
                  <Link href={category.route} className="tm-btn tm-btn-secondary">
                    Browse {category.name}
                  </Link>
                ) : null}
                <Link href="/tools" className="tm-btn tm-btn-primary">
                  Explore All Tools
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-tm-border bg-tm-soft p-5">
            <h3 className="text-base font-bold text-tm-text">Need another utility?</h3>
            <p className="mt-2 text-sm font-medium text-tm-muted">
              Browse related tools or explore the full Tool Base directory.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {category ? (
                <Link href={category.route} className="tm-btn tm-btn-secondary">
                  Browse {category.name}
                </Link>
              ) : null}
              <Link href="/tools" className="tm-btn tm-btn-primary">
                Explore All Tools
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function isCalculatorLike(tool: ToolDefinition): boolean {
  return (
    tool.category === "calculators-converters" ||
    tool.category === "specialized-calculators"
  );
}

function uniqueDetailItems(tool: ToolDefinition): string[] {
  const overlap = new Set([
    ...tool.inputFormats.map((item) => item.toLowerCase()),
    ...tool.outputFormats.map((item) => item.toLowerCase()),
  ]);
  const unique = tool.supportedFormats.filter(
    (item) => !overlap.has(item.toLowerCase()),
  );
  return unique.length ? unique : tool.supportedFormats;
}

function hasUsefulDetailCards(tool: ToolDefinition): boolean {
  return (
    tool.inputFormats.length > 0 ||
    tool.outputFormats.length > 0 ||
    tool.supportedFormats.length > 0
  );
}

function DetailCard({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-tm-border bg-tm-elevated p-5">
      <h3 className="text-sm font-bold tracking-wide text-tm-muted uppercase">{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm font-semibold text-tm-text">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
