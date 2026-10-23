import { getGuideForToolSlug } from "@/lib/blog/tool-guides";
import { formulaCalculatorCatalog, SUBCATEGORY_LABELS } from "@/lib/formula-calculators";
import type { FormulaCalculatorSpec, FormulaField } from "@/lib/formula-calculators";
import { calculatorTools } from "./calculator-tools";
import { specializedCalculatorTools } from "./specialized-calculator-tools";
import type { ToolDefinition, ToolFaq, ToolHowToStep } from "./types";

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

function fieldLabels(fields: FormulaField[]): string[] {
  return fields.map((field) => field.label).filter(Boolean);
}

function buildIntro(spec: FormulaCalculatorSpec): string {
  const labels = fieldLabels(spec.fields);
  const fieldSentence =
    labels.length === 0
      ? "Use the on-page controls to enter your values."
      : labels.length === 1
        ? `Enter ${labels[0]}, then read the calculated result.`
        : labels.length <= 4
          ? `Enter ${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}, then read the calculated result.`
          : `Enter the labeled fields (${labels.slice(0, 3).join(", ")}, and more), then read the calculated result.`;

  const notice = spec.notices?.[0]
    ? ` ${spec.notices[0].replace(/\s+/g, " ").trim()}`
    : "";

  return `${spec.shortDescription} ${fieldSentence}${
    spec.formulaHint ? ` The working relationship is ${spec.formulaHint}.` : ""
  }${notice}`.replace(/\s+/g, " ").trim();
}

function buildHowToSteps(spec: FormulaCalculatorSpec): ToolHowToStep[] {
  const labels = fieldLabels(spec.fields);
  const enterDescription =
    labels.length === 0
      ? "Use the calculator controls on this page. Required values are checked before a result is shown."
      : `Fill in ${labels.join(", ")}. Required values are checked before a result is shown.`;

  return [
    {
      title: "Enter the values this calculator needs",
      description: enterDescription,
    },
    {
      title: "Review the primary result",
      description: spec.formulaHint
        ? `Check the main answer and any breakdown rows. Formula reference: ${spec.formulaHint}.`
        : "Check the main answer and any breakdown rows or notes shown under the result.",
    },
    {
      title: "Copy or reset",
      description:
        "Copy the result when you need it elsewhere, or reset the form to start over without leaving the page.",
    },
  ];
}

function buildFeatures(spec: FormulaCalculatorSpec): string[] {
  const labels = fieldLabels(spec.fields);
  const features = [
    labels.length
      ? `Inputs for ${labels.slice(0, 3).join(", ")}${labels.length > 3 ? ", and related fields" : ""}`
      : "Focused calculator controls for this task",
    spec.formulaHint
      ? `Transparent formula: ${spec.formulaHint}`
      : "Transparent calculation notes on the result",
    "Instant browser-side calculation with input validation",
    "Copy result and reset without leaving the page",
  ];
  if (spec.notices?.length) {
    features.push("On-page notices for assumptions and limitations");
  }
  return features;
}

function buildFaqs(spec: FormulaCalculatorSpec): ToolFaq[] {
  if (spec.faq?.length) return spec.faq;

  const faqs: ToolFaq[] = [
    {
      question: `What does the ${spec.name} calculate?`,
      answer: spec.description,
    },
  ];

  const labels = fieldLabels(spec.fields);
  if (labels.length) {
    faqs.push({
      question: "Which inputs do I need?",
      answer: `This page asks for ${labels.join(", ")}. Keep units consistent with the field labels.`,
    });
  }

  if (spec.formulaHint) {
    faqs.push({
      question: "What formula does Tool Base use?",
      answer: `The calculator follows this relationship: ${spec.formulaHint}. Supporting breakdown rows explain intermediate values when they are shown.`,
    });
  }

  if (spec.examples?.[0]) {
    const example = spec.examples[0];
    faqs.push({
      question: "Can you show a simple example?",
      answer: `${example.title}: input ${example.input}. Expected result: ${example.output}.${
        example.formula ? ` (${example.formula})` : ""
      }`,
    });
  }

  if (spec.notices?.length) {
    faqs.push({
      question: "What should I know before relying on the result?",
      answer: spec.notices.join(" "),
    });
  } else {
    faqs.push({
      question: "Are these results official advice?",
      answer:
        "No. Results are educational estimates based on the formulas and assumptions shown on the page. Verify important decisions with a qualified professional when needed.",
    });
  }

  faqs.push({
    question: "Will refreshing the page reset my inputs?",
    answer:
      "Yes. A full page refresh clears the current session values. While you stay on the page, your inputs and results remain until you reset them.",
  });

  return faqs;
}

