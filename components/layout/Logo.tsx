import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  href?: string;
  /** Kept for call-site compatibility. The artwork sits on a white plate for contrast. */
  tone?: "light" | "dark";
}

/**
 * Official Tool Base logo — the uploaded gradient TB + wordmark asset only.
 * A white plate keeps navy wordmark readable on dark header/footer surfaces.
 */
export function Logo({ className, href = "/" }: LogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center rounded-xl bg-white px-2 py-1.5 shadow-[0_0_0_1px_rgba(11,22,53,0.06)]",
        className,
      )}
    >
      <Image
        src="/tb-logo.png"
        alt="Tool Base"
        width={2032}
        height={774}
        priority
        className="h-7 w-auto max-w-[132px] object-contain object-left sm:h-9 sm:max-w-[176px] md:h-10 md:max-w-[200px]"
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
