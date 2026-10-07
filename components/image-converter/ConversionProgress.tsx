"use client";

import { ProcessingProgress } from "@/components/ui/ProcessingProgress";
import type { ProgressState } from "@/lib/processing/types";

interface ConversionProgressProps {
  label?: string;
  /** Real measured percent only — omit or null for indeterminate. */
  percent?: number | null;
}

/**
 * Thin adapter over ProcessingProgress for image converter / editor call sites.
 */
export function ConversionProgress({
  label = "Converting your image…",
  percent = null,
}: ConversionProgressProps) {
  const progress: ProgressState =
    typeof percent === "number" && Number.isFinite(percent) && percent >= 0
      ? {
          mode: "determinate",
          label,
          percent: Math.max(0, Math.min(100, Math.round(percent))),
        }
      : { mode: "indeterminate", label };

  return <ProcessingProgress progress={progress} />;
}
