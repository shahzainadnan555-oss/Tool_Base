import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  href?: string;
  tone?: "light" | "dark";
}

export function Logo({ className, href = "/", tone = "light" }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-tm-accent text-sm font-extrabold text-white"
      >
        TM
      </span>
      <span
        className={cn(
          "text-xl font-extrabold tracking-tight",
          tone === "dark" ? "text-white" : "text-tm-text",
        )}
      >
        ToolMyra
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="ToolMyra home" className="inline-flex">
      {content}
    </Link>
  );
}
