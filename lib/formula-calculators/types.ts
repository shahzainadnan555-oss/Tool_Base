export type FormulaSubcategory =
  | "financial"
  | "math"
  | "date-time"
  | "construction"
  | "measurement"
  | "electrical"
  | "internet"
  | "transportation"
  | "education"
  | "other";

export type FormulaFieldType =
  | "number"
  | "select"
  | "date"
  | "text"
  | "textarea"
  | "checkbox";

export interface FormulaFieldOption {
  value: string;
  label: string;
}

export interface FormulaField {
  id: string;
  label: string;
  type: FormulaFieldType;
  defaultValue?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  inputMode?: "decimal" | "numeric" | "text";
  options?: FormulaFieldOption[];
  hint?: string;
  /** Grid span hint: full width on mobile always; on md+ use 1 or 2 columns */
  span?: 1 | 2;
}

export interface FormulaBreakdownRow {
  label: string;
  value: string;
}

export interface FormulaTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface FormulaResult {
  primaryLabel: string;
  primary: string;
  subhead?: string;
  breakdown?: FormulaBreakdownRow[];
  formula?: string;
  notes?: string[];
  table?: FormulaTable;
  copyText: string;
}

export type FormulaCompute = (values: Record<string, string>) => FormulaResult;

export type FormulaUiKind = "form" | "scientific" | "matrix";

export interface FormulaCalculatorSpec {
  slug: string;
  name: string;
  subcategory: FormulaSubcategory;
  shortDescription: string;
  description: string;
  keywords: string[];
  aliases?: string[];
  relatedToolIds: string[];
  featured?: boolean;
  notices?: string[];
  formulaHint?: string;
  examples?: Array<{
    title: string;
    input: string;
    output: string;
    formula?: string;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  fields: FormulaField[];
  live?: boolean;
  ui?: FormulaUiKind;
  compute: FormulaCompute;
}

export const SUBCATEGORY_LABELS: Record<FormulaSubcategory, string> = {
  financial: "Financial Calculators",
  math: "Math Calculators",
  "date-time": "Date & Time Calculators",
  construction: "Construction & Home Calculators",
  measurement: "Measurement & Conversion Calculators",
  electrical: "Electrical & Engineering Calculators",
  internet: "Internet & Technical Calculators",
  transportation: "Transportation Calculators",
  education: "Education Calculators",
  other: "Other Practical Calculators",
};
