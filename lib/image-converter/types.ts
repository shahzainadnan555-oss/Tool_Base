export type RasterOutputFormat = "png" | "jpeg" | "webp";
export type ImageOutputFormat = RasterOutputFormat | "svg" | "ico";

export type ImageConverterKind =
  | "standard"
  | "svg-raster"
  | "png-to-svg"
  | "tiff"
  | "heic"
  | "ico-to-raster"
  | "png-to-ico";

export interface ImageConverterConfig {
  slug: string;
  label: string;
  inputLabel: string;
  outputLabel: string;
  accept: string;
  extensions: string[];
  mimeTypes: string[];
  outputFormat: ImageOutputFormat;
  outputExtension: string;
  outputMimeType: string;
  kind: ImageConverterKind;
  maxFileSizeBytes: number;
  flattenTransparency: boolean;
  backgroundColor: string;
  quality: number;
  supportsSvgDimensions?: boolean;
  notices: string[];
}

export interface ConversionResult {
  blob: Blob;
  previewUrl: string;
  fileName: string;
  outputMimeType: string;
  outputExtension: string;
  width: number;
  height: number;
  sizeBytes: number;
  notice?: string;
}

export interface SelectedImageFile {
  file: File;
  previewUrl: string;
  name: string;
  type: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export const DEFAULT_MAX_IMAGE_BYTES = 40 * 1024 * 1024;
