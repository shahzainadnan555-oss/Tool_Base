import Link from "next/link";
import { ToolCard } from "@/components/tools/ToolCard";
import { browseSections, toolsForBrowseSection } from "@/lib/tools/browse";
import { Icon } from "@/components/ui/Icon";

export function CategoryToolSections({
  limit = 8,
}: {
  limit?: number;
}) {
  return (
    <div className="space-y-14 md:space-y-16">
      {browseSections.map((section, index) => {
        const tools = toolsForBrowseSection(section, limit);
        if (!tools.length) return null;
        const alt = index % 2 === 1;
        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28 tm-reveal"
            style={{ animationDelay: `${Math.min(index, 4) * 40}ms` }}
          >
            <div
              className={
                alt
                  ? "-mx-4 rounded-2xl border border-tm-border bg-tm-white px-4 py-6 sm:-mx-0 sm:px-6 md:py-8"
                  : ""
              }
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-tm-accent to-tm-cyan text-white shadow-[0_8px_20px_rgba(21,94,239,0.25)]">
                      <Icon name={section.icon} className="h-5 w-5" />
                    </span>
                    <h2 className="tm-h2">{section.label}</h2>
                  </div>
                  <p className="mt-3 text-base font-medium text-tm-muted">
                    {section.description}
                  </p>
                </div>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-bold text-tm-accent transition-colors hover:bg-tm-surface-2 hover:text-tm-accent-hover"
                >
                  View All →
                </Link>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} compact />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
