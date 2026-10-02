export type PdfToolKind =
  | "pdf-to-image"
  | "images-to-pdf"
  | "merge"
  | "split"
  | "compress"
  | "extract-pages"
  | "reorder"
  | "rotate"
  | "crop"
  | "metadata-viewer"
  | "metadata-remover"
  | "password-protect"
  | "unlock"
  | "page-numbering"
  | "watermark"
  | "text-extract"
  | "pdf-to-text";

export type PdfImageOutput = "image/jpeg" | "image/png" | "image/webp";

export interface PdfToolConfig {
  slug: string;
  kind: PdfToolKind;
  actionLabel: string;
  processingLabel: string;
  resetLabel: string;
  accept: string;
  extensions: string[];
  mimeTypes: string[];
  maxFileSizeBytes: number;
  maxFiles: number;
  allowMultiple: boolean;
  filenameSuffix: string;
  notices: string[];
  /** For pdf-to-image tools */
  imageOutput?: PdfImageOutput;
  imageExtension?: string;
  /** For images-to-pdf */
  imageInput?: "jpeg" | "png";
}

export interface PdfSourceFile {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  type: string;
  pageCount?: number;
  previewUrl?: string;
}

export interface PdfProcessResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  previewUrl?: string;
  notice?: string;
  stats?: Record<string, string>;
  textContent?: string;
  metadataRows?: Array<{ label: string; value: string }>;
  /** Extra files when multi-output without zip preference */
  extraFiles?: Array<{ blob: Blob; fileName: string }>;
}

export interface PdfProcessOptions {
  pageSelection?: string;
  pageOrder?: number[];
  removedPages?: number[];
  rotations?: Record<number, 0 | 90 | 180 | 270>;
  rotateAll?: 0 | 90 | 180 | 270;
  crop?: { left: number; bottom: number; right: number; top: number };
  cropAllPages?: boolean;
  password?: string;
  passwordConfirm?: string;
  unlockPassword?: string;
  watermarkText?: string;
  watermarkOpacity?: number;
  watermarkRotation?: number;
  watermarkFontSize?: number;
  watermarkColor?: string;
  watermarkPosition?: "center" | "top" | "bottom" | "diagonal";
  pageNumberPosition?: "bottom-center" | "bottom-left" | "bottom-right" | "top-center";
  pageNumberStart?: number;
  pageNumberFontSize?: number;
  pageNumberFormat?: "number" | "page-n";
  imageQuality?: number;
  scale?: number;
  onProgress?: (completed: number, total: number, label: string) => void;
}

export const DEFAULT_PDF_MAX_BYTES = 80 * 1024 * 1024;
export const DEFAULT_PDF_MAX_FILES = 30;
