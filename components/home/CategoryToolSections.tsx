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
    <div className="space-y-16">
      {browseSections.map((section) => {
        const tools = toolsForBrowseSection(section, limit);
        if (!tools.length) return null;
        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-tm-navy text-white">
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
                className="text-sm font-bold text-tm-accent hover:text-tm-accent-hover"
              >
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            <p className="mt-5">
              <Link
                href={section.href}
                className="text-sm font-bold text-tm-accent hover:text-tm-accent-hover"
              >
                View all {section.label.toLowerCase()} tools →
              </Link>
            </p>
          </section>
        );
      })}
    </div>
  );
}
