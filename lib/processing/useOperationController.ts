"use client";

import { useCallback, useRef, useState } from "react";
import type { OperationControllerState, ProgressState } from "./types";

/**
 * Single-operation processing controller (Prompt 3A).
 * Ensures one active job, real progress when measurable, and stale-result protection.
 */
export function useOperationController(defaultLabel = "Processing…") {
  const opIdRef = useRef(0);
  const [phase, setPhase] = useState<OperationControllerState["phase"]>("idle");
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isCurrent = useCallback((operationId: number) => operationId === opIdRef.current, []);

  const start = useCallback(
    (label = defaultLabel): number => {
      const id = ++opIdRef.current;
      setPhase("processing");
      setError(null);
      setProgress({ mode: "indeterminate", label });
      return id;
    },
    [defaultLabel],
  );

  const setIndeterminate = useCallback(
    (operationId: number, label: string) => {
      if (!isCurrent(operationId)) return;
      setProgress({ mode: "indeterminate", label });
    },
    [isCurrent],
  );

  const setUnitProgress = useCallback(
    (operationId: number, completed: number, total: number, label: string) => {
      if (!isCurrent(operationId)) return;
      if (!Number.isFinite(total) || total <= 0) {
        setProgress({ mode: "indeterminate", label });
        return;
      }
      const percent = Math.max(0, Math.min(100, Math.round((completed / total) * 100)));
      setProgress({
        mode: "determinate",
        label,
        percent,
        detail: `${completed} of ${total}`,
      });
    },
    [isCurrent],
  );

  const succeed = useCallback(
    (operationId: number): boolean => {
      if (!isCurrent(operationId)) return false;
      setPhase("done");
      setProgress(null);
      setError(null);
      return true;
    },
    [isCurrent],
  );

  const fail = useCallback(
    (operationId: number, message: string) => {
      if (!isCurrent(operationId)) return;
      setPhase("error");
      setProgress(null);
      setError(message);
    },
    [isCurrent],
  );

  const reset = useCallback(() => {
    opIdRef.current += 1;
    setPhase("idle");
    setProgress(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    phase,
    progress,
    error,
    isProcessing: phase === "processing",
    start,
    setIndeterminate,
    setUnitProgress,
    succeed,
    fail,
    reset,
    clearError,
    isCurrent,
  };
}
