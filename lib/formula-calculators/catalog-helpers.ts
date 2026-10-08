import type {
  FormulaCalculatorSpec,
  FormulaCompute,
  FormulaField,
  FormulaSubcategory,
} from "./types";

type SpecInput = {
  slug: string;
  name: string;
  subcategory: FormulaSubcategory;
  shortDescription: string;
  description?: string;
  keywords: string[];
  aliases?: string[];
  relatedToolIds: string[];
  featured?: boolean;
  notices?: string[];
  formulaHint?: string;
  examples?: FormulaCalculatorSpec["examples"];
  faq?: FormulaCalculatorSpec["faq"];
  fields: FormulaField[];
  live?: boolean;
  ui?: FormulaCalculatorSpec["ui"];
  compute: FormulaCompute;
};

export function def(input: SpecInput): FormulaCalculatorSpec {
  return {
    ...input,
    description:
      input.description ??
      `${input.shortDescription} Free online Tool Base calculator with clear inputs, validation, and transparent formulas.`,
    live: input.live ?? true,
    ui: input.ui ?? "form",
  };
}

export function moneyField(
  id: string,
  label: string,
  defaultValue: string,
  extras: Partial<FormulaField> = {},
): FormulaField {
  return {
    id,
    label,
    type: "number",
    defaultValue,
    inputMode: "decimal",
    step: "0.01",
    min: "0",
    ...extras,
  };
}

export function percentField(
  id: string,
  label: string,
  defaultValue: string,
  extras: Partial<FormulaField> = {},
): FormulaField {
  return {
    id,
    label,
    type: "number",
    defaultValue,
    inputMode: "decimal",
    step: "0.01",
    min: "0",
    ...extras,
  };
}

export function numberField(
  id: string,
  label: string,
  defaultValue: string,
  extras: Partial<FormulaField> = {},
): FormulaField {
  return {
    id,
    label,
    type: "number",
    defaultValue,
    inputMode: "decimal",
    step: "any",
    ...extras,
  };
}

export function selectField(
  id: string,
  label: string,
  defaultValue: string,
  options: FormulaField["options"],
): FormulaField {
  return { id, label, type: "select", defaultValue, options };
}

export const currencySelect = selectField("currency", "Currency", "USD", [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
  { value: "JPY", label: "JPY" },
  { value: "INR", label: "INR" },
]);

export const eduDisclaimer =
  "Educational estimate only. Not financial, tax, legal, or investment advice.";