function buildTips(spec: FormulaCalculatorSpec): string[] | undefined {
  const tips: string[] = [];
  if (spec.formulaHint) tips.push(`Formula: ${spec.formulaHint}`);
  for (const notice of spec.notices ?? []) {
    tips.push(notice);
  }
  for (const field of spec.fields) {
    if (field.hint) tips.push(`${field.label}: ${field.hint}`);
  }
  if (spec.examples?.[0]) {
    tips.push(
      `Example — ${spec.examples[0].title}: ${spec.examples[0].input} → ${spec.examples[0].output}`,
    );
  }
  return tips.length ? tips.slice(0, 6) : undefined;
}

function buildFormats(spec: FormulaCalculatorSpec): {
  inputFormats: string[];
  outputFormats: string[];
  supportedFormats: string[];
  supportedFormatsHeading: string;
} {
  const labels = fieldLabels(spec.fields);
  const inputFormats = labels.length
    ? labels.map((label) => `${label} (numeric or form input)`)
    : ["On-page calculator fields"];
  return {
    inputFormats: inputFormats.slice(0, 8),
    outputFormats: [
      "Primary calculated result",
      "Optional breakdown values",
      "Copyable text result",
    ],
    supportedFormats: [
      SUBCATEGORY_LABELS[spec.subcategory],
      "Browser-side calculation",
      ...(spec.formulaHint ? ["Documented formula notes"] : []),
    ],
    supportedFormatsHeading: "Inputs, results, and calculator details",
  };
}

export const formulaCalculatorTools: ToolDefinition[] = formulaCalculatorCatalog.map((spec) => {
  const categoryLabel = SUBCATEGORY_LABELS[spec.subcategory];
  const formats = buildFormats(spec);
  const seoBase =
    spec.description.length >= 50
      ? spec.description
      : `${spec.shortDescription} Free ${categoryLabel.toLowerCase()} from Tool Base.`;

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
    relatedToolIds: spec.relatedToolIds.filter((id) => knownRelatedIds.has(id)),
    seoTitle: `${spec.name} — Free Online | Tool Base`,
    seoDescription: seoBase.slice(0, 155),
    h1: spec.name,
    intro: buildIntro(spec),
    guide: getGuideForToolSlug(spec.slug),
    convertHeading: `Use the ${spec.name}`,
    howToHeading: `How to use the ${spec.name}`,
    featuresHeading: `${spec.name} features`,
    supportedFormatsHeading: formats.supportedFormatsHeading,
    tipsHeading: "Formula notes and practical tips",
    relatedToolsHeading: "Related calculators",
    hideReport: true,
    processingMode: "browser",
    features: buildFeatures(spec),
    howToSteps: buildHowToSteps(spec),
    faq: buildFaqs(spec),
    inputFormats: formats.inputFormats,
    outputFormats: formats.outputFormats,
    supportedFormats: formats.supportedFormats,
    examples: spec.examples,
    tips: buildTips(spec),
  });
});

export function isFormulaCalculatorToolSlug(slug: string): boolean {
  return formulaCalculatorTools.some((item) => item.slug === slug);
}
