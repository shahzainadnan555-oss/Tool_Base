import type { ToolDefinition } from "./types";

function tool(
  partial: Omit<ToolDefinition, "route" | "status"> & {
    status?: ToolDefinition["status"];
  },
): ToolDefinition {
  return {
    ...partial,
    route: `/tools/${partial.slug}`,
    status: partial.status ?? "available",
  };
}

/** PDF tools — Prompt 4 */
export const pdfTools: ToolDefinition[] = [
  tool({
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    slug: "pdf-to-jpg",
    category: "pdf-tools",
    description: "Convert PDF pages into JPG images.",
    shortDescription: "Convert PDF pages to JPG images.",
    icon: "pdf",
    keywords: [
      "pdf to jpg",
      "convert pdf to jpg",
      "pdf jpg converter",
      "pdf to jpeg",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "PDF"],
    relatedToolIds: [
      "pdf-to-png",
      "pdf-to-webp",
      "jpg-to-pdf",
      "pdf-compressor",
      "pdf-splitter",
      "pdf-page-extractor",
    ],
    seoTitle: "PDF to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PDF to JPG online with Tool Base. Turn PDF pages into JPG images and download the results instantly.",
    h1: "PDF to JPG",
    intro:
      "Convert PDF pages into JPG images online. Upload a PDF, choose pages if needed, and download high-quality JPG output.",
    convertHeading: "Convert PDF to JPG Online",
    howToHeading: "How to Convert PDF to JPG",
    featuresHeading: "PDF to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your PDF",
        description: "Select the PDF to convert.",
      },
      {
        title: "Choose Pages",
        description: "Convert all pages or enter a page selection.",
      },
      {
        title: "Download Images",
        description: "Save the image file or ZIP of pages.",
      },
    ],
    faq: [
      {
        question: "Is PDF to JPG free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF to JPG keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["JPG"],
  }),
  tool({
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    slug: "jpg-to-pdf",
    category: "pdf-tools",
    description: "Convert JPG images into a PDF document.",
    shortDescription: "Create a PDF from JPG images.",
    icon: "pdf",
    keywords: [
      "jpg to pdf",
      "jpeg to pdf",
      "convert jpg to pdf",
      "image to pdf",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPEG", "JPG", "PDF"],
    relatedToolIds: [
      "png-to-pdf",
      "pdf-to-jpg",
      "pdf-merger",
      "pdf-compressor",
      "pdf-page-reorderer",
    ],
    seoTitle: "JPG to PDF Converter — Free Online | Tool Base",
    seoDescription:
      "Convert JPG to PDF online with Tool Base. Combine one or more JPEG images into a downloadable PDF.",
    h1: "JPG to PDF",
    intro:
      "Turn JPG or JPEG images into a PDF. Upload one or multiple images, reorder pages, and download a ready-to-share document.",
    convertHeading: "Convert JPG to PDF Online",
    howToHeading: "How to Convert JPG to PDF",
    featuresHeading: "JPG to PDF Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with JPG, JPEG files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Images",
        description: "Add one or more images and reorder them if needed.",
      },
      {
        title: "Create PDF",
        description: "Generate a PDF with one page per image.",
      },
      {
        title: "Download PDF",
        description: "Save the new PDF document.",
      },
    ],
    faq: [
      {
        question: "Is JPG to PDF free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does JPG to PDF keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["JPG", "JPEG"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "png-to-pdf",
    name: "PNG to PDF",
    slug: "png-to-pdf",
    category: "pdf-tools",
    description: "Convert PNG images into a PDF document.",
    shortDescription: "Create a PDF from PNG images.",
    icon: "pdf",
    keywords: ["png to pdf", "convert png to pdf", "image to pdf"],
    popular: false,
    new: true,
    supportedFormats: ["PDF", "PNG"],
    relatedToolIds: [
      "jpg-to-pdf",
      "pdf-to-png",
      "pdf-merger",
      "pdf-compressor",
    ],
    seoTitle: "PNG to PDF Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PNG to PDF online with Tool Base. Combine PNG images into a clean PDF document for sharing or printing.",
    h1: "PNG to PDF",
    intro:
      "Create a PDF from PNG images. Upload files, set page order, and download a PDF that preserves your image layout.",
    convertHeading: "Convert PNG to PDF Online",
    howToHeading: "How to Convert PNG to PDF",
    featuresHeading: "PNG to PDF Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PNG files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Images",
        description: "Add one or more images and reorder them if needed.",
      },
      {
        title: "Create PDF",
        description: "Generate a PDF with one page per image.",
      },
      {
        title: "Download PDF",
        description: "Save the new PDF document.",
      },
    ],
    faq: [
      {
        question: "Is PNG to PDF free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PNG to PDF keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PNG"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-to-png",
    name: "PDF to PNG",
    slug: "pdf-to-png",
    category: "pdf-tools",
    description: "Convert PDF pages into PNG images.",
    shortDescription: "Convert PDF pages to PNG images.",
    icon: "pdf",
    keywords: ["pdf to png", "convert pdf to png", "pdf png converter"],
    popular: true,
    new: false,
    supportedFormats: ["PDF", "PNG"],
    relatedToolIds: [
      "pdf-to-jpg",
      "pdf-to-webp",
      "png-to-pdf",
      "pdf-compressor",
      "pdf-splitter",
    ],
    seoTitle: "PDF to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PDF to PNG online with Tool Base. Export PDF pages as PNG images with optional page selection.",
    h1: "PDF to PNG",
    intro:
      "Export PDF pages as PNG images. Choose specific pages or convert the whole document, then download the results.",
    convertHeading: "Convert PDF to PNG Online",
    howToHeading: "How to Convert PDF to PNG",
    featuresHeading: "PDF to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your PDF",
        description: "Select the PDF to convert.",
      },
      {
        title: "Choose Pages",
        description: "Convert all pages or enter a page selection.",
      },
      {
        title: "Download Images",
        description: "Save the image file or ZIP of pages.",
      },
    ],
    faq: [
      {
        question: "Is PDF to PNG free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF to PNG keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "pdf-to-webp",
    name: "PDF to WebP",
    slug: "pdf-to-webp",
    category: "pdf-tools",
    description: "Convert PDF pages into WebP images.",
    shortDescription: "Convert PDF pages to WebP images.",
    icon: "pdf",
    keywords: ["pdf to webp", "convert pdf to webp", "pdf webp converter"],
    popular: false,
    new: true,
    supportedFormats: ["PDF", "WebP"],
    relatedToolIds: [
      "pdf-to-jpg",
      "pdf-to-png",
      "pdf-compressor",
      "webp-compressor",
    ],
    seoTitle: "PDF to WebP Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PDF to WebP online with Tool Base. Turn PDF pages into modern WebP images for the web.",
    h1: "PDF to WebP",
    intro:
      "Convert PDF pages into WebP images for lighter web delivery. Select pages and download valid WebP output.",
    convertHeading: "Convert PDF to WebP Online",
    howToHeading: "How to Convert PDF to WebP",
    featuresHeading: "PDF to WebP Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your PDF",
        description: "Select the PDF to convert.",
      },
      {
        title: "Choose Pages",
        description: "Convert all pages or enter a page selection.",
      },
      {
        title: "Download Images",
        description: "Save the image file or ZIP of pages.",
      },
    ],
    faq: [
      {
        question: "Is PDF to WebP free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF to WebP keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["WebP"],
  }),
  tool({
    id: "pdf-merger",
    name: "PDF Merger",
    slug: "pdf-merger",
    category: "pdf-tools",
    description: "Merge multiple PDF files into one document.",
    shortDescription: "Combine multiple PDFs into one file.",
    icon: "pdf",
    keywords: ["merge pdf", "combine pdf", "pdf merger", "join pdf"],
    popular: true,
    new: false,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-splitter",
      "pdf-page-extractor",
      "pdf-compressor",
      "pdf-page-reorderer",
      "jpg-to-pdf",
    ],
    seoTitle: "PDF Merger — Merge PDF Files Online | Tool Base",
    seoDescription:
      "Merge PDF files online with Tool Base. Upload multiple PDFs, set the order, and download one combined document.",
    h1: "PDF Merger",
    intro:
      "Combine multiple PDF files into a single document. Upload files, reorder them, merge, and download the result.",
    convertHeading: "Merge PDF Files Online",
    howToHeading: "How to Merge PDFs",
    featuresHeading: "PDF Merger Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload PDF Files",
        description: "Add two or more PDFs and arrange them in order.",
      },
      {
        title: "Merge PDFs",
        description: "Combine the files into one document.",
      },
      {
        title: "Download Merged PDF",
        description: "Save the merged result.",
      },
    ],
    faq: [
      {
        question: "Is PDF Merger free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Merger keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-splitter",
    name: "PDF Splitter",
    slug: "pdf-splitter",
    category: "pdf-tools",
    description: "Split a PDF into separate files by pages or ranges.",
    shortDescription: "Split PDFs by pages or ranges.",
    icon: "pdf",
    keywords: [
      "split pdf",
      "pdf splitter",
      "extract pages from pdf",
      "separate pdf pages",
    ],
    popular: true,
    new: false,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-page-extractor",
      "pdf-merger",
      "pdf-rotator",
      "pdf-cropper",
      "pdf-compressor",
    ],
    seoTitle: "PDF Splitter — Split PDF Online | Tool Base",
    seoDescription:
      "Split PDF files online with Tool Base. Separate pages or ranges into individual PDF files and download the results.",
    h1: "PDF Splitter",
    intro:
      "Split a PDF by individual pages or ranges such as 1-3, 5, 8-10. Download each part as its own PDF.",
    convertHeading: "Split PDF Files Online",
    howToHeading: "How to Split a PDF",
    featuresHeading: "PDF Splitter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the file you want to process with PDF Splitter.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Splitter free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Splitter keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-compressor",
    name: "PDF Compressor",
    slug: "pdf-compressor",
    category: "pdf-tools",
    description: "Compress PDF files to reduce document size.",
    shortDescription: "Reduce PDF file size online.",
    icon: "pdf",
    keywords: [
      "pdf compressor",
      "compress pdf",
      "reduce pdf size",
      "pdf size reducer",
    ],
    popular: true,
    new: false,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-merger",
      "pdf-splitter",
      "pdf-to-jpg",
      "pdf-to-png",
      "pdf-to-webp",
      "pdf-text-extractor",
    ],
    seoTitle: "PDF Compressor — Compress PDF Online | Tool Base",
    seoDescription:
      "Compress PDF files online with Tool Base. Reduce document size and compare original vs compressed file sizes.",
    h1: "PDF Compressor",
    intro:
      "Reduce PDF file size for easier sharing and uploads. Upload a PDF, compress it, review real size savings, and download.",
    convertHeading: "Compress PDF Files Online",
    howToHeading: "How to Compress a PDF",
    featuresHeading: "PDF Compression Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your PDF",
        description: "Choose the PDF you want to compress.",
      },
      {
        title: "Compress Your File",
        description:
          "Start compression and wait for the measured size comparison.",
      },
      {
        title: "Download the Compressed PDF",
        description: "Save the reduced PDF when processing finishes.",
      },
    ],
    faq: [
      {
        question: "Is PDF Compressor free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Compressor keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "Will every PDF get smaller?",
        answer:
          "No. Already optimized PDFs may not shrink further. Tool Base always shows actual measured sizes.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-page-extractor",
    name: "PDF Page Extractor",
    slug: "pdf-page-extractor",
    category: "pdf-tools",
    description: "Extract selected pages into a new PDF.",
    shortDescription: "Extract specific pages from a PDF.",
    icon: "pdf",
    keywords: [
      "pdf page extractor",
      "extract pages from pdf",
      "pdf extract pages",
    ],
    popular: false,
    new: true,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-splitter",
      "pdf-merger",
      "pdf-page-reorderer",
      "pdf-rotator",
    ],
    seoTitle: "PDF Page Extractor — Extract PDF Pages | Tool Base",
    seoDescription:
      "Extract PDF pages online with Tool Base. Keep only the pages you need and download a new PDF.",
    h1: "PDF Page Extractor",
    intro:
      "Pull selected pages such as 2,4,7-9 into a new PDF while leaving the rest behind.",
    convertHeading: "Extract PDF Pages Online",
    howToHeading: "How to Extract PDF Pages",
    featuresHeading: "PDF Page Extractor Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description:
          "Choose the file you want to process with PDF Page Extractor.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Page Extractor free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Page Extractor keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-page-reorderer",
    name: "PDF Page Reorderer",
    slug: "pdf-page-reorderer",
    category: "pdf-tools",
    description: "Reorder PDF pages before downloading.",
    shortDescription: "Change the order of PDF pages.",
    icon: "pdf",
    keywords: ["pdf page reorder", "reorder pdf pages", "rearrange pdf"],
    popular: false,
    new: true,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-page-extractor",
      "pdf-merger",
      "pdf-rotator",
      "pdf-splitter",
    ],
    seoTitle: "PDF Page Reorderer — Rearrange PDF Pages | Tool Base",
    seoDescription:
      "Reorder PDF pages online with Tool Base. Move pages up or down, remove unwanted pages, and download the new order.",
    h1: "PDF Page Reorderer",
    intro:
      "Rearrange PDF pages into the exact order you need. Move pages, remove extras, and generate an updated PDF.",
    convertHeading: "Reorder PDF Pages Online",
    howToHeading: "How to Reorder PDF Pages",
    featuresHeading: "PDF Page Reorderer Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description:
          "Choose the file you want to process with PDF Page Reorderer.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Page Reorderer free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Page Reorderer keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-rotator",
    name: "PDF Rotator",
    slug: "pdf-rotator",
    category: "pdf-tools",
    description: "Rotate PDF pages by 90°, 180°, or 270°.",
    shortDescription: "Rotate PDF pages online.",
    icon: "pdf",
    keywords: ["pdf rotator", "rotate pdf", "rotate pdf pages"],
    popular: false,
    new: false,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-cropper",
      "pdf-page-reorderer",
      "pdf-splitter",
      "pdf-page-extractor",
    ],
    seoTitle: "PDF Rotator — Rotate PDF Pages Online | Tool Base",
    seoDescription:
      "Rotate PDF pages online with Tool Base. Apply 90°, 180°, or 270° rotation and download the updated PDF.",
    h1: "PDF Rotator",
    intro:
      "Fix sideways or upside-down PDF pages by rotating them, then download a corrected document.",
    convertHeading: "Rotate PDF Pages Online",
    howToHeading: "How to Rotate a PDF",
    featuresHeading: "PDF Rotator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the file you want to process with PDF Rotator.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Rotator free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Rotator keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-cropper",
    name: "PDF Cropper",
    slug: "pdf-cropper",
    category: "pdf-tools",
    description: "Crop PDF page margins without distorting content.",
    shortDescription: "Crop PDF pages online.",
    icon: "pdf",
    keywords: ["pdf cropper", "crop pdf", "trim pdf margins"],
    popular: false,
    new: true,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-rotator",
      "pdf-page-extractor",
      "pdf-splitter",
      "pdf-compressor",
    ],
    seoTitle: "PDF Cropper — Crop PDF Pages Online | Tool Base",
    seoDescription:
      "Crop PDF pages online with Tool Base. Trim margins on selected pages and download a clipped PDF.",
    h1: "PDF Cropper",
    intro:
      "Trim unwanted margins from PDF pages. Set crop percentages, apply to selected pages, and download the result.",
    convertHeading: "Crop PDF Pages Online",
    howToHeading: "How to Crop a PDF",
    featuresHeading: "PDF Cropper Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the file you want to process with PDF Cropper.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Cropper free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Cropper keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-metadata-viewer",
    name: "PDF Metadata Viewer",
    slug: "pdf-metadata-viewer",
    category: "pdf-tools",
    description: "View available PDF document metadata.",
    shortDescription: "Inspect PDF metadata fields.",
    icon: "pdf",
    keywords: ["pdf metadata", "pdf properties", "pdf info viewer"],
    popular: false,
    new: false,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-metadata-remover",
      "pdf-text-extractor",
      "pdf-compressor",
    ],
    seoTitle: "PDF Metadata Viewer — View PDF Info Online | Tool Base",
    seoDescription:
      "View PDF metadata online with Tool Base. Inspect title, author, dates, page count, and other available fields.",
    h1: "PDF Metadata Viewer",
    intro:
      "Inspect PDF document information such as title, author, creator, dates, and page count when those fields exist.",
    convertHeading: "View PDF Metadata Online",
    howToHeading: "How to View PDF Metadata",
    featuresHeading: "PDF Metadata Viewer Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description:
          "Choose the file you want to process with PDF Metadata Viewer.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Metadata Viewer free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Metadata Viewer keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-metadata-remover",
    name: "PDF Metadata Remover",
    slug: "pdf-metadata-remover",
    category: "pdf-tools",
    description: "Remove common PDF metadata fields.",
    shortDescription: "Clear PDF document info fields.",
    icon: "pdf",
    keywords: [
      "remove pdf metadata",
      "pdf metadata remover",
      "strip pdf metadata",
    ],
    popular: false,
    new: true,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-metadata-viewer",
      "pdf-password-protector",
      "pdf-compressor",
    ],
    seoTitle: "PDF Metadata Remover — Remove PDF Info | Tool Base",
    seoDescription:
      "Remove PDF metadata online with Tool Base. Clear common document info fields and download a cleaned PDF.",
    h1: "PDF Metadata Remover",
    intro:
      "Clear common PDF info fields before sharing. Upload a PDF, remove supported metadata, and download the cleaned file.",
    convertHeading: "Remove PDF Metadata Online",
    howToHeading: "How to Remove PDF Metadata",
    featuresHeading: "PDF Metadata Remover Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description:
          "Choose the file you want to process with PDF Metadata Remover.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Metadata Remover free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Metadata Remover keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-password-protector",
    name: "PDF Password Protector",
    slug: "pdf-password-protector",
    category: "pdf-tools",
    description: "Password-protect a PDF with encryption.",
    shortDescription: "Add a password to a PDF.",
    icon: "pdf",
    keywords: ["pdf password", "protect pdf", "encrypt pdf", "lock pdf"],
    popular: true,
    new: false,
    supportedFormats: ["PDF"],
    relatedToolIds: ["pdf-unlocker", "pdf-metadata-remover", "pdf-compressor"],
    seoTitle: "PDF Password Protector — Encrypt PDF Online | Tool Base",
    seoDescription:
      "Password-protect PDF files online with Tool Base. Encrypt a PDF with your password and download the secured file.",
    h1: "PDF Password Protector",
    intro:
      "Add password protection to a PDF before sharing. Enter and confirm a password, then download an encrypted document.",
    convertHeading: "Protect PDF Files Online",
    howToHeading: "How to Password Protect a PDF",
    featuresHeading: "PDF Password Protector Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description:
          "Choose the file you want to process with PDF Password Protector.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Password Protector free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Password Protector keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "Is the password stored?",
        answer:
          "No. The password is used only to encrypt the file session and is not stored by Tool Base.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-unlocker",
    name: "PDF Unlocker",
    slug: "pdf-unlocker",
    category: "pdf-tools",
    description: "Unlock a PDF when you know the password.",
    shortDescription: "Remove PDF password with authorization.",
    icon: "pdf",
    keywords: [
      "pdf unlocker",
      "unlock pdf",
      "remove pdf password",
      "decrypt pdf",
    ],
    popular: false,
    new: false,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-password-protector",
      "pdf-metadata-remover",
      "pdf-compressor",
    ],
    seoTitle: "PDF Unlocker — Unlock PDF Online | Tool Base",
    seoDescription:
      "Unlock PDF files online with Tool Base when you know the password. Create an unprotected copy you are authorized to open.",
    h1: "PDF Unlocker",
    intro:
      "Remove password protection from a PDF you are authorized to open. Provide the password and download an unlocked copy.",
    convertHeading: "Unlock PDF Files Online",
    howToHeading: "How to Unlock a PDF",
    featuresHeading: "PDF Unlocker Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the file you want to process with PDF Unlocker.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Unlocker free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Unlocker keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "Can it crack unknown passwords?",
        answer:
          "No. You must provide the correct password for a PDF you are authorized to open.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-page-numbering",
    name: "PDF Page Numbering",
    slug: "pdf-page-numbering",
    category: "pdf-tools",
    description: "Add page numbers to a PDF document.",
    shortDescription: "Insert page numbers into a PDF.",
    icon: "pdf",
    keywords: ["pdf page numbers", "add page numbers to pdf", "pdf numbering"],
    popular: false,
    new: true,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-watermark",
      "pdf-page-reorderer",
      "pdf-rotator",
      "pdf-compressor",
    ],
    seoTitle: "PDF Page Numbering — Add Page Numbers Online | Tool Base",
    seoDescription:
      "Add page numbers to PDF files online with Tool Base. Choose position, format, and starting number, then download.",
    h1: "PDF Page Numbering Tool",
    intro:
      "Add clear page numbers to your PDF. Choose position, starting number, and format such as 1 or Page 1.",
    convertHeading: "Add PDF Page Numbers Online",
    howToHeading: "How to Add Page Numbers to a PDF",
    featuresHeading: "PDF Page Numbering Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description:
          "Choose the file you want to process with PDF Page Numbering.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Page Numbering free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Page Numbering keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-watermark",
    name: "PDF Watermark Tool",
    slug: "pdf-watermark",
    category: "pdf-tools",
    description: "Add a text watermark to PDF pages.",
    shortDescription: "Watermark PDF pages with custom text.",
    icon: "pdf",
    keywords: ["pdf watermark", "add watermark to pdf", "watermark pdf"],
    popular: false,
    new: true,
    supportedFormats: ["PDF"],
    relatedToolIds: [
      "pdf-page-numbering",
      "pdf-password-protector",
      "pdf-compressor",
      "pdf-metadata-remover",
    ],
    seoTitle: "PDF Watermark Tool — Add Watermark Online | Tool Base",
    seoDescription:
      "Add a text watermark to PDF files online with Tool Base. Control opacity, rotation, size, and color, then download.",
    h1: "PDF Watermark Tool",
    intro:
      "Place a custom text watermark across PDF pages. Adjust opacity, rotation, size, and position, then download the result.",
    convertHeading: "Watermark PDF Files Online",
    howToHeading: "How to Watermark a PDF",
    featuresHeading: "PDF Watermark Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description:
          "Choose the file you want to process with PDF Watermark Tool.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF Watermark Tool free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Watermark Tool keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-text-extractor",
    name: "PDF Text Extractor",
    slug: "pdf-text-extractor",
    category: "pdf-tools",
    description: "Extract text from a PDF text layer.",
    shortDescription: "Copy text from PDF documents.",
    icon: "pdf",
    keywords: ["pdf text extractor", "extract text from pdf", "pdf copy text"],
    popular: true,
    new: false,
    supportedFormats: ["PDF", "TXT"],
    relatedToolIds: [
      "pdf-to-text",
      "pdf-metadata-viewer",
      "pdf-compressor",
      "pdf-to-jpg",
    ],
    seoTitle: "PDF Text Extractor — Extract Text Online | Tool Base",
    seoDescription:
      "Extract text from PDF files online with Tool Base. Copy or download the text layer when the document contains selectable text.",
    h1: "PDF Text Extractor",
    intro:
      "Extract available text from a PDF’s text layer. Copy results or download a TXT file. Scanned image-only PDFs may not include extractable text.",
    convertHeading: "Extract Text from PDF Online",
    howToHeading: "How to Extract Text from a PDF",
    featuresHeading: "PDF Text Extractor Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your PDF",
        description: "Choose a PDF that contains a text layer.",
      },
      {
        title: "Extract Text",
        description: "Read available text from the document.",
      },
      {
        title: "Copy or Download",
        description: "Copy the text or download a TXT file.",
      },
    ],
    faq: [
      {
        question: "Is PDF Text Extractor free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF Text Extractor keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "Does this use OCR?",
        answer:
          "No. It extracts the existing text layer. Scanned image-only PDFs may have little or no extractable text.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["TXT"],
  }),
  tool({
    id: "pdf-to-text",
    name: "PDF to Text",
    slug: "pdf-to-text",
    category: "pdf-tools",
    description: "Convert PDF text into a TXT file.",
    shortDescription: "Convert PDF documents to TXT.",
    icon: "pdf",
    keywords: [
      "pdf to text",
      "pdf to txt",
      "convert pdf to text",
      "pdf txt converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["PDF", "TXT"],
    relatedToolIds: [
      "pdf-text-extractor",
      "pdf-to-jpg",
      "pdf-compressor",
      "pdf-metadata-viewer",
    ],
    seoTitle: "PDF to Text Converter — PDF to TXT Online | Tool Base",
    seoDescription:
      "Convert PDF to text online with Tool Base. Turn available PDF text into a downloadable TXT file.",
    h1: "PDF to Text Converter",
    intro:
      "Convert a PDF’s text layer into a TXT file while preserving a sensible reading order across pages when text is available.",
    convertHeading: "Convert PDF to Text Online",
    howToHeading: "How to Convert PDF to Text",
    featuresHeading: "PDF to Text Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related PDF Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Works with PDF files",
      "Clear upload → process → download flow",
      "One processing state with accurate progress when measurable",
      "No account required",
      "Mobile-friendly controls",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the file you want to process with PDF to Text.",
      },
      {
        title: "Configure and Process",
        description: "Adjust options if needed, then start processing.",
      },
      {
        title: "Download the Result",
        description: "Save the finished file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PDF to Text free to use?",
        answer:
          "Yes. Tool Base PDF tools are free to use and do not require an account.",
      },
      {
        question: "Does PDF to Text keep my files private?",
        answer:
          "This tool is designed to process PDF files for this workflow. Your source file is not uploaded to Tool Base servers to complete the operation, though the page may still load Tool Base assets or PDF runtimes over the network.",
      },
      {
        question: "What if my PDF fails?",
        answer:
          "Try another file, confirm the PDF is not damaged, and check whether a password is required.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["TXT"],
  }),
];
