import { imageDataToBlob, rasterizeObjectUrl, type RasterizeOptions } from "./rasterize";
import { fileToArrayBuffer } from "./utils";

type UtifModule = {
  decode: (buffer: ArrayBuffer) => Array<{ width: number; height: number; data?: Uint8Array }>;
  decodeImage: (buffer: ArrayBuffer, ifd: { width: number; height: number; data?: Uint8Array }) => void;
  toRGBA8: (ifd: { width: number; height: number; data?: Uint8Array }) => Uint8Array;
};

export async function convertTiffFile(
  file: File,
  options: RasterizeOptions,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> {
  const UTIF = (await import("utif")) as unknown as UtifModule;
  const buffer = await fileToArrayBuffer(file);
  const ifds = UTIF.decode(buffer);
  if (!ifds.length) {
    throw new Error("We couldn't read this TIFF file. It may be unsupported or damaged.");
  }

  const page = ifds[0];
  UTIF.decodeImage(buffer, page);
  const rgba = UTIF.toRGBA8(page);
  const clamped = new Uint8ClampedArray(rgba.length);
  clamped.set(rgba);
  const imageData = new ImageData(clamped, page.width, page.height);
  return imageDataToBlob(imageData, options);
}

export async function convertHeicFile(
  file: File,
  options: RasterizeOptions,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> {
  const mod = (await import("heic2any")) as unknown as {
    default?: (opts: {
      blob: Blob;
      toType?: string;
      quality?: number;
    }) => Promise<Blob | Blob[]>;
  } & ((opts: {
    blob: Blob;
    toType?: string;
    quality?: number;
  }) => Promise<Blob | Blob[]>);

  const heic2any = mod.default ?? mod;
  let converted: Blob | Blob[];
  try {
    converted = await heic2any({
      blob: file,
      toType: "image/png",
      quality: 0.92,
    });
  } catch {
    throw new Error(
      "We couldn't decode this HEIC/HEIF image. Please try another file.",
    );
  }

  const pngBlob = Array.isArray(converted) ? converted[0] : converted;
  if (!pngBlob) {
    throw new Error("HEIC conversion did not produce an image. Please try another file.");
  }

  const objectUrl = URL.createObjectURL(pngBlob);
  try {
    return await rasterizeObjectUrl(objectUrl, options);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
