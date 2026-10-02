import { PDFDocument, StandardFonts, rgb, degrees, type PDFPage } from "@cantoo/pdf-lib";
import JSZip from "jszip";
import { extractPdfText, loadPdfjsDocument, renderPdfPageToCanvas } from "./pdfjs";
import type {
  PdfProcessOptions,
  PdfProcessResult,
  PdfSourceFile,
  PdfToolConfig,
} from "./types";
import {
  blobFromCanvas,
  buildPdfOutputName,
  formatBytes,
  parsePageSelection,
  parseSplitRanges,
} from "./utils";
import { friendlyPdfError } from "./validate";

function hexToRgb01(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n)) return { r: 0.15, g: 0.39, b: 0.92 };
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
  };
}

async function loadPdfLib(file: File, options?: { ignoreEncryption?: boolean; password?: string }) {
  const bytes = await file.arrayBuffer();
  return PDFDocument.load(bytes, {
    ignoreEncryption: options?.ignoreEncryption ?? false,
    password: options?.password,
    updateMetadata: false,
  });
}

function resultFromBytes(
  bytes: Uint8Array,
  config: PdfToolConfig,
  sourceName: string,
  extras: Partial<PdfProcessResult> = {},
): PdfProcessResult {
  const blob = new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
  return {
    blob,
    fileName: buildPdfOutputName(sourceName, config.filenameSuffix, "pdf"),
    mimeType: "application/pdf",
    sizeBytes: blob.size,
    previewUrl: URL.createObjectURL(blob),
    ...extras,
  };
}

async function zipFiles(
  files: Array<{ blob: Blob; fileName: string }>,
  zipName: string,
): Promise<PdfProcessResult> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.fileName, file.blob);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  return {
    blob,
    fileName: zipName.endsWith(".zip") ? zipName : `${zipName}.zip`,
    mimeType: "application/zip",
    sizeBytes: blob.size,
    previewUrl: URL.createObjectURL(blob),
    stats: { Files: String(files.length) },
  };
}

export async function pdfToImages(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const buffer = await source.file.arrayBuffer();
  const pdf = await loadPdfjsDocument(buffer, options.unlockPassword);
  try {
    const pages = parsePageSelection(options.pageSelection || "all", pdf.numPages);
    if (!pages.length) throw new Error("No valid pages were selected.");
    const mime = config.imageOutput || "image/jpeg";
    const ext = config.imageExtension || "jpg";
    const quality = (options.imageQuality ?? 85) / 100;
    const scale = options.scale ?? 1.75;
    const outputs: Array<{ blob: Blob; fileName: string }> = [];

    for (let i = 0; i < pages.length; i += 1) {
      const pageNum = pages[i];
      options.onProgress?.(i, pages.length, `Rendering page ${pageNum}…`);
      const canvas = await renderPdfPageToCanvas(pdf, pageNum, scale);
      const blob = await blobFromCanvas(
        canvas,
        mime,
        mime === "image/png" ? undefined : quality,
      );
      outputs.push({
        blob,
        fileName: buildPdfOutputName(
          source.name,
          `page-${pageNum}`,
          ext,
        ),
      });
      options.onProgress?.(i + 1, pages.length, `Rendered page ${pageNum}`);
    }

    if (outputs.length === 1) {
      const only = outputs[0];
      return {
        blob: only.blob,
        fileName: only.fileName,
        mimeType: mime,
        sizeBytes: only.blob.size,
        previewUrl: URL.createObjectURL(only.blob),
        stats: {
          Pages: "1",
          Size: formatBytes(only.blob.size),
        },
      };
    }

    return zipFiles(
      outputs,
      buildPdfOutputName(source.name, config.filenameSuffix, "zip"),
    );
  } finally {
    await pdf.cleanup();
  }
}

