export type TextToolKind =
  | "stats"
  | "case"
  | "transform"
  | "find-replace"
  | "diff"
  | "generate"
  | "repeater"
  | "cleaner"
  | "sort"
  | "dedupe"
  | "reading-time";

export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "capitalized"
  | "alternating"
  | "inverse";

export interface TextToolConfig {
  slug: string;
  kind: TextToolKind;
  actionLabel?: string;
  live: boolean;
  showStats: boolean;
  showOutput: boolean;
  dualInput?: boolean;
  downloadName: string;
  defaultCaseMode?: CaseMode;
  /** Fixed case mode for dedicated converters */
  lockedCaseMode?: CaseMode;
  notices: string[];
}

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingMinutes: number;
}

export interface TextProcessOptions {
  caseMode?: CaseMode;
  readingSpeed?: number;
  caseSensitive?: boolean;
  preserveFirst?: boolean;
  removeBlankDuplicates?: boolean;
  sortDirection?: "asc" | "desc";
  sortCaseSensitive?: boolean;
  sortNumeric?: boolean;
  ignoreLeadingWhitespace?: boolean;
  collapseSpaces?: boolean;
  trimLines?: boolean;
  removeEmptyLines?: boolean;
  normalizeLineEndings?: boolean;
  collapseBlankLines?: boolean;
  findText?: string;
  replaceText?: string;
  replaceAll?: boolean;
  wholeWord?: boolean;
  repeatCount?: number;
  separator?: "newline" | "space" | "none";
  loremMode?: "paragraphs" | "sentences" | "words";
  loremCount?: number;
  loremStartClassic?: boolean;
}

export interface TextProcessResult {
  output: string;
  stats?: TextStats;
  matchCount?: number;
  notice?: string;
  diffHtml?: never;
  diffParts?: Array<{ type: "equal" | "add" | "remove"; value: string }>;
}

export const MAX_REPEAT_COUNT = 1000;
export const MAX_LOREM_COUNT = 200;
export const LARGE_TEXT_THRESHOLD = 80_000;
