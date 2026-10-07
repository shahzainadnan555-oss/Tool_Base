import {
  canvasToBlob,
  createCanvas,
  formatBytes,
  getExtension,
  loadHtmlImage,
  revokeObjectUrl,
} from "@/lib/image-converter/utils";
import type { EditorImageFile, OutputMime } from "./types";

export { formatBytes, getExtension, loadHtmlImage, revokeObjectUrl, canvasToBlob, createCanvas };

export function buildProcessedFileName(
  originalName: string,
  suffix: string,
  extension: string,
): string {
  const cleaned = originalName.trim() || "image";
  const base = cleaned.replace(/\.[^.]+$/, "") || "image";
  const safeSuffix = suffix.replace(/^\-+|\-+$/g, "");
  return `${base}-${safeSuffix}.${extension.replace(/^\./, "")}`;
}

export function extensionForMime(mime: OutputMime): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "png";
}

export function mimeFromFile(file: File, fallback: OutputMime = "image/png"): OutputMime {
  const type = file.type.toLowerCase();
  if (type === "image/jpeg" || type === "image/jpg") return "image/jpeg";
  if (type === "image/webp") return "image/webp";
  if (type === "image/png") return "image/png";
  const ext = getExtension(file.name);
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "png") return "image/png";
  return fallback;
}

export async function fileToImageElement(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await loadHtmlImage(url);
  } finally {
    // Keep blob alive via caller preview URL; revoke temporary only if different
    // Caller manages previewUrl. This temp URL can be revoked after decode if we
    // draw to canvas immediately. For Image element we need the URL while loading.
    URL.revokeObjectURL(url);
  }
}

export async function loadEditorImage(file: File): Promise<EditorImageFile> {
  const previewUrl = URL.createObjectURL(file);
  try {
    let width = 0;
    let height = 0;

    // Prefer createImageBitmap for faster decode when available.
    if (typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(file);
        width = bitmap.width;
        height = bitmap.height;
        bitmap.close();
      } catch {
        // Fall through to HTMLImageElement decode.
      }
    }

    if (!width || !height) {
      const image = await loadHtmlImage(previewUrl);
      width = image.naturalWidth;
      height = image.naturalHeight;
    }

    return {
      file,
      previewUrl,
      name: file.name,
      type: file.type || `image/${getExtension(file.name) || "png"}`,
      sizeBytes: file.size,
      width,
      height,
    };
  } catch (error) {
    revokeObjectUrl(previewUrl);
    throw error;
  }
}

export async function drawImageToCanvas(
  source: CanvasImageSource,
  width: number,
  height: number,
  options?: { background?: string },
): Promise<HTMLCanvasElement> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
  if (options?.background) {
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

export async function imageFileToCanvas(file: File): Promise<{
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  image: HTMLImageElement;
  objectUrl: string;
}> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadHtmlImage(objectUrl);
    const canvas = await drawImageToCanvas(image, image.naturalWidth, image.naturalHeight);
    return { canvas, width: image.naturalWidth, height: image.naturalHeight, image, objectUrl };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

export function reductionPercent(original: number, compressed: number): string {
  if (original <= 0) return "0%";
  const value = ((original - compressed) / original) * 100;
  return `${Math.max(0, value).toFixed(1)}%`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "").trim();
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
