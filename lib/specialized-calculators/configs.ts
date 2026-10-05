import type { SpecializedCalculatorConfig } from "./types";

export const specializedCalculatorConfigs: Record<string, SpecializedCalculatorConfig> = {
  "totaled-car-value-calculator": {
    slug: "totaled-car-value-calculator",
    kind: "totaled-car",
    notices: [
      "This totaled car value calculator provides a general estimate, not a guaranteed insurance payout.",
    ],
  },
  "capital-gains-tax-calculator-on-sale-of-property": {
    slug: "capital-gains-tax-calculator-on-sale-of-property",
    kind: "capital-gains",
    notices: [
      "This is a capital gains tax estimate based on the tax rate and figures you enter. It is not professional tax advice.",
    ],
  },
  "middle-school-gpa-calculator": {
    slug: "middle-school-gpa-calculator",
    kind: "middle-school-gpa",
    notices: [
      "Grading scales vary by school. Configure the scale before treating the GPA as comparable to another campus.",
    ],
  },
  "ap-chem-score-calculator": {
    slug: "ap-chem-score-calculator",
    kind: "ap-score",
    apCourse: "ap-chem",
    notices: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
    ],
  },
  "ap-bio-score-calculator": {
    slug: "ap-bio-score-calculator",
    kind: "ap-score",
    apCourse: "ap-bio",
    notices: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
    ],
  },
  "ap-calc-bc-score-calculator": {
    slug: "ap-calc-bc-score-calculator",
    kind: "ap-score",
    apCourse: "ap-calc-bc",
    notices: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
    ],
  },
  "retirement-calculator-dave-ramsey": {
    slug: "retirement-calculator-dave-ramsey",
    kind: "retirement-ramsey-style",
    notices: [
      "This is an independent Tool Base calculator and is not affiliated with or endorsed by Dave Ramsey.",
    ],
  },
  "tree-removal-cost-calculator": {
    slug: "tree-removal-cost-calculator",
    kind: "tree-removal",
    notices: [
      "Tree-removal pricing varies widely. Results are an estimated range, not a contractor quote.",
    ],
  },
  "ap-lit-score-calculator": {
    slug: "ap-lit-score-calculator",
    kind: "ap-score",
    apCourse: "ap-lit",
    notices: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
    ],
  },
};

export function getSpecializedCalculatorConfig(
  slug: string,
): SpecializedCalculatorConfig | undefined {
  return specializedCalculatorConfigs[slug];
}

export function isSpecializedCalculatorSlug(slug: string): boolean {
  return Boolean(specializedCalculatorConfigs[slug]);
}
