/**
 * Apply a refined cutout alpha (and edge RGB) onto the original full-resolution
 * image so solid subject pixels keep native detail while edges stay soft/clean.
 */

async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("We couldn't prepare the result image.");
  return blob;
}

export async function compositeCutoutOntoOriginal(
  refinedCutout: Blob,
  original: Blob | File,
  targetWidth: number,
  targetHeight: number,
): Promise<Blob> {
  const [cutoutBmp, originalBmp] = await Promise.all([
    createImageBitmap(refinedCutout),
    createImageBitmap(original),
  ]);

  try {
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("We couldn't prepare the result image.");

    // Base: original photograph at full resolution.
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(originalBmp, 0, 0, targetWidth, targetHeight);
    const base = ctx.getImageData(0, 0, targetWidth, targetHeight);

    // Cutout scaled to the same size for alpha + edge colors.
    const cutoutCanvas = document.createElement("canvas");
    cutoutCanvas.width = targetWidth;
    cutoutCanvas.height = targetHeight;
    const cutoutCtx = cutoutCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!cutoutCtx) throw new Error("We couldn't prepare the result image.");
    cutoutCtx.imageSmoothingEnabled = true;
    cutoutCtx.imageSmoothingQuality = "high";
    cutoutCtx.clearRect(0, 0, targetWidth, targetHeight);
    cutoutCtx.drawImage(cutoutBmp, 0, 0, targetWidth, targetHeight);
    const cutout = cutoutCtx.getImageData(0, 0, targetWidth, targetHeight);

    const out = base.data;
    const src = cutout.data;

    for (let i = 0; i < out.length; i += 4) {
      const a = src[i + 3];
      if (a <= 2) {
        out[i] = 0;
        out[i + 1] = 0;
        out[i + 2] = 0;
        out[i + 3] = 0;
      } else if (a >= 250) {
        // Keep original RGB for solid foreground — maximum subject fidelity.
        out[i + 3] = 255;
      } else {
        // Soft edge: use refined cutout RGB (decontaminated) + model alpha.
        out[i] = src[i];
        out[i + 1] = src[i + 1];
        out[i + 2] = src[i + 2];
        out[i + 3] = a;
      }
    }

    ctx.putImageData(base, 0, 0);
    return canvasToPngBlob(canvas);
  } finally {
    cutoutBmp.close();
    originalBmp.close();
  }
}
