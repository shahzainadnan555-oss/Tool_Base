import imageCompression from "browser-image-compression";
import type {
  EditorImageFile,
  EditorProcessOptions,
  EditorProcessResult,
  ImageEditorConfig,
  OutputMime,
} from "./types";
import {
  buildProcessedFileName,
  canvasToBlob,
  createCanvas,
  drawImageToCanvas,
  extensionForMime,
  formatBytes,
  imageFileToCanvas,
  loadHtmlImage,
  mimeFromFile,
  reductionPercent,
} from "./utils";

async function encodeCanvas(
  canvas: HTMLCanvasElement,
  mime: OutputMime,
  quality = 0.92,
): Promise<Blob> {
  const q = mime === "image/png" ? undefined : quality;
  return canvasToBlob(canvas, mime, q);
}

async function finalize(
  blob: Blob,
  config: ImageEditorConfig,
  source: EditorImageFile,
  width: number,
  height: number,
  mime: OutputMime,
  extras?: Partial<EditorProcessResult>,
): Promise<EditorProcessResult> {
  const extension = config.forceOutputExtension ?? extensionForMime(mime);
  return {
    blob,
    previewUrl: URL.createObjectURL(blob),
    fileName: buildProcessedFileName(source.name, config.filenameSuffix, extension),
    mimeType: mime,
    sizeBytes: blob.size,
    width,
    height,
    ...extras,
  };
}

