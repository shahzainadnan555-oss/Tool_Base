import { categories } from "./categories";
import { getAllTools } from "./registry";
import type { ToolDefinition } from "./types";

export interface SearchResult {
  tool: ToolDefinition;
  score: number;
  matchedOn: string[];
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

function tokenize(query: string): string[] {
  return normalize(query)
    .split(/[\s,/|+-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export function searchTools(query: string, limit = 50): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const categoryNameById = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  const results: SearchResult[] = [];

  const normalizedQuery = normalize(query);

  for (const tool of getAllTools()) {
    const haystacks: Array<{ label: string; value: string; weight: number }> = [
      { label: "name", value: tool.name, weight: 12 },
      { label: "slug", value: tool.slug.replace(/-/g, " "), weight: 10 },
      { label: "keywords", value: tool.keywords.join(" "), weight: 8 },
      { label: "aliases", value: (tool.aliases ?? []).join(" "), weight: 9 },
      {
        label: "exactPrimaryKeyword",
        value: tool.exactPrimaryKeyword ?? "",
        weight: 16,
      },
      { label: "category", value: categoryNameById.get(tool.category) ?? "", weight: 6 },
      { label: "shortDescription", value: tool.shortDescription, weight: 4 },
      { label: "description", value: tool.description, weight: 3 },
      {
        label: "formats",
        value: [...tool.inputFormats, ...tool.outputFormats, ...tool.supportedFormats].join(" "),
        weight: 5,
      },
    ];

    let score = 0;
    const matchedOn = new Set<string>();

    const normalizedName = normalize(tool.name);
    const normalizedSlug = normalize(tool.slug.replace(/-/g, " "));

    if (normalizedName === normalizedQuery || normalizedSlug === normalizedQuery) {
      score += 400;
      matchedOn.add("exact-title");
    } else if (normalizedName.includes(normalizedQuery)) {
      score += 220;
      matchedOn.add("title");
    }

    if (tool.exactPrimaryKeyword && normalize(tool.exactPrimaryKeyword) === normalizedQuery) {
      score += 80;
      matchedOn.add("exactPrimaryKeyword");
    } else if (tool.keywords.some((keyword) => normalize(keyword) === normalizedQuery)) {
      score += 60;
      matchedOn.add("keywords");
    } else if ((tool.aliases ?? []).some((alias) => normalize(alias) === normalizedQuery)) {
      score += 70;
      matchedOn.add("aliases");
    }

    let missedToken = false;
    for (const token of tokens) {
      let tokenMatched = false;

      for (const field of haystacks) {
        const value = normalize(field.value);
        if (!value) continue;

        if (value === token) {
          score += field.weight * 3;
          matchedOn.add(field.label);
          tokenMatched = true;
        } else if (value.startsWith(token) || value.includes(` ${token}`)) {
          score += field.weight * 2;
          matchedOn.add(field.label);
          tokenMatched = true;
        } else if (value.includes(token)) {
          score += field.weight;
          matchedOn.add(field.label);
          tokenMatched = true;
        }
      }

      if (!tokenMatched) missedToken = true;
    }

    if (missedToken) continue;

    if (tool.popular) score += 1;
    if (tool.new) score += 0.5;

    if (score > 0) {
      results.push({
        tool,
        score,
        matchedOn: Array.from(matchedOn),
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, limit);
}

export function getSearchSuggestions(query: string, limit = 8): ToolDefinition[] {
  return searchTools(query, limit).map((result) => result.tool);
}
