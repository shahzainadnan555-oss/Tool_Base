import type { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpegInstance: FFmpeg | null = null;
let loadingPromise: Promise<FFmpeg> | null = null;

function absolutePublicUrl(path: string): string {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).href;
}

/**
 * Lazy-load a single shared ffmpeg.wasm instance (single-thread core).
 * Worker + core assets are served from /public/ffmpeg for reliable same-origin loading.
 */
export async function getFfmpeg(
  onLog?: (message: string) => void,
): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ]);
    const ffmpeg = new FFmpeg();
    if (onLog) {
      ffmpeg.on("log", ({ message }) => onLog(message));
    }

    const coreURL = await toBlobURL(
      absolutePublicUrl("/ffmpeg/ffmpeg-core.js"),
      "text/javascript",
    );
    const wasmURL = await toBlobURL(
      absolutePublicUrl("/ffmpeg/ffmpeg-core.wasm"),
      "application/wasm",
    );

    const loadPromise = ffmpeg.load({
      coreURL,
      wasmURL,
      // Absolute same-origin worker so module imports resolve to /ffmpeg/*.js
      classWorkerURL: absolutePublicUrl("/ffmpeg/worker.js"),
    });
    const timeout = new Promise<never>((_, reject) => {
      window.setTimeout(
        () => reject(new Error("Media processing timed out while loading. Please try again.")),
        90000,
      );
    });
    await Promise.race([loadPromise, timeout]);
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  try {
    return await loadingPromise;
  } catch (error) {
    loadingPromise = null;
    ffmpegInstance = null;
    throw error;
  }
}

export async function writeInputFile(ffmpeg: FFmpeg, file: File, inputName: string) {
  const { fetchFile } = await import("@ffmpeg/util");
  await ffmpeg.writeFile(inputName, await fetchFile(file));
}

export async function readOutputFile(
  ffmpeg: FFmpeg,
  outputName: string,
): Promise<Uint8Array> {
  const data = await ffmpeg.readFile(outputName);
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }
  return data as Uint8Array;
}

export async function safeDelete(ffmpeg: FFmpeg, name: string) {
  try {
    await ffmpeg.deleteFile(name);
  } catch {
    // ignore missing files
  }
}

export function attachProgress(
  ffmpeg: FFmpeg,
  onProgress?: (ratio: number, label: string) => void,
  label = "Processing audio…",
) {
  if (!onProgress) return () => undefined;
  const handler = ({ progress }: { progress: number }) => {
    if (!Number.isFinite(progress)) return;
    const ratio = Math.max(0, Math.min(1, progress));
    onProgress(ratio, label);
  };
  ffmpeg.on("progress", handler);
  return () => {
    ffmpeg.on("progress", () => undefined);
  };
}
