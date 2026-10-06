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
  "college-gpa-calculator": {
    slug: "college-gpa-calculator",
    kind: "gpa",
    gpaLabel: "college",
    forceWeighted: true,
    notices: ["College GPA policies vary. Use the credit hours and scale your school publishes."],
  },
  "high-school-gpa-calculator": {
    slug: "high-school-gpa-calculator",
    kind: "gpa",
    gpaLabel: "high school",
    notices: ["High-school weighting for honors/AP varies. Edit the scale if your campus uses plus/minus or extra points."],
  },
  "weighted-gpa-calculator": {
    slug: "weighted-gpa-calculator",
    kind: "gpa",
    gpaLabel: "weighted",
    forceWeighted: true,
    notices: ["Enter credits or weights for each course. Honors/AP extra points belong in the scale, not as a hidden bonus."],
  },
  "final-grade-needed-calculator": {
    slug: "final-grade-needed-calculator",
    kind: "final-grade",
    notices: ["Assumes one remaining assessment worth the stated percentage of the course."],
  },
  "weighted-grade-calculator": {
    slug: "weighted-grade-calculator",
    kind: "weighted-grade",
    notices: ["Weights can be percentages or any consistent proportions."],
  },
  "ap-english-language-score-calculator": {
    slug: "ap-english-language-score-calculator",
    kind: "ap-score",
    apCourse: "ap-lang",
    notices: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
    ],
  },
  "ap-us-history-score-calculator": {
    slug: "ap-us-history-score-calculator",
    kind: "ap-score",
    apCourse: "ap-ush",
    notices: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
    ],
  },
  "ap-world-history-score-calculator": {
    slug: "ap-world-history-score-calculator",
    kind: "ap-score",
    apCourse: "ap-world",
    notices: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
    ],
  },
  "ap-psychology-score-calculator": {
    slug: "ap-psychology-score-calculator",
    kind: "ap-score",
    apCourse: "ap-psych",
    notices: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
    ],
  },
  "car-loan-payment-calculator": {
    slug: "car-loan-payment-calculator",
    kind: "car-loan",
    notices: ["This amortization estimate is not a lender quote."],
  },
  "sales-commission-calculator": {
    slug: "sales-commission-calculator",
    kind: "sales-commission",
    notices: ["Commission plans vary. Results use only the rate, threshold, and bonus you enter."],
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
