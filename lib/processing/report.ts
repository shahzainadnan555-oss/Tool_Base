/**
 * Honest progress helpers.
 * Stages with no measurable units use total=0 / ratio<0 → indeterminate UI.
 */

export type UnitProgressFn = (
  completed: number,
  total: number,
  label: string,
) => void;

export type RatioProgressFn = (ratio: number, label: string) => void;

/** Status-only update when no reliable percentage exists. */
export function reportStage(
  onProgress: UnitProgressFn | undefined,
  label: string,
): void {
  onProgress?.(0, 0, label);
}

/** Status-only update for ratio-based APIs (ffmpeg tools). */
export function reportRatioStage(
  onProgress: RatioProgressFn | undefined,
  label: string,
): void {
  onProgress?.(-1, label);
}
