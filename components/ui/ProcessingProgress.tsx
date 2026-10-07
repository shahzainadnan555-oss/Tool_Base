"use client";

import type { ProgressState } from "@/lib/processing/types";

interface ProcessingProgressProps {
  progress: ProgressState;
  className?: string;
}

/**
 * Shared Tool Base processing indicator.
 * Determinate percent only when progress contains real measurements.
 */
export function ProcessingProgress({
  progress,
  className = "",
}: ProcessingProgressProps) {
  if (progress.mode === "determinate") {
    return (
      <div
        role="progressbar"
        aria-live="polite"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-label={progress.label}
        className={`rounded-2xl border border-tm-border bg-tm-soft px-4 py-3 ${className}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 text-sm font-bold text-tm-text">
            {progress.label}
          </p>
          <p className="shrink-0 text-sm font-extrabold tabular-nums text-tm-accent">
            {progress.percent}%
          </p>
        </div>
        {progress.detail ? (
          <p className="mt-1 text-xs font-semibold text-tm-muted">
            {progress.detail}
          </p>
        ) : null}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-tm-track">
          <div
            className="tm-progress-fill h-full rounded-full bg-tm-accent"
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
      className={`flex items-center gap-3 rounded-2xl border border-tm-border bg-tm-soft px-4 py-3 ${className}`}
    >
      <span
        className="tm-spinner h-5 w-5 shrink-0 rounded-full border-2 border-tm-accent border-r-transparent"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-tm-text">{progress.label}</p>
        <div className="tm-progress-shimmer mt-2 h-1.5 overflow-hidden rounded-full bg-tm-track" />
      </div>
    </div>
  );
}
