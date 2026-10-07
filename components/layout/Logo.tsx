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
 */
export function Logo({ className, href = "/", compact = false }: LogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center rounded-xl bg-white px-2 py-1.5 shadow-[0_0_0_1px_rgba(11,22,53,0.08)] transition-[padding] duration-200",
        compact && "px-1.5 py-1",
        className,
      )}
    >
      <Image
        src="/tb-logo.png"
        alt="Tool Base"
        width={2032}
        height={774}
        priority
        className={cn(
          "w-auto object-contain object-left transition-[height,max-width] duration-200",
          compact
            ? "h-7 max-w-[128px] sm:h-8 sm:max-w-[148px]"
            : "h-7 max-w-[132px] sm:h-9 sm:max-w-[176px] md:h-10 md:max-w-[200px]",
        )}
      />
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="Tool Base home" className="inline-flex shrink-0">
      {content}
    </Link>
  );
}
