import { Button } from "@/components/ui/Button";

interface CTASectionProps {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  dark?: boolean;
}

export function CTASection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  dark = false,
}: CTASectionProps) {
  return (
    <section
      className={
        dark
          ? "tm-surface-dark rounded-2xl px-5 py-10 sm:rounded-3xl sm:px-6 md:px-10 md:py-14"
          : "rounded-2xl border border-tm-border bg-tm-elevated px-5 py-10 sm:rounded-3xl sm:px-6 md:px-10 md:py-14"
      }
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className={`tm-h2 ${dark ? "text-tm-on-brand" : ""}`}>{title}</h2>
        <p className={`tm-lead mx-auto mt-4 ${dark ? "text-[var(--tm-footer-muted)]" : ""}`}>
          {description}
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href={primaryHref} className="w-full sm:w-auto">
            {primaryLabel}
          </Button>
          {secondaryHref && secondaryLabel ? (
            <Button
              href={secondaryHref}
              variant="secondary"
              className={
                dark
                  ? "w-full border-white/20 bg-white/10 text-tm-on-brand hover:bg-white hover:text-tm-navy sm:w-auto"
                  : "w-full sm:w-auto"
              }
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
