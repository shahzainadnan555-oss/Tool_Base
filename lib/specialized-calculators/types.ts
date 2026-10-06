export type SpecializedCalculatorKind =
  | "totaled-car"
  | "capital-gains"
  | "middle-school-gpa"
  | "gpa"
  | "weighted-grade"
  | "final-grade"
  | "ap-score"
  | "retirement-ramsey-style"
  | "tree-removal"
  | "car-loan"
  | "sales-commission";

export type ApCourseId =
  | "ap-chem"
  | "ap-bio"
  | "ap-calc-bc"
  | "ap-lit"
  | "ap-lang"
  | "ap-ush"
  | "ap-world"
  | "ap-psych";

export interface SpecializedCalculatorConfig {
  slug: string;
  kind: SpecializedCalculatorKind;
  apCourse?: ApCourseId;
  notices: string[];
  gpaLabel?: string;
  forceWeighted?: boolean;
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
