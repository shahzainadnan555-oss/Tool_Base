import Link from "next/link";
import { getRelatedTools } from "@/lib/tools/registry";
import type { ToolDefinition } from "@/lib/tools/types";
import { ToolCard } from "@/components/tools/ToolCard";

interface RelatedToolsProps {
  tool: ToolDefinition;
  heading?: string;
}

export function RelatedTools({ tool, heading }: RelatedToolsProps) {
  const related = getRelatedTools(tool);

  if (!related.length) return null;

  return (
    <section aria-labelledby="related-tools-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="related-tools-heading" className="tm-h2">
            {heading ?? "Related Tools"}
          </h2>
          <p className="mt-2 max-w-2xl text-base font-medium text-tm-muted">
            Explore related Tool Base utilities that pair well with {tool.name}.
          </p>
        </div>
        <Link href="/tools" className="text-sm font-bold text-tm-accent hover:text-tm-accent-hover">
          Browse all tools
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <ToolCard key={item.id} tool={item} />
        ))}
      </div>
    </section>
  );
}
