import { createCanvas, fileToArrayBuffer, loadHtmlImage } from "./utils";
import { rasterizeObjectUrl, type RasterizeOptions } from "./rasterize";

interface IcoEntry {
  width: number;
  height: number;
  bytesInRes: number;
  imageOffset: number;
  data: Uint8Array;
  isPng: boolean;
}

function readU16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readU32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

function parseIco(buffer: ArrayBuffer): IcoEntry[] {
  const view = new DataView(buffer);
  if (buffer.byteLength < 6) {
    throw new Error("This ICO file appears to be invalid.");
  }

  const reserved = readU16(view, 0);
  const type = readU16(view, 2);
  const count = readU16(view, 4);

  if (reserved !== 0 || type !== 1 || count < 1) {
    throw new Error("We couldn't read this ICO file. Please try another icon file.");
  }

  const entries: IcoEntry[] = [];
  for (let i = 0; i < count; i += 1) {
    const entryOffset = 6 + i * 16;
    if (entryOffset + 16 > buffer.byteLength) break;

    const widthByte = view.getUint8(entryOffset);
    const heightByte = view.getUint8(entryOffset + 1);
    const bytesInRes = readU32(view, entryOffset + 8);
    const imageOffset = readU32(view, entryOffset + 12);

    if (imageOffset + bytesInRes > buffer.byteLength) continue;

    const data = new Uint8Array(buffer, imageOffset, bytesInRes);
    const isPng =
      data.length >= 8 &&
      data[0] === 0x89 &&
      data[1] === 0x50 &&
      data[2] === 0x4e &&
      data[3] === 0x47;

    let width = widthByte === 0 ? 256 : widthByte;
    let height = heightByte === 0 ? 256 : heightByte;

    if (!isPng && data.length > 24) {
      const dib = new DataView(data.buffer, data.byteOffset, data.byteLength);
      width = dib.getInt32(4, true);
      height = Math.abs(dib.getInt32(8, true) / 2);
    }

    entries.push({ width, height, bytesInRes, imageOffset, data, isPng });
  }

  if (!entries.length) {
    throw new Error("No readable images were found inside this ICO file.");
  }

  return entries.sort((a, b) => b.width * b.height - a.width * a.height);
}

async function bmpIconToImageData(entry: IcoEntry): Promise<ImageData> {
  // BMP-style ICON image: BITMAPINFOHEADER + XOR bitmap + AND mask
  const data = entry.data;
  if (data.length < 40) {
    throw new Error("This ICO image data is incomplete.");
  }

  const dib = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const headerSize = dib.getUint32(0, true);
  const width = dib.getInt32(4, true);
  const heightTotal = dib.getInt32(8, true);
  const height = Math.abs(heightTotal / 2);
  const bitCount = dib.getUint16(14, true);

  if (headerSize < 40 || width <= 0 || height <= 0) {
    throw new Error("Unsupported ICO bitmap header.");
  }

  if (bitCount !== 32 && bitCount !== 24) {
    throw new Error("This ICO color depth is not supported. Try an ICO that contains PNG images.");
  }

  const imageData = new ImageData(width, height);
  const xorOffset = headerSize;
  const rowSize = Math.ceil((width * bitCount) / 32) * 4;

  for (let y = 0; y < height; y += 1) {
    const srcY = height - 1 - y;
    for (let x = 0; x < width; x += 1) {
      const srcIndex = xorOffset + srcY * rowSize + x * (bitCount / 8);
      const dstIndex = (y * width + x) * 4;
      const b = data[srcIndex] ?? 0;
      const g = data[srcIndex + 1] ?? 0;
      const r = data[srcIndex + 2] ?? 0;
      const a = bitCount === 32 ? (data[srcIndex + 3] ?? 255) : 255;
      imageData.data[dstIndex] = r;
      imageData.data[dstIndex + 1] = g;
      imageData.data[dstIndex + 2] = b;
      imageData.data[dstIndex + 3] = a;
    }
  }

  return imageData;
}

export async function convertIcoToRaster(
  file: File,
  options: RasterizeOptions,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string; notice?: string }> {
  const buffer = await fileToArrayBuffer(file);
  const entries = parseIco(buffer);
  const selected = entries[0];
  const notice =
    entries.length > 1
      ? `This ICO contained ${entries.length} sizes. ToolMyra converted the largest available image (${selected.width}×${selected.height}).`
      : undefined;

  if (selected.isPng) {
    const pngBlob = new Blob([selected.data.slice()], {
      type: "image/png",
    });
    const url = URL.createObjectURL(pngBlob);
    try {
      const result = await rasterizeObjectUrl(url, options);
      return { ...result, notice };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const imageData = await bmpIconToImageData(selected);
  const canvas = createCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not prepare an image canvas for conversion.");
  ctx.putImageData(imageData, 0, 0);
  const url = URL.createObjectURL(await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("ICO frame encoding failed."))), "image/png");
  }));
  try {
    const result = await rasterizeObjectUrl(url, options);
    return { ...result, notice };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function createIcoFromPng(pngBytes: Uint8Array, width: number, height: number): Blob {
  const headerSize = 6;
  const entrySize = 16;
  const offset = headerSize + entrySize;
  const buffer = new ArrayBuffer(offset + pngBytes.length);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);

  view.setUint8(6, width >= 256 ? 0 : width);
  view.setUint8(7, height >= 256 ? 0 : height);
  view.setUint8(8, 0);
  view.setUint8(9, 0);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, pngBytes.length, true);
  view.setUint32(18, offset, true);

  bytes.set(pngBytes, offset);
  return new Blob([buffer], { type: "image/x-icon" });
}

export async function convertPngToIco(
  file: File,
  size = 256,
): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadHtmlImage(objectUrl);
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare an image canvas for conversion.");
    ctx.clearRect(0, 0, size, size);

    const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
    const drawWidth = Math.max(1, Math.round(image.naturalWidth * scale));
    const drawHeight = Math.max(1, Math.round(image.naturalHeight * scale));
    const dx = Math.floor((size - drawWidth) / 2);
    const dy = Math.floor((size - drawHeight) / 2);
    ctx.drawImage(image, dx, dy, drawWidth, drawHeight);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode PNG for ICO."))),
        "image/png",
      );
    });
    const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
    const icoBlob = createIcoFromPng(pngBytes, size, size);
    return {
      blob: icoBlob,
      width: size,
      height: size,
      previewUrl: URL.createObjectURL(pngBlob),
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
