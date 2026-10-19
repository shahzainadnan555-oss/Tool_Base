import { FILE_TOO_LARGE_MESSAGE } from "@/lib/uploads/limits";
import type { PdfToolConfig } from "./types";
import { getExtension } from "./utils";

export function validatePdfUpload(
  file: File,
  config: PdfToolConfig,
): string | null {
  if (!file || file.size <= 0) {
    return "Please choose a valid file.";
  }
  if (file.size > config.maxFileSizeBytes) {
    return FILE_TOO_LARGE_MESSAGE;
  }

  const ext = getExtension(file.name);
  const type = (file.type || "").toLowerCase();
  const extOk = config.extensions.includes(ext);
  const mimeOk = !type || config.mimeTypes.some((m) => m.toLowerCase() === type);

  if (!extOk && !mimeOk) {
    if (config.kind === "images-to-pdf") {
      return "Unsupported image format. Please choose a supported image file.";
    }
    return "Unsupported file format. Please choose a supported PDF file.";
  }

  return null;
}

export function friendlyPdfError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/password|encrypted/i.test(message)) {
    return "This PDF is password-protected. Unlock it first or provide the correct password.";
  }
  if (/Invalid PDF|pdf format|corrupt|Failed to parse/i.test(message)) {
    return "We couldn't read this PDF. The file may be damaged or unsupported.";
  }
  if (/memory|allocation|out of memory/i.test(message)) {
    return "This browser ran out of memory while processing the PDF. The file passed the size check, but this device could not finish it.";
  }
  if (message && message.length < 160 && !/stack|undefined|null/i.test(message)) {
    return message;
  }
  return "We couldn't process this PDF. Please try another file.";
}
