/**
 * Edge-aware alpha refinement for background-removal cutouts.
 * Improves hair/fur edges, reduces speckles/holes, and decontaminates halos
 * without globally blurring the subject.
 *
 * Large images are refined on a capped working resolution; the refined alpha
 * is then applied back to the original-resolution RGB so output size is preserved.
 */

export interface RefineCutoutResult {
  blob: Blob;
  width: number;
  height: number;
  /** Share of pixels with alpha > 127 (0–1). */
  foregroundRatio: number;
  /** Share of pixels with alpha in (8, 247) — soft edge band. */
  softEdgeRatio: number;
}

const MAX_REFINE_LONG_EDGE = 1536;

function createWorkCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("We couldn't prepare the result image.");
  return blob;
}

function yieldToUi(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
    } else {
      queueMicrotask(resolve);
    }
  });
}

function morphAlpha(
  src: Uint8ClampedArray,
  width: number,
  height: number,
  mode: "dilate" | "erode",
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(src.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let value = mode === "dilate" ? 0 : 255;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = Math.min(width - 1, Math.max(0, x + dx));
          const ny = Math.min(height - 1, Math.max(0, y + dy));
          const a = src[(ny * width + nx) * 4 + 3];
          value = mode === "dilate" ? Math.max(value, a) : Math.min(value, a);
        }
      }
      const i = (y * width + x) * 4;
      out[i] = src[i];
      out[i + 1] = src[i + 1];
      out[i + 2] = src[i + 2];
      out[i + 3] = value;
    }
  }
  return out;
}

function softenTransitionBand(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): void {
  const alpha = new Uint8Array(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    alpha[p] = data[i + 3];
  }

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      const a = alpha[p];
      if (a <= 8 || a >= 247) continue;

      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          sum += alpha[(y + dy) * width + (x + dx)];
          count += 1;
        }
      }
      const blurred = Math.round(sum / count);
      data[p * 4 + 3] = Math.round(a * 0.62 + blurred * 0.38);
    }
  }
}

function decontaminateEdges(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): void {
  const copy = new Uint8ClampedArray(data);

  for (let y = 2; y < height - 2; y += 1) {
    for (let x = 2; x < width - 2; x += 1) {
      const i = (y * width + x) * 4;
      const a = copy[i + 3];
      if (a <= 16 || a >= 240) continue;

      let r = 0;
      let g = 0;
      let b = 0;
      let wsum = 0;

      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          const j = ((y + dy) * width + (x + dx)) * 4;
          const na = copy[j + 3];
          if (na < 220) continue;
          const weight = na / 255;
          r += copy[j] * weight;
          g += copy[j + 1] * weight;
          b += copy[j + 2] * weight;
          wsum += weight;
        }
      }

      if (wsum < 0.5) continue;

      const fr = r / wsum;
      const fg = g / wsum;
      const fb = b / wsum;
      const t = 1 - a / 255;
      const mix = Math.min(0.88, t * 1.2);
      data[i] = Math.round(copy[i] * (1 - mix) + fr * mix);
      data[i + 1] = Math.round(copy[i + 1] * (1 - mix) + fg * mix);
      data[i + 2] = Math.round(copy[i + 2] * (1 - mix) + fb * mix);
    }
  }
}

function analyzeAlpha(data: Uint8ClampedArray): {
  foregroundRatio: number;
  softEdgeRatio: number;
} {
  const pixels = data.length / 4;
  let fg = 0;
  let soft = 0;
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    if (a > 127) fg += 1;
    if (a > 8 && a < 247) soft += 1;
  }
  return {
    foregroundRatio: fg / pixels,
    softEdgeRatio: soft / pixels,
  };
}

function refinePixels(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): Uint8ClampedArray {
  // Close tiny subject holes, then open tiny background speckles.
  let pixels = morphAlpha(data, width, height, "dilate");
  pixels = morphAlpha(pixels, width, height, "erode");
  pixels = morphAlpha(pixels, width, height, "erode");
  pixels = morphAlpha(pixels, width, height, "dilate");
  softenTransitionBand(pixels, width, height);
  decontaminateEdges(pixels, width, height);
  return pixels;
}

