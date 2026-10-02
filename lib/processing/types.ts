export type ProcessingPhase = "idle" | "processing" | "done" | "error";

export type ProgressState =
  | { mode: "indeterminate"; label: string }
  | { mode: "determinate"; label: string; percent: number; detail?: string };

export interface OperationControllerState {
  phase: ProcessingPhase;
  progress: ProgressState | null;
  error: string | null;
  operationId: number;
}
