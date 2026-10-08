import { formatBytes, getExtension, revokeObjectUrl } from "@/lib/image-converter/utils";

export { formatBytes, getExtension, revokeObjectUrl };

export function buildOutputName(
  originalName: string,
  suffix: string,
  extension: string,
): string {
  const cleaned = (originalName || "document").trim() || "document";
  const base = cleaned.replace(/\.[^.]+$/, "") || "document";
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
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export async function readFileAsText(file: File): Promise<string> {
  return file.text();
}

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

/** Strip common RTF control words into plain text. */
export function stripRtf(rtf: string): string {
  let text = rtf.replace(/\r\n?/g, "\n");
  text = text.replace(/\{\\\*\\[^{}]*\}/g, "");
  text = text.replace(/\\'[0-9a-fA-F]{2}/g, (match) => {
    const code = Number.parseInt(match.slice(2), 16);
    return Number.isFinite(code) ? String.fromCharCode(code) : "";
  });
  text = text.replace(/\\u(-?\d+)\??/g, (_, n) => {
    const code = Number(n);
    return Number.isFinite(code) ? String.fromCharCode(code < 0 ? code + 65536 : code) : "";
  });
  text = text.replace(/\\par[d]?/g, "\n");
  text = text.replace(/\\line/g, "\n");
  text = text.replace(/\\tab/g, "\t");
  text = text.replace(/\\[a-z]+(-?\d+)?[ ]?/gi, "");
  text = text.replace(/[{}]/g, "");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