export async function compressImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const quality = Math.min(1, Math.max(0.1, (options.quality ?? 70) / 100));
  const outputMime: OutputMime =
    config.forceOutputMime ??
    (config.lockedFormat === "jpeg"
      ? "image/jpeg"
      : config.lockedFormat === "webp"
        ? "image/webp"
        : config.lockedFormat === "png"
          ? "image/png"
          : mimeFromFile(source.file));

  // browser-image-compression works best for jpeg/webp; for png preserve alpha via canvas path when needed
  if (outputMime === "image/png") {
    const { canvas, objectUrl, width, height } = await imageFileToCanvas(source.file);
    try {
      // Re-encode PNG. For further size reduction, optionally scale if quality < 90.
      let target = canvas;
      if ((options.quality ?? 80) < 85 && Math.max(width, height) > 1200) {
        const scale = 0.85 + ((options.quality ?? 80) / 100) * 0.15;
        const tw = Math.max(1, Math.round(width * scale));
        const th = Math.max(1, Math.round(height * scale));
        target = await drawImageToCanvas(canvas, tw, th);
      }
      const blob = await encodeCanvas(target, "image/png");
      return finalize(blob, config, source, target.width, target.height, "image/png", {
        stats: {
          "Original size": formatBytes(source.sizeBytes),
          "Compressed size": formatBytes(blob.size),
          Reduction: reductionPercent(source.sizeBytes, blob.size),
        },
        notice:
          blob.size >= source.sizeBytes
            ? "This PNG did not shrink further. Many PNGs are already well compressed; try a lower quality setting or a different format for smaller files."
            : undefined,
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  const file = new File([source.file], source.name, { type: source.type || outputMime });
  const compressed = await imageCompression(file, {
    maxSizeMB: Math.max(0.05, source.sizeBytes / (1024 * 1024) * quality),
    maxWidthOrHeight: options.quality && options.quality < 60 ? 2048 : 4096,
    useWebWorker: true,
    fileType: outputMime,
    initialQuality: quality,
  });

  const url = URL.createObjectURL(compressed);
  try {
    const image = await loadHtmlImage(url);
    const mime = (compressed.type as OutputMime) || outputMime;
    return finalize(
      compressed,
      config,
      source,
      image.naturalWidth,
      image.naturalHeight,
      mime,
      {
        stats: {
          "Original size": formatBytes(source.sizeBytes),
          "Compressed size": formatBytes(compressed.size),
          Reduction: reductionPercent(source.sizeBytes, compressed.size),
        },
      },
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function resizeImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const width = Math.max(1, Math.round(options.width || source.width));
  const height = Math.max(1, Math.round(options.height || source.height));
  const mime = config.forceOutputMime ?? options.outputMime ?? mimeFromFile(source.file);
  const { image, objectUrl } = await imageFileToCanvas(source.file);
  try {
    const canvas = await drawImageToCanvas(image, width, height);
    if (mime === "image/jpeg") {
      const withBg = createCanvas(width, height);
      const ctx = withBg.getContext("2d");
      if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(canvas, 0, 0);
      const blob = await encodeCanvas(withBg, mime, 0.92);
      return finalize(blob, config, source, width, height, mime);
    }
    const blob = await encodeCanvas(canvas, mime, 0.92);
    return finalize(blob, config, source, width, height, mime);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function cropImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const crop = options.crop;
  if (!crop || crop.width < 1 || crop.height < 1) {
    throw new Error("Please select a crop area before applying the crop.");
  }
  const mime = config.forceOutputMime ?? mimeFromFile(source.file, "image/png");
  const { image, objectUrl } = await imageFileToCanvas(source.file);
  try {
    const canvas = createCanvas(crop.width, crop.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, crop.width, crop.height);
    }
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height,
    );
    const blob = await encodeCanvas(canvas, mime, 0.92);
    return finalize(blob, config, source, crop.width, crop.height, mime);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function rotateImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const degrees = options.rotation ?? 90;
  const mime = config.forceOutputMime ?? mimeFromFile(source.file, "image/png");
  const { image, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    const rad = (degrees * Math.PI) / 180;
    const abs = Math.abs(degrees) % 180 === 90;
    const outW = abs ? height : width;
    const outH = abs ? width : height;
    const canvas = createCanvas(outW, outH);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
    }
    ctx.translate(outW / 2, outH / 2);
    ctx.rotate(rad);
    ctx.drawImage(image, -width / 2, -height / 2);
    const blob = await encodeCanvas(canvas, mime, 0.92);
    return finalize(blob, config, source, outW, outH, mime);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function flipImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const mime = config.forceOutputMime ?? mimeFromFile(source.file, "image/png");
  const { image, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.translate(
      options.flipHorizontal ? width : 0,
      options.flipVertical ? height : 0,
    );
    ctx.scale(options.flipHorizontal ? -1 : 1, options.flipVertical ? -1 : 1);
    ctx.drawImage(image, 0, 0);
    const blob = await encodeCanvas(canvas, mime, 0.92);
    return finalize(blob, config, source, width, height, mime);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function convolve(
  imageData: ImageData,
  kernel: number[],
  divisor?: number,
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const side = Math.sqrt(kernel.length);
  const half = Math.floor(side / 2);
  const div = (divisor ?? kernel.reduce((a, b) => a + b, 0)) || 1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let ky = 0; ky < side; ky += 1) {
        for (let kx = 0; kx < side; kx += 1) {
          const ix = Math.min(width - 1, Math.max(0, x + kx - half));
          const iy = Math.min(height - 1, Math.max(0, y + ky - half));
          const idx = (iy * width + ix) * 4;
          const weight = kernel[ky * side + kx];
          r += data[idx] * weight;
          g += data[idx + 1] * weight;
          b += data[idx + 2] * weight;
        }
      }
      const out = (y * width + x) * 4;
      output.data[out] = Math.min(255, Math.max(0, r / div));
      output.data[out + 1] = Math.min(255, Math.max(0, g / div));
      output.data[out + 2] = Math.min(255, Math.max(0, b / div));
      output.data[out + 3] = data[out + 3];
    }
  }
  return output;
}

export async function sharpenImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const amount = Math.min(3, Math.max(0.2, (options.strength ?? 40) / 40));
  const mime = config.forceOutputMime ?? mimeFromFile(source.file, "image/png");
  const { canvas, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
    const center = 1 + 4 * amount;
    const edge = -amount;
    const sharpened = convolve(ctx.getImageData(0, 0, width, height), [
      0,
      edge,
      0,
      edge,
      center,
      edge,
      0,
      edge,
      0,
    ]);
    ctx.putImageData(sharpened, 0, 0);
    const blob = await encodeCanvas(canvas, mime, 0.92);
    return finalize(blob, config, source, width, height, mime);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function blurImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const radius = Math.min(20, Math.max(1, Math.round((options.strength ?? 30) / 10)));
  const mime = config.forceOutputMime ?? mimeFromFile(source.file, "image/png");
  const { image, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(image, 0, 0);
    ctx.filter = "none";
    const blob = await encodeCanvas(canvas, mime, 0.92);
    return finalize(blob, config, source, width, height, mime);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function pixelateImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const block = Math.min(80, Math.max(2, Math.round(options.pixelSize ?? 12)));
  const mime = config.forceOutputMime ?? mimeFromFile(source.file, "image/png");
  const { image, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    const smallW = Math.max(1, Math.floor(width / block));
    const smallH = Math.max(1, Math.floor(height / block));
    const small = createCanvas(smallW, smallH);
    const smallCtx = small.getContext("2d");
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!smallCtx || !ctx) throw new Error("Your browser could not prepare an image canvas.");
    smallCtx.imageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    smallCtx.drawImage(image, 0, 0, smallW, smallH);
    ctx.drawImage(small, 0, 0, width, height);
    const blob = await encodeCanvas(canvas, mime, 0.92);
    return finalize(blob, config, source, width, height, mime);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function roundedImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const radius = Math.max(0, Math.round(options.radius ?? 32));
  const { image, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
    ctx.clearRect(0, 0, width, height);
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(width, 0, width, height, r);
    ctx.arcTo(width, height, 0, height, r);
    ctx.arcTo(0, height, 0, 0, r);
    ctx.arcTo(0, 0, width, 0, r);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, 0, 0);
    const blob = await encodeCanvas(canvas, "image/png");
    return finalize(blob, config, source, width, height, "image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function circularImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const { image, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    const crop = options.crop;
    const size = Math.max(
      1,
      Math.round(crop ? Math.min(crop.width, crop.height) : Math.min(width, height)),
    );
    const sx = Math.round(crop?.x ?? (width - size) / 2);
    const sy = Math.round(crop?.y ?? (height - size) / 2);
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, sx, sy, size, size, 0, 0, size, size);
    const blob = await encodeCanvas(canvas, "image/png");
    return finalize(blob, config, source, size, size, "image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function borderImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const borderWidth = Math.max(1, Math.round(options.borderWidth ?? 16));
  const padding = Math.max(0, Math.round(options.padding ?? 0));
  const color = options.borderColor || "#2563EB";
  const radius = Math.max(0, Math.round(options.radius ?? 0));
  const mime = config.forceOutputMime ?? mimeFromFile(source.file, "image/png");
  const { image, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    const outW = width + (borderWidth + padding) * 2;
    const outH = height + (borderWidth + padding) * 2;
    const canvas = createCanvas(outW, outH);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas.");
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
    } else {
      ctx.clearRect(0, 0, outW, outH);
    }
    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };
    ctx.fillStyle = color;
    drawRoundRect(0, 0, outW, outH, radius + borderWidth);
    ctx.fill();
    if (mime !== "image/jpeg") {
      ctx.globalCompositeOperation = "destination-out";
      drawRoundRect(
        borderWidth,
        borderWidth,
        outW - borderWidth * 2,
        outH - borderWidth * 2,
        radius,
      );
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.fillStyle = options.backgroundColor || "#ffffff";
      drawRoundRect(
        borderWidth,
        borderWidth,
        outW - borderWidth * 2,
        outH - borderWidth * 2,
        radius,
      );
      ctx.fill();
    }
    ctx.drawImage(image, borderWidth + padding, borderWidth + padding);
    const blob = await encodeCanvas(canvas, mime === "image/jpeg" ? mime : "image/png", 0.92);
    return finalize(
      blob,
      config,
      source,
      outW,
      outH,
      mime === "image/jpeg" ? mime : "image/png",
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function changeQuality(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  return compressImage(source, { ...config, filenameSuffix: "quality" }, options);
}

export async function removeExif(
  source: EditorImageFile,
  config: ImageEditorConfig,
): Promise<EditorProcessResult> {
  const mime = mimeFromFile(source.file, "image/jpeg");
  const { canvas, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    // Re-encoding through canvas drops EXIF and most embedded metadata.
    const outMime: OutputMime = mime === "image/png" ? "image/png" : mime === "image/webp" ? "image/webp" : "image/jpeg";
    const blob = await encodeCanvas(
      canvas,
      outMime,
      outMime === "image/png" ? undefined : 0.92,
    );
    return finalize(blob, config, source, width, height, outMime, {
      notice:
        "Common EXIF metadata was removed by re-encoding the image. The visual content is preserved.",
      stats: {
        "Original size": formatBytes(source.sizeBytes),
        "Output size": formatBytes(blob.size),
      },
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function changeDpi(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions,
): Promise<EditorProcessResult> {
  const dpi = Math.max(1, Math.min(1200, Math.round(options.dpi ?? 300)));
  const mime = mimeFromFile(source.file, "image/jpeg");
  const { canvas, objectUrl, width, height } = await imageFileToCanvas(source.file);
  try {
    if (mime === "image/png") {
      const pngBlob = await encodeCanvas(canvas, "image/png");
      const withDpi = await writePngDpi(pngBlob, dpi);
      return finalize(withDpi, config, source, width, height, "image/png", {
        stats: { DPI: `${dpi}` },
        notice: "PNG pHYs metadata was updated. Pixel dimensions are unchanged.",
      });
    }

    if (mime === "image/webp") {
      const webpBlob = await encodeCanvas(canvas, "image/webp", 0.92);
      return finalize(webpBlob, config, source, width, height, "image/webp", {
        stats: { DPI: `${dpi}` },
        notice:
          "WebP does not reliably support DPI metadata in browsers. The image was re-saved; pixel dimensions are unchanged.",
      });
    }

    const jpegBlob = await encodeCanvas(canvas, "image/jpeg", 0.92);
    const withDpi = await writeJpegDpi(jpegBlob, dpi);
    return finalize(withDpi, config, source, width, height, "image/jpeg", {
      stats: { DPI: `${dpi}` },
      notice: "JPEG DPI metadata was updated. Pixel dimensions and visual detail are unchanged.",
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function writePngDpi(blob: Blob, dpi: number): Promise<Blob> {
  const buffer = new Uint8Array(await blob.arrayBuffer());
  const pixelsPerMeter = Math.round(dpi / 0.0254);
  const phys = new Uint8Array(9);
  const view = new DataView(phys.buffer);
  view.setUint32(0, pixelsPerMeter);
  view.setUint32(4, pixelsPerMeter);
  phys[8] = 1; // meters
  const chunkType = new TextEncoder().encode("pHYs");
  const chunkData = phys;
  const crcInput = new Uint8Array(chunkType.length + chunkData.length);
  crcInput.set(chunkType, 0);
  crcInput.set(chunkData, chunkType.length);
  const crc = crc32(crcInput);
  const chunk = new Uint8Array(4 + 4 + chunkData.length + 4);
  const chunkView = new DataView(chunk.buffer);
  chunkView.setUint32(0, chunkData.length);
  chunk.set(chunkType, 4);
  chunk.set(chunkData, 8);
  chunkView.setUint32(8 + chunkData.length, crc);

  // Insert after IHDR (which starts at byte 8)
  const ihdrLen = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength).getUint32(8);
  const insertAt = 8 + 4 + 4 + ihdrLen + 4;
  const output = new Uint8Array(buffer.length + chunk.length);
  output.set(buffer.subarray(0, insertAt), 0);
  output.set(chunk, insertAt);
  output.set(buffer.subarray(insertAt), insertAt + chunk.length);
  return new Blob([output], { type: "image/png" });
}

async function writeJpegDpi(blob: Blob, dpi: number): Promise<Blob> {
  const piexif = (await import("piexifjs")).default ?? (await import("piexifjs"));
  const dataUrl = await blobToDataUrl(blob);
  const zeroth: Record<string | number, unknown> = {};
  const exifObj = { "0th": zeroth, Exif: {}, GPS: {} };
  // ResolutionUnit inches = 2, X/YResolution as rational
  zeroth[piexif.ImageIFD.XResolution] = [dpi, 1];
  zeroth[piexif.ImageIFD.YResolution] = [dpi, 1];
  zeroth[piexif.ImageIFD.ResolutionUnit] = 2;
  const exifBytes = piexif.dump(exifObj);
  const inserted = piexif.insert(exifBytes, dataUrl);
  const res = await fetch(inserted);
  return res.blob();
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image data."));
    reader.readAsDataURL(blob);
  });
}

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    c ^= data[i];
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

export async function readMetadata(source: EditorImageFile): Promise<EditorProcessResult> {
  const exifr = (await import("exifr")).default;
  const rows: Array<{ label: string; value: string }> = [
    { label: "File name", value: source.name },
    { label: "File type", value: source.type || "Unknown" },
    { label: "File size", value: formatBytes(source.sizeBytes) },
    { label: "Width", value: `${source.width}px` },
    { label: "Height", value: `${source.height}px` },
  ];

  try {
    const parsed = await exifr.parse(source.file, {
      tiff: true,
      xmp: true,
      icc: false,
      jfif: true,
      ihdr: true,
      gps: true,
      reviveValues: true,
    });
    if (parsed && typeof parsed === "object") {
      for (const [key, value] of Object.entries(parsed)) {
        if (value == null || value === "") continue;
        const text =
          value instanceof Date
            ? value.toISOString()
            : typeof value === "object"
              ? JSON.stringify(value)
              : String(value);
        rows.push({ label: key, value: text });
      }
    }
  } catch {
    // No EXIF is fine.
  }

  const hasExtra = rows.length > 5;
  return {
    blob: source.file,
    previewUrl: source.previewUrl,
    fileName: source.name,
    mimeType: source.type,
    sizeBytes: source.sizeBytes,
    width: source.width,
    height: source.height,
    metadataRows: hasExtra ? rows : rows,
    notice: hasExtra ? undefined : undefined,
    stats: hasExtra
      ? { Fields: String(rows.length) }
      : { Status: "No additional EXIF metadata was found in this image." },
  };
}

export async function removeBackground(
  source: EditorImageFile,
  config: ImageEditorConfig,
): Promise<EditorProcessResult> {
  const { removeBackground: removeBackgroundFn } = await import(
    "@imgly/background-removal"
  );
  try {
    const blob = await removeBackgroundFn(source.file, {
      model: "isnet_quint8",
      device: "cpu",
      proxyToWorker: false,
      output: { format: "image/png", quality: 0.9 },
    });
    const url = URL.createObjectURL(blob);
    try {
      const image = await loadHtmlImage(url);
      return finalize(blob, config, source, image.naturalWidth, image.naturalHeight, "image/png", {
        notice:
          "Background removed in your browser. Results vary by subject contrast and image complexity. The first run may take longer while the on-device model loads.",
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    throw new Error(
      detail && /webgpu|wasm|fetch|network|onnx|model/i.test(detail)
        ? "We couldn't remove the background in this browser session. Please try another image, check your connection, or use a supported device."
        : "We couldn't remove the background in this browser session. Please try another image or a supported device.",
    );
  }
}

export async function processEditorImage(
  source: EditorImageFile,
  config: ImageEditorConfig,
  options: EditorProcessOptions = {},
): Promise<EditorProcessResult> {
  switch (config.kind) {
    case "compress":
    case "quality":
      return compressImage(source, config, options);
    case "resize":
      return resizeImage(source, config, options);
    case "crop":
      return cropImage(source, config, options);
    case "rotate":
      return rotateImage(source, config, options);
    case "flip":
      return flipImage(source, config, options);
    case "sharpen":
      return sharpenImage(source, config, options);
    case "blur":
      return blurImage(source, config, options);
    case "pixelate":
      return pixelateImage(source, config, options);
    case "rounded":
      return roundedImage(source, config, options);
    case "circular":
      return circularImage(source, config, options);
    case "border":
      return borderImage(source, config, options);
    case "exif-remover":
      return removeExif(source, config);
    case "dpi-changer":
      return changeDpi(source, config, options);
    case "metadata-viewer":
      return readMetadata(source);
    case "background-remover":
      return removeBackground(source, config);
    case "color-picker":
      throw new Error("Color picker does not require processing.");
    default:
      throw new Error("Unsupported image tool.");
  }
}
