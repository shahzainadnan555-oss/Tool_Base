import {
  COMMON_VIDEO_ACCEPT,
  COMMON_VIDEO_EXTS,
  COMMON_VIDEO_MIMES,
  DEFAULT_VIDEO_MAX_BYTES,
  DEFAULT_VIDEO_MAX_FILES,
  type VideoToolConfig,
  type VideoToolKind,
} from "./types";

function cfg(
  partial: Omit<VideoToolConfig, "maxFileSizeBytes" | "maxFiles" | "notices"> &
    Partial<Pick<VideoToolConfig, "maxFileSizeBytes" | "maxFiles" | "notices" | "lightMode">>,
): VideoToolConfig {
  return {
    maxFileSizeBytes: DEFAULT_VIDEO_MAX_BYTES,
    maxFiles: DEFAULT_VIDEO_MAX_FILES,
    ...partial,
    notices: partial.notices ?? [],
  };
}

function convert(
  slug: string,
  actionLabel: string,
  outputExtension: string,
  outputMime: string,
  ffmpegFormat: string,
  accept: string,
  extensions: string[],
  mimeTypes: string[],
  notices: string[] = [],
  filenameSuffix = "converted",
): VideoToolConfig {
  return cfg({
    slug,
    kind: "convert",
    actionLabel,
    processingLabel: "Converting video…",
    resetLabel: "Convert Another Video",
    accept,
    extensions,
    mimeTypes,
    allowMultiple: false,
    maxFiles: 1,
    filenameSuffix,
    outputExtension,
    outputMime,
    ffmpegFormat,
    notices,
  });
}

function edit(
  slug: string,
  kind: VideoToolKind,
  actionLabel: string,
  filenameSuffix: string,
  extras: Partial<VideoToolConfig> = {},
): VideoToolConfig {
  return cfg({
    slug,
    kind,
    actionLabel,
    processingLabel: "Processing video…",
    resetLabel: "Start Over",
    accept: COMMON_VIDEO_ACCEPT,
    extensions: COMMON_VIDEO_EXTS,
    mimeTypes: COMMON_VIDEO_MIMES,
    allowMultiple: kind === "merge",
    maxFiles: kind === "merge" ? 12 : 1,
    filenameSuffix,
    outputExtension: "mp4",
    outputMime: "video/mp4",
    ffmpegFormat: "mp4",
    ...extras,
  });
}

const MP4 = {
  accept: ".mp4,video/mp4",
  extensions: ["mp4"],
  mimeTypes: ["video/mp4"],
};

export const videoToolConfigs: Record<string, VideoToolConfig> = {
  "mp4-to-mp3": convert(
    "mp4-to-mp3",
    "Convert to MP3",
    "mp3",
    "audio/mpeg",
    "mp3",
    MP4.accept,
    MP4.extensions,
    MP4.mimeTypes,
    [],
    "",
  ),
  "mp4-to-wav": convert(
    "mp4-to-wav",
    "Convert to WAV",
    "wav",
    "audio/wav",
    "wav",
    MP4.accept,
    MP4.extensions,
    MP4.mimeTypes,
    ["WAV is uncompressed, but converting from a compressed source cannot restore lost detail."],
    "",
  ),
  "mp4-to-gif": convert(
    "mp4-to-gif",
    "Convert to GIF",
    "gif",
    "image/gif",
    "gif",
    MP4.accept,
    MP4.extensions,
    MP4.mimeTypes,
    ["GIF output has no audio track."],
  ),
  "gif-to-mp4": convert(
    "gif-to-mp4",
    "Convert to MP4",
    "mp4",
    "video/mp4",
    "mp4",
    ".gif,image/gif",
    ["gif"],
    ["image/gif"],
  ),
  "mov-to-mp4": convert(
    "mov-to-mp4",
    "Convert to MP4",
    "mp4",
    "video/mp4",
    "mp4",
    ".mov,video/quicktime",
    ["mov"],
    ["video/quicktime"],
  ),
  "avi-to-mp4": convert(
    "avi-to-mp4",
    "Convert to MP4",
    "mp4",
    "video/mp4",
    "mp4",
    ".avi,video/x-msvideo,video/avi",
    ["avi"],
    ["video/x-msvideo", "video/avi"],
  ),
  "mkv-to-mp4": convert(
    "mkv-to-mp4",
    "Convert to MP4",
    "mp4",
    "video/mp4",
    "mp4",
    ".mkv,video/x-matroska",
    ["mkv"],
    ["video/x-matroska"],
  ),
  "webm-to-mp4": convert(
    "webm-to-mp4",
    "Convert to MP4",
    "mp4",
    "video/mp4",
    "mp4",
    ".webm,video/webm",
    ["webm"],
    ["video/webm"],
  ),
  "mp4-to-webm": convert(
    "mp4-to-webm",
    "Convert to WebM",
    "webm",
    "video/webm",
    "webm",
    MP4.accept,
    MP4.extensions,
    MP4.mimeTypes,
  ),
  "video-compressor": edit("video-compressor", "compress", "Compress Video", "compressed", {
    processingLabel: "Compressing video…",
    notices: ["Lower quality settings reduce file size and can reduce visual clarity."],
  }),
  "video-resizer": edit("video-resizer", "resize", "Resize Video", "resized", {
    processingLabel: "Resizing video…",
  }),
  "video-cropper": edit("video-cropper", "crop", "Crop Video", "cropped", {
    processingLabel: "Cropping video…",
  }),
  "video-trimmer": edit("video-trimmer", "trim", "Trim Video", "trimmed", {
    processingLabel: "Trimming video…",
  }),
  "video-cutter": edit("video-cutter", "cut", "Cut Video", "cut", {
    processingLabel: "Cutting video…",
  }),
  "video-merger": edit("video-merger", "merge", "Merge Videos", "merged", {
    processingLabel: "Merging videos…",
    allowMultiple: true,
    maxFiles: 12,
  }),
  "video-rotator": edit("video-rotator", "rotate", "Rotate Video", "rotated", {
    processingLabel: "Rotating video…",
  }),
  "video-speed-changer": edit("video-speed-changer", "speed", "Change Speed", "speed", {
    processingLabel: "Changing speed…",
  }),
  "video-thumbnail-extractor": edit(
    "video-thumbnail-extractor",
    "thumbnail",
    "Download Thumbnail",
    "thumbnail",
    {
      processingLabel: "Extracting thumbnail…",
      outputExtension: "png",
      outputMime: "image/png",
      lightMode: true,
      resetLabel: "Extract Another Thumbnail",
    },
  ),
  "video-frame-extractor": edit(
    "video-frame-extractor",
    "frame",
    "Download Frame",
    "frame",
    {
      processingLabel: "Extracting frame…",
      outputExtension: "png",
      outputMime: "image/png",
      lightMode: true,
      resetLabel: "Extract Another Frame",
    },
  ),
  "video-metadata-viewer": edit(
    "video-metadata-viewer",
    "metadata",
    "View Metadata",
    "metadata",
    {
      processingLabel: "Reading metadata…",
      lightMode: true,
      resetLabel: "Check Another Video",
    },
  ),
};

export function getVideoToolConfig(slug: string): VideoToolConfig | undefined {
  return videoToolConfigs[slug];
}

export function isVideoToolSlug(slug: string): boolean {
  return Boolean(videoToolConfigs[slug]);
}

export const videoToolSlugs = Object.keys(videoToolConfigs);
