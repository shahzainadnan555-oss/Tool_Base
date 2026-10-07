"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LOADER_REVEAL_MS,
  PROGRESS_THROTTLE_MS,
  type OperationControllerState,
  type ProgressState,
} from "./types";

function clampPercent(value: number, max = 99): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.round(value)));
}

/**
 * Single-operation processing controller.
 * One active job ID; determinate progress only from real measurements.
 */
export function useOperationController(defaultLabel = "Processing…") {
  const opIdRef = useRef(0);
  const lastPercentRef = useRef(0);
  const lastLabelRef = useRef("");
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingProgressRef = useRef<ProgressState | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase] = useState<OperationControllerState["phase"]>("idle");
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const clearThrottle = useCallback(() => {
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }
    pendingProgressRef.current = null;
  }, []);

  const clearReveal = useCallback(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearThrottle();
      clearReveal();
    };
  }, [clearReveal, clearThrottle]);

  const flushProgress = useCallback((next: ProgressState) => {
    setProgress(next);
  }, []);

  const publishProgress = useCallback(
    (next: ProgressState) => {
      pendingProgressRef.current = next;
      if (throttleTimerRef.current) return;
      flushProgress(next);
      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null;
        const pending = pendingProgressRef.current;
        if (pending) flushProgress(pending);
      }, PROGRESS_THROTTLE_MS);
    },
    [flushProgress],
  );

  const isCurrent = useCallback(
    (operationId: number) => operationId === opIdRef.current,
    [],
  );

  const start = useCallback(
    (label = defaultLabel): number => {
      const id = ++opIdRef.current;
      lastPercentRef.current = 0;
      lastLabelRef.current = label;
      clearThrottle();
      clearReveal();
      setPhase("processing");
      setError(null);
      setLoaderVisible(false);
      setProgress({ mode: "indeterminate", label });
      revealTimerRef.current = setTimeout(() => {
        if (opIdRef.current === id) setLoaderVisible(true);
      }, LOADER_REVEAL_MS);
      return id;
    },
    [clearReveal, clearThrottle, defaultLabel],
  );

  const setIndeterminate = useCallback(
    (operationId: number, label: string) => {
      if (!isCurrent(operationId)) return;
      lastLabelRef.current = label;
      lastPercentRef.current = 0;
      publishProgress({ mode: "indeterminate", label });
    },
    [isCurrent, publishProgress],
  );

  /**
   * Real unit progress (pages, files, bytes with a known total, etc.).
   * Does not invent "X of 100" for ratio-only work — use setRatioProgress.
   */
  const setUnitProgress = useCallback(
    (
      operationId: number,
      completed: number,
      total: number,
      label: string,
      detail?: string,
    ) => {
      if (!isCurrent(operationId)) return;
      if (!Number.isFinite(total) || total <= 0) {
        lastLabelRef.current = label;
        lastPercentRef.current = 0;
        publishProgress({ mode: "indeterminate", label });
        return;
      }
      const raw = (completed / total) * 100;
      // Cap at 99 until succeed() — 100% means validated completion.
      let percent = clampPercent(raw, 99);
      if (label === lastLabelRef.current && percent < lastPercentRef.current) {
        percent = lastPercentRef.current;
      }
      lastLabelRef.current = label;
      lastPercentRef.current = percent;
      // Default unit detail for countable work (pages/files). Skip for large
      // byte totals unless the caller supplies an explicit detail string.
      let honestDetail: string | undefined;
      if (detail !== undefined) {
        honestDetail = detail || undefined;
      } else if (total <= 500) {
        honestDetail = `${Math.min(Math.round(completed), total)} of ${total}`;
      }
      publishProgress({
        mode: "determinate",
        label,
        percent,
        detail: honestDetail,
      });
    },
    [isCurrent, publishProgress],
  );

  /**
   * Real 0–1 ratio progress (e.g. ffmpeg encoding progress).
   * Shows percent only — never fake "X of 100" units.
   */
  const setRatioProgress = useCallback(
    (operationId: number, ratio: number, label: string) => {
      if (!isCurrent(operationId)) return;
      if (!Number.isFinite(ratio) || ratio < 0) {
        lastLabelRef.current = label;
        lastPercentRef.current = 0;
        publishProgress({ mode: "indeterminate", label });
        return;
      }
      let percent = clampPercent(ratio * 100, 99);
      if (label === lastLabelRef.current && percent < lastPercentRef.current) {
        percent = lastPercentRef.current;
      }
      lastLabelRef.current = label;
      lastPercentRef.current = percent;
      publishProgress({ mode: "determinate", label, percent });
    },
    [isCurrent, publishProgress],
  );

  const succeed = useCallback(
    (operationId: number): boolean => {
      if (!isCurrent(operationId)) return false;
      clearThrottle();
      clearReveal();
      setPhase("done");
      setProgress(null);
      setLoaderVisible(false);
      setError(null);
      lastPercentRef.current = 0;
      return true;
    },
    [clearReveal, clearThrottle, isCurrent],
  );

  const fail = useCallback(
    (operationId: number, message: string) => {
      if (!isCurrent(operationId)) return;
      clearThrottle();
      clearReveal();
      setPhase("error");
      setProgress(null);
      setLoaderVisible(false);
      setError(message);
      lastPercentRef.current = 0;
    },
    [clearReveal, clearThrottle, isCurrent],
  );

  const cancel = useCallback(() => {
    opIdRef.current += 1;
    clearThrottle();
    clearReveal();
    setPhase("cancelled");
    setProgress(null);
    setLoaderVisible(false);
    setError(null);
    lastPercentRef.current = 0;
  }, [clearReveal, clearThrottle]);

  const reset = useCallback(() => {
    opIdRef.current += 1;
    clearThrottle();
    clearReveal();
    setPhase("idle");
    setProgress(null);
    setLoaderVisible(false);
    setError(null);
    lastPercentRef.current = 0;
  }, [clearReveal, clearThrottle]);

  const clearError = useCallback(() => setError(null), []);

  return {
    phase,
    progress,
    error,
    /** True while an operation is running (regardless of loader reveal delay). */
    isProcessing: phase === "processing" || phase === "preparing" || phase === "finalizing",
    /** True only after LOADER_REVEAL_MS — avoid spinner flash on instant ops. */
    showProgress: loaderVisible && progress != null,
    start,
    setIndeterminate,
    setUnitProgress,
    setRatioProgress,
    succeed,
    fail,
    cancel,
    reset,
    clearError,
    isCurrent,
  };
}