/**
 * Refine a cutout PNG while preserving exact output dimensions.
 */
export async function refineCutoutAlpha(
  blob: Blob,
): Promise<RefineCutoutResult> {
  const bitmap = await createImageBitmap(blob);
  const fullW = bitmap.width;
  const fullH = bitmap.height;
  const longEdge = Math.max(fullW, fullH);
  const scale =
    longEdge > MAX_REFINE_LONG_EDGE ? MAX_REFINE_LONG_EDGE / longEdge : 1;
  const workW = Math.max(1, Math.round(fullW * scale));
  const workH = Math.max(1, Math.round(fullH * scale));

  try {
    const workCanvas = createWorkCanvas(workW, workH);
    const workCtx = workCanvas.getContext("2d", { willReadFrequently: true });
    if (!workCtx) throw new Error("We couldn't prepare the result image.");

    workCtx.clearRect(0, 0, workW, workH);
    workCtx.drawImage(bitmap, 0, 0, workW, workH);
    let workData = workCtx.getImageData(0, 0, workW, workH);
    await yieldToUi();
    const refinedWork = refinePixels(workData.data, workW, workH);
    await yieldToUi();
    const refinedCopy = new Uint8ClampedArray(refinedWork);
    workData = new ImageData(refinedCopy, workW, workH);
    workCtx.putImageData(workData, 0, 0);

    const stats = analyzeAlpha(refinedWork);

    // Apply refined alpha back onto original-resolution RGB.
    const fullCanvas = createWorkCanvas(fullW, fullH);
    const fullCtx = fullCanvas.getContext("2d", { willReadFrequently: true });
    if (!fullCtx) throw new Error("We couldn't prepare the result image.");

    fullCtx.clearRect(0, 0, fullW, fullH);
    fullCtx.drawImage(bitmap, 0, 0, fullW, fullH);
    const fullData = fullCtx.getImageData(0, 0, fullW, fullH);

    // Upscale refined alpha with canvas smoothing, then copy alpha channel.
    const alphaCanvas = createWorkCanvas(fullW, fullH);
    const alphaCtx = alphaCanvas.getContext("2d");
    if (!alphaCtx) throw new Error("We couldn't prepare the result image.");
    alphaCtx.imageSmoothingEnabled = true;
    alphaCtx.imageSmoothingQuality = "high";
    alphaCtx.clearRect(0, 0, fullW, fullH);
    alphaCtx.drawImage(workCanvas, 0, 0, fullW, fullH);
    const alphaData = alphaCtx.getImageData(0, 0, fullW, fullH);

    for (let i = 0; i < fullData.data.length; i += 4) {
      fullData.data[i + 3] = alphaData.data[i + 3];
    }

    // Final light decontamination at full resolution for large images only on
    // a sparse edge band would be expensive; re-run only when we did not
    // already refine at full size.
    if (scale < 1) {
      decontaminateEdges(fullData.data, fullW, fullH);
      await yieldToUi();
    }

    fullCtx.putImageData(fullData, 0, 0);
    const refined = await canvasToPngBlob(fullCanvas);

    return {
      blob: refined,
      width: fullW,
      height: fullH,
      foregroundRatio: stats.foregroundRatio,
      softEdgeRatio: stats.softEdgeRatio,
    };
  } finally {
    bitmap.close();
  }
}

/**
 * Reject obviously broken segmentation results before presenting them.
 */
export function assertPlausibleCutout(stats: {
  foregroundRatio: number;
  softEdgeRatio: number;
  byteSize: number;
}): void {
  if (stats.byteSize < 64) {
    throw new Error(
      "We couldn't remove the background from this image. Please try another image.",
    );
  }
  if (stats.foregroundRatio < 0.004 || stats.foregroundRatio > 0.995) {
    throw new Error(
      "We couldn't separate the subject from this background. Please try another image.",
    );
  }
}
