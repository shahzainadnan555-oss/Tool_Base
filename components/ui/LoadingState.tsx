"use client";

interface LoadingStateProps {
  label?: string;
  detail?: string;
}

/** Page/section indeterminate loading for interactive tool workspaces. */
export function LoadingState({
  label = "Preparing the tool…",
  detail = "The interactive controls will appear here in a moment. Usage notes and FAQs stay available below.",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-tm-border bg-tm-elevated px-6 py-12 text-center"
    >
      <span className="inline-flex items-center gap-3">
        <span
          className="tm-spinner h-5 w-5 shrink-0 rounded-full border-2 border-tm-accent border-r-transparent"
          aria-hidden
        />
        <span className="font-semibold text-tm-muted">{label}</span>
      </span>
      {detail ? (
        <p className="max-w-md text-sm font-medium text-tm-muted">{detail}</p>
      ) : null}
    </div>
  );
}
