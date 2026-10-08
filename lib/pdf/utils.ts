import { formatBytes, getExtension, revokeObjectUrl } from "@/lib/image-converter/utils";

export { formatBytes, getExtension, revokeObjectUrl };

export function buildPdfOutputName(
  originalName: string,
  suffix: string,
  extension: string,
): string {
  const cleaned = originalName.trim() || "document";
  const base = cleaned.replace(/\.[^.]+$/, "") || "document";
  const safeSuffix = suffix.replace(/^-+|-+$/g, "");
  const ext = extension.replace(/^\./, "");
  if (!safeSuffix) return `${base}.${ext}`;
  return `${base}-${safeSuffix}.${ext}`;
}

export function createFileId(): string {
  return `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Parse "1-3,5,8-10" into 1-based page numbers (unique, sorted). */
export function parsePageSelection(input: string, pageCount: number): number[] {
  const text = input.trim();
  if (!text || /^all$/i.test(text)) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  for (const part of text.split(/[,;\s]+/).filter(Boolean)) {
    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      let start = Number(range[1]);
      let end = Number(range[2]);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      if (start > end) [start, end] = [end, start];
      for (let p = start; p <= end; p += 1) {
        if (p >= 1 && p <= pageCount) pages.add(p);
      }
      continue;
    }
    const single = Number(part);
    if (Number.isFinite(single) && single >= 1 && single <= pageCount) {
      pages.add(single);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

/** Parse split ranges preserving each range as a separate group. */
export function parseSplitRanges(input: string, pageCount: number): number[][] {
  const text = input.trim();
  if (!text) return [];
  const groups: number[][] = [];
  for (const part of text.split(/[,;]+/).map((s) => s.trim()).filter(Boolean)) {
    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      let start = Number(range[1]);
      let end = Number(range[2]);
      if (start > end) [start, end] = [end, start];
      const pages: number[] = [];
      for (let p = start; p <= end; p += 1) {
        if (p >= 1 && p <= pageCount) pages.push(p);
      }
      if (pages.length) groups.push(pages);
      continue;
    }
    const single = Number(part);
    if (Number.isFinite(single) && single >= 1 && single <= pageCount) {
      groups.push([single]);
    }
  }
  return groups;
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

export async function blobFromCanvas(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Could not encode the image."));
        else resolve(blob);
      },
      mime,
      quality,
    );
  });
}