export async function imagesToPdf(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  if (!sources.length) throw new Error("Please upload at least one image.");
  const doc = await PDFDocument.create();
  const total = sources.length;
  for (let i = 0; i < total; i += 1) {
    const source = sources[i];
    options.onProgress?.(i, total, `Adding ${source.name}…`);
    const bytes = new Uint8Array(await source.file.arrayBuffer());
    const image =
      config.imageInput === "png" || source.type === "image/png"
        ? await doc.embedPng(bytes)
        : await doc.embedJpg(bytes);
    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
    options.onProgress?.(i + 1, total, `Added page ${i + 1}`);
  }
  const saved = await doc.save();
  const name = sources.length === 1 ? sources[0].name : "images";
  return resultFromBytes(saved, config, name, {
    stats: { Pages: String(total), Size: formatBytes(saved.byteLength) },
  });
}

export async function mergePdfs(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  if (sources.length < 2) throw new Error("Please upload at least two PDF files to merge.");
  const merged = await PDFDocument.create();
  let totalPages = 0;
  for (let i = 0; i < sources.length; i += 1) {
    const source = sources[i];
    options.onProgress?.(i, sources.length, `Merging ${source.name}…`);
    const doc = await loadPdfLib(source.file);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
    totalPages += pages.length;
    options.onProgress?.(i + 1, sources.length, `Merged ${source.name}`);
  }
  const saved = await merged.save();
  return resultFromBytes(saved, config, "merged-document", {
    stats: {
      Files: String(sources.length),
      Pages: String(totalPages),
      Size: formatBytes(saved.byteLength),
    },
  });
}

export async function splitPdf(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const doc = await loadPdfLib(source.file);
  const groups = parseSplitRanges(options.pageSelection || "", doc.getPageCount());
  if (!groups.length) {
    throw new Error("Enter page ranges such as 1-3, 5, 8-10.");
  }
  const outputs: Array<{ blob: Blob; fileName: string }> = [];
  for (let i = 0; i < groups.length; i += 1) {
    const pages = groups[i];
    options.onProgress?.(i, groups.length, `Creating part ${i + 1}…`);
    const out = await PDFDocument.create();
    const copied = await out.copyPages(
      doc,
      pages.map((p) => p - 1),
    );
    copied.forEach((page) => out.addPage(page));
    const bytes = await out.save();
    const label =
      pages.length === 1 ? `page-${pages[0]}` : `pages-${pages[0]}-${pages[pages.length - 1]}`;
    outputs.push({
      blob: new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }),
      fileName: buildPdfOutputName(source.name, label, "pdf"),
    });
    options.onProgress?.(i + 1, groups.length, `Created part ${i + 1}`);
  }
  if (outputs.length === 1) {
    const only = outputs[0];
    return {
      blob: only.blob,
      fileName: only.fileName,
      mimeType: "application/pdf",
      sizeBytes: only.blob.size,
      previewUrl: URL.createObjectURL(only.blob),
      stats: { Parts: "1", Size: formatBytes(only.blob.size) },
    };
  }
  return zipFiles(outputs, buildPdfOutputName(source.name, "split", "zip"));
}

export async function compressPdf(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  options.onProgress?.(0, 2, "Loading PDF…");
  const original = await loadPdfLib(source.file);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(original, original.getPageIndices());
  pages.forEach((page) => out.addPage(page));
  out.setTitle("");
  out.setAuthor("");
  out.setSubject("");
  out.setKeywords([]);
  out.setProducer("");
  out.setCreator("");
  options.onProgress?.(1, 2, "Saving compressed PDF…");
  const saved = await out.save({ useObjectStreams: true });
  options.onProgress?.(2, 2, "Done");
  const originalSize = source.sizeBytes;
  const compressedSize = saved.byteLength;
  const reduction =
    originalSize > 0
      ? `${Math.max(0, ((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%`
      : "0%";
  return resultFromBytes(saved, config, source.name, {
    stats: {
      "Original size": formatBytes(originalSize),
      "Compressed size": formatBytes(compressedSize),
      Reduction: reduction,
    },
    notice:
      compressedSize >= originalSize
        ? "This PDF did not shrink further. Many PDFs are already optimized; try a different file or remove unused pages first."
        : undefined,
  });
}

