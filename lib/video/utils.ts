import { formatBytes, getExtension, revokeObjectUrl } from "@/lib/image-converter/utils";

export { formatBytes, getExtension, revokeObjectUrl };

export function createVideoId(): string {
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function buildVideoOutputName(
  originalName: string,
  suffix: string,
  extension: string,
): string {
  const cleaned = originalName.trim() || "video";
  const base = cleaned.replace(/\.[^.]+$/, "") || "video";
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
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function formatDuration(seconds?: number): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "Unknown";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function extensionFromName(name: string): string {
  return getExtension(name) || "bin";
}

export async function probeVideoMeta(
  file: File,
): Promise<{ durationSeconds?: number; width?: number; height?: number }> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    const meta = await new Promise<{ duration: number; width: number; height: number }>(
      (resolve, reject) => {
        video.onloadedmetadata = () =>
          resolve({
            duration: video.duration,
            width: video.videoWidth,
            height: video.videoHeight,
          });
        video.onerror = () => reject(new Error("Could not read video metadata."));
        video.src = url;
      },
    );
    return {
      durationSeconds: Number.isFinite(meta.duration) ? meta.duration : undefined,
      width: meta.width || undefined,
      height: meta.height || undefined,
    };
  } catch {
    return {};
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function captureFrameAt(
  file: File,
  timeSeconds: number,
  mimeType = "image/png",
  quality = 0.92,
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("Could not load video for frame capture."));
      video.src = url;
    });
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const clamped = Math.max(0, Math.min(timeSeconds, Math.max(duration - 0.05, 0)));
    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("Could not seek to the selected timestamp."));
      video.currentTime = clamped;
    });
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1;
    canvas.height = video.videoHeight || 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare a canvas for frame capture.");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (value) => (value ? resolve(value) : reject(new Error("Could not encode the frame image."))),
        mimeType,
        quality,
      );
    });
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
