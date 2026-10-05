export type SpecializedCalculatorKind =
  | "totaled-car"
  | "capital-gains"
  | "middle-school-gpa"
  | "ap-score"
  | "retirement-ramsey-style"
  | "tree-removal";

export type ApCourseId = "ap-chem" | "ap-bio" | "ap-calc-bc" | "ap-lit";

export interface SpecializedCalculatorConfig {
  slug: string;
  kind: SpecializedCalculatorKind;
  apCourse?: ApCourseId;
  notices: string[];
}

export interface CalcBreakdownRow {
  label: string;
  value: string;
}

export interface SpecializedCalcResult {
  headline: string;
  subhead?: string;
  primaryLabel: string;
  primary: string;
  breakdown: CalcBreakdownRow[];
  formula?: string;
  notes: string[];
  copyText: string;
}

export const CURRENCIES = [
  { id: "USD", label: "USD" },
  { id: "EUR", label: "EUR" },
  { id: "GBP", label: "GBP" },
  { id: "CAD", label: "CAD" },
  { id: "AUD", label: "AUD" },
  { id: "INR", label: "INR" },
  { id: "JPY", label: "JPY" },
] as const;
