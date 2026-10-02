import {
  DEFAULT_EDITOR_MAX_BYTES,
  type ImageEditorConfig,
  type ImageEditorKind,
} from "./types";

const COMMON_ACCEPT =
  ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
const COMMON_EXTS = ["jpg", "jpeg", "png", "webp"];
const COMMON_MIMES = ["image/jpeg", "image/png", "image/webp"];

function editor(
  partial: Omit<
    ImageEditorConfig,
    "maxFileSizeBytes" | "accept" | "extensions" | "mimeTypes" | "notices"
  > & {
    maxFileSizeBytes?: number;
    accept?: string;
    extensions?: string[];
    mimeTypes?: string[];
    notices?: string[];
  },
): ImageEditorConfig {
  return {
    maxFileSizeBytes: DEFAULT_EDITOR_MAX_BYTES,
    accept: COMMON_ACCEPT,
    extensions: COMMON_EXTS,
    mimeTypes: COMMON_MIMES,
    ...partial,
    notices: partial.notices ?? [],
  };
}

function make(
  slug: string,
  kind: ImageEditorKind,
  actionLabel: string,
  filenameSuffix: string,
  extras: Partial<ImageEditorConfig> = {},
): ImageEditorConfig {
  return editor({
    slug,
    kind,
    actionLabel,
    processingLabel: "Processing...",
    resetLabel: "Process Another Image",
    filenameSuffix,
    ...extras,
  });
}

export const imageEditorConfigs: Record<string, ImageEditorConfig> = {
  "image-compressor": make("image-compressor", "compress", "Compress Image", "compressed", {
    notices: ["Compression uses lossy encoding where needed. Transparent PNGs keep alpha when possible."],
  }),
  "jpg-compressor": make("jpg-compressor", "compress", "Compress JPG", "compressed", {
    lockedFormat: "jpeg",
    accept: ".jpg,.jpeg,image/jpeg",
    extensions: ["jpg", "jpeg"],
    mimeTypes: ["image/jpeg"],
    forceOutputMime: "image/jpeg",
    forceOutputExtension: "jpg",
    notices: ["This tool accepts JPG/JPEG images and outputs a compressed JPG file."],
  }),
  "png-compressor": make("png-compressor", "compress", "Compress PNG", "compressed", {
    lockedFormat: "png",
    accept: ".png,image/png",
    extensions: ["png"],
    mimeTypes: ["image/png"],
    forceOutputMime: "image/png",
    forceOutputExtension: "png",
    notices: [
      "PNG compression preserves transparency. Size reduction depends on the image content and may be modest for already-optimized PNGs.",
    ],
  }),
  "webp-compressor": make("webp-compressor", "compress", "Compress WebP", "compressed", {
    lockedFormat: "webp",
    accept: ".webp,image/webp",
    extensions: ["webp"],
    mimeTypes: ["image/webp"],
    forceOutputMime: "image/webp",
    forceOutputExtension: "webp",
  }),
  "image-resizer": make("image-resizer", "resize", "Resize Image", "resized"),
  "image-cropper": make("image-cropper", "crop", "Crop Image", "cropped"),
  "image-rotator": make("image-rotator", "rotate", "Apply Rotation", "rotated", {
    resetLabel: "Edit Another Image",
  }),
  "image-flipper": make("image-flipper", "flip", "Apply Flip", "flipped", {
    resetLabel: "Edit Another Image",
  }),
  "image-metadata-viewer": make(
    "image-metadata-viewer",
    "metadata-viewer",
    "View Metadata",
    "metadata",
    { resetLabel: "Check Another Image" },
  ),
  "exif-remover": make("exif-remover", "exif-remover", "Remove Metadata", "no-exif", {
    notices: [
      "This tool removes common EXIF metadata by re-encoding the image. Some non-EXIF embedded data may remain depending on format.",
    ],
  }),
  "image-dpi-changer": make("image-dpi-changer", "dpi-changer", "Change DPI", "dpi", {
    notices: [
      "DPI/PPI metadata affects print and display interpretation. Changing DPI does not create new image detail or improve sharpness.",
    ],
  }),
  "image-quality-changer": make(
    "image-quality-changer",
    "quality",
    "Apply Quality",
    "quality",
    {
      notices: ["Quality adjustment uses lossy encoding for JPG and WebP. PNG output preserves alpha."],
    },
  ),
  "image-sharpener": make("image-sharpener", "sharpen", "Apply Sharpen", "sharpened", {
    resetLabel: "Edit Another Image",
  }),
  "image-blur": make("image-blur", "blur", "Apply Blur", "blurred", {
    resetLabel: "Edit Another Image",
  }),
  "image-pixelator": make("image-pixelator", "pixelate", "Apply Pixelation", "pixelated", {
    resetLabel: "Edit Another Image",
  }),
  "rounded-image-generator": make(
    "rounded-image-generator",
    "rounded",
    "Create Rounded Image",
    "rounded",
    {
      forceOutputMime: "image/png",
      forceOutputExtension: "png",
      notices: ["Rounded corners are exported as PNG so transparent corners can be preserved."],
    },
  ),
  "circular-image-cropper": make(
    "circular-image-cropper",
    "circular",
    "Create Circular Image",
    "circular",
    {
      forceOutputMime: "image/png",
      forceOutputExtension: "png",
      notices: ["Circular results are exported as PNG with transparent corners outside the circle."],
    },
  ),
  "image-border-generator": make(
    "image-border-generator",
    "border",
    "Add Border",
    "border",
    { resetLabel: "Edit Another Image" },
  ),
  "background-remover": make(
    "background-remover",
    "background-remover",
    "Remove Background",
    "no-background",
    {
      forceOutputMime: "image/png",
      forceOutputExtension: "png",
      processingLabel: "Removing background…",
      notices: [],
      resetLabel: "Remove Another Image",
    },
  ),
  "image-color-picker": make(
    "image-color-picker",
    "color-picker",
    "Pick Color",
    "color",
    { resetLabel: "Pick From Another Image" },
  ),
};

export function getImageEditorConfig(slug: string): ImageEditorConfig | undefined {
  return imageEditorConfigs[slug];
}

export function isImageEditorSlug(slug: string): boolean {
  return Boolean(imageEditorConfigs[slug]);
}

export const imageEditorSlugs = Object.keys(imageEditorConfigs);
