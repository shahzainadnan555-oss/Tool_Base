import { ToolCard } from "@/components/tools/ToolCard";
import type { ToolDefinition } from "@/lib/tools/types";
import { cn } from "@/lib/utils/cn";

interface ToolGridProps {
  tools: ToolDefinition[];
  className?: string;
}

export function ToolGrid({ tools, className }: ToolGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
