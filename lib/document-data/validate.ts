import type { DocumentDataConfig } from "./types";
import { getExtension } from "./utils";

export function validateDocumentFile(
  file: File,
  config: DocumentDataConfig,
): string | null {
  if (!file || file.size <= 0) return "Please choose a valid file.";
  if (file.size > config.maxFileSizeBytes) {
    const mb = Math.round(config.maxFileSizeBytes / (1024 * 1024));
    return `This file is too large. Please choose a file under ${mb} MB.`;
  }
  const ext = getExtension(file.name);
  const type = (file.type || "").toLowerCase();
  const extOk = config.extensions.includes(ext);
  const mimeOk = !type || config.mimeTypes.some((m) => m.toLowerCase() === type);
  if (!extOk && !mimeOk) {
    return `Unsupported file format. Please choose a supported ${config.extensions.join(", ").toUpperCase()} file.`;
  }
  return null;
}

export function friendlyDocumentError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/Invalid JSON/i.test(message)) return message;
  if (/YAML/i.test(message)) return message;
  if (/XML/i.test(message)) return message;
  if (/CSV|tabular/i.test(message)) return message;
  if (/password|encrypted/i.test(message)) {
    return "This PDF is password-protected. Unlock it first, then try again.";
  }
  if (/docx|zip|central directory/i.test(message)) {
    return "We couldn't read this DOCX file. It may be damaged or not a valid Word document.";
  }
  if (message && message.length < 180 && !/undefined|null|stack/i.test(message)) {
    return message;
  }
  return "We couldn't convert this file. Please check the input and try again.";
}
