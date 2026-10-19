import { FILE_TOO_LARGE_MESSAGE } from "@/lib/uploads/limits";
import type { VideoToolConfig } from "./types";
import { getExtension } from "./utils";

export function validateVideoFile(file: File, config: VideoToolConfig): string | null {
  if (!file || file.size <= 0) return "Please choose a valid video file.";
  if (file.size > config.maxFileSizeBytes) {
    return FILE_TOO_LARGE_MESSAGE;
  }
  const ext = getExtension(file.name);
  const type = (file.type || "").toLowerCase();
  const extOk = config.extensions.includes(ext);
  const mimeOk = !type || config.mimeTypes.some((m) => m.toLowerCase() === type);
  if (!extOk && !mimeOk) {
    return "Unsupported video format. Please choose a supported video file.";
  }
  return null;
}

export function friendlyVideoError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message === FILE_TOO_LARGE_MESSAGE) return message;
  if (/codec|Invalid data|does not contain|Unsupported|Decoder/i.test(message)) {
    return "We couldn't decode this video. The format or codec may be unsupported.";
  }
  if (/memory|out of memory|allocation/i.test(message)) {
    return "This browser ran out of memory while processing the video. The file passed the size check, but this device could not finish it.";
  }
  if (/ffmpeg|load|network|Failed to fetch|timed out/i.test(message)) {
    return "Video processing libraries could not be loaded. Check your connection and try again.";
  }
  if (/start|end|timestamp|range/i.test(message) && message.length < 160) {
    return message;
  }
  if (message && message.length < 180 && !/undefined|null|stack/i.test(message)) {
    return message;
  }
  return "We couldn't process this video. Please try another file or a different format.";
}
