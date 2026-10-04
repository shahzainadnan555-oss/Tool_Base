"use client";

import type { ProgressState } from "@/lib/processing/types";

interface ProcessingProgressProps {
  progress: ProgressState;
}

/**
 * Single loader for tool operations.
 * Shows a determinate percent only when real unit progress is available.
 */
export function ProcessingProgress({ progress }: ProcessingProgressProps) {
  if (progress.mode === "determinate") {
    return (
      <div
        role="progressbar"
        aria-live="polite"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-label={progress.label}
        className="rounded-2xl border border-tm-border bg-tm-soft px-4 py-3"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-tm-text">{progress.label}</p>
          <p className="text-sm font-extrabold text-tm-accent">{progress.percent}%</p>
        </div>
        {progress.detail ? (
          <p className="mt-1 text-xs font-semibold text-tm-muted">{progress.detail}</p>
        ) : null}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-tm-white">
          <div
            className="h-full rounded-full bg-tm-accent transition-[width] duration-200"
            style={{ width: `${progress.percent}%` }}
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
      <p className="text-sm font-bold text-tm-text">{progress.label}</p>
    </div>
  );
}
