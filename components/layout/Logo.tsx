import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  href?: string;
  /** Kept for call-site compatibility. */
  tone?: "light" | "dark";
  compact?: boolean;
}

/**
 * Official Tool Base wordmark on a white plate in both light and dark mode.
 * Height-sized with auto width so the plate hugs the artwork (no empty side space).
 */
export function Logo({ className, href = "/", compact = false }: LogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg bg-white shadow-[0_0_0_1px_rgba(11,22,53,0.08)]",
        compact ? "px-1 py-0.5" : "px-1.5 py-1",
        className,
      )}
    >
      <Image
        src="/tb-logo.png"
        alt="Tool Base"
        width={2032}
        height={774}
        priority
        sizes="120px"
        className={cn(
          "block w-auto object-contain object-left",
          compact ? "h-6 sm:h-7" : "h-7 sm:h-8",
        )}
        style={{ width: "auto" }}
      />
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label="Tool Base home"
      className="relative z-10 inline-flex shrink-0"
    >
      {content}
    </Link>
  );
}
