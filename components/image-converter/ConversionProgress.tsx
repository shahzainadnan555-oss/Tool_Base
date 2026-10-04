"use client";

interface ConversionProgressProps {
  label?: string;
  /** Real measured percent only — omit for indeterminate. */
  percent?: number | null;
}

export function ConversionProgress({
  label = "Converting your image…",
  percent = null,
}: ConversionProgressProps) {
  const determinate =
    typeof percent === "number" && Number.isFinite(percent) && percent >= 0;

  if (determinate) {
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    return (
      <div
        role="progressbar"
        aria-live="polite"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label}
        className="rounded-2xl border border-tm-border bg-tm-soft px-4 py-3"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-tm-text">{label}</p>
          <p className="text-sm font-extrabold text-tm-accent">{value}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-tm-track">
          <div
            className="h-full rounded-full bg-tm-accent transition-[width] duration-200"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  }

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
