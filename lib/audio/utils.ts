import { formatBytes, getExtension, revokeObjectUrl } from "@/lib/image-converter/utils";

export { formatBytes, getExtension, revokeObjectUrl };

export function createAudioId(): string {
  return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function buildAudioOutputName(
  originalName: string,
  suffix: string,
  extension: string,
): string {
  const cleaned = originalName.trim() || "audio";
  const base = cleaned.replace(/\.[^.]+$/, "") || "audio";
  const safeSuffix = suffix.replace(/^-+|-+$/g, "");
  const ext = extension.replace(/^\./, "");
  return safeSuffix ? `${base}-${safeSuffix}.${ext}` : `${base}.${ext}`;
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function formatDuration(seconds?: number): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "Unknown";
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function probeAudioDuration(file: File): Promise<number | undefined> {
  const url = URL.createObjectURL(file);
  try {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    const duration = await new Promise<number>((resolve, reject) => {
      audio.onloadedmetadata = () => resolve(audio.duration);
      audio.onerror = () => reject(new Error("Could not read audio duration."));
      audio.src = url;
    });
    return Number.isFinite(duration) ? duration : undefined;
  } catch {
    return undefined;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function extensionFromName(name: string): string {
  return getExtension(name) || "bin";
}