export async function extractPages(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const doc = await loadPdfLib(source.file);
  const pages = parsePageSelection(options.pageSelection || "", doc.getPageCount());
  if (!pages.length) throw new Error("Enter pages such as 2,4,7-9.");
  options.onProgress?.(0, 1, "Extracting pages…");
  const out = await PDFDocument.create();
  const copied = await out.copyPages(
    doc,
    pages.map((p) => p - 1),
  );
  copied.forEach((page) => out.addPage(page));
  const saved = await out.save();
  options.onProgress?.(1, 1, "Done");
  return resultFromBytes(saved, config, source.name, {
    stats: {
      "Original pages": String(doc.getPageCount()),
      "Extracted pages": String(copied.length),
    },
  });
}

export async function reorderPages(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const doc = await loadPdfLib(source.file);
  const count = doc.getPageCount();
  let order = options.pageOrder?.filter((p) => p >= 1 && p <= count) ?? [];
  if (options.removedPages?.length) {
    const removed = new Set(options.removedPages);
    if (!order.length) order = Array.from({ length: count }, (_, i) => i + 1);
    order = order.filter((p) => !removed.has(p));
  }
  if (!order.length) throw new Error("Keep at least one page in the document.");
  options.onProgress?.(0, 1, "Reordering pages…");
  const out = await PDFDocument.create();
  const copied = await out.copyPages(
    doc,
    order.map((p) => p - 1),
  );
  copied.forEach((page) => out.addPage(page));
  const saved = await out.save();
  options.onProgress?.(1, 1, "Done");
  return resultFromBytes(saved, config, source.name, {
    stats: { Pages: String(copied.length) },
  });
}

export async function rotatePdf(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const doc = await loadPdfLib(source.file);
  const count = doc.getPageCount();
  const allAngle = options.rotateAll ?? 90;
  options.onProgress?.(0, count, "Rotating pages…");
  for (let i = 0; i < count; i += 1) {
    const page = doc.getPage(i);
    const specific = options.rotations?.[i + 1];
    const angle = specific ?? allAngle;
    if (angle) page.setRotation(degrees((page.getRotation().angle + angle) % 360));
    options.onProgress?.(i + 1, count, `Rotated page ${i + 1}`);
  }
  const saved = await doc.save();
  return resultFromBytes(saved, config, source.name);
}

export async function cropPdf(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const crop = options.crop ?? { left: 5, bottom: 5, right: 5, top: 5 };
  const doc = await loadPdfLib(source.file);
  const count = doc.getPageCount();
  const selected = new Set(
    parsePageSelection(options.pageSelection || "all", count),
  );
  options.onProgress?.(0, count, "Cropping pages…");
  for (let i = 0; i < count; i += 1) {
    if (!selected.has(i + 1)) {
      options.onProgress?.(i + 1, count, `Skipped page ${i + 1}`);
      continue;
    }
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const left = (Math.min(40, Math.max(0, crop.left)) / 100) * width;
    const right = (Math.min(40, Math.max(0, crop.right)) / 100) * width;
    const bottom = (Math.min(40, Math.max(0, crop.bottom)) / 100) * height;
    const top = (Math.min(40, Math.max(0, crop.top)) / 100) * height;
    const newWidth = Math.max(24, width - left - right);
    const newHeight = Math.max(24, height - bottom - top);
    page.setCropBox(left, bottom, newWidth, newHeight);
    page.setMediaBox(left, bottom, newWidth, newHeight);
    options.onProgress?.(i + 1, count, `Cropped page ${i + 1}`);
  }
  const saved = await doc.save();
  return resultFromBytes(saved, config, source.name);
}

