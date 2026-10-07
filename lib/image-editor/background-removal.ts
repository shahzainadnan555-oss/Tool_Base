import type {
  EditorImageFile,
  EditorProcessOptions,
  EditorProcessResult,
  ImageEditorConfig,
} from "./types";
import { compositeCutoutOntoOriginal } from "./bg-composite";
import {
  assertPlausibleCutout,
  refineCutoutAlpha,
} from "./bg-refine";
import { buildProcessedFileName, formatBytes } from "./utils";

type ImglyModule = typeof import("@imgly/background-removal");
type ImglyConfig = NonNullable<Parameters<ImglyModule["removeBackground"]>[1]>;
type ModelId = "isnet" | "isnet_fp16";

/** Singleton module promise — never re-import the heavy package. */
let imglyModulePromise: Promise<ImglyModule> | null = null;

/** Stable progress sink so imgly's memoized session keeps one progress fn. */
let progressSink:
  | ((key: string, current: number, total: number) => void)
  | null = null;

const stableProgress = (key: string, current: number, total: number) => {
  progressSink?.(key, current, total);
};

let resolvedDevice: "cpu" | "gpu" | null = null;
let resolvedModel: ModelId | null = null;
let preloadPromise: Promise<void> | null = null;

function devTime(label: string, start: number) {
  if (process.env.NODE_ENV !== "development") return;
  if (typeof console !== "undefined" && typeof console.debug === "function") {
    console.debug(
      `[bg-remover] ${label}: ${Math.round(performance.now() - start)}ms`,
    );
  }
}

function loadImgly(): Promise<ImglyModule> {
  if (!imglyModulePromise) {
    imglyModulePromise = import("@imgly/background-removal");
  }
  return imglyModulePromise;
}

async function detectDevice(): Promise<"cpu" | "gpu"> {
  if (resolvedDevice) return resolvedDevice;
  try {
    const nav = navigator as Navigator & {
      gpu?: { requestAdapter: () => Promise<unknown> };
    };
    if (nav.gpu) {
      const adapter = await nav.gpu.requestAdapter();
      if (adapter) {
        resolvedDevice = "gpu";
        return resolvedDevice;
      }
    }
  } catch {
    // Fall through to CPU.
  }
  resolvedDevice = "cpu";
  return resolvedDevice;
}

/**
 * Prefer full ISNet for accuracy. Use fp16 only on clearly constrained mobile
 * devices where the full model is likely to thrash memory.
 */
function pickModel(device: "cpu" | "gpu"): ModelId {
  if (resolvedModel) return resolvedModel;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memoryGb = nav.deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // Constrained mobile → medium model. Everything else → full ISNet (best edges).
  if (mobile && device === "cpu" && (memoryGb ?? 4) <= 4 && cores <= 4) {
    resolvedModel = "isnet_fp16";
  } else {
    resolvedModel = "isnet";
  }
  return resolvedModel;
}

function buildEngineConfig(
  device: "cpu" | "gpu",
  model: ModelId,
): ImglyConfig {
  return {
    model,
    device,
    // Upscale the soft mask and composite onto the original-resolution tensor.
    rescale: true,
    proxyToWorker: true,
    output: {
      format: "image/png",
      quality: 1,
    },
    progress: stableProgress,
  };
}

/**
 * Warm the ONNX session when the user opens Background Remover.
 */
export function preloadBackgroundRemoval(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  preloadPromise = (async () => {
    const start = performance.now();
    try {
      const imgly = await loadImgly();
      const device = await detectDevice();
      const model = pickModel(device);
      await imgly.preload(buildEngineConfig(device, model));
      devTime(`preload (${model}/${device})`, start);
    } catch {
      resolvedDevice = "cpu";
      try {
        const imgly = await loadImgly();
        const model = pickModel("cpu");
        await imgly.preload(buildEngineConfig("cpu", model));
        devTime(`preload-cpu-fallback (${model})`, start);
      } catch {
        preloadPromise = null;
      }
    }
  })();

  return preloadPromise;
}

/**
 * Optional downscale of extremely large sources for the segmentation pass.
 * The library always infers at 1024², but decoding/compositing multi‑megapixel
 * originals can dominate. We keep a high-quality working copy (≤ 4096 long edge)
 * for the engine, then verify final dimensions against the true source size.
 */
async function prepareEngineSource(
  source: EditorImageFile,
): Promise<{ input: Blob | File; workingWidth: number; workingHeight: number }> {
  const MAX_LONG_EDGE = 4096;
  const longEdge = Math.max(source.width, source.height);
  if (longEdge <= MAX_LONG_EDGE) {
    return {
      input: source.file,
      workingWidth: source.width,
      workingHeight: source.height,
    };
  }

  const start = performance.now();
  const scale = MAX_LONG_EDGE / longEdge;
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(source.file, {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "high",
    });
  } catch {
    bitmap = await createImageBitmap(source.file);
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return {
        input: source.file,
        workingWidth: source.width,
        workingHeight: source.height,
      };
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) {
      return {
        input: source.file,
        workingWidth: source.width,
        workingHeight: source.height,
      };
    }
    devTime("prepare-working-image", start);
    return { input: blob, workingWidth: width, workingHeight: height };
  } finally {
    bitmap.close();
  }
}

