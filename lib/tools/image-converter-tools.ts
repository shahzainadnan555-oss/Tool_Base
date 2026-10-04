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

/** Image conversion tools — Prompt 2 */
export const imageConverterTools: ToolDefinition[] = [
  tool({
    id: "jpg-to-png",
    name: "JPG to PNG",
    slug: "jpg-to-png",
    category: "image-tools",
    description: "Convert JPG and JPEG images to PNG format.",
    shortDescription: "Convert JPG and JPEG images to PNG format.",
    icon: "image-convert",
    keywords: [
      "jpg to png",
      "jpeg to png",
      "jpg png converter",
      "convert jpg to png",
      "online jpg to png converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG"],
    relatedToolIds: [
      "png-to-jpg",
      "jpg-to-webp",
      "png-to-webp",
      "image-compressor",
      "image-resizer",
    ],
    seoTitle: "JPG to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert JPG and JPEG images to PNG online with Tool Base. Upload your image, convert it, and download the PNG instantly.",
    h1: "JPG to PNG Converter",
    intro:
      "Convert JPG images to PNG format online with Tool Base. Upload your JPG or JPEG file, convert it directly, and download the resulting PNG — no account required.",
    convertHeading: "Convert JPG to PNG Online",
    howToHeading: "How to Convert JPG to PNG",
    featuresHeading: "JPG to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "JPG and JPEG both accepted",
      "Fast conversion",
      "Preserves dimensions",
      "Simple upload → convert → download",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your JPG Image",
        description: "Select a JPG file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a PNG file.",
      },
      {
        title: "Download Your PNG",
        description: "Save the converted .png file to your device.",
      },
    ],
    faq: [
      {
        question: "Can I convert JPEG as well as JPG?",
        answer:
          "Yes. JPG and JPEG are the same format family, so both work with this converter.",
      },
      {
        question: "Is this free to use?",
        answer: "Yes. No account is required to convert your image.",
      },
      {
        question: "Will the PNG be larger than my JPG?",
        answer:
          "Often yes. PNG is useful when you want a lossless-friendly still image format.",
      },
    ],
    inputFormats: ["JPG", "JPEG"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "png-to-jpg",
    name: "PNG to JPG",
    slug: "png-to-jpg",
    category: "image-tools",
    description: "Convert PNG images to JPG with a compatible background.",
    shortDescription: "Convert PNG images to JPG with a compatible background.",
    icon: "image-convert",
    keywords: [
      "png to jpg",
      "png to jpeg",
      "convert png to jpg",
      "png jpg converter",
      "online png to jpg converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["PNG", "JPG"],
    relatedToolIds: [
      "jpg-to-png",
      "png-to-webp",
      "webp-to-jpg",
      "image-compressor",
      "jpg-to-webp",
    ],
    seoTitle: "PNG to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PNG to JPG online with Tool Base. Upload a PNG, convert it, and download a JPEG file instantly.",
    h1: "PNG to JPG Converter",
    intro:
      "Turn PNG images into JPG files when you need a widely compatible photo format. Transparent PNG areas are filled with a white background because JPG does not support alpha transparency.",
    convertHeading: "Convert PNG to JPG Online",
    howToHeading: "How to Convert PNG to JPG",
    featuresHeading: "PNG to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "PNG to JPG conversion",
      "Transparency flattened to white",
      "Free and straightforward workflow",
      "Clear preview before converting",
      "Works on mobile and desktop",
    ],
    howToSteps: [
      {
        title: "Upload Your PNG Image",
        description: "Select a PNG file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a JPG file.",
      },
      {
        title: "Download Your JPG",
        description: "Save the converted .jpg file to your device.",
      },
    ],
    faq: [
      {
        question: "What happens to transparent pixels?",
        answer:
          "JPG cannot store transparency. Transparent areas are filled with white before encoding.",
      },
      {
        question: "Is this free to use?",
        answer: "Yes. No account or payment is required.",
      },
      {
        question: "Can I convert to JPEG?",
        answer:
          "Yes. The downloaded file uses the .jpg extension for JPEG output.",
      },
    ],
    inputFormats: ["PNG"],
    outputFormats: ["JPG"],
  }),
  tool({
    id: "jpg-to-webp",
    name: "JPG to WebP",
    slug: "jpg-to-webp",
    category: "image-tools",
    description: "Convert JPG images to modern WebP format.",
    shortDescription: "Convert JPG images to modern WebP format.",
    icon: "image-convert",
    keywords: [
      "jpg to webp",
      "jpeg to webp",
      "convert jpg to webp",
      "jpg webp converter",
      "online jpg to webp",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "WebP"],
    relatedToolIds: [
      "webp-to-jpg",
      "png-to-webp",
      "jpg-to-png",
      "image-compressor",
      "webp-to-png",
    ],
    seoTitle: "JPG to WebP Converter — Free Online | Tool Base",
    seoDescription:
      "Convert JPG to WebP online with Tool Base. Create WebP images from JPEG files for free.",
    h1: "JPG to WebP Converter",
    intro:
      "Convert JPG and JPEG images to WebP for a modern format often used for efficient web delivery. Upload, convert, and download the WebP file.",
    convertHeading: "Convert JPG to WebP Online",
    howToHeading: "How to Convert JPG to WebP",
    featuresHeading: "JPG to WebP Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "JPG/JPEG to WebP conversion",
      "Browser-side processing",
      "Useful for website image workflows",
      "No sign-up needed",
      "Instant download after conversion",
    ],
    howToSteps: [
      {
        title: "Upload Your JPG Image",
        description: "Select a JPG file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a WebP file.",
      },
      {
        title: "Download Your WebP",
        description: "Save the converted .webp file to your device.",
      },
    ],
    faq: [
      {
        question: "Why convert JPG to WebP?",
        answer:
          "WebP is commonly used on the web because it can deliver strong quality at smaller sizes for many images.",
      },
      {
        question: "Do I need special software?",
        answer:
          "No. Tool Base converts the file and lets you download WebP directly.",
      },
      {
        question: "Is quality preserved?",
        answer:
          "Tool Base uses a high-quality WebP encoding setting. Exact size savings depend on the image.",
      },
    ],
    inputFormats: ["JPG", "JPEG"],
    outputFormats: ["WebP"],
  }),
  tool({
    id: "webp-to-jpg",
    name: "WebP to JPG",
    slug: "webp-to-jpg",
    category: "image-tools",
    description: "Convert WebP images to widely compatible JPG files.",
    shortDescription: "Convert WebP images to widely compatible JPG files.",
    icon: "image-convert",
    keywords: [
      "webp to jpg",
      "webp to jpeg",
      "convert webp to jpg",
      "webp jpg converter",
      "online webp to jpg",
    ],
    popular: true,
    new: false,
    supportedFormats: ["WebP", "JPG"],
    relatedToolIds: [
      "jpg-to-webp",
      "png-to-jpg",
      "webp-to-png",
      "image-compressor",
      "jpg-to-png",
    ],
    seoTitle: "WebP to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert WebP to JPG online with Tool Base. Upload a WebP image, convert it, and download a JPEG file.",
    h1: "WebP to JPG Converter",
    intro:
      "Convert WebP images to JPG when you need broader compatibility with apps, editors, or devices that prefer JPEG. Transparent areas become white because JPG has no alpha channel.",
    convertHeading: "Convert WebP to JPG Online",
    howToHeading: "How to Convert WebP to JPG",
    featuresHeading: "WebP to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "WebP to JPG conversion",
      "Transparency flattened for JPG",
      "Free with no account required",
      "Preview before downloading",
      "Mobile-friendly interface",
    ],
    howToSteps: [
      {
        title: "Upload Your WebP Image",
        description: "Select a WebP file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a JPG file.",
      },
      {
        title: "Download Your JPG",
        description: "Save the converted .jpg file to your device.",
      },
    ],
    faq: [
      {
        question: "Why convert WebP to JPG?",
        answer:
          "Some older apps and workflows still prefer JPG. This converter helps bridge that compatibility gap.",
      },
      {
        question: "Are transparent WebP images supported?",
        answer:
          "Yes. Transparent areas are filled with white so the JPG remains valid.",
      },
      {
        question: "Is the conversion local?",
        answer: "Yes. Processing runs for this tool.",
      },
    ],
    inputFormats: ["WebP"],
    outputFormats: ["JPG"],
  }),
  tool({
    id: "png-to-webp",
    name: "PNG to WebP",
    slug: "png-to-webp",
    category: "image-tools",
    description:
      "Convert PNG images to WebP while aiming to keep transparency.",
    shortDescription:
      "Convert PNG images to WebP while aiming to keep transparency.",
    icon: "image-convert",
    keywords: [
      "png to webp",
      "convert png to webp",
      "png webp converter",
      "online png to webp",
    ],
    popular: false,
    new: true,
    supportedFormats: ["PNG", "WebP"],
    relatedToolIds: [
      "webp-to-png",
      "jpg-to-webp",
      "png-to-jpg",
      "image-compressor",
      "webp-to-jpg",
    ],
    seoTitle: "PNG to WebP Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PNG to WebP online with Tool Base. Upload a PNG, convert it, and download the WebP result.",
    h1: "PNG to WebP Converter",
    intro:
      "Convert PNG graphics to WebP when you want a modern web-friendly format. Where your browser’s WebP encoder supports alpha, transparent regions can be preserved.",
    convertHeading: "Convert PNG to WebP Online",
    howToHeading: "How to Convert PNG to WebP",
    featuresHeading: "PNG to WebP Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "PNG to WebP conversion",
      "Transparency preserved when encoder supports alpha",
      "Free and private browser workflow",
      "Clear validation messages",
      "Fast convert-and-download path",
    ],
    howToSteps: [
      {
        title: "Upload Your PNG Image",
        description: "Select a PNG file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a WebP file.",
      },
      {
        title: "Download Your WebP",
        description: "Save the converted .webp file to your device.",
      },
    ],
    faq: [
      {
        question: "Does WebP keep PNG transparency?",
        answer:
          "When your browser supports WebP alpha encoding, Tool Base attempts to preserve transparency.",
      },
      {
        question: "Is this better for websites?",
        answer:
          "WebP is often used for web delivery. Choose it when your publishing stack supports WebP.",
      },
      {
        question: "Do I need an account?",
        answer: "No. Upload, convert, and download without signing up.",
      },
    ],
    inputFormats: ["PNG"],
    outputFormats: ["WebP"],
  }),
  tool({
    id: "webp-to-png",
    name: "WebP to PNG",
    slug: "webp-to-png",
    category: "image-tools",
    description: "Convert WebP images to PNG for editing and design workflows.",
    shortDescription:
      "Convert WebP images to PNG for editing and design workflows.",
    icon: "image-convert",
    keywords: [
      "webp to png",
      "convert webp to png",
      "webp png converter",
      "online webp to png",
    ],
    popular: false,
    new: false,
    supportedFormats: ["WebP", "PNG"],
    relatedToolIds: [
      "png-to-webp",
      "webp-to-jpg",
      "png-to-jpg",
      "image-compressor",
      "jpg-to-png",
    ],
    seoTitle: "WebP to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert WebP to PNG online with Tool Base. Upload your WebP file, convert it, and download a PNG.",
    h1: "WebP to PNG Converter",
    intro:
      "Convert WebP images to PNG when you need a format that is widely supported in design tools and editing workflows. Transparency is preserved when present in the source WebP.",
    convertHeading: "Convert WebP to PNG Online",
    howToHeading: "How to Convert WebP to PNG",
    featuresHeading: "WebP to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "WebP to PNG conversion",
      "Keeps transparency when available",
      "No upload to a conversion server for this workflow",
      "Simple preview and download",
      "Works across modern browsers",
    ],
    howToSteps: [
      {
        title: "Upload Your WebP Image",
        description: "Select a WebP file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a PNG file.",
      },
      {
        title: "Download Your PNG",
        description: "Save the converted .png file to your device.",
      },
    ],
    faq: [
      {
        question: "Why convert WebP to PNG?",
        answer:
          "PNG is often easier to use in design tools, screenshots workflows, and editing software.",
      },
      {
        question: "Is animation preserved?",
        answer: "No. This converter produces a still PNG image.",
      },
      {
        question: "Can I convert animated WebP?",
        answer:
          "The tool converts a still representation of the image. Use a dedicated animation workflow if you need every frame.",
      },
    ],
    inputFormats: ["WebP"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "gif-to-png",
    name: "GIF to PNG",
    slug: "gif-to-png",
    category: "image-tools",
    description: "Convert GIF images to PNG using the first frame.",
    shortDescription: "Convert GIF images to PNG using the first frame.",
    icon: "image-convert",
    keywords: [
      "gif to png",
      "convert gif to png",
      "gif png converter",
      "online gif to png",
    ],
    popular: false,
    new: true,
    supportedFormats: ["GIF", "PNG"],
    relatedToolIds: [
      "gif-to-jpg",
      "png-to-jpg",
      "png-to-webp",
      "image-compressor",
      "webp-to-png",
    ],
    seoTitle: "GIF to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert GIF to PNG online with Tool Base. Upload a GIF, convert the first frame, and download a PNG file.",
    h1: "GIF to PNG Converter",
    intro:
      "Convert GIF files to PNG online. Animated GIFs are converted using the first visible frame because PNG is a still-image format and cannot represent animation.",
    convertHeading: "Convert GIF to PNG Online",
    howToHeading: "How to Convert GIF to PNG",
    featuresHeading: "GIF to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "GIF to PNG conversion",
      "Clear notice for animated GIF limitation",
      "No account required",
      "Predictable still-frame output",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your GIF Image",
        description: "Select a GIF file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a PNG file.",
      },
      {
        title: "Download Your PNG",
        description: "Save the converted .png file to your device.",
      },
    ],
    faq: [
      {
        question: "Does this keep GIF animation?",
        answer:
          "No. PNG is not an animated format. Tool Base converts the first visible frame and states that clearly.",
      },
      {
        question: "Why convert GIF to PNG?",
        answer:
          "PNG is useful when you need a still image for editing, publishing, or further conversion.",
      },
      {
        question: "Are transparent GIFs supported?",
        answer:
          "Yes. Transparency in the converted frame is preserved in PNG when present.",
      },
    ],
    inputFormats: ["GIF"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "gif-to-jpg",
    name: "GIF to JPG",
    slug: "gif-to-jpg",
    category: "image-tools",
    description: "Convert GIF images to JPG using the first frame.",
    shortDescription: "Convert GIF images to JPG using the first frame.",
    icon: "image-convert",
    keywords: [
      "gif to jpg",
      "convert gif to jpg",
      "gif jpg converter",
      "online gif to jpg",
    ],
    popular: false,
    new: false,
    supportedFormats: ["GIF", "JPG"],
    relatedToolIds: [
      "gif-to-png",
      "png-to-jpg",
      "bmp-to-jpg",
      "image-compressor",
      "jpg-to-png",
    ],
    seoTitle: "GIF to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert GIF to JPG online with Tool Base. Upload a GIF, convert the first frame, and download a JPEG file.",
    h1: "GIF to JPG Converter",
    intro:
      "Convert GIF files to JPG online. Because JPG is a still format, animated GIFs are converted from the first visible frame. Transparent areas are filled with white.",
    convertHeading: "Convert GIF to JPG Online",
    howToHeading: "How to Convert GIF to JPG",
    featuresHeading: "GIF to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "GIF to JPG conversion",
      "Animated GIFs use the first frame only",
      "Transparency flattened for JPG",
      "Free browser conversion",
      "Straightforward download",
    ],
    howToSteps: [
      {
        title: "Upload Your GIF Image",
        description: "Select a GIF file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a JPG file.",
      },
      {
        title: "Download Your JPG",
        description: "Save the converted .jpg file to your device.",
      },
    ],
    faq: [
      {
        question: "Is animation preserved in JPG?",
        answer:
          "No. JPG cannot store animation. Only the first frame is converted.",
      },
      {
        question: "What about transparent GIFs?",
        answer:
          "Transparent areas are filled with white because JPG has no alpha channel.",
      },
      {
        question: "Can I convert to JPEG?",
        answer:
          "Yes. The output is a standard JPEG file with a .jpg extension.",
      },
    ],
    inputFormats: ["GIF"],
    outputFormats: ["JPG"],
  }),
  tool({
    id: "bmp-to-jpg",
    name: "BMP to JPG",
    slug: "bmp-to-jpg",
    category: "image-tools",
    description: "Convert BMP bitmap images to JPG format.",
    shortDescription: "Convert BMP bitmap images to JPG format.",
    icon: "image-convert",
    keywords: [
      "bmp to jpg",
      "convert bmp to jpg",
      "bmp jpg converter",
      "online bmp to jpg",
    ],
    popular: false,
    new: false,
    supportedFormats: ["BMP", "JPG"],
    relatedToolIds: [
      "bmp-to-png",
      "png-to-jpg",
      "jpg-to-png",
      "image-compressor",
      "gif-to-jpg",
    ],
    seoTitle: "BMP to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert BMP to JPG online with Tool Base. Upload your bitmap image, convert it, and download a JPEG file.",
    h1: "BMP to JPG Converter",
    intro:
      "Convert BMP bitmap images to JPG when you need a smaller, more shareable photo format. Upload a BMP file, convert it, and download the JPG result.",
    convertHeading: "Convert BMP to JPG Online",
    howToHeading: "How to Convert BMP to JPG",
    featuresHeading: "BMP to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "BMP to JPG conversion",
      "Useful for sharing and uploads",
      "Fast encoding",
      "No account required",
      "Clear file validation",
    ],
    howToSteps: [
      {
        title: "Upload Your BMP Image",
        description: "Select a BMP file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a JPG file.",
      },
      {
        title: "Download Your JPG",
        description: "Save the converted .jpg file to your device.",
      },
    ],
    faq: [
      {
        question: "Why convert BMP to JPG?",
        answer:
          "BMP files are often large. JPG is usually more practical for sharing and web use.",
      },
      {
        question: "Is quality reduced?",
        answer:
          "JPG uses lossy compression, so there can be a quality and size tradeoff.",
      },
      {
        question: "Does this work on mobile?",
        answer:
          "Yes. The converter UI is designed for desktop and mobile browsers.",
      },
    ],
    inputFormats: ["BMP"],
    outputFormats: ["JPG"],
  }),
  tool({
    id: "bmp-to-png",
    name: "BMP to PNG",
    slug: "bmp-to-png",
    category: "image-tools",
    description: "Convert BMP bitmap images to PNG format.",
    shortDescription: "Convert BMP bitmap images to PNG format.",
    icon: "image-convert",
    keywords: [
      "bmp to png",
      "convert bmp to png",
      "bmp png converter",
      "online bmp to png",
    ],
    popular: false,
    new: false,
    supportedFormats: ["BMP", "PNG"],
    relatedToolIds: [
      "bmp-to-jpg",
      "png-to-jpg",
      "png-to-webp",
      "image-compressor",
      "jpg-to-png",
    ],
    seoTitle: "BMP to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert BMP to PNG online with Tool Base. Upload a BMP image, convert it, and download a PNG file.",
    h1: "BMP to PNG Converter",
    intro:
      "Convert BMP images to PNG for a more widely used still-image format in editing and publishing workflows. Process the file and download the PNG.",
    convertHeading: "Convert BMP to PNG Online",
    howToHeading: "How to Convert BMP to PNG",
    featuresHeading: "BMP to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "BMP to PNG conversion",
      "Browser-side processing",
      "Useful for editing workflows",
      "Simple three-step flow",
      "Free to use",
    ],
    howToSteps: [
      {
        title: "Upload Your BMP Image",
        description: "Select a BMP file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a PNG file.",
      },
      {
        title: "Download Your PNG",
        description: "Save the converted .png file to your device.",
      },
    ],
    faq: [
      {
        question: "Is PNG better than BMP?",
        answer:
          "PNG is generally more practical for sharing and editing. BMP is an older uncompressed bitmap format.",
      },
      {
        question: "Do I need to install software?",
        answer: "No. Conversion happens in the browser.",
      },
      {
        question: "Are dimensions preserved?",
        answer: "Yes. The converter keeps the source bitmap dimensions.",
      },
    ],
    inputFormats: ["BMP"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "tiff-to-jpg",
    name: "TIFF to JPG",
    slug: "tiff-to-jpg",
    category: "image-tools",
    description: "Convert TIFF images to JPG using a browser decoder.",
    shortDescription: "Convert TIFF images to JPG using a browser decoder.",
    icon: "image-convert",
    keywords: [
      "tiff to jpg",
      "tif to jpg",
      "convert tiff to jpg",
      "tiff jpg converter",
      "online tiff to jpg",
    ],
    popular: false,
    new: true,
    supportedFormats: ["TIFF", "TIF", "JPG"],
    relatedToolIds: [
      "tiff-to-png",
      "bmp-to-jpg",
      "png-to-jpg",
      "image-compressor",
      "jpg-to-webp",
    ],
    seoTitle: "TIFF to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert TIFF to JPG online with Tool Base. Decode TIFF files and download a JPEG result.",
    h1: "TIFF to JPG Converter",
    intro:
      "Convert TIFF and TIF images to JPG online. Tool Base uses a TIFF decoder, then encodes a standard JPEG you can download immediately.",
    convertHeading: "Convert TIFF to JPG Online",
    howToHeading: "How to Convert TIFF to JPG",
    featuresHeading: "TIFF to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "TIFF/TIF decoding in the browser",
      "JPG output for easier sharing",
      "Helpful error messages for unsupported files",
      "No account required",
      "Keeps the conversion workflow simple",
    ],
    howToSteps: [
      {
        title: "Upload Your TIFF Image",
        description: "Select a TIFF file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a JPG file.",
      },
      {
        title: "Download Your JPG",
        description: "Save the converted .jpg file to your device.",
      },
    ],
    faq: [
      {
        question: "What if my TIFF fails to convert?",
        answer:
          "Some TIFF variants are uncommon. Tool Base shows a clear message instead of producing a broken file.",
      },
      {
        question: "Are multi-page TIFFs supported?",
        answer: "This tool converts the first page/image from the TIFF file.",
      },
      {
        question: "Is processing local?",
        answer: "Yes. Decoding and encoding run.",
      },
    ],
    inputFormats: ["TIFF", "TIF"],
    outputFormats: ["JPG"],
  }),
  tool({
    id: "tiff-to-png",
    name: "TIFF to PNG",
    slug: "tiff-to-png",
    category: "image-tools",
    description: "Convert TIFF images to PNG using a browser decoder.",
    shortDescription: "Convert TIFF images to PNG using a browser decoder.",
    icon: "image-convert",
    keywords: [
      "tiff to png",
      "tif to png",
      "convert tiff to png",
      "tiff png converter",
      "online tiff to png",
    ],
    popular: false,
    new: false,
    supportedFormats: ["TIFF", "TIF", "PNG"],
    relatedToolIds: [
      "tiff-to-jpg",
      "bmp-to-png",
      "png-to-jpg",
      "image-compressor",
      "png-to-webp",
    ],
    seoTitle: "TIFF to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert TIFF to PNG online with Tool Base. Decode your TIFF in the browser and download a PNG file.",
    h1: "TIFF to PNG Converter",
    intro:
      "Convert TIFF and TIF files to PNG online with a decoder. Useful when you need a PNG for editing or publishing instead of a TIFF container.",
    convertHeading: "Convert TIFF to PNG Online",
    howToHeading: "How to Convert TIFF to PNG",
    featuresHeading: "TIFF to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Client-side TIFF decoding",
      "PNG output for editing workflows",
      "Clear unsupported-file messaging",
      "Free browser conversion",
      "No sign-up required",
    ],
    howToSteps: [
      {
        title: "Upload Your TIFF Image",
        description: "Select a TIFF file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a PNG file.",
      },
      {
        title: "Download Your PNG",
        description: "Save the converted .png file to your device.",
      },
    ],
    faq: [
      {
        question: "Can every TIFF convert successfully?",
        answer:
          "Most common TIFF images work. Unusual compression modes may be unsupported and will show a clear error.",
      },
      {
        question: "Does this keep transparency?",
        answer:
          "When the decoded TIFF contains alpha data that can be represented, PNG can preserve it.",
      },
      {
        question: "Is the first page used?",
        answer: "Yes. Multi-page TIFFs use the first image page.",
      },
    ],
    inputFormats: ["TIFF", "TIF"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "svg-to-png",
    name: "SVG to PNG",
    slug: "svg-to-png",
    category: "image-tools",
    description: "Convert scalable SVG graphics into PNG images.",
    shortDescription: "Convert scalable SVG graphics into PNG images.",
    icon: "image-convert",
    keywords: [
      "svg to png",
      "convert svg to png",
      "svg png converter",
      "online svg to png",
    ],
    popular: true,
    new: false,
    supportedFormats: ["SVG", "PNG"],
    relatedToolIds: [
      "svg-to-jpg",
      "png-to-svg",
      "png-to-jpg",
      "image-resizer",
      "image-compressor",
    ],
    seoTitle: "SVG to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert SVG to PNG online with Tool Base. Render SVG graphics and download a PNG image.",
    h1: "SVG to PNG Converter",
    intro:
      "Convert SVG vector graphics into PNG images online. Render your SVG in the browser, optionally set output dimensions, and download a raster PNG.",
    convertHeading: "Convert SVG to PNG Online",
    howToHeading: "How to Convert SVG to PNG",
    featuresHeading: "SVG to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "SVG rendered before PNG export",
      "Optional width and height controls",
      "Aspect ratio locking",
      "Fast conversion",
      "Useful for sharing and embedding",
    ],
    howToSteps: [
      {
        title: "Upload Your SVG Image",
        description: "Select a SVG file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a PNG file.",
      },
      {
        title: "Download Your PNG",
        description: "Save the converted .png file to your device.",
      },
    ],
    faq: [
      {
        question: "Can I choose the PNG size?",
        answer:
          "Yes. You can set width and height while keeping aspect ratio locked.",
      },
      {
        question: "Why convert SVG to PNG?",
        answer: "PNG is useful when an app or CMS field does not accept SVG.",
      },
      {
        question: "Are complex SVGs supported?",
        answer:
          "Most standard SVGs convert well. External references or unsupported features may fail with a clear message.",
      },
    ],
    inputFormats: ["SVG"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "png-to-svg",
    name: "PNG to SVG",
    slug: "png-to-svg",
    category: "image-tools",
    description:
      "Convert PNG raster artwork into an SVG-style vector representation.",
    shortDescription:
      "Convert PNG raster artwork into an SVG-style vector representation.",
    icon: "image-convert",
    keywords: [
      "png to svg",
      "convert png to svg",
      "png svg converter",
      "online png to svg",
      "png to vector",
    ],
    popular: true,
    new: false,
    supportedFormats: ["PNG", "SVG"],
    relatedToolIds: [
      "svg-to-png",
      "png-to-jpg",
      "image-resizer",
      "svg-to-jpg",
      "image-compressor",
    ],
    seoTitle: "PNG to SVG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PNG to SVG online with Tool Base. Trace raster artwork into an SVG-style vector representation.",
    h1: "PNG to SVG Converter",
    intro:
      "Convert PNG images into SVG-style vector output using tracing. Results vary with image complexity — this is real vectorization, not a renamed file extension.",
    convertHeading: "Convert PNG to SVG Online",
    howToHeading: "How to Convert PNG to SVG",
    featuresHeading: "PNG to SVG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Real raster-to-vector tracing",
      "Honest explanation of conversion limits",
      "No account required",
      "Useful for simple logos and graphics",
      "No fake extension renaming",
    ],
    howToSteps: [
      {
        title: "Upload Your PNG Image",
        description: "Select a PNG file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a SVG file.",
      },
      {
        title: "Download Your SVG",
        description: "Save the converted .svg file to your device.",
      },
    ],
    faq: [
      {
        question: "Is every PNG perfect as SVG?",
        answer:
          "No. Simple graphics convert more cleanly than complex photos. Tool Base explains this on the page.",
      },
      {
        question: "Do you just rename the file?",
        answer: "No. The PNG is traced into SVG markup.",
      },
      {
        question: "Can I edit the SVG afterward?",
        answer:
          "Yes. You can open the downloaded SVG in a vector editor, though path complexity depends on the source image.",
      },
    ],
    inputFormats: ["PNG"],
    outputFormats: ["SVG"],
  }),
  tool({
    id: "svg-to-jpg",
    name: "SVG to JPG",
    slug: "svg-to-jpg",
    category: "image-tools",
    description: "Convert SVG graphics to JPG with a solid background.",
    shortDescription: "Convert SVG graphics to JPG with a solid background.",
    icon: "image-convert",
    keywords: [
      "svg to jpg",
      "convert svg to jpg",
      "svg jpg converter",
      "online svg to jpg",
    ],
    popular: false,
    new: true,
    supportedFormats: ["SVG", "JPG"],
    relatedToolIds: [
      "svg-to-png",
      "png-to-jpg",
      "jpg-to-webp",
      "image-resizer",
      "png-to-svg",
    ],
    seoTitle: "SVG to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert SVG to JPG online with Tool Base. Render your SVG in the browser and download a JPEG image.",
    h1: "SVG to JPG Converter",
    intro:
      "Convert SVG files to JPG online by rendering the vector graphic first. Transparent areas are filled with white because JPG cannot store transparency.",
    convertHeading: "Convert SVG to JPG Online",
    howToHeading: "How to Convert SVG to JPG",
    featuresHeading: "SVG to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "SVG rendered before JPG export",
      "Optional output dimensions",
      "White background for transparency",
      "Account-free browser workflow",
      "Clean download filenames",
    ],
    howToSteps: [
      {
        title: "Upload Your SVG Image",
        description: "Select a SVG file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a JPG file.",
      },
      {
        title: "Download Your JPG",
        description: "Save the converted .jpg file to your device.",
      },
    ],
    faq: [
      {
        question: "Why is there a white background?",
        answer:
          "JPG has no alpha channel, so transparent SVG areas are filled with white.",
      },
      {
        question: "Can I control output size?",
        answer:
          "Yes. Width and height controls are available with aspect-ratio locking.",
      },
      {
        question: "Is SVG text rendered?",
        answer:
          "Text embedded in the SVG is rendered when the browser can draw it during conversion.",
      },
    ],
    inputFormats: ["SVG"],
    outputFormats: ["JPG"],
  }),
  tool({
    id: "ico-to-png",
    name: "ICO to PNG",
    slug: "ico-to-png",
    category: "image-tools",
    description: "Convert ICO icon files to PNG images.",
    shortDescription: "Convert ICO icon files to PNG images.",
    icon: "image-convert",
    keywords: [
      "ico to png",
      "convert ico to png",
      "ico png converter",
      "online ico to png",
    ],
    popular: false,
    new: true,
    supportedFormats: ["ICO", "PNG"],
    relatedToolIds: [
      "png-to-ico",
      "png-to-jpg",
      "svg-to-png",
      "image-resizer",
      "png-to-webp",
    ],
    seoTitle: "ICO to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert ICO to PNG online with Tool Base. Extract icon images and download a PNG file.",
    h1: "ICO to PNG Converter",
    intro:
      "Convert ICO icons to PNG online. If an ICO contains multiple sizes, Tool Base uses the largest available image and tells you what was selected.",
    convertHeading: "Convert ICO to PNG Online",
    howToHeading: "How to Convert ICO to PNG",
    featuresHeading: "ICO to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "ICO decoding in the browser",
      "Largest icon size selected by default",
      "PNG output for easy editing",
      "Clear multi-size messaging",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your ICO Image",
        description: "Select a ICO file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a PNG file.",
      },
      {
        title: "Download Your PNG",
        description: "Save the converted .png file to your device.",
      },
    ],
    faq: [
      {
        question: "What if my ICO has multiple sizes?",
        answer:
          "Tool Base selects the largest available image and notes that choice in the result.",
      },
      {
        question: "Are BMP-style ICO images supported?",
        answer:
          "Common PNG-in-ICO and 24/32-bit BMP-style icons are supported. Unusual formats show a clear error.",
      },
      {
        question: "Can I use the PNG afterward?",
        answer: "Yes. PNG is easy to edit, resize, or convert further.",
      },
    ],
    inputFormats: ["ICO"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "png-to-ico",
    name: "PNG to ICO",
    slug: "png-to-ico",
    category: "image-tools",
    description: "Convert PNG images into a proper ICO icon file.",
    shortDescription: "Convert PNG images into a proper ICO icon file.",
    icon: "image-convert",
    keywords: [
      "png to ico",
      "convert png to ico",
      "png ico converter",
      "favicon maker",
      "online png to ico",
    ],
    popular: false,
    new: true,
    supportedFormats: ["PNG", "ICO"],
    relatedToolIds: [
      "ico-to-png",
      "svg-to-png",
      "image-resizer",
      "png-to-jpg",
      "png-to-webp",
    ],
    seoTitle: "PNG to ICO Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PNG to ICO online with Tool Base. Create a real ICO file from a PNG image.",
    h1: "PNG to ICO Converter",
    intro:
      "Convert PNG images to ICO online by generating a real ICO container with a PNG payload. Ideal for favicons and simple desktop-style icons.",
    convertHeading: "Convert PNG to ICO Online",
    howToHeading: "How to Convert PNG to ICO",
    featuresHeading: "PNG to ICO Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Creates a real ICO file",
      "Uses a 256×256 PNG payload",
      "Not an extension rename",
      "Fast generation",
      "Simple upload and download flow",
    ],
    howToSteps: [
      {
        title: "Upload Your PNG Image",
        description: "Select a PNG file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a ICO file.",
      },
      {
        title: "Download Your ICO",
        description: "Save the converted .ico file to your device.",
      },
    ],
    faq: [
      {
        question: "Is this just a renamed PNG?",
        answer:
          "No. Tool Base writes a proper ICO container that embeds PNG image data.",
      },
      {
        question: "What size is generated?",
        answer: "The default output is a 256×256 icon suitable for modern use.",
      },
      {
        question: "Can I use it as a favicon?",
        answer:
          "Yes. Many sites accept ICO favicons. You can also keep a PNG favicon if your stack prefers PNG.",
      },
    ],
    inputFormats: ["PNG"],
    outputFormats: ["ICO"],
  }),
  tool({
    id: "heic-to-jpg",
    name: "HEIC to JPG",
    slug: "heic-to-jpg",
    category: "image-tools",
    description: "Convert HEIC/HEIF photos to JPG.",
    shortDescription: "Convert HEIC/HEIF photos to JPG.",
    icon: "image-convert",
    keywords: [
      "heic to jpg",
      "heif to jpg",
      "convert heic to jpg",
      "heic jpg converter",
      "online heic to jpg",
    ],
    popular: false,
    new: true,
    supportedFormats: ["HEIC", "HEIF", "JPG"],
    relatedToolIds: [
      "heic-to-png",
      "jpg-to-png",
      "jpg-to-webp",
      "image-compressor",
      "png-to-jpg",
    ],
    seoTitle: "HEIC to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert HEIC to JPG online with Tool Base. Decode HEIC/HEIF photos and download a JPEG file.",
    h1: "HEIC to JPG Converter",
    intro:
      "Convert HEIC and HEIF photos to JPG online using a decoder. Useful for sharing iPhone photos with apps and devices that prefer JPEG.",
    convertHeading: "Convert HEIC to JPG Online",
    howToHeading: "How to Convert HEIC to JPG",
    featuresHeading: "HEIC to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "HEIC/HEIF decoding support",
      "JPG output for broad compatibility",
      "Graceful errors for unsupported files",
      "No account required",
      "Mobile-friendly converter UI",
    ],
    howToSteps: [
      {
        title: "Upload Your HEIC Image",
        description: "Select a HEIC file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a JPG file.",
      },
      {
        title: "Download Your JPG",
        description: "Save the converted .jpg file to your device.",
      },
    ],
    faq: [
      {
        question: "My HEIC failed to convert. Why?",
        answer:
          "Some HEIC variants or damaged files cannot be decoded. Tool Base shows a clear message instead of a fake success state.",
      },
      {
        question: "Is HEIF supported too?",
        answer: "Yes. Both .heic and .heif uploads are accepted.",
      },
      {
        question: "Does the file leave my device?",
        answer: "This converter is designed for decoding and encoding.",
      },
    ],
    inputFormats: ["HEIC", "HEIF"],
    outputFormats: ["JPG"],
  }),
  tool({
    id: "heic-to-png",
    name: "HEIC to PNG",
    slug: "heic-to-png",
    category: "image-tools",
    description: "Convert HEIC/HEIF photos to PNG.",
    shortDescription: "Convert HEIC/HEIF photos to PNG.",
    icon: "image-convert",
    keywords: [
      "heic to png",
      "heif to png",
      "convert heic to png",
      "heic png converter",
      "online heic to png",
    ],
    popular: false,
    new: true,
    supportedFormats: ["HEIC", "HEIF", "PNG"],
    relatedToolIds: [
      "heic-to-jpg",
      "png-to-jpg",
      "png-to-webp",
      "image-compressor",
      "jpg-to-png",
    ],
    seoTitle: "HEIC to PNG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert HEIC to PNG online with Tool Base. Decode HEIC/HEIF photos and download a PNG file.",
    h1: "HEIC to PNG Converter",
    intro:
      "Convert HEIC and HEIF images to PNG online with a decoder. Choose PNG when you want a lossless-friendly still image for editing or further conversion.",
    convertHeading: "Convert HEIC to PNG Online",
    howToHeading: "How to Convert HEIC to PNG",
    featuresHeading: "HEIC to PNG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "HEIC/HEIF to PNG conversion",
      "Client-side decoding",
      "Helpful failure messages",
      "Free and account-free",
      "Works alongside other image tools",
    ],
    howToSteps: [
      {
        title: "Upload Your HEIC Image",
        description: "Select a HEIC file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a PNG file.",
      },
      {
        title: "Download Your PNG",
        description: "Save the converted .png file to your device.",
      },
    ],
    faq: [
      {
        question: "When should I choose PNG instead of JPG?",
        answer:
          "Choose PNG when you want a lossless-friendly image for editing. Choose JPG for smaller shareable photos.",
      },
      {
        question: "Are live photos fully supported?",
        answer:
          "This tool converts the still image representation from the HEIC/HEIF file.",
      },
      {
        question: "Will corrupted HEIC files crash the page?",
        answer: "No. Failures are caught and shown as friendly errors.",
      },
    ],
    inputFormats: ["HEIC", "HEIF"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "avif-to-jpg",
    name: "AVIF to JPG",
    slug: "avif-to-jpg",
    category: "image-tools",
    description: "Convert AVIF images to JPG using browser decoding.",
    shortDescription: "Convert AVIF images to JPG using browser decoding.",
    icon: "image-convert",
    keywords: [
      "avif to jpg",
      "convert avif to jpg",
      "avif jpg converter",
      "online avif to jpg",
    ],
    popular: false,
    new: true,
    supportedFormats: ["AVIF", "JPG"],
    relatedToolIds: [
      "jpg-to-webp",
      "webp-to-jpg",
      "heic-to-jpg",
      "image-compressor",
      "png-to-jpg",
    ],
    seoTitle: "AVIF to JPG Converter — Free Online | Tool Base",
    seoDescription:
      "Convert AVIF to JPG online with Tool Base. Decode AVIF when supported and download a JPEG file.",
    h1: "AVIF to JPG Converter",
    intro:
      "Convert AVIF images to JPG online when your browser can decode AVIF. Tool Base renders the image locally and downloads a standard JPEG file — not a renamed extension.",
    convertHeading: "Convert AVIF to JPG Online",
    howToHeading: "How to Convert AVIF to JPG",
    featuresHeading: "AVIF to JPG Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "AVIF decoding via the browser",
      "Real JPG encoding afterward",
      "Clear messaging if AVIF is unsupported",
      "No fake conversion",
      "Simple three-step experience",
    ],
    howToSteps: [
      {
        title: "Upload Your AVIF Image",
        description: "Select a AVIF file from your device.",
      },
      {
        title: "Convert Your Image",
        description: "Click Convert to create a JPG file.",
      },
      {
        title: "Download Your JPG",
        description: "Save the converted .jpg file to your device.",
      },
    ],
    faq: [
      {
        question: "What if my browser cannot decode AVIF?",
        answer:
          "You will see a clear error. Try a modern browser with AVIF support or another file.",
      },
      {
        question: "Is the output a real JPG?",
        answer:
          "Yes. After decoding, Tool Base encodes a standard JPEG blob for download.",
      },
      {
        question: "Do you upload my AVIF to a server?",
        answer: "No. This workflow is designed for processing.",
      },
    ],
    inputFormats: ["AVIF"],
    outputFormats: ["JPG"],
  }),
];
