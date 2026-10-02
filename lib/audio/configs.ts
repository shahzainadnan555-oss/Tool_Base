import {
  COMMON_AUDIO_ACCEPT,
  COMMON_AUDIO_EXTS,
  COMMON_AUDIO_MIMES,
  DEFAULT_AUDIO_MAX_BYTES,
  DEFAULT_AUDIO_MAX_FILES,
  type AudioToolConfig,
  type AudioToolKind,
} from "./types";

function cfg(
  partial: Omit<AudioToolConfig, "maxFileSizeBytes" | "maxFiles" | "notices"> &
    Partial<Pick<AudioToolConfig, "maxFileSizeBytes" | "maxFiles" | "notices">>,
): AudioToolConfig {
  return {
    maxFileSizeBytes: DEFAULT_AUDIO_MAX_BYTES,
    maxFiles: DEFAULT_AUDIO_MAX_FILES,
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
): AudioToolConfig {
  return cfg({
    slug,
    kind: "convert",
    actionLabel,
    processingLabel: "Converting audio…",
    resetLabel: "Convert Another Audio",
    accept,
    extensions,
    mimeTypes,
    allowMultiple: false,
    maxFiles: 1,
    filenameSuffix: "converted",
    outputExtension,
    outputMime,
    ffmpegFormat,
    notices,
  });
}

function edit(
  slug: string,
  kind: AudioToolKind,
  actionLabel: string,
  filenameSuffix: string,
  extras: Partial<AudioToolConfig> = {},
): AudioToolConfig {
  return cfg({
    slug,
    kind,
    actionLabel,
    processingLabel: "Processing audio…",
    resetLabel: "Start Over",
    accept: COMMON_AUDIO_ACCEPT,
    extensions: COMMON_AUDIO_EXTS,
    mimeTypes: COMMON_AUDIO_MIMES,
    allowMultiple: kind === "join",
    maxFiles: kind === "join" ? 20 : 1,
    filenameSuffix,
    outputExtension: "mp3",
    outputMime: "audio/mpeg",
    ffmpegFormat: "mp3",
    ...extras,
  });
}

const MP3 = {
  accept: ".mp3,audio/mpeg",
  extensions: ["mp3"],
  mimeTypes: ["audio/mpeg"],
};

export const audioToolConfigs: Record<string, AudioToolConfig> = {
  "mp3-to-wav": convert(
    "mp3-to-wav",
    "Convert to WAV",
    "wav",
    "audio/wav",
    "wav",
    MP3.accept,
    MP3.extensions,
    MP3.mimeTypes,
  ),
  "wav-to-mp3": convert(
    "wav-to-mp3",
    "Convert to MP3",
    "mp3",
    "audio/mpeg",
    "mp3",
    ".wav,audio/wav,audio/x-wav,audio/wave",
    ["wav"],
    ["audio/wav", "audio/x-wav", "audio/wave"],
  ),
  "mp3-to-aac": convert(
    "mp3-to-aac",
    "Convert to AAC",
    "aac",
    "audio/aac",
    "adts",
    MP3.accept,
    MP3.extensions,
    MP3.mimeTypes,
  ),
  "aac-to-mp3": convert(
    "aac-to-mp3",
    "Convert to MP3",
    "mp3",
    "audio/mpeg",
    "mp3",
    ".aac,.m4a,audio/aac,audio/mp4,audio/x-m4a",
    ["aac", "m4a"],
    ["audio/aac", "audio/mp4", "audio/x-m4a"],
  ),
  "mp3-to-ogg": convert(
    "mp3-to-ogg",
    "Convert to OGG",
    "ogg",
    "audio/ogg",
    "ogg",
    MP3.accept,
    MP3.extensions,
    MP3.mimeTypes,
  ),
  "ogg-to-mp3": convert(
    "ogg-to-mp3",
    "Convert to MP3",
    "mp3",
    "audio/mpeg",
    "mp3",
    ".ogg,.oga,.opus,audio/ogg",
    ["ogg", "oga", "opus"],
    ["audio/ogg"],
  ),
  "flac-to-mp3": convert(
    "flac-to-mp3",
    "Convert to MP3",
    "mp3",
    "audio/mpeg",
    "mp3",
    ".flac,audio/flac,audio/x-flac",
    ["flac"],
    ["audio/flac", "audio/x-flac"],
  ),
  "mp3-to-flac": convert(
    "mp3-to-flac",
    "Convert to FLAC",
    "flac",
    "audio/flac",
    "flac",
    MP3.accept,
    MP3.extensions,
    MP3.mimeTypes,
    [
      "FLAC is lossless, but converting from MP3 cannot restore information already lost in the MP3 encoding.",
    ],
  ),
  "m4a-to-mp3": convert(
    "m4a-to-mp3",
    "Convert to MP3",
    "mp3",
    "audio/mpeg",
    "mp3",
    ".m4a,audio/mp4,audio/x-m4a,audio/aac",
    ["m4a"],
    ["audio/mp4", "audio/x-m4a", "audio/aac"],
  ),
  "mp3-to-m4a": convert(
    "mp3-to-m4a",
    "Convert to M4A",
    "m4a",
    "audio/mp4",
    "ipod",
    MP3.accept,
    MP3.extensions,
    MP3.mimeTypes,
  ),
  "audio-compressor": edit("audio-compressor", "compress", "Compress Audio", "compressed", {
    processingLabel: "Compressing audio…",
    notices: ["Lower bitrates reduce file size and can reduce audio quality."],
  }),
  "audio-trimmer": edit("audio-trimmer", "trim", "Trim Audio", "trimmed", {
    processingLabel: "Trimming audio…",
  }),
  "audio-cutter": edit("audio-cutter", "cut", "Cut Audio", "cut", {
    processingLabel: "Cutting audio…",
  }),
  "audio-joiner": edit("audio-joiner", "join", "Join Audio", "joined", {
    processingLabel: "Joining audio…",
    allowMultiple: true,
    maxFiles: 20,
  }),
  "audio-volume-booster": edit(
    "audio-volume-booster",
    "volume",
    "Boost Volume",
    "boosted",
    {
      processingLabel: "Adjusting volume…",
      notices: ["High gain can cause clipping and distortion. Start with a modest boost."],
    },
  ),
  "audio-speed-changer": edit(
    "audio-speed-changer",
    "speed",
    "Change Speed",
    "speed",
    { processingLabel: "Changing speed…" },
  ),
  "audio-pitch-changer": edit(
    "audio-pitch-changer",
    "pitch",
    "Change Pitch",
    "pitch",
    {
      processingLabel: "Changing pitch…",
      notices: ["Pitch shifting adjusts tone without intending to change playback duration."],
    },
  ),
  "audio-waveform-generator": edit(
    "audio-waveform-generator",
    "waveform",
    "Generate Waveform",
    "waveform",
    {
      processingLabel: "Generating waveform…",
      outputExtension: "png",
      outputMime: "image/png",
      filenameSuffix: "waveform",
    },
  ),
  "audio-metadata-viewer": edit(
    "audio-metadata-viewer",
    "metadata",
    "View Metadata",
    "metadata",
    {
      processingLabel: "Reading metadata…",
      resetLabel: "Check Another Audio",
    },
  ),
  "silence-remover": edit("silence-remover", "silence-remove", "Remove Silence", "no-silence", {
    processingLabel: "Removing silence…",
    notices: [
      "Defaults are conservative. Aggressive thresholds can remove quiet speech or soft music.",
    ],
  }),
};

export function getAudioToolConfig(slug: string): AudioToolConfig | undefined {
  return audioToolConfigs[slug];
}

export function isAudioToolSlug(slug: string): boolean {
  return Boolean(audioToolConfigs[slug]);
}

export const audioToolSlugs = Object.keys(audioToolConfigs);