/**
 * Authoritative background-removal pipeline:
 * preload → segment (full ISNet when possible) → refine alpha → validate → PNG.
 */
export async function removeBackground(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions = {},
): Promise<EditorProcessResult> {
  const totalStart = performance.now();
  const stage = (label: string) => {
    // total=0 → indeterminate status (no invented percentage)
    options.onProgress?.(0, 0, label);
  };

  progressSink = (key, current, total) => {
    if (!options.onProgress || !Number.isFinite(total) || total <= 0) return;
    // Only model/asset downloads expose real byte progress.
    if (/download|fetch|load|model|wasm|ort|onnx/i.test(key)) {
      options.onProgress(current, total, "Preparing…");
    }
  };

  try {
    stage("Preparing…");
    await preloadBackgroundRemoval();

    const imgly = await loadImgly();
    let device = await detectDevice();
    let model = pickModel(device);
    const prepared = await prepareEngineSource(source);

    stage("Removing background…");
    // Inference has no trustworthy percent — clear download determinate state.
    progressSink = null;

    const inferStart = performance.now();
    let rawBlob: Blob;
    try {
      rawBlob = await imgly.removeBackground(
        prepared.input,
        buildEngineConfig(device, model),
      );
    } catch (error) {
      if (device === "gpu") {
        resolvedDevice = "cpu";
        preloadPromise = null;
        device = "cpu";
        model = pickModel(device);
        stage("Preparing…");
        progressSink = (key, current, total) => {
          if (!options.onProgress || !Number.isFinite(total) || total <= 0) return;
          if (/download|fetch|load|model|wasm|ort|onnx/i.test(key)) {
            options.onProgress(current, total, "Preparing…");
          }
        };
        await preloadBackgroundRemoval();
        progressSink = null;
        stage("Removing background…");
        rawBlob = await imgly.removeBackground(
          prepared.input,
          buildEngineConfig("cpu", model),
        );
      } else if (model === "isnet") {
        // Last resort: medium model if full ISNet fails to load/run.
        resolvedModel = "isnet_fp16";
        preloadPromise = null;
        model = "isnet_fp16";
        stage("Preparing…");
        progressSink = (key, current, total) => {
          if (!options.onProgress || !Number.isFinite(total) || total <= 0) return;
          if (/download|fetch|load|model|wasm|ort|onnx/i.test(key)) {
            options.onProgress(current, total, "Preparing…");
          }
        };
        await preloadBackgroundRemoval();
        progressSink = null;
        stage("Removing background…");
        rawBlob = await imgly.removeBackground(
          prepared.input,
          buildEngineConfig(device, model),
        );
      } else {
        throw error;
      }
    }
    devTime(`inference (${model}/${device})`, inferStart);

    stage("Refining result…");
    const refineStart = performance.now();
    const refined = await refineCutoutAlpha(rawBlob);
    devTime("refine", refineStart);

    assertPlausibleCutout({
      foregroundRatio: refined.foregroundRatio,
      softEdgeRatio: refined.softEdgeRatio,
      byteSize: refined.blob.size,
    });

    // Re-composite onto the original photograph so solid subject pixels keep
    // native detail; soft edges use the refined/decontaminated cutout colors.
    stage("Finalizing…");
    const compositeStart = performance.now();
    const finalBlob = await compositeCutoutOntoOriginal(
      refined.blob,
      source.file,
      source.width,
      source.height,
    );
    devTime("composite", compositeStart);

    const result: EditorProcessResult = {
      blob: finalBlob,
      previewUrl: URL.createObjectURL(finalBlob),
      fileName: buildProcessedFileName(
        source.name,
        config.filenameSuffix,
        "png",
      ),
      mimeType: "image/png",
      sizeBytes: finalBlob.size,
      width: source.width,
      height: source.height,
      stats: {
        Width: `${source.width}px`,
        Height: `${source.height}px`,
        Size: formatBytes(finalBlob.size),
      },
    };

    devTime("total", totalStart);
    return result;
  } catch (error) {
    if (
      error instanceof Error &&
      (/couldn't remove the background/i.test(error.message) ||
        /couldn't separate the subject/i.test(error.message))
    ) {
      throw error;
    }
    throw new Error(
      "We couldn't remove the background from this image. Please try another image.",
    );
  } finally {
    progressSink = null;
  }
}

/** Dev-only introspection for reports / debugging. */
export function getBackgroundRemovalRuntimeInfo() {
  return {
    device: resolvedDevice,
    model: resolvedModel,
    preloaded: Boolean(preloadPromise),
  };
}
