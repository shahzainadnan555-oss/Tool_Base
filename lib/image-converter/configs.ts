import {
  DEFAULT_MAX_IMAGE_BYTES,
  type ImageConverterConfig,
  type ImageConverterKind,
  type ImageOutputFormat,
} from "./types";

function config(partial: Omit<ImageConverterConfig, "maxFileSizeBytes" | "quality" | "backgroundColor"> & {
  maxFileSizeBytes?: number;
  quality?: number;
  backgroundColor?: string;
}): ImageConverterConfig {
  return {
    maxFileSizeBytes: DEFAULT_MAX_IMAGE_BYTES,
    quality: 0.92,
    backgroundColor: "#ffffff",
    ...partial,
  };
}

function raster(
  slug: string,
  inputLabel: string,
  outputLabel: string,
  extensions: string[],
  mimeTypes: string[],
  outputFormat: Exclude<ImageOutputFormat, "svg" | "ico">,
  kind: ImageConverterKind,
  extras: Partial<ImageConverterConfig> = {},
): ImageConverterConfig {
  const outputExtension = outputFormat === "jpeg" ? "jpg" : outputFormat;
  const outputMimeType =
    outputFormat === "jpeg"
      ? "image/jpeg"
      : outputFormat === "webp"
        ? "image/webp"
        : "image/png";

  return config({
    slug,
    label: `${inputLabel} to ${outputLabel}`,
    inputLabel,
    outputLabel,
    accept: [...extensions.map((ext) => `.${ext}`), ...mimeTypes].join(","),
    extensions,
    mimeTypes,
    outputFormat,
    outputExtension,
    outputMimeType,
    kind,
    flattenTransparency: outputFormat === "jpeg",
    notices: extras.notices ?? [],
    supportsSvgDimensions: extras.supportsSvgDimensions,
    ...extras,
  });
}

export const imageConverterConfigs: Record<string, ImageConverterConfig> = {
  "jpg-to-png": raster("jpg-to-png", "JPG", "PNG", ["jpg", "jpeg"], ["image/jpeg"], "png", "standard"),
  "png-to-jpg": raster(
    "png-to-jpg",
    "PNG",
    "JPG",
    ["png"],
    ["image/png"],
    "jpeg",
    "standard",
    {
      notices: [
        "JPG does not support transparency. Transparent areas are filled with a white background.",
      ],
    },
  ),
  "jpg-to-webp": raster("jpg-to-webp", "JPG", "WebP", ["jpg", "jpeg"], ["image/jpeg"], "webp", "standard"),
  "webp-to-jpg": raster(
    "webp-to-jpg",
    "WebP",
    "JPG",
    ["webp"],
    ["image/webp"],
    "jpeg",
    "standard",
    {
      notices: [
        "JPG does not support transparency. Transparent WebP areas are filled with a white background.",
      ],
    },
  ),
  "png-to-webp": raster("png-to-webp", "PNG", "WebP", ["png"], ["image/png"], "webp", "standard", {
    notices: ["Transparent PNG areas are preserved when your browser’s WebP encoder supports alpha."],
  }),
  "webp-to-png": raster("webp-to-png", "WebP", "PNG", ["webp"], ["image/webp"], "png", "standard"),
  "gif-to-png": raster("gif-to-png", "GIF", "PNG", ["gif"], ["image/gif"], "png", "standard", {
    notices: [
      "Animated GIFs are converted using the first visible frame. PNG is a still image and cannot preserve animation.",
    ],
  }),
  "gif-to-jpg": raster("gif-to-jpg", "GIF", "JPG", ["gif"], ["image/gif"], "jpeg", "standard", {
    notices: [
      "Animated GIFs are converted using the first visible frame. JPG is a still image and cannot preserve animation.",
    ],
  }),
  "bmp-to-jpg": raster("bmp-to-jpg", "BMP", "JPG", ["bmp"], ["image/bmp", "image/x-bmp"], "jpeg", "standard"),
  "bmp-to-png": raster("bmp-to-png", "BMP", "PNG", ["bmp"], ["image/bmp", "image/x-bmp"], "png", "standard"),
  "tiff-to-jpg": raster(
    "tiff-to-jpg",
    "TIFF",
    "JPG",
    ["tif", "tiff"],
    ["image/tiff", "image/tif"],
    "jpeg",
    "tiff",
  ),
  "tiff-to-png": raster(
    "tiff-to-png",
    "TIFF",
    "PNG",
    ["tif", "tiff"],
    ["image/tiff", "image/tif"],
    "png",
    "tiff",
  ),
  "svg-to-png": raster("svg-to-png", "SVG", "PNG", ["svg"], ["image/svg+xml"], "png", "svg-raster", {
    supportsSvgDimensions: true,
  }),
  "svg-to-jpg": raster("svg-to-jpg", "SVG", "JPG", ["svg"], ["image/svg+xml"], "jpeg", "svg-raster", {
    supportsSvgDimensions: true,
    notices: [
      "JPG does not support transparency. Transparent SVG areas are filled with a white background.",
    ],
  }),
  "png-to-svg": config({
    slug: "png-to-svg",
    label: "PNG to SVG",
    inputLabel: "PNG",
    outputLabel: "SVG",
    accept: ".png,image/png",
    extensions: ["png"],
    mimeTypes: ["image/png"],
    outputFormat: "svg",
    outputExtension: "svg",
    outputMimeType: "image/svg+xml",
    kind: "png-to-svg",
    flattenTransparency: false,
    notices: [
      "PNG images are raster images. This tool converts raster artwork into an SVG-style vector representation, and results may vary depending on image complexity.",
    ],
  }),
  "ico-to-png": raster("ico-to-png", "ICO", "PNG", ["ico"], ["image/x-icon", "image/vnd.microsoft.icon"], "png", "ico-to-raster"),
  "png-to-ico": config({
    slug: "png-to-ico",
    label: "PNG to ICO",
    inputLabel: "PNG",
    outputLabel: "ICO",
    accept: ".png,image/png",
    extensions: ["png"],
    mimeTypes: ["image/png"],
    outputFormat: "ico",
    outputExtension: "ico",
    outputMimeType: "image/x-icon",
    kind: "png-to-ico",
    flattenTransparency: false,
    notices: ["Creates a 256×256 ICO containing a PNG image payload suitable for modern icon use."],
  }),
  "heic-to-jpg": raster(
    "heic-to-jpg",
    "HEIC",
    "JPG",
    ["heic", "heif"],
    ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"],
    "jpeg",
    "heic",
  ),
  "heic-to-png": raster(
    "heic-to-png",
    "HEIC",
    "PNG",
    ["heic", "heif"],
    ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"],
    "png",
    "heic",
  ),
  "avif-to-jpg": raster("avif-to-jpg", "AVIF", "JPG", ["avif"], ["image/avif"], "jpeg", "standard", {
    notices: [
      "AVIF decoding depends on your browser. If conversion fails, try another browser or a different AVIF file.",
    ],
  }),
};

export function getImageConverterConfig(slug: string): ImageConverterConfig | undefined {
  return imageConverterConfigs[slug];
}

export function isImageConverterSlug(slug: string): boolean {
  return Boolean(imageConverterConfigs[slug]);
}

export const imageConverterSlugs = Object.keys(imageConverterConfigs);