export async function viewPdfMetadata(
  sources: PdfSourceFile[],
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const doc = await loadPdfLib(source.file, { ignoreEncryption: true });
  const rows: Array<{ label: string; value: string }> = [
    { label: "File name", value: source.name },
    { label: "File size", value: formatBytes(source.sizeBytes) },
    { label: "Pages", value: String(doc.getPageCount()) },
  ];
  const title = doc.getTitle();
  const author = doc.getAuthor();
  const subject = doc.getSubject();
  const creator = doc.getCreator();
  const producer = doc.getProducer();
  const keywords = doc.getKeywords();
  const creation = doc.getCreationDate();
  const modification = doc.getModificationDate();
  if (title) rows.push({ label: "Title", value: title });
  if (author) rows.push({ label: "Author", value: author });
  if (subject) rows.push({ label: "Subject", value: subject });
  if (creator) rows.push({ label: "Creator", value: creator });
  if (producer) rows.push({ label: "Producer", value: producer });
  if (keywords) rows.push({ label: "Keywords", value: keywords });
  if (creation) rows.push({ label: "Creation date", value: creation.toISOString() });
  if (modification) {
    rows.push({ label: "Modification date", value: modification.toISOString() });
  }
  const hasExtra = rows.length > 3;
  return {
    blob: source.file,
    fileName: source.name,
    mimeType: "application/pdf",
    sizeBytes: source.sizeBytes,
    metadataRows: rows,
    stats: hasExtra
      ? { Fields: String(rows.length) }
      : { Status: "No metadata available." },
    notice: hasExtra ? undefined : "No metadata available.",
  };
}

export async function removePdfMetadata(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  options.onProgress?.(0, 1, "Removing metadata…");
  const doc = await loadPdfLib(source.file);
  doc.setTitle("");
  doc.setAuthor("");
  doc.setSubject("");
  doc.setKeywords([]);
  doc.setProducer("");
  doc.setCreator("");
  try {
    doc.setCreationDate(new Date(0));
    doc.setModificationDate(new Date(0));
  } catch {
    // Some PDFs reject date writes; info fields above are still cleared.
  }
  const saved = await doc.save();
  options.onProgress?.(1, 1, "Done");
  return resultFromBytes(saved, config, source.name, {
    notice:
      "Common document info fields were cleared. Some embedded XMP or custom metadata may remain depending on the file.",
  });
}

export async function protectPdf(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const password = (options.password || "").trim();
  const confirm = (options.passwordConfirm || "").trim();
  if (!password) throw new Error("Enter a password to protect this PDF.");
  if (password.length < 4) throw new Error("Use a password with at least 4 characters.");
  if (password !== confirm) throw new Error("Password confirmation does not match.");
  options.onProgress?.(0, 1, "Encrypting PDF…");
  const doc = await loadPdfLib(source.file);
  doc.encrypt({
    userPassword: password,
    ownerPassword: password,
  });
  const saved = await doc.save();
  options.onProgress?.(1, 1, "Done");
  return resultFromBytes(saved, config, source.name, {
    notice: "The PDF is password-protected. The password is not stored or shown again.",
  });
}

export async function unlockPdf(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const password = (options.unlockPassword || "").trim();
  if (!password) throw new Error("Enter the PDF password to unlock it.");
  options.onProgress?.(0, 2, "Opening protected PDF…");
  let doc;
  try {
    doc = await loadPdfLib(source.file, { password });
  } catch {
    throw new Error("Could not unlock this PDF with the password provided.");
  }
  options.onProgress?.(1, 2, "Saving unlocked PDF…");
  // Re-save without calling encrypt() produces an unprotected document.
  const out = await PDFDocument.create();
  const pages = await out.copyPages(doc, doc.getPageIndices());
  pages.forEach((page) => out.addPage(page));
  const saved = await out.save();
  options.onProgress?.(2, 2, "Done");
  return resultFromBytes(saved, config, source.name, {
    notice: "Created an unprotected PDF using the password you provided.",
  });
}

function drawCenteredText(
  page: PDFPage,
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  color: ReturnType<typeof rgb>,
  position: "bottom-center" | "bottom-left" | "bottom-right" | "top-center",
) {
  const { width, height } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, size);
  let x = (width - textWidth) / 2;
  let y = 28;
  if (position === "bottom-left") x = 36;
  if (position === "bottom-right") x = Math.max(36, width - textWidth - 36);
  if (position === "top-center") y = height - 36;
  page.drawText(text, { x, y, size, font, color });
}

