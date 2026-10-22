import { getGuideForToolSlug } from "@/lib/blog/tool-guides";
import { formulaCalculatorCatalog, SUBCATEGORY_LABELS } from "@/lib/formula-calculators";
import { calculatorTools } from "./calculator-tools";
import { specializedCalculatorTools } from "./specialized-calculator-tools";
import type { ToolDefinition } from "./types";

function tool(
  partial: Omit<ToolDefinition, "route" | "status"> & {
    status?: ToolDefinition["status"];
  },
): ToolDefinition {
  return {
    ...partial,
    route: `/tools/${partial.slug}`,
    status: partial.status ?? "available",
  };
}

const knownRelatedIds = new Set<string>([
  ...formulaCalculatorCatalog.map((item) => item.slug),
  ...calculatorTools.map((item) => item.id),
  ...specializedCalculatorTools.map((item) => item.id),
]);

export const formulaCalculatorTools: ToolDefinition[] = formulaCalculatorCatalog.map((spec) => {
  const categoryLabel = SUBCATEGORY_LABELS[spec.subcategory];
  return tool({
    id: spec.slug,
    name: spec.name,
    slug: spec.slug,
    category: "calculators-converters",
    subcategory: spec.subcategory,
    aliases: spec.aliases,
    description: spec.description,
    shortDescription: spec.shortDescription,
    icon: "calculator",
    keywords: spec.keywords,
    popular: Boolean(spec.featured),
    new: true,
    supportedFormats: ["Numbers", "Formulas"],
    relatedToolIds: spec.relatedToolIds.filter((id) => knownRelatedIds.has(id)),
    seoTitle: `${spec.name} — Free Online | Tool Base`,
    seoDescription:
      spec.description.length >= 50
        ? spec.description.slice(0, 155)
        : `${spec.shortDescription} Use this free ${categoryLabel.toLowerCase()} tool from Tool Base in your browser.`,
    h1: spec.name,
    intro: `${spec.shortDescription} Enter your values, review the result instantly, and use the formula notes to understand how Tool Base calculated the answer.`,
    guide: getGuideForToolSlug(spec.slug),
    convertHeading: `Use the ${spec.name}`,
    howToHeading: `How to use the ${spec.name}`,
    featuresHeading: `${spec.name} features`,
    relatedToolsHeading: "Related calculators",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Clear inputs with validation",
      "Instant results for standard calculations",
      "Transparent formulas and assumptions",
      "Mobile-friendly controls",
      "Clear Light Mode layout on mobile and desktop",
    ],
    howToSteps: [
      {
        title: "Enter your values",
        description: "Fill in the fields for this calculator. Required inputs are validated before results appear.",
      },
      {
        title: "Review the result",
        description: "Tool Base updates the primary result and supporting breakdown as you calculate.",
      },
      {
        title: "Copy or reset",
        description: "Copy the result for later use, or reset the form to start over without leaving the page.",
      },
    ],
    faq: spec.faq?.length
      ? spec.faq
      : [
          {
            question: `Is the ${spec.name} free?`,
            answer: "Yes. Tool Base calculators are free to use in your browser with no account required.",
          },
          {
            question: "Are the results official advice?",
            answer:
              "No. Results are educational estimates based on the formulas shown. Verify important decisions with a qualified professional when needed.",
          },
          {
            question: "Will refreshing the page reset my inputs?",
            answer: "Yes for a full page refresh. While you stay on the calculator page, your inputs and results remain until you reset them.",
          },
        ],
    inputFormats: ["Numeric inputs", "Form fields"],
    outputFormats: ["Calculated results"],
    examples: spec.examples,
    tips: spec.formulaHint ? [`Formula: ${spec.formulaHint}`] : undefined,
  });
});

export function isFormulaCalculatorToolSlug(slug: string): boolean {
  return formulaCalculatorTools.some((tool) => tool.slug === slug);
}
