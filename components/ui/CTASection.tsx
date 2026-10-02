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
          ? "tm-surface-dark rounded-3xl px-6 py-12 md:px-10 md:py-14"
          : "rounded-3xl border border-tm-border bg-white px-6 py-12 md:px-10 md:py-14"
      }
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className={`tm-h2 ${dark ? "text-white" : ""}`}>{title}</h2>
        <p className={`tm-lead mx-auto mt-4 ${dark ? "text-slate-300" : ""}`}>
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={primaryHref}>{primaryLabel}</Button>
          {secondaryHref && secondaryLabel ? (
            <Button
              href={secondaryHref}
              variant={dark ? "secondary" : "secondary"}
              className={dark ? "border-white/20 bg-white/10 text-white hover:bg-white hover:text-tm-text" : undefined}
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
