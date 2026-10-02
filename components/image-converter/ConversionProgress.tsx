"use client";

export function ConversionProgress({ label = "Converting your image…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-2xl border border-tm-border bg-tm-soft px-4 py-3"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-tm-accent border-r-transparent" />
      <p className="text-sm font-bold text-tm-text">{label}</p>
    </div>
  );
}
