export type ProcessingPhase =
  | "idle"
  | "preparing"
  | "processing"
  | "finalizing"
  | "done"
  | "error"
  | "cancelled";

/**
 * Authoritative progress payload for tool UIs.
 * Determinate mode is reserved for real measurable work only.
 */
export type ProgressState =
  | { mode: "indeterminate"; label: string }
  | {
      mode: "determinate";
      label: string;
      /** 0–99 while running; 100 only after true completion. */
      percent: number;
      /** Optional honest unit detail, e.g. "8 of 20 pages". */
      detail?: string;
    };

export interface OperationControllerState {
  phase: ProcessingPhase;
  progress: ProgressState | null;
  error: string | null;
  operationId: number;
}

/** UI delay before showing a loader for very short operations (ms). */
export const LOADER_REVEAL_MS = 120;

/** Minimum interval between progress UI updates (ms). */
export const PROGRESS_THROTTLE_MS = 50;
