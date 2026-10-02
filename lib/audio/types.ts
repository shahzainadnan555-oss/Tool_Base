export type AudioToolKind =
  | "convert"
  | "compress"
  | "trim"
  | "cut"
  | "join"
  | "volume"
  | "speed"
  | "pitch"
  | "waveform"
  | "metadata"
  | "silence-remove";

export interface AudioToolConfig {
  slug: string;
  kind: AudioToolKind;
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
  /** ffmpeg output args template helpers */
  ffmpegFormat?: string;
  notices: string[];
}

export interface AudioSourceFile {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  type: string;
  objectUrl: string;
  durationSeconds?: number;
}

export interface AudioProcessResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  previewUrl?: string;
  notice?: string;
  stats?: Record<string, string>;
  metadataRows?: Array<{ label: string; value: string }>;
  waveformDataUrl?: string;
}

export interface AudioProcessOptions {
  bitrate?: string;
  quality?: number;
  startSeconds?: number;
  endSeconds?: number;
  volumeGainDb?: number;
  speed?: number;
  pitchSemitones?: number;
  silenceThresholdDb?: number;
  silenceMinDuration?: number;
  onProgress?: (ratio: number, label: string) => void;
}

export const DEFAULT_AUDIO_MAX_BYTES = 80 * 1024 * 1024;
export const DEFAULT_AUDIO_MAX_FILES = 20;

export const COMMON_AUDIO_ACCEPT =
  ".mp3,.wav,.aac,.ogg,.flac,.m4a,.oga,.opus,audio/mpeg,audio/wav,audio/x-wav,audio/aac,audio/ogg,audio/flac,audio/mp4,audio/x-m4a";

export const COMMON_AUDIO_EXTS = ["mp3", "wav", "aac", "ogg", "flac", "m4a", "oga", "opus"];
export const COMMON_AUDIO_MIMES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/aac",
  "audio/ogg",
  "audio/flac",
  "audio/mp4",
  "audio/x-m4a",
  "audio/x-flac",
];