export async function addPageNumbers(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const doc = await loadPdfLib(source.file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const start = Math.max(1, options.pageNumberStart ?? 1);
  const size = Math.max(8, Math.min(36, options.pageNumberFontSize ?? 12));
  const position = options.pageNumberPosition ?? "bottom-center";
  const format = options.pageNumberFormat ?? "number";
  const count = doc.getPageCount();
  for (let i = 0; i < count; i += 1) {
    options.onProgress?.(i, count, `Numbering page ${i + 1}…`);
    const n = start + i;
    const label = format === "page-n" ? `Page ${n}` : String(n);
    drawCenteredText(doc.getPage(i), label, font, size, rgb(0.2, 0.2, 0.2), position);
    options.onProgress?.(i + 1, count, `Numbered page ${i + 1}`);
  }
  const saved = await doc.save();
  return resultFromBytes(saved, config, source.name);
}

export async function addWatermark(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const text = (options.watermarkText || "").trim();
  if (!text) throw new Error("Enter watermark text.");
  const doc = await loadPdfLib(source.file);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const size = Math.max(10, Math.min(96, options.watermarkFontSize ?? 48));
  const opacity = Math.max(0.05, Math.min(1, (options.watermarkOpacity ?? 30) / 100));
  const rotation = options.watermarkRotation ?? -45;
  const color = hexToRgb01(options.watermarkColor || "#2563EB");
  const position = options.watermarkPosition ?? "diagonal";
  const count = doc.getPageCount();
  for (let i = 0; i < count; i += 1) {
    options.onProgress?.(i, count, `Watermarking page ${i + 1}…`);
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, size);
    const x = (width - textWidth) / 2;
    let y = height / 2;
    if (position === "top") y = height - size - 40;
    if (position === "bottom") y = 48;
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(position === "diagonal" ? rotation : 0),
    });
    options.onProgress?.(i + 1, count, `Watermarked page ${i + 1}`);
  }
  const saved = await doc.save();
  return resultFromBytes(saved, config, source.name);
}

export async function extractText(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a PDF file.");
  const buffer = await source.file.arrayBuffer();
  const pdf = await loadPdfjsDocument(buffer, options.unlockPassword);
  try {
    const text = await extractPdfText(pdf, (completed, total) => {
      options.onProgress?.(completed, total, `Reading page ${completed}…`);
    });
    const trimmed = text.trim();
    const blob = new Blob([trimmed || ""], { type: "text/plain;charset=utf-8" });
    const asDownload = config.kind === "pdf-to-text";
    return {
      blob,
      fileName: buildPdfOutputName(source.name, asDownload ? "txt" : "extracted", "txt"),
      mimeType: "text/plain",
      sizeBytes: blob.size,
      textContent: trimmed,
      previewUrl: URL.createObjectURL(blob),
      notice: trimmed
        ? undefined
        : "No extractable text was found. This PDF may be scanned images without a text layer. OCR is not applied.",
      stats: {
        Characters: String(trimmed.length),
        Pages: String(pdf.numPages),
      },
    };
  } finally {
    await pdf.cleanup();
  }
}

export async function processPdfTool(
  sources: PdfSourceFile[],
  config: PdfToolConfig,
  options: PdfProcessOptions = {},
): Promise<PdfProcessResult> {
  try {
    switch (config.kind) {
      case "pdf-to-image":
        return await pdfToImages(sources, config, options);
      case "images-to-pdf":
        return await imagesToPdf(sources, config, options);
      case "merge":
        return await mergePdfs(sources, config, options);
      case "split":
        return await splitPdf(sources, config, options);
      case "compress":
        return await compressPdf(sources, config, options);
      case "extract-pages":
        return await extractPages(sources, config, options);
      case "reorder":
        return await reorderPages(sources, config, options);
      case "rotate":
        return await rotatePdf(sources, config, options);
      case "crop":
        return await cropPdf(sources, config, options);
      case "metadata-viewer":
        return await viewPdfMetadata(sources);
      case "metadata-remover":
        return await removePdfMetadata(sources, config, options);
      case "password-protect":
        return await protectPdf(sources, config, options);
      case "unlock":
        return await unlockPdf(sources, config, options);
      case "page-numbering":
        return await addPageNumbers(sources, config, options);
      case "watermark":
        return await addWatermark(sources, config, options);
      case "text-extract":
      case "pdf-to-text":
        return await extractText(sources, config, options);
      default:
        throw new Error("Unsupported PDF tool.");
    }
  } catch (error) {
    throw new Error(friendlyPdfError(error));
  }
}
