import Link from "next/link";
import type { CategoryDefinition } from "@/lib/tools/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

interface CategoryCardProps {
  category: CategoryDefinition;
  toolCount?: number;
  className?: string;
  titledAs?: "h3" | "h2" | "p";
}

export function CategoryCard({
  category,
  toolCount,
  className,
  titledAs = "h3",
}: CategoryCardProps) {
  const TitleTag = titledAs;

  return (
    <Link
      href={category.route}
      className={cn(
        "tm-card group flex h-full flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-accent",
        className,
      )}
      aria-label={`Browse ${category.name}`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-tm-accent to-tm-cyan text-white shadow-[0_8px_20px_rgba(21,94,239,0.22)]">
        <Icon name={category.icon} className="h-5 w-5" />
      </span>
      <TitleTag className="tm-h3 mt-5 transition-colors group-hover:text-tm-accent">
        {category.name}
      </TitleTag>
      <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-tm-muted">
        {category.description}
      </p>
      {typeof toolCount === "number" ? (
        <p className="mt-4 text-sm font-bold text-tm-accent">
          {toolCount} {toolCount === 1 ? "tool" : "tools"}
        </p>
      ) : (
        <p className="mt-4 text-sm font-bold text-tm-accent">Explore category →</p>
      )}
    </Link>
  );
}
