import type { AudioToolConfig } from "./types";
import { getExtension } from "./utils";

export function validateAudioFile(file: File, config: AudioToolConfig): string | null {
  if (!file || file.size <= 0) return "Please choose a valid audio file.";
  if (file.size > config.maxFileSizeBytes) {
    const mb = Math.round(config.maxFileSizeBytes / (1024 * 1024));
    return `This file is too large. Please choose a file under ${mb} MB.`;
  }
  const ext = getExtension(file.name);
  const type = (file.type || "").toLowerCase();
  const extOk = config.extensions.includes(ext);
  const mimeOk = !type || config.mimeTypes.some((m) => m.toLowerCase() === type);
  if (!extOk && !mimeOk) {
    return "Unsupported audio format. Please choose a supported audio file.";
  }
  return null;
}

export function friendlyAudioError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/codec|Invalid data|does not contain|Unsupported/i.test(message)) {
    return "We couldn't decode this audio file. The format or codec may be unsupported.";
  }
  if (/memory|out of memory|allocation/i.test(message)) {
    return "This audio file is too large to process in this browser session.";
  }
  if (/ffmpeg|load|network|Failed to fetch/i.test(message)) {
    return "Audio processing libraries could not be loaded. Check your connection and try again.";
  }
  if (message && message.length < 180 && !/undefined|null|stack/i.test(message)) {
    return message;
  }
  return "We couldn't process this audio file. Please try another file.";
}
