import type { ImageConverterConfig } from "./types";
import { getExtension } from "./utils";

export function validateImageFile(
  file: File | null | undefined,
  config: ImageConverterConfig,
): string | null {
  if (!file) {
    return "Please choose an image file to convert.";
  }

  if (file.size <= 0) {
    return "The selected file is empty. Please choose another image.";
  }

  if (file.size > config.maxFileSizeBytes) {
    const mb = Math.round(config.maxFileSizeBytes / (1024 * 1024));
    return `This file is too large. Please upload an image under ${mb} MB.`;
  }

  const extension = getExtension(file.name);
  const mime = (file.type || "").toLowerCase();
  const extensionOk = config.extensions.includes(extension);
  const mimeOk =
    !mime ||
    config.mimeTypes.some((allowed) => allowed.toLowerCase() === mime) ||
    mime === "application/octet-stream";

  if (!extensionOk && !mimeOk) {
    const article = /^[aeiou]/i.test(config.inputLabel) ? "an" : "a";
    return `Unsupported file type. Please upload ${article} ${config.inputLabel} image.`;
  }

  if (!extensionOk && mimeOk) {
    // Allow MIME-only match for some mobile cameras, but warn via soft pass.
    return null;
  }

  if (extensionOk && mime && !mimeOk && mime !== "application/octet-stream") {
    const article = /^[aeiou]/i.test(config.inputLabel) ? "an" : "a";
    return `Unsupported file type. Please upload ${article} ${config.inputLabel} image.`;
  }

  return null;
}
