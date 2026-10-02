import { createCanvas, loadHtmlImage } from "./utils";
import { rasterizeSourceToBlob, type RasterizeOptions } from "./rasterize";

export interface SvgRenderOptions extends RasterizeOptions {
  targetWidth?: number;
  targetHeight?: number;
  maintainAspectRatio?: boolean;
}

async function prepareSvgUrl(file: File): Promise<string> {
  const text = await file.text();
  if (!text.includes("<svg")) {
    throw new Error("This file does not look like a valid SVG.");
  }
  const blob = new Blob([text], { type: "image/svg+xml" });
  return URL.createObjectURL(blob);
}

export async function convertSvgToRaster(
  file: File,
  options: SvgRenderOptions,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> {
  const svgUrl = await prepareSvgUrl(file);
  try {
    const image = await loadHtmlImage(svgUrl);
    let width = options.targetWidth ?? (image.naturalWidth || 1024);
    let height = options.targetHeight ?? (image.naturalHeight || 1024);

    if (
      options.maintainAspectRatio !== false &&
      options.targetWidth &&
      !options.targetHeight &&
      image.naturalWidth > 0
    ) {
      height = Math.round((options.targetWidth / image.naturalWidth) * image.naturalHeight);
    } else if (
      options.maintainAspectRatio !== false &&
      options.targetHeight &&
      !options.targetWidth &&
      image.naturalHeight > 0
    ) {
      width = Math.round((options.targetHeight / image.naturalHeight) * image.naturalWidth);
    }

    return rasterizeSourceToBlob(image, image.naturalWidth || width, image.naturalHeight || height, {
      ...options,
      targetWidth: width,
      targetHeight: height,
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export async function convertPngToSvg(file: File): Promise<{
  blob: Blob;
  width: number;
  height: number;
  previewUrl: string;
  notice?: string;
}> {
  const ImageTracerModule = (await import("imagetracerjs")) as unknown as {
    default?: {
      imagedataToSVG: (
        data: ImageData,
        options?: Record<string, number | string | boolean>,
      ) => string;
    };
    imagedataToSVG?: (
      data: ImageData,
      options?: Record<string, number | string | boolean>,
    ) => string;
  };

  const tracer = ImageTracerModule.default ?? ImageTracerModule;
  if (!tracer.imagedataToSVG) {
    throw new Error("SVG tracing library failed to load. Please try again.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadHtmlImage(objectUrl);
    const maxSide = 900;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Your browser could not prepare an image canvas for conversion.");
    }
    ctx.drawImage(image, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);

    const svg = tracer.imagedataToSVG(imageData, {
      ltres: 1,
      qtres: 1,
      pathomit: 8,
      colorsampling: 2,
      numberofcolors: 16,
      mincolorratio: 0.02,
      colorquantcycles: 3,
      scale: 1,
      viewbox: true,
    });

    if (!svg || !svg.includes("<svg")) {
      throw new Error("Vectorization did not produce a valid SVG. Try a simpler graphic.");
    }

    const blob = new Blob([svg], { type: "image/svg+xml" });
    return {
      blob,
      width,
      height,
      previewUrl: URL.createObjectURL(blob),
      notice:
        "PNG images are raster images. This tool converts raster artwork into an SVG-style vector representation, and results may vary depending on image complexity.",
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
