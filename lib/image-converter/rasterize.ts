import {
  canvasToBlob,
  createCanvas,
  fillBackground,
  loadHtmlImage,
} from "./utils";
import type { RasterOutputFormat } from "./types";

export interface RasterizeOptions {
  flattenTransparency: boolean;
  backgroundColor: string;
  outputFormat: RasterOutputFormat;
  quality: number;
  targetWidth?: number;
  targetHeight?: number;
}

export async function rasterizeSourceToBlob(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  options: RasterizeOptions,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> {
  const width = Math.max(1, Math.round(options.targetWidth ?? sourceWidth));
  const height = Math.max(1, Math.round(options.targetHeight ?? sourceHeight));
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Your browser could not prepare an image canvas for conversion.");
  }

  if (options.flattenTransparency || options.outputFormat === "jpeg") {
    fillBackground(ctx, width, height, options.backgroundColor);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  ctx.drawImage(source, 0, 0, width, height);

  const mimeType =
    options.outputFormat === "jpeg"
      ? "image/jpeg"
      : options.outputFormat === "webp"
        ? "image/webp"
        : "image/png";

  const quality =
    options.outputFormat === "png" ? undefined : Math.min(1, Math.max(0.1, options.quality));

  const blob = await canvasToBlob(canvas, mimeType, quality);
  const previewUrl = URL.createObjectURL(blob);
  return { blob, width, height, previewUrl };
}

export async function rasterizeObjectUrl(
  objectUrl: string,
  options: RasterizeOptions,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> {
  const image = await loadHtmlImage(objectUrl);
  return rasterizeSourceToBlob(image, image.naturalWidth, image.naturalHeight, options);
}

export async function imageDataToBlob(
  imageData: ImageData,
  options: RasterizeOptions,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> {
  const canvas = createCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Your browser could not prepare an image canvas for conversion.");
  }
  if (options.flattenTransparency || options.outputFormat === "jpeg") {
    fillBackground(ctx, imageData.width, imageData.height, options.backgroundColor);
  }
  ctx.putImageData(imageData, 0, 0);

  // Re-draw through drawImage path for JPEG flattening consistency when needed
  if (options.outputFormat === "jpeg" || options.flattenTransparency) {
    return rasterizeSourceToBlob(canvas, canvas.width, canvas.height, options);
  }

  const mimeType = options.outputFormat === "webp" ? "image/webp" : "image/png";
  const blob = await canvasToBlob(
    canvas,
    mimeType,
    options.outputFormat === "png" ? undefined : options.quality,
  );
  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    previewUrl: URL.createObjectURL(blob),
  };
}
