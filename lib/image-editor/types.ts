export type ImageEditorKind =
  | "compress"
  | "resize"
  | "crop"
  | "rotate"
  | "flip"
  | "metadata-viewer"
  | "exif-remover"
  | "dpi-changer"
  | "quality"
  | "sharpen"
  | "blur"
  | "pixelate"
  | "rounded"
  | "circular"
  | "border"
  | "background-remover"
  | "color-picker";

export type OutputMime = "image/jpeg" | "image/png" | "image/webp";

export interface ImageEditorConfig {
  slug: string;
  kind: ImageEditorKind;
  actionLabel: string;
  processingLabel: string;
  resetLabel: string;
  accept: string;
  extensions: string[];
  mimeTypes: string[];
  maxFileSizeBytes: number;
  defaultOutputMime?: OutputMime;
  forceOutputMime?: OutputMime;
  forceOutputExtension?: string;
  filenameSuffix: string;
  notices: string[];
  /** Format-locked compressor (jpg/png/webp) */
  lockedFormat?: "jpeg" | "png" | "webp";
}

export interface EditorImageFile {
  file: File;
  previewUrl: string;
  name: string;
  type: string;
  sizeBytes: number;
  width: number;
  height: number;
}

export interface EditorProcessResult {
  blob: Blob;
  previewUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  notice?: string;
  stats?: Record<string, string>;
  metadataRows?: Array<{ label: string; value: string }>;
}

export interface EditorProcessOptions {
  quality?: number;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  outputMime?: OutputMime;
  rotation?: 90 | 180 | -90;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  crop?: { x: number; y: number; width: number; height: number };
  dpi?: number;
  strength?: number;
  pixelSize?: number;
  radius?: number;
  borderWidth?: number;
  borderColor?: string;
  padding?: number;
  backgroundColor?: string;
  /** Real progress callback when the engine reports measurable units. */
  onProgress?: (completed: number, total: number, label: string) => void;
}

export const DEFAULT_EDITOR_MAX_BYTES = 40 * 1024 * 1024;
