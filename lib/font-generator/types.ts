export type FontStyleCategory =
  | "bold"
  | "italic"
  | "cursive"
  | "script"
  | "sans"
  | "monospace"
  | "math"
  | "bubble"
  | "circle"
  | "square"
  | "smallcaps"
  | "old-english"
  | "fraktur"
  | "underline"
  | "strikethrough"
  | "decorative"
  | "symbols"
  | "aesthetic"
  | "upside-down"
  | "mirror"
  | "minimal"
  | "special";

export interface FontStyleDefinition {
  id: string;
  name: string;
  category: FontStyleCategory;
  keywords: string[];
  /** Transform input while preserving unsupported chars and line breaks. */
  transform: (input: string) => string;
}

export const FONT_STYLE_CATEGORY_LABELS: Record<FontStyleCategory | "all", string> = {
  all: "All",
  bold: "Bold",
  italic: "Italic",
  cursive: "Cursive",
  script: "Script",
  sans: "Sans Serif",
  monospace: "Monospace",
  math: "Math / Styled",
  bubble: "Bubble",
  circle: "Circle",
  square: "Square",
  smallcaps: "Small Caps",
  "old-english": "Old English",
  fraktur: "Fraktur",
  underline: "Underline",
  strikethrough: "Strikethrough",
  decorative: "Decorative",
  symbols: "Symbols",
  aesthetic: "Aesthetic",
  "upside-down": "Upside Down",
  mirror: "Mirror / Reverse",
  minimal: "Minimal",
  special: "Special",
};
