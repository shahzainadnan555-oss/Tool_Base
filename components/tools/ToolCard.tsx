import Link from "next/link";
import { getCategoryById } from "@/lib/tools/categories";
import type { ToolDefinition } from "@/lib/tools/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

interface ToolCardProps {
  tool: ToolDefinition;
  className?: string;
  compact?: boolean;
}

export function ToolCard({ tool, className, compact = false }: ToolCardProps) {
  const category = getCategoryById(tool.category);

  return (
    <Link
      href={tool.route}
      className={cn(
        "tm-tool-card group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-accent",
        compact ? "p-3.5" : "p-4",
        className,
      )}
      aria-label={`Open ${tool.name}`}
    >
      <div className="flex items-start gap-3">
        <span className="tm-tool-card-icon inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tm-surface-2 text-tm-accent transition-[transform,background,color] duration-150">
          <Icon name={tool.icon} className="h-4.5 w-4.5 h-[1.125rem] w-[1.125rem]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-[0.95rem] font-bold leading-snug text-tm-text transition-colors group-hover:text-tm-accent">
              {tool.name}
            </h3>
            {(tool.popular || tool.new) && (
              <div className="flex shrink-0 flex-wrap gap-1">
                {tool.popular ? (
                  <span className="tm-badge bg-tm-surface-2 text-tm-accent">Featured</span>
                ) : null}
                {tool.new ? (
                  <span className="tm-badge bg-tm-success-bg text-tm-success">New</span>
                ) : null}
              </div>
            )}
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-relaxed text-tm-muted">
            {tool.shortDescription}
          </p>
          {category ? (
            <p className="mt-2.5 text-[0.68rem] font-bold tracking-[0.06em] text-tm-muted uppercase">
              {category.name}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
