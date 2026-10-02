import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from "pdfjs-dist";

let workerReady = false;

export function ensurePdfjsWorker() {
  if (typeof window === "undefined" || workerReady) return;
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  workerReady = true;
}

export async function loadPdfjsDocument(
  data: ArrayBuffer | Uint8Array,
  password?: string,
): Promise<PDFDocumentProxy> {
  ensurePdfjsWorker();
  const loadingTask = getDocument({
    data: data instanceof Uint8Array ? data : new Uint8Array(data),
    password: password || undefined,
    useSystemFonts: true,
  });
  return loadingTask.promise;
}

export async function renderPdfPageToCanvas(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  scale = 1.5,
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not prepare a canvas for PDF rendering.");
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return canvas;
}

export async function extractPdfText(
  pdf: PDFDocumentProxy,
  onProgress?: (completed: number, total: number) => void,
): Promise<string> {
  const parts: string[] = [];
  const total = pdf.numPages;
  for (let i = 1; i <= total; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) parts.push(pageText);
    onProgress?.(i, total);
  }
  return parts.join("\n\n");
}

export async function getPdfPageCount(file: File, password?: string): Promise<number> {
  const buffer = await file.arrayBuffer();
  const pdf = await loadPdfjsDocument(buffer, password);
  try {
    return pdf.numPages;
  } finally {
    await pdf.cleanup();
  }
}
