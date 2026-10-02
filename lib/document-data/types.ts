export type DocumentDataKind =
  | "docx-to-pdf"
  | "pdf-to-docx"
  | "txt-to-pdf"
  | "txt-to-docx"
  | "docx-to-txt"
  | "rtf-to-pdf"
  | "rtf-to-txt"
  | "markdown-to-html"
  | "html-to-markdown"
  | "markdown-to-pdf"
  | "csv-to-json"
  | "json-to-csv"
  | "csv-to-xml"
  | "xml-to-json"
  | "json-to-xml"
  | "txt-to-csv"
  | "csv-to-tsv"
  | "tsv-to-csv"
  | "yaml-to-json"
  | "json-to-yaml";

export type InputMode = "file" | "text" | "both";

export interface DocumentDataConfig {
  slug: string;
  kind: DocumentDataKind;
  actionLabel: string;
  processingLabel: string;
  resetLabel: string;
  accept: string;
  extensions: string[];
  mimeTypes: string[];
  maxFileSizeBytes: number;
  inputMode: InputMode;
  outputExtension: string;
  outputMime: string;
  filenameSuffix: string;
  notices: string[];
  pastePlaceholder?: string;
  copyLabel?: string;
}

export interface DocumentDataResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  textPreview?: string;
  notice?: string;
  stats?: Record<string, string>;
}

export interface DocumentDataOptions {
  textInput?: string;
  sourceName?: string;
  delimiter?: string;
  hasHeader?: boolean;
  xmlRootName?: string;
  xmlRowName?: string;
  onProgress?: (completed: number, total: number, label: string) => void;
}

export const DEFAULT_DOC_MAX_BYTES = 40 * 1024 * 1024;
