import type { ConversionResult, ImageConverterConfig, SelectedImageFile } from "./types";
import { convertHeicFile, convertTiffFile } from "./decoders";
import { convertIcoToRaster, convertPngToIco } from "./ico";
import { rasterizeObjectUrl, type RasterizeOptions } from "./rasterize";
import { convertPngToSvg, convertSvgToRaster } from "./svg";
import { buildOutputFileName, friendlyError, revokeObjectUrl } from "./utils";

export interface ConvertImageOptions {
  targetWidth?: number;
  targetHeight?: number;
  maintainAspectRatio?: boolean;
  icoSize?: number;
}

function toRasterOptions(
  config: ImageConverterConfig,
  options?: ConvertImageOptions,
): RasterizeOptions {
  if (config.outputFormat === "svg" || config.outputFormat === "ico") {
    throw new Error("Invalid raster output configuration.");
  }

  return {
    flattenTransparency: config.flattenTransparency,
    backgroundColor: config.backgroundColor,
    outputFormat: config.outputFormat,
    quality: config.quality,
    targetWidth: options?.targetWidth,
    targetHeight: options?.targetHeight,
  };
}

export async function convertImageFile(
  selected: SelectedImageFile,
  config: ImageConverterConfig,
  options?: ConvertImageOptions,
): Promise<ConversionResult> {
  try {
    let result: {
      blob: Blob;
      width: number;
      height: number;
      previewUrl: string;
      notice?: string;
    };

    switch (config.kind) {
      case "standard":
        result = await rasterizeObjectUrl(selected.previewUrl, toRasterOptions(config, options));
        break;
      case "svg-raster":
        result = await convertSvgToRaster(selected.file, {
          ...toRasterOptions(config, options),
          targetWidth: options?.targetWidth,
          targetHeight: options?.targetHeight,
          maintainAspectRatio: options?.maintainAspectRatio ?? true,
        });
        break;
      case "png-to-svg":
        result = await convertPngToSvg(selected.file);
        break;
      case "tiff":
        result = await convertTiffFile(selected.file, toRasterOptions(config, options));
        break;
      case "heic":
        result = await convertHeicFile(selected.file, toRasterOptions(config, options));
        break;
      case "ico-to-raster":
        result = await convertIcoToRaster(selected.file, toRasterOptions(config, options));
        break;
      case "png-to-ico":
        result = await convertPngToIco(selected.file, options?.icoSize ?? 256);
        break;
      default:
        throw new Error("Unsupported conversion type.");
    }

    if (!result.blob || result.blob.size <= 0) {
      revokeObjectUrl(result.previewUrl);
      throw new Error("Conversion produced an empty file. Please try another image.");
    }

    const noticeParts = [...config.notices];
    if (result.notice) noticeParts.push(result.notice);

    return {
      blob: result.blob,
      previewUrl: result.previewUrl,
      fileName: buildOutputFileName(selected.name, config.outputExtension),
      outputMimeType: config.outputMimeType,
      outputExtension: config.outputExtension,
      width: result.width,
      height: result.height,
      sizeBytes: result.blob.size,
      notice: noticeParts.length ? noticeParts.join(" ") : undefined,
    };
  } catch (error) {
    throw new Error(
      friendlyError(
        error,
        "We couldn't convert this image. Please try another file or a supported format.",
      ),
    );
  }
}

export function downloadBlob(blob: Blob, fileName: string): void {
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
