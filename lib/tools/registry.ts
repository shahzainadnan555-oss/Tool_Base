import type { ToolDefinition } from "./types";
import { imageConverterTools } from "./image-converter-tools";
import { imageEditorTools } from "./image-editor-tools";
import { pdfTools } from "./pdf-tools";
import { documentDataTools } from "./document-data-tools";
import { audioTools } from "./audio-tools";
import { videoTools } from "./video-tools";
import { textTools } from "./text-tools";
import { developerTools } from "./developer-tools";
import { securityTools } from "./security-tools";
import { calculatorTools } from "./calculator-tools";
import { specializedCalculatorTools } from "./specialized-calculator-tools";
import { formulaCalculatorTools } from "./formula-calculator-tools";
import { fontGeneratorTools } from "./font-generator-tools";
import { generatorTools } from "./generator-tools";
import { typingTools } from "./typing-tools";
import { expansionTools } from "./expansion-tools";
import { categoryPackTools } from "./category-pack-tools";

/**
 * Central Tool Base tool registry.
 * Future prompts should add tools here — pages, cards, search, SEO,
 * related tools, sitemap, and category listings all read from this file.
 */
export const tools: ToolDefinition[] = [
  ...imageConverterTools,
  ...imageEditorTools,
  ...pdfTools,
  ...documentDataTools,
  ...audioTools,
  ...videoTools,
  ...textTools,
  ...developerTools,
  ...securityTools,
  ...calculatorTools,
  ...specializedCalculatorTools,
  ...formulaCalculatorTools,
  ...fontGeneratorTools,
  ...generatorTools,
  ...typingTools,
  ...expansionTools,
  ...categoryPackTools,
];

export function getAllTools(): ToolDefinition[] {
  return tools;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((item) => item.slug === slug);
}

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((item) => item.id === id);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  if (categoryId === "calculators-converters") {
    return tools.filter(
      (item) =>
        item.category === "calculators-converters" ||
        item.category === "specialized-calculators",
    );
  }
  return tools.filter((item) => item.category === categoryId);
}

export function getPopularTools(): ToolDefinition[] {
  return tools.filter((item) => item.popular);
}

export function getNewTools(): ToolDefinition[] {
  return tools.filter((item) => item.new);
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.relatedToolIds
    .map((id) => getToolById(id))
    .filter((item): item is ToolDefinition => Boolean(item));
}

export function getAllToolSlugs(): string[] {
  return tools.map((item) => item.slug);
}

export function sortToolsAz(list: ToolDefinition[]): ToolDefinition[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}
