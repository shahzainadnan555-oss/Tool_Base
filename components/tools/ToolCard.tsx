import Link from "next/link";
import { getCategoryById } from "@/lib/tools/categories";
import type { ToolDefinition } from "@/lib/tools/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

interface ToolCardProps {
  tool: ToolDefinition;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const category = getCategoryById(tool.category);

  return (
    <Link
      href={tool.route}
      className={cn(
        "tm-card group flex h-full flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-accent",
        className,
      )}
      aria-label={`Open ${tool.name}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-tm-soft text-tm-accent">
          <Icon name={tool.icon} className="h-5 w-5" />
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          {tool.popular ? (
            <span className="tm-badge bg-tm-soft text-tm-accent">Popular</span>
          ) : null}
          {tool.new ? (
            <span className="tm-badge bg-tm-soft text-tm-success">New</span>
          ) : null}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-bold text-tm-text transition-colors group-hover:text-tm-accent">
        {tool.name}
      </h3>
      <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-tm-muted">
        {tool.shortDescription}
      </p>
      {category ? (
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-tm-muted">
          {category.name}
        </p>
      ) : null}
    </Link>
  );
}
