import type { ImageEditorConfig } from "./types";
import { getExtension } from "./utils";

export function validateEditorFile(
  file: File | null | undefined,
  config: ImageEditorConfig,
): string | null {
  if (!file) return "Please choose an image file.";
  if (file.size <= 0) return "The selected file is empty. Please choose another image.";
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
    return "Unsupported image format. Please choose a supported image file.";
  }

  if (extensionOk && mime && !mimeOk && mime !== "application/octet-stream") {
    return "Unsupported image format. Please choose a supported image file.";
  }

  return null;
}
