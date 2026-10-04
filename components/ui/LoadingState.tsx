interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 rounded-2xl border border-tm-border bg-tm-white px-6 py-12"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-tm-accent border-r-transparent" />
      <span className="font-semibold text-tm-muted">{label}</span>
    </div>
  );
}
