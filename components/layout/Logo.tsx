import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  href?: string;
  /** On light surfaces the mark sits in a navy badge for contrast; on dark surfaces the mark stands alone. */
  tone?: "light" | "dark";
}

/**
 * Official ToolMyra brand mark — the uploaded TM monogram asset only.
 * Do not recreate or alter the artwork. Contrast is handled by the container, not the mark.
 */
export function Logo({ className, href = "/", tone = "light" }: LogoProps) {
  const mark = (
    <Image
      src="/tm-logo.png"
      alt="ToolMyra"
      width={1536}
      height={1024}
      priority
      className="h-8 w-auto object-contain md:h-9"
    />
  );

  const content =
    tone === "dark" ? (
      <span className={cn("inline-flex items-center", className)}>{mark}</span>
    ) : (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[0.7rem] bg-[#0B1220] px-2 py-1.5",
          "shadow-[inset_0_0_0_1px_rgba(37,99,235,0.35),0_0_0_1px_rgba(59,130,246,0.12)]",
          className,
        )}
      >
        {mark}
      </span>
    );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="ToolMyra home"
      className="inline-flex shrink-0"
    >
      {content}
    </Link>
  );
}
