"use client";

interface LoadingStateProps {
  label?: string;
}

/** Page/section indeterminate loading. */
export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 rounded-2xl border border-tm-border bg-tm-elevated px-6 py-12"
    >
      <span
        className="tm-spinner h-5 w-5 shrink-0 rounded-full border-2 border-tm-accent border-r-transparent"
        aria-hidden
      />
      <span className="font-semibold text-tm-muted">{label}</span>
    </div>
  );
}
