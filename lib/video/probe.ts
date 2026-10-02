import {
  getFfmpeg,
  safeDelete,
  writeInputFile,
} from "@/lib/audio/ffmpeg";
import { extensionFromName } from "./utils";

export type MediaStreamProbe = {
  videoCodec?: string;
  audioCodec?: string;
  hasVideo: boolean;
  hasAudio: boolean;
  width?: number;
  height?: number;
  fps?: number;
  durationSeconds?: number;
  containerHint?: string;
};

/** Codecs that can be stream-copied into an MP4/MOV-style container safely. */
const MP4_VIDEO_COPY = new Set(["h264", "mpeg4"]);
const MP4_AUDIO_COPY = new Set(["aac", "mp3"]);

export function normalizeCodecName(raw: string): string {
  const c = raw.toLowerCase().replace(/[^a-z0-9.+]/g, "");
  if (c.includes("h264") || c.includes("avc1") || c === "avc") return "h264";
  if (c.includes("h265") || c.includes("hevc") || c.includes("hvc1")) return "hevc";
  if (c.includes("vp9") || c.includes("vp09")) return "vp9";
  if (c.includes("vp8") || c.includes("vp08")) return "vp8";
  if (c.includes("av1") || c.includes("av01")) return "av1";
  if (c.includes("mpeg4") || c.includes("mp4v") || c === "xvid" || c === "divx") {
    return "mpeg4";
  }
  if (c.includes("mjpeg") || c === "jpeg") return "mjpeg";
  if (c.includes("aac") || c.includes("mp4a")) return "aac";
  if (c.includes("mp3") || c.includes("libmp3") || c === "mpga") return "mp3";
  if (c.includes("opus")) return "opus";
  if (c.includes("vorbis")) return "vorbis";
  if (c.includes("flac")) return "flac";
  if (c.includes("pcm") || c.startsWith("s16") || c.startsWith("s32")) return "pcm";
  if (c.includes("ac3") || c.includes("eac3")) return "ac3";
  if (c.includes("alac")) return "alac";
  return c.split(/[,(\s]/)[0] || c;
}

export function parseFfmpegProbeLogs(logText: string): MediaStreamProbe {
  const result: MediaStreamProbe = {
    hasVideo: false,
    hasAudio: false,
  };

  const durationMatch = logText.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/i);
  if (durationMatch) {
    const hours = Number(durationMatch[1]);
    const minutes = Number(durationMatch[2]);
    const seconds = Number(durationMatch[3]);
    if ([hours, minutes, seconds].every(Number.isFinite)) {
      result.durationSeconds = hours * 3600 + minutes * 60 + seconds;
    }
  }

  const inputMatch = logText.match(/Input #\d+,\s*([^,]+),/i);
  if (inputMatch) {
    result.containerHint = inputMatch[1].trim().toLowerCase();
  }

  const streamRegex =
    /Stream #\d+:\d+(?:\([^)]*\))?: (Video|Audio):\s*([^\s,]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = streamRegex.exec(logText)) !== null) {
    const kind = match[1].toLowerCase();
    const codec = normalizeCodecName(match[2]);
    if (kind === "video") {
      result.hasVideo = true;
      if (!result.videoCodec) result.videoCodec = codec;
    } else if (kind === "audio") {
      result.hasAudio = true;
      if (!result.audioCodec) result.audioCodec = codec;
    }
  }

  const videoLine = logText.match(
    /Stream #\d+:\d+(?:\([^)]*\))?: Video:[^\n]+/i,
  )?.[0];
  if (videoLine) {
    const dim = videoLine.match(/,\s*(\d{2,5})x(\d{2,5})(?:\s*[,\[])/);
    if (dim) {
      result.width = Number(dim[1]) || undefined;
      result.height = Number(dim[2]) || undefined;
    }
    const fps = videoLine.match(/,\s*([\d.]+)\s*fps/i);
    if (fps) {
      const value = Number(fps[1]);
      if (Number.isFinite(value) && value > 0) result.fps = value;
    }
  }

  return result;
}

export function canFullyRemuxToMp4(probe: MediaStreamProbe): boolean {
  if (!probe.hasVideo || !probe.videoCodec) return false;
  if (!MP4_VIDEO_COPY.has(probe.videoCodec)) return false;
  if (!probe.hasAudio) return true;
  if (!probe.audioCodec) return false;
  return MP4_AUDIO_COPY.has(probe.audioCodec);
}

export function canCopyVideoToMp4(probe: MediaStreamProbe): boolean {
  return Boolean(probe.videoCodec && MP4_VIDEO_COPY.has(probe.videoCodec));
}

export function canCopyAudioToMp4(probe: MediaStreamProbe): boolean {
  if (!probe.hasAudio) return true;
  return Boolean(probe.audioCodec && MP4_AUDIO_COPY.has(probe.audioCodec));
}

/** Probe a file already written into the ffmpeg virtual FS (no extra copy). */
export async function probeWrittenInput(
  inputName: string,
): Promise<MediaStreamProbe> {
  const ffmpeg = await getFfmpeg();
  const logs: string[] = [];
  const onLog = ({ message }: { message: string }) => {
    logs.push(message);
  };
  ffmpeg.on("log", onLog);
  try {
    await ffmpeg.exec(["-hide_banner", "-i", inputName]);
  } catch {
    // ffmpeg -i without an output exits non-zero; logs still contain stream info.
  } finally {
    ffmpeg.off("log", onLog);
  }
  return parseFfmpegProbeLogs(logs.join("\n"));
}

/** Standalone probe that writes, inspects, and cleans up the temporary input. */
export async function probeMediaStreams(file: File): Promise<MediaStreamProbe> {
  const ffmpeg = await getFfmpeg();
  const inputExt = extensionFromName(file.name) || "bin";
  const input = `probe_${Date.now().toString(36)}.${inputExt}`;
  try {
    await writeInputFile(ffmpeg, file, input);
    return await probeWrittenInput(input);
  } finally {
    await safeDelete(ffmpeg, input);
  }
}
