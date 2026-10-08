import { financialCatalog } from "./catalog-financial";
import { financialMoreCatalog } from "./catalog-financial-more";
import { mathCatalog } from "./catalog-math";
import { practicalCatalog } from "./catalog-practical";
import type { FormulaCalculatorSpec, FormulaSubcategory } from "./types";
import { SUBCATEGORY_LABELS } from "./types";

export type {
  FormulaCalculatorSpec,
  FormulaField,
  FormulaResult,
  FormulaSubcategory,
  FormulaUiKind,
} from "./types";
export { SUBCATEGORY_LABELS } from "./types";

export const formulaCalculatorCatalog: FormulaCalculatorSpec[] = [
  ...financialCatalog,
  ...financialMoreCatalog,
  ...mathCatalog,
  ...practicalCatalog,
];

const bySlug = new Map(formulaCalculatorCatalog.map((item) => [item.slug, item]));

export function getFormulaCalculatorSpec(slug: string): FormulaCalculatorSpec | undefined {
  return bySlug.get(slug);
}

export function isFormulaCalculatorSlug(slug: string): boolean {
  return bySlug.has(slug);
}

export function getFormulaCalculatorSlugs(): string[] {
  return formulaCalculatorCatalog.map((item) => item.slug);
}

export function getFormulaCalculatorsBySubcategory(
  subcategory: FormulaSubcategory,
): FormulaCalculatorSpec[] {
  return formulaCalculatorCatalog.filter((item) => item.subcategory === subcategory);
}

export function getFormulaSubcategoryCounts(): Record<FormulaSubcategory, number> {
  const counts = Object.fromEntries(
    (Object.keys(SUBCATEGORY_LABELS) as FormulaSubcategory[]).map((key) => [key, 0]),
  ) as Record<FormulaSubcategory, number>;
  for (const item of formulaCalculatorCatalog) {
    counts[item.subcategory] += 1;
  }
  return counts;
}
