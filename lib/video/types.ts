export type VideoToolKind =
  | "convert"
  | "compress"
  | "resize"
  | "crop"
  | "trim"
  | "cut"
  | "merge"
  | "rotate"
  | "speed"
  | "thumbnail"
  | "frame"
  | "metadata";

export interface VideoToolConfig {
  slug: string;
  kind: VideoToolKind;
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
  outputExtension?: string;
  outputMime?: string;
  ffmpegFormat?: string;
  notices: string[];
  /** When true, processing can skip ffmpeg (metadata / canvas extract). */
  lightMode?: boolean;
}

export interface VideoSourceFile {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  type: string;
  objectUrl: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
}

export interface VideoProcessResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  previewUrl?: string;
  notice?: string;
  stats?: Record<string, string>;
  metadataRows?: Array<{ label: string; value: string }>;
  imagePreviewUrl?: string;
}

export interface VideoCropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VideoProcessOptions {
  quality?: number;
  startSeconds?: number;
  endSeconds?: number;
  width?: number;
  height?: number;
  maintainAspect?: boolean;
  crop?: VideoCropRect;
  rotation?: 90 | 180 | 270 | -90;
  speed?: number;
  timestampSeconds?: number;
  gifFps?: number;
  gifWidth?: number;
  onProgress?: (ratio: number, label: string) => void;
}

export const DEFAULT_VIDEO_MAX_BYTES = 200 * 1024 * 1024;
export const DEFAULT_VIDEO_MAX_FILES = 12;

export const COMMON_VIDEO_ACCEPT =
  ".mp4,.mov,.avi,.mkv,.webm,.gif,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,image/gif";

export const COMMON_VIDEO_EXTS = ["mp4", "mov", "avi", "mkv", "webm", "gif"];
export const COMMON_VIDEO_MIMES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/avi",
  "video/x-matroska",
  "video/webm",
  "image/gif",
];
