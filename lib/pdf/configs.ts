import {
  DEFAULT_PDF_MAX_BYTES,
  DEFAULT_PDF_MAX_FILES,
  type PdfToolConfig,
  type PdfToolKind,
} from "./types";

const PDF_ACCEPT = ".pdf,application/pdf";
const PDF_EXTS = ["pdf"];
const PDF_MIMES = ["application/pdf"];

function cfg(
  partial: Omit<PdfToolConfig, "maxFileSizeBytes" | "maxFiles" | "notices" | "accept" | "extensions" | "mimeTypes"> &
    Partial<Pick<PdfToolConfig, "maxFileSizeBytes" | "maxFiles" | "notices" | "accept" | "extensions" | "mimeTypes">>,
): PdfToolConfig {
  return {
    maxFileSizeBytes: DEFAULT_PDF_MAX_BYTES,
    maxFiles: DEFAULT_PDF_MAX_FILES,
    accept: PDF_ACCEPT,
    extensions: PDF_EXTS,
    mimeTypes: PDF_MIMES,
    ...partial,
    notices: partial.notices ?? [],
  };
}

function make(
  slug: string,
  kind: PdfToolKind,
  actionLabel: string,
  filenameSuffix: string,
  extras: Partial<PdfToolConfig> = {},
): PdfToolConfig {
  return cfg({
    slug,
    kind,
    actionLabel,
    processingLabel: "Processing…",
    resetLabel: "Process Another File",
    allowMultiple: false,
    maxFiles: 1,
    filenameSuffix,
    ...extras,
  });
}

export const pdfToolConfigs: Record<string, PdfToolConfig> = {
  "pdf-to-jpg": make("pdf-to-jpg", "pdf-to-image", "Convert to JPG", "jpg", {
    imageOutput: "image/jpeg",
    imageExtension: "jpg",
    notices: ["Each selected PDF page is rendered to a JPG image. Multiple pages download as a ZIP."],
  }),
  "pdf-to-png": make("pdf-to-png", "pdf-to-image", "Convert to PNG", "png", {
    imageOutput: "image/png",
    imageExtension: "png",
    notices: ["Each selected PDF page is rendered to a PNG image. Multiple pages download as a ZIP."],
  }),
  "pdf-to-webp": make("pdf-to-webp", "pdf-to-image", "Convert to WebP", "webp", {
    imageOutput: "image/webp",
    imageExtension: "webp",
    notices: ["Each selected PDF page is rendered to a WebP image. Multiple pages download as a ZIP."],
  }),
  "jpg-to-pdf": make("jpg-to-pdf", "images-to-pdf", "Create PDF", "pdf", {
    accept: ".jpg,.jpeg,image/jpeg",
    extensions: ["jpg", "jpeg"],
    mimeTypes: ["image/jpeg"],
    allowMultiple: true,
    maxFiles: 40,
    imageInput: "jpeg",
    resetLabel: "Convert More Images",
  }),
  "png-to-pdf": make("png-to-pdf", "images-to-pdf", "Create PDF", "pdf", {
    accept: ".png,image/png",
    extensions: ["png"],
    mimeTypes: ["image/png"],
    allowMultiple: true,
    maxFiles: 40,
    imageInput: "png",
    resetLabel: "Convert More Images",
  }),
  "pdf-merger": make("pdf-merger", "merge", "Merge PDFs", "merged", {
    allowMultiple: true,
    maxFiles: 30,
    resetLabel: "Merge More PDFs",
  }),
  "pdf-splitter": make("pdf-splitter", "split", "Split PDF", "split", {
    notices: ["Enter pages or ranges such as 1-3, 5, 8-10. Each range becomes its own PDF in a ZIP."],
  }),
  "pdf-compressor": make("pdf-compressor", "compress", "Compress PDF", "compressed", {
    notices: [
      "Compression re-encodes the PDF and may reduce quality of embedded images. Savings vary by document.",
    ],
  }),
  "pdf-page-extractor": make(
    "pdf-page-extractor",
    "extract-pages",
    "Extract Pages",
    "extracted",
    {
      notices: ["Enter pages or ranges such as 2,4,7-9 to keep only those pages in a new PDF."],
    },
  ),
  "pdf-page-reorderer": make("pdf-page-reorderer", "reorder", "Reorder Pages", "reordered", {
    resetLabel: "Reorder Another PDF",
  }),
  "pdf-rotator": make("pdf-rotator", "rotate", "Apply Rotation", "rotated", {
    resetLabel: "Rotate Another PDF",
  }),
  "pdf-cropper": make("pdf-cropper", "crop", "Crop PDF", "cropped", {
    notices: [
      "Crop margins are percentages of each page (0–40). Content is clipped, not stretched.",
    ],
  }),
  "pdf-metadata-viewer": make(
    "pdf-metadata-viewer",
    "metadata-viewer",
    "View Metadata",
    "metadata",
    { resetLabel: "Check Another PDF" },
  ),
  "pdf-metadata-remover": make(
    "pdf-metadata-remover",
    "metadata-remover",
    "Remove Metadata",
    "no-metadata",
    {
      notices: [
        "This tool clears common document info fields (title, author, subject, keywords, dates, and producer/creator where supported).",
      ],
    },
  ),
  "pdf-password-protector": make(
    "pdf-password-protector",
    "password-protect",
    "Protect PDF",
    "protected",
    {
      notices: ["Creates a password-protected PDF. Keep your password safe — Tool Base does not store it."],
    },
  ),
  "pdf-unlocker": make("pdf-unlocker", "unlock", "Unlock PDF", "unlocked", {
    notices: [
      "Only unlock PDFs you are authorized to open. Provide the correct password. The tool creates a new unprotected PDF from the unlocked content.",
    ],
  }),
  "pdf-page-numbering": make(
    "pdf-page-numbering",
    "page-numbering",
    "Add Page Numbers",
    "numbered",
  ),
  "pdf-watermark": make("pdf-watermark", "watermark", "Add Watermark", "watermarked"),
  "pdf-text-extractor": make(
    "pdf-text-extractor",
    "text-extract",
    "Extract Text",
    "text",
    {
      notices: [
        "Extracts the PDF text layer when available. Scanned image-only PDFs may not contain extractable text (OCR is not applied).",
      ],
      resetLabel: "Extract From Another PDF",
    },
  ),
  "pdf-to-text": make("pdf-to-text", "pdf-to-text", "Convert to TXT", "txt", {
    notices: [
      "Converts available PDF text into a .txt file. Image-only scanned PDFs may produce little or no text without OCR.",
    ],
  }),
};

export function getPdfToolConfig(slug: string): PdfToolConfig | undefined {
  return pdfToolConfigs[slug];
}

export function isPdfToolSlug(slug: string): boolean {
  return Boolean(pdfToolConfigs[slug]);
}

export const pdfToolSlugs = Object.keys(pdfToolConfigs);
