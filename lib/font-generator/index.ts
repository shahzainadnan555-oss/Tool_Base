export type { FontStyleCategory, FontStyleDefinition } from "./types";
export { FONT_STYLE_CATEGORY_LABELS } from "./types";
export { fontStyles, getFontStyleById } from "./styles";
export { segmentGraphemes } from "./segment";

import { fontStyles } from "./styles";
import type { FontStyleCategory, FontStyleDefinition } from "./types";

export function filterFontStyles(options: {
  category: FontStyleCategory | "all";
  query: string;
}): FontStyleDefinition[] {
  const q = options.query.trim().toLowerCase();
  return fontStyles.filter((style) => {
    if (options.category !== "all" && style.category !== options.category) {
      return false;
    }
    if (!q) return true;
    return (
      style.name.toLowerCase().includes(q) ||
      style.id.includes(q) ||
      style.keywords.some((keyword) => keyword.includes(q)) ||
      style.category.includes(q)
    );
  });
}

export function transformWithStyle(styleId: string, input: string): string {
  const style = fontStyles.find((item) => item.id === styleId);
  if (!style) return input;
  return style.transform(input);
}
