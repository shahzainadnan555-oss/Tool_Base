export type DeveloperToolKind =
  | "json-format"
  | "json-validate"
  | "json-minify"
  | "html-format"
  | "html-minify"
  | "css-format"
  | "css-minify"
  | "js-format"
  | "js-minify"
  | "xml-format"
  | "xml-validate"
  | "sql-format"
  | "sql-minify"
  | "regex-test"
  | "regex-generate"
  | "base64-encode"
  | "base64-decode"
  | "url-encode"
  | "url-decode"
  | "html-entity-encode";

export type IndentStyle = "2" | "4" | "tab";

export interface DeveloperToolConfig {
  slug: string;
  kind: DeveloperToolKind;
  actionLabel: string;
  live: boolean;
  showOutput: boolean;
  dualInput?: boolean;
  downloadName: string;
  inputLabel: string;
  outputLabel?: string;
  notices: string[];
  languageHint?: "json" | "html" | "css" | "javascript" | "xml" | "sql" | "text" | "regex";
}

export interface ValidationResult {
  valid: boolean;
  message: string;
  line?: number;
  column?: number;
  position?: number;
}

export interface RegexMatchInfo {
  match: string;
  index: number;
  end: number;
  groups: string[];
  namedGroups?: Record<string, string>;
}

export interface RegexTestResult {
  matchCount: number;
  matches: RegexMatchInfo[];
  timedOut?: boolean;
  error?: string;
}

export interface DeveloperProcessOptions {
  indent?: IndentStyle;
  regexPattern?: string;
  regexFlags?: string;
  regexTestText?: string;
  regexTemplate?: string;
  regexOptions?: RegexGeneratorOptions;
  urlMode?: "component" | "uri";
}

export interface RegexGeneratorOptions {
  template: string;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  customSet?: string;
  minLength?: number;
  maxLength?: number;
}

export interface DeveloperProcessResult {
  output: string;
  validation?: ValidationResult;
  regex?: RegexTestResult;
  notice?: string;
}

export const MAX_DEV_INPUT_CHARS = 2_000_000;
export const MAX_REGEX_PATTERN_CHARS = 2_000;
export const MAX_REGEX_TEST_CHARS = 500_000;
export const REGEX_TIMEOUT_MS = 800;
export const LARGE_DEV_TEXT_THRESHOLD = 120_000;
