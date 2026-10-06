import type { CaseMode, TextToolConfig, TextToolKind } from "./types";

function cfg(
  partial: Omit<TextToolConfig, "notices"> & Partial<Pick<TextToolConfig, "notices">>,
): TextToolConfig {
  return {
    notices: partial.notices ?? [],
    ...partial,
  };
}

function make(
  slug: string,
  kind: TextToolKind,
  extras: Partial<TextToolConfig> = {},
): TextToolConfig {
  return cfg({
    slug,
    kind,
    live: true,
    showStats: true,
    showOutput: kind !== "stats" && kind !== "reading-time" && kind !== "diff",
    downloadName: "converted-text.txt",
    ...extras,
  });
}

export const textToolConfigs: Record<string, TextToolConfig> = {
  "word-counter": make("word-counter", "stats", {
    showOutput: false,
    downloadName: "word-count-text.txt",
  }),
  "character-counter": make("character-counter", "stats", {
    showOutput: false,
    downloadName: "character-count-text.txt",
  }),
  "sentence-counter": make("sentence-counter", "stats", {
    showOutput: false,
    notices: ["Sentence detection is heuristic and may not match every writing style."],
    downloadName: "sentence-count-text.txt",
  }),
  "paragraph-counter": make("paragraph-counter", "stats", {
    showOutput: false,
    downloadName: "paragraph-count-text.txt",
  }),
  "reading-time-calculator": make("reading-time-calculator", "reading-time", {
    showOutput: false,
    notices: ["Reading time is an estimate based on average reading speed."],
    downloadName: "reading-time-text.txt",
  }),
  "text-case-converter": make("text-case-converter", "case", {
    defaultCaseMode: "title",
    actionLabel: "Convert Case",
    downloadName: "converted-text.txt",
  }),
  "uppercase-converter": make("uppercase-converter", "case", {
    lockedCaseMode: "upper",
    downloadName: "uppercase-text.txt",
  }),
  "lowercase-converter": make("lowercase-converter", "case", {
    lockedCaseMode: "lower",
    downloadName: "lowercase-text.txt",
  }),
  "title-case-converter": make("title-case-converter", "case", {
    lockedCaseMode: "title",
    downloadName: "title-case-text.txt",
  }),
  "sentence-case-converter": make("sentence-case-converter", "case", {
    lockedCaseMode: "sentence",
    downloadName: "sentence-case-text.txt",
  }),
  "remove-extra-spaces": make("remove-extra-spaces", "transform", {
    actionLabel: "Remove Extra Spaces",
    downloadName: "cleaned-spaces.txt",
  }),
  "remove-duplicate-lines": make("remove-duplicate-lines", "dedupe", {
    actionLabel: "Remove Duplicates",
    downloadName: "unique-lines.txt",
  }),
  "sort-lines": make("sort-lines", "sort", {
    actionLabel: "Sort Lines",
    downloadName: "sorted-lines.txt",
  }),
  "reverse-text": make("reverse-text", "transform", {
    downloadName: "reversed-text.txt",
  }),
  "reverse-words": make("reverse-words", "transform", {
    downloadName: "reversed-words.txt",
  }),
  "text-repeater": make("text-repeater", "repeater", {
    live: false,
    actionLabel: "Repeat Text",
    downloadName: "repeated-text.txt",
    notices: ["Repeat count is limited to keep your browser responsive."],
  }),
  "text-cleaner": make("text-cleaner", "cleaner", {
    actionLabel: "Clean Text",
    downloadName: "cleaned-text.txt",
  }),
  "find-and-replace": make("find-and-replace", "find-replace", {
    live: false,
    actionLabel: "Replace",
    downloadName: "replaced-text.txt",
  }),
  "text-diff-checker": make("text-diff-checker", "diff", {
    live: true,
    dualInput: true,
    showOutput: false,
    showStats: false,
    downloadName: "diff-summary.txt",
  }),
  "lorem-ipsum-generator": make("lorem-ipsum-generator", "generate", {
    live: false,
    showStats: false,
    actionLabel: "Generate",
    downloadName: "lorem-ipsum.txt",
  }),
  "capitalize-words": make("capitalize-words", "case", {
    lockedCaseMode: "capitalized",
    downloadName: "capitalized-text.txt",
  }),
  "randomize-list": make("randomize-list", "transform", {
    live: false,
    actionLabel: "Randomize List",
    downloadName: "randomized-list.txt",
  }),
  "reverse-list": make("reverse-list", "transform", {
    actionLabel: "Reverse List",
    downloadName: "reversed-list.txt",
  }),
  "text-to-ascii": make("text-to-ascii", "transform", {
    actionLabel: "Convert to ASCII Codes",
    downloadName: "ascii-codes.txt",
  }),
  "ascii-to-text": make("ascii-to-text", "transform", {
    actionLabel: "Convert ASCII to Text",
    downloadName: "decoded-text.txt",
  }),
  "unicode-to-krutidev": make("unicode-to-krutidev", "transform", {
    actionLabel: "Convert to KrutiDev",
    downloadName: "krutidev-text.txt",
    notices: ["This mapping covers everyday Devanagari characters. Rare conjuncts may need a manual check."],
  }),
  "krutidev-to-unicode": make("krutidev-to-unicode", "transform", {
    actionLabel: "Convert to Unicode",
    downloadName: "unicode-text.txt",
  }),
};

export function getTextToolConfig(slug: string): TextToolConfig | undefined {
  return textToolConfigs[slug];
}

export function isTextToolSlug(slug: string): boolean {
  return Boolean(textToolConfigs[slug]);
}

export const textToolSlugs = Object.keys(textToolConfigs);

export const CASE_OPTIONS: Array<{ value: CaseMode; label: string }> = [
  { value: "upper", label: "UPPERCASE" },
  { value: "lower", label: "lowercase" },
  { value: "title", label: "Title Case" },
  { value: "sentence", label: "Sentence case" },
  { value: "capitalized", label: "Capitalized Case" },
  { value: "alternating", label: "aLtErNaTiNg CaSe" },
  { value: "inverse", label: "iNVERSE cASE" },
];
