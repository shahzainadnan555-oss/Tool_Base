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

/** Image editing, compression & optimization tools — Prompt 3 */
export const imageEditorTools: ToolDefinition[] = [
  tool({
    id: "image-compressor",
    name: "Image Compressor",
    slug: "image-compressor",
    category: "image-tools",
    description: "Reduce image file size while balancing quality.",
    shortDescription: "Reduce image file size while balancing quality.",
    icon: "compress",
    keywords: [
      "image compressor",
      "compress image",
      "image size reducer",
      "reduce image size",
      "compress photo",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "jpg-compressor",
      "png-compressor",
      "webp-compressor",
      "image-resizer",
      "image-quality-changer",
      "image-metadata-viewer",
    ],
    seoTitle: "Image Compressor — Free Online | ToolMyra",
    seoDescription:
      "Compress images online with ToolMyra. Reduce image file size while balancing image quality, then download the optimized result instantly.",
    h1: "Image Compressor",
    intro:
      "Compress images online with ToolMyra. Upload a JPG, PNG, or WebP file, adjust compression quality, compare file sizes, and download the optimized result — no account required.",
    convertHeading: "Compress Images Online",
    howToHeading: "How to Compress an Image",
    featuresHeading: "Image Compressor Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Compress JPG, PNG, and WebP images",
      "Shows original vs compressed size",
      "Quality control where applicable",
      "No account required",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Adjust Compression",
        description: "Choose a quality level that balances size and clarity.",
      },
      {
        title: "Download the Compressed Image",
        description: "Save the optimized file to your device.",
      },
    ],
    faq: [
      {
        question: "Does compression reduce quality?",
        answer:
          "Lossy compression can reduce quality. ToolMyra shows actual file sizes so you can choose a balance that works for your use case.",
      },
      {
        question: "Which formats are supported?",
        answer: "JPG/JPEG, PNG, and WebP are supported by this compressor.",
      },
      {
        question: "Is processing local?",
        answer: "Yes. Compression runs for this tool.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "jpg-compressor",
    name: "JPG Compressor",
    slug: "jpg-compressor",
    category: "image-tools",
    description: "Compress JPG and JPEG images with quality control.",
    shortDescription: "Compress JPG and JPEG images with quality control.",
    icon: "compress",
    keywords: [
      "jpg compressor",
      "jpeg compressor",
      "compress jpg",
      "compress jpeg",
      "reduce jpg size",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-compressor",
      "png-compressor",
      "webp-compressor",
      "image-quality-changer",
      "jpg-to-webp",
    ],
    seoTitle: "JPG Compressor — Free Online | ToolMyra",
    seoDescription:
      "Compress JPG and JPEG images online with ToolMyra. Reduce JPEG file size with quality control and download the result instantly.",
    h1: "JPG Compressor",
    intro:
      "Compress JPG and JPEG photos online with ToolMyra. Adjust quality, compare the original and compressed sizes, and download a valid JPG file.",
    convertHeading: "Compress JPG Images Online",
    howToHeading: "How to Compress a JPG",
    featuresHeading: "JPG Compressor Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Dedicated JPG/JPEG compression",
      "Quality slider",
      "Actual size comparison",
      "Valid JPG output",
      "No sign-up required",
    ],
    howToSteps: [
      {
        title: "Upload Your JPG Image",
        description: "Select a JPG or JPEG file.",
      },
      {
        title: "Adjust JPG Quality",
        description: "Set the JPG quality slider.",
      },
      {
        title: "Download the Compressed JPG",
        description: "Save the compressed JPG.",
      },
    ],
    faq: [
      {
        question: "Can I upload JPEG files?",
        answer: "Yes. JPG and JPEG are both accepted.",
      },
      {
        question: "Will the output stay JPG?",
        answer: "Yes. This tool outputs a compressed JPG file.",
      },
      {
        question: "Are savings guaranteed?",
        answer:
          "Savings depend on the source image and quality setting. ToolMyra only shows measured sizes.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "png-compressor",
    name: "PNG Compressor",
    slug: "png-compressor",
    category: "image-tools",
    description:
      "Compress PNG images while preserving transparency when possible.",
    shortDescription:
      "Compress PNG images while preserving transparency when possible.",
    icon: "compress",
    keywords: [
      "png compressor",
      "compress png",
      "reduce png size",
      "png optimizer",
    ],
    popular: false,
    new: true,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-compressor",
      "jpg-compressor",
      "webp-compressor",
      "image-resizer",
      "png-to-webp",
    ],
    seoTitle: "PNG Compressor — Free Online | ToolMyra",
    seoDescription:
      "Compress PNG images online with ToolMyra. Reduce PNG file size while preserving transparency when possible.",
    h1: "PNG Compressor",
    intro:
      "Compress PNG images online with ToolMyra. Transparency is preserved when possible. Compare file sizes and download the compressed PNG.",
    convertHeading: "Compress PNG Images Online",
    howToHeading: "How to Compress a PNG",
    featuresHeading: "PNG Compressor Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "PNG-focused compression",
      "Transparency preserved when possible",
      "Actual before/after sizes",
      "Straightforward workflow",
      "Clear notices when size cannot shrink further",
    ],
    howToSteps: [
      {
        title: "Upload Your PNG Image",
        description: "Select a PNG file.",
      },
      {
        title: "Adjust Compression",
        description: "Choose a quality level that balances size and clarity.",
      },
      {
        title: "Download the Compressed PNG",
        description: "Save the compressed PNG.",
      },
    ],
    faq: [
      {
        question: "Does PNG compression keep transparency?",
        answer: "Yes. ToolMyra keeps alpha data when re-encoding PNG output.",
      },
      {
        question: "Why didn’t my PNG get smaller?",
        answer:
          "Some PNGs are already optimized. The tool reports real sizes and will not invent savings.",
      },
      {
        question: "Is this lossless?",
        answer:
          "PNG re-encoding preserves visual pixels, but size reduction depends on content and optional scaling at lower quality settings.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "webp-compressor",
    name: "WebP Compressor",
    slug: "webp-compressor",
    category: "image-tools",
    description: "Compress WebP images with adjustable quality.",
    shortDescription: "Compress WebP images with adjustable quality.",
    icon: "compress",
    keywords: [
      "webp compressor",
      "compress webp",
      "reduce webp size",
      "webp optimizer",
    ],
    popular: false,
    new: true,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-compressor",
      "jpg-compressor",
      "png-compressor",
      "image-quality-changer",
      "webp-to-png",
    ],
    seoTitle: "WebP Compressor — Free Online | ToolMyra",
    seoDescription:
      "Compress WebP images online with ToolMyra. Reduce WebP file size with quality controls and download instantly.",
    h1: "WebP Compressor",
    intro:
      "Compress WebP images online with ToolMyra. Adjust quality, review actual size reduction, and download a valid WebP file.",
    convertHeading: "Compress WebP Images Online",
    howToHeading: "How to Compress a WebP",
    featuresHeading: "WebP Compressor Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Dedicated WebP compression",
      "Quality control",
      "Measured size comparison",
      "Valid WebP output",
      "Account-free browser processing",
    ],
    howToSteps: [
      {
        title: "Upload Your WebP Image",
        description: "Select a WebP file.",
      },
      {
        title: "Adjust WebP Quality",
        description: "Set the WebP quality slider.",
      },
      {
        title: "Download the Compressed WebP",
        description: "Save the compressed WebP.",
      },
    ],
    faq: [
      {
        question: "Is WebP compression lossy?",
        answer:
          "Yes, quality-based WebP encoding is lossy. Lower quality usually means a smaller file.",
      },
      {
        question: "Can I compress animated WebP?",
        answer: "This tool compresses a still WebP image representation.",
      },
      {
        question: "Do I need an account?",
        answer: "No.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-resizer",
    name: "Image Resizer",
    slug: "image-resizer",
    category: "image-tools",
    description:
      "Resize images to custom dimensions while controlling aspect ratio.",
    shortDescription:
      "Resize images to custom dimensions while controlling aspect ratio.",
    icon: "resize",
    keywords: [
      "image resizer",
      "resize image",
      "change image dimensions",
      "photo resizer",
      "resize photo",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-compressor",
      "image-cropper",
      "image-quality-changer",
      "circular-image-cropper",
      "jpg-to-png",
    ],
    seoTitle: "Image Resizer — Free Online | ToolMyra",
    seoDescription:
      "Resize images online with ToolMyra. Change image dimensions with aspect-ratio control and download the result instantly.",
    h1: "Image Resizer",
    intro:
      "Resize images online with ToolMyra. Set width and height, keep aspect ratio when needed, preview dimensions, and download the resized image.",
    convertHeading: "Resize Images Online",
    howToHeading: "How to Resize an Image",
    featuresHeading: "Image Resizer Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Custom width and height",
      "Maintain aspect ratio option",
      "Preview expected dimensions",
      "Works with common image formats",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Set Width and Height",
        description: "Enter dimensions and optionally keep aspect ratio.",
      },
      {
        title: "Download the Resized Image",
        description: "Save the resized file.",
      },
    ],
    faq: [
      {
        question: "What does maintain aspect ratio do?",
        answer:
          "When enabled, changing one dimension automatically updates the other to keep proportions.",
      },
      {
        question: "Will resizing reduce quality?",
        answer:
          "Enlarging can look softer. Shrinking usually looks cleaner. ToolMyra does not invent detail.",
      },
      {
        question: "Which formats can I resize?",
        answer: "JPG, PNG, and WebP are supported.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-cropper",
    name: "Image Cropper",
    slug: "image-cropper",
    category: "image-tools",
    description: "Crop images to the exact area or ratio you need.",
    shortDescription: "Crop images to the exact area or ratio you need.",
    icon: "image-convert",
    keywords: [
      "image cropper",
      "crop image",
      "crop photo",
      "aspect ratio crop",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "circular-image-cropper",
      "image-resizer",
      "rounded-image-generator",
      "image-rotator",
      "image-compressor",
    ],
    seoTitle: "Image Cropper — Free Online | ToolMyra",
    seoDescription:
      "Crop images online with ToolMyra. Select the exact area or ratio you need and download the cropped result.",
    h1: "Image Cropper",
    intro:
      "Crop images online with ToolMyra. Drag and resize the crop area, choose common aspect ratios, preview the result, and download the cropped image.",
    convertHeading: "Crop Images Online",
    howToHeading: "How to Crop an Image",
    featuresHeading: "Image Cropper Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Drag and resize crop area",
      "Free, 1:1, 4:3, 16:9, and 3:2 presets",
      "Zoom control",
      "Mobile-friendly cropping",
      "Real cropped output",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Adjust the Crop Area",
        description: "Drag, resize, and zoom the crop selection.",
      },
      {
        title: "Download the Cropped Image",
        description: "Save the cropped file.",
      },
    ],
    faq: [
      {
        question: "Can I crop to a square?",
        answer: "Yes. Choose the 1:1 preset.",
      },
      {
        question: "Does cropping change file format?",
        answer:
          "Output stays a common raster format based on your source image.",
      },
      {
        question: "Does it work on phones?",
        answer:
          "Yes. The crop controls are designed to remain usable on mobile.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-rotator",
    name: "Image Rotator",
    slug: "image-rotator",
    category: "image-tools",
    description: "Rotate images by 90°, 180°, or counterclockwise turns.",
    shortDescription: "Rotate images by 90°, 180°, or counterclockwise turns.",
    icon: "image",
    keywords: [
      "image rotator",
      "rotate image",
      "rotate photo",
      "rotate 90 degrees",
    ],
    popular: false,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-flipper",
      "image-cropper",
      "image-resizer",
      "image-compressor",
      "exif-remover",
    ],
    seoTitle: "Image Rotator — Free Online | ToolMyra",
    seoDescription:
      "Rotate images online with ToolMyra. Turn photos 90° or 180° and download the rotated file.",
    h1: "Image Rotator",
    intro:
      "Rotate images online with ToolMyra. Choose 90° clockwise, 90° counterclockwise, or 180°, apply the rotation, and download the result.",
    convertHeading: "Rotate Images Online",
    howToHeading: "How to Rotate an Image",
    featuresHeading: "Image Rotator Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "90° clockwise and counterclockwise",
      "180° rotation",
      "Preview-ready workflow",
      "No account required",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Choose a Rotation",
        description: "Pick 90°, -90°, or 180°.",
      },
      {
        title: "Download the Rotated Image",
        description: "Save the rotated file.",
      },
    ],
    faq: [
      {
        question: "Can I rotate freely by any angle?",
        answer:
          "This tool focuses on precise 90° and 180° rotations for clean results.",
      },
      {
        question: "Will EXIF orientation be updated?",
        answer:
          "The visual pixels are rotated. Use EXIF Remover if you also want metadata stripped.",
      },
      {
        question: "Is quality preserved?",
        answer:
          "Rotation re-encodes the image carefully; minor encoding differences can occur with lossy formats.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-flipper",
    name: "Image Flipper",
    slug: "image-flipper",
    category: "image-tools",
    description: "Flip images horizontally or vertically.",
    shortDescription: "Flip images horizontally or vertically.",
    icon: "image",
    keywords: [
      "image flipper",
      "flip image",
      "mirror image",
      "flip horizontal",
      "flip vertical",
    ],
    popular: false,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-rotator",
      "image-cropper",
      "image-resizer",
      "rounded-image-generator",
      "image-compressor",
    ],
    seoTitle: "Image Flipper — Free Online | ToolMyra",
    seoDescription:
      "Flip images online with ToolMyra. Mirror photos horizontally or vertically and download the result instantly.",
    h1: "Image Flipper",
    intro:
      "Flip images online with ToolMyra. Mirror a photo horizontally, vertically, or both, then download the flipped result.",
    convertHeading: "Flip Images Online",
    howToHeading: "How to Flip an Image",
    featuresHeading: "Image Flipper Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Horizontal flip",
      "Vertical flip",
      "Combine both flips",
      "Simple browser workflow",
      "No sign-up required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Choose Flip Direction",
        description: "Enable horizontal and/or vertical flip.",
      },
      {
        title: "Download the Flipped Image",
        description: "Save the flipped file.",
      },
    ],
    faq: [
      {
        question: "What is a horizontal flip?",
        answer: "It mirrors the image left-to-right.",
      },
      {
        question: "Can I flip both ways?",
        answer:
          "Yes. Enable horizontal and vertical together for a 180°-like mirror effect.",
      },
      {
        question: "Do I need to install software?",
        answer: "Yes. You can flip and download the result with no account.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-metadata-viewer",
    name: "Image Metadata Viewer",
    slug: "image-metadata-viewer",
    category: "image-tools",
    description: "Inspect available image metadata and EXIF details.",
    shortDescription: "Inspect available image metadata and EXIF details.",
    icon: "image",
    keywords: [
      "image metadata viewer",
      "exif viewer",
      "view image metadata",
      "photo metadata",
    ],
    popular: false,
    new: true,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "exif-remover",
      "image-dpi-changer",
      "image-compressor",
      "image-resizer",
      "image-quality-changer",
    ],
    seoTitle: "Image Metadata Viewer — Free Online | ToolMyra",
    seoDescription:
      "View image metadata online with ToolMyra. Inspect file details and available EXIF information without uploading to an account.",
    h1: "Image Metadata Viewer",
    intro:
      "Upload an image to view available metadata with ToolMyra. File details and EXIF fields are shown only when they actually exist in the file.",
    convertHeading: "View Image Metadata Online",
    howToHeading: "How to View Image Metadata",
    featuresHeading: "Image Metadata Viewer Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Shows real metadata only",
      "Organized field list",
      "Includes dimensions and file info",
      "EXIF fields when present",
      "No invented values",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Review Available Fields",
        description: "Inspect file details and any available EXIF fields.",
      },
      {
        title: "Check Another Image if needed",
        description: "Reset and upload a different file when finished.",
      },
    ],
    faq: [
      {
        question: "What if no metadata is found?",
        answer: "ToolMyra shows a clear message instead of inventing fields.",
      },
      {
        question: "Is GPS shown?",
        answer: "GPS is displayed only when present in the file.",
      },
      {
        question: "Does viewing metadata change the file?",
        answer: "No. This tool inspects the image; it does not modify it.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["Metadata"],
  }),
  tool({
    id: "exif-remover",
    name: "EXIF Remover",
    slug: "exif-remover",
    category: "image-tools",
    description: "Remove common EXIF metadata from images before sharing.",
    shortDescription: "Remove common EXIF metadata from images before sharing.",
    icon: "image",
    keywords: [
      "exif remover",
      "remove exif",
      "strip image metadata",
      "remove photo metadata",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-metadata-viewer",
      "image-compressor",
      "image-dpi-changer",
      "image-resizer",
      "jpg-compressor",
    ],
    seoTitle: "EXIF Remover — Free Online | ToolMyra",
    seoDescription:
      "Remove EXIF metadata online with ToolMyra. Strip common camera and location metadata from images before sharing.",
    h1: "EXIF Remover",
    intro:
      "Remove common EXIF metadata online with ToolMyra. Re-encode your image to strip typical EXIF fields, then download a clean image file.",
    convertHeading: "Remove Image Metadata Online",
    howToHeading: "How to Remove EXIF Data",
    featuresHeading: "EXIF Remover Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Removes common EXIF by re-encoding",
      "Keeps visual content",
      "Clear explanation of what is removed",
      "No account required",
      "Useful before sharing photos",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Remove Metadata",
        description: "Strip common EXIF metadata by re-encoding.",
      },
      {
        title: "Download the Clean Image",
        description: "Save the metadata-stripped image.",
      },
    ],
    faq: [
      {
        question: "Does this remove every possible metadata type?",
        answer:
          "It removes common EXIF by re-encoding. Some uncommon embedded chunks may remain depending on format.",
      },
      {
        question: "Will the photo look the same?",
        answer:
          "Visual content is preserved. Lossy formats may have minor encoding differences.",
      },
      {
        question: "Why remove EXIF?",
        answer:
          "EXIF can include camera model, timestamps, and sometimes location data.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-dpi-changer",
    name: "Image DPI Changer",
    slug: "image-dpi-changer",
    category: "image-tools",
    description:
      "Update DPI/PPI metadata for print workflows without inventing detail.",
    shortDescription:
      "Update DPI/PPI metadata for print workflows without inventing detail.",
    icon: "image",
    keywords: [
      "image dpi changer",
      "change image dpi",
      "ppi changer",
      "set image dpi",
    ],
    popular: false,
    new: true,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-metadata-viewer",
      "exif-remover",
      "image-resizer",
      "image-compressor",
      "image-quality-changer",
    ],
    seoTitle: "Image DPI Changer — Free Online | ToolMyra",
    seoDescription:
      "Change image DPI online with ToolMyra. Update DPI/PPI metadata for print workflows without claiming false quality gains.",
    h1: "Image DPI Changer",
    intro:
      "Change image DPI/PPI metadata online with ToolMyra. Pixel dimensions stay the same — DPI affects print and display interpretation, not sharpness.",
    convertHeading: "Change Image DPI Online",
    howToHeading: "How to Change Image DPI",
    featuresHeading: "Image DPI Changer Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Sets DPI/PPI metadata",
      "Does not invent new detail",
      "Clear educational notice",
      "Supports common raster formats",
      "Straightforward workflow",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Enter DPI",
        description: "Provide the DPI/PPI value to write into metadata.",
      },
      {
        title: "Download the Updated Image",
        description: "Save the image with updated DPI metadata.",
      },
    ],
    faq: [
      {
        question: "Does changing DPI improve quality?",
        answer:
          "No. DPI metadata does not create new pixels or sharpen an image.",
      },
      {
        question: "When is DPI useful?",
        answer:
          "Print layouts and some design tools use DPI/PPI to interpret physical size.",
      },
      {
        question: "Do pixel dimensions change?",
        answer: "No. Width and height in pixels stay the same.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-quality-changer",
    name: "Image Quality Changer",
    slug: "image-quality-changer",
    category: "image-tools",
    description: "Adjust encoding quality for JPG and WebP images.",
    shortDescription: "Adjust encoding quality for JPG and WebP images.",
    icon: "compress",
    keywords: [
      "image quality changer",
      "change image quality",
      "jpeg quality",
      "webp quality",
    ],
    popular: false,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-compressor",
      "jpg-compressor",
      "webp-compressor",
      "image-resizer",
      "png-compressor",
    ],
    seoTitle: "Image Quality Changer — Free Online | ToolMyra",
    seoDescription:
      "Change image quality online with ToolMyra. Adjust JPG/WebP encoding quality and download the result instantly.",
    h1: "Image Quality Changer",
    intro:
      "Change image encoding quality online with ToolMyra. Use the quality slider to balance file size and visual fidelity, then download the re-encoded image.",
    convertHeading: "Change Image Quality Online",
    howToHeading: "How to Change Image Quality",
    featuresHeading: "Image Quality Changer Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Quality slider",
      "Transparent about lossy encoding",
      "Shows resulting file size after processing",
      "Works with common formats",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Adjust Quality",
        description: "Move the quality slider to your preferred setting.",
      },
      {
        title: "Download the Result",
        description: "Save the processed image.",
      },
    ],
    faq: [
      {
        question: "Is higher quality always better?",
        answer:
          "Higher quality usually looks better and creates larger files. Choose based on your needs.",
      },
      {
        question: "Can quality improve a blurry photo?",
        answer: "No. Encoding quality cannot restore missing detail.",
      },
      {
        question: "Does PNG use the quality slider?",
        answer:
          "PNG keeps alpha and may optionally reduce dimensions at lower settings to help size.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-sharpener",
    name: "Image Sharpener",
    slug: "image-sharpener",
    category: "image-tools",
    description: "Apply controlled sharpening to photos and graphics.",
    shortDescription: "Apply controlled sharpening to photos and graphics.",
    icon: "image",
    keywords: [
      "image sharpener",
      "sharpen image",
      "sharpen photo",
      "increase image sharpness",
    ],
    popular: false,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-blur",
      "image-quality-changer",
      "image-resizer",
      "image-compressor",
      "image-pixelator",
    ],
    seoTitle: "Image Sharpener — Free Online | ToolMyra",
    seoDescription:
      "Sharpen images online with ToolMyra. Apply a controlled sharpening effect and download the result.",
    h1: "Image Sharpener",
    intro:
      "Sharpen images online with ToolMyra. Adjust sharpness with a simple control, preview the processed result, and download the sharpened image.",
    convertHeading: "Sharpen Images Online",
    howToHeading: "How to Sharpen an Image",
    featuresHeading: "Image Sharpener Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Simple sharpness control",
      "Conservative default strength",
      "Real convolution-based sharpening",
      "No account required",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Adjust Sharpness",
        description: "Choose a sharpening strength.",
      },
      {
        title: "Download the Sharpened Image",
        description: "Save the sharpened file.",
      },
    ],
    faq: [
      {
        question: "Can sharpening fix a very blurry photo?",
        answer:
          "Sharpening can improve edge clarity, but it cannot recover detail that was never captured.",
      },
      {
        question: "Why avoid max sharpening by default?",
        answer: "Oversharpening creates halos and harsh edges.",
      },
      {
        question: "Which formats are supported?",
        answer: "JPG, PNG, and WebP.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-blur",
    name: "Image Blur Tool",
    slug: "image-blur",
    category: "image-tools",
    description: "Apply adjustable blur to images.",
    shortDescription: "Apply adjustable blur to images.",
    icon: "image",
    keywords: [
      "image blur",
      "blur image",
      "blur photo",
      "gaussian blur online",
    ],
    popular: false,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-sharpener",
      "image-pixelator",
      "image-compressor",
      "image-resizer",
      "background-remover",
    ],
    seoTitle: "Image Blur Tool — Free Online | ToolMyra",
    seoDescription:
      "Blur images online with ToolMyra. Adjust blur strength and download the processed image instantly.",
    h1: "Image Blur Tool",
    intro:
      "Blur images online with ToolMyra. Control blur amount, process the image, and download the blurred result.",
    convertHeading: "Blur Images Online",
    howToHeading: "How to Blur an Image",
    featuresHeading: "Image Blur Tool Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Adjustable blur amount",
      "Simple controls",
      "Real browser blur processing",
      "Useful for soft backgrounds or privacy",
      "No sign-up required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Set Blur Amount",
        description: "Choose how strong the blur should be.",
      },
      {
        title: "Download the Blurred Image",
        description: "Save the blurred file.",
      },
    ],
    faq: [
      {
        question: "What is blur useful for?",
        answer:
          "Softening backgrounds, reducing distraction, or lightly anonymizing details.",
      },
      {
        question: "Is the blur live?",
        answer:
          "Controls are instant to set; the final file is generated when you apply blur.",
      },
      {
        question: "Can I undo?",
        answer: "Use Process Another Image to start over.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "image-pixelator",
    name: "Image Pixelator",
    slug: "image-pixelator",
    category: "image-tools",
    description: "Pixelate images with adjustable block size.",
    shortDescription: "Pixelate images with adjustable block size.",
    icon: "image",
    keywords: [
      "image pixelator",
      "pixelate image",
      "mosaic effect",
      "pixelate photo",
    ],
    popular: false,
    new: true,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-blur",
      "image-cropper",
      "image-compressor",
      "circular-image-cropper",
      "background-remover",
    ],
    seoTitle: "Image Pixelator — Free Online | ToolMyra",
    seoDescription:
      "Pixelate images online with ToolMyra. Adjust pixel size and download a mosaic-style result instantly.",
    h1: "Image Pixelator",
    intro:
      "Pixelate images online with ToolMyra. Choose a pixel block size, preview the effect after processing, and download the pixelated image.",
    convertHeading: "Pixelate Images Online",
    howToHeading: "How to Pixelate an Image",
    featuresHeading: "Image Pixelator Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Adjustable pixel size",
      "Moderate default block size",
      "Real pixelation processing",
      "Straightforward workflow",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Choose Pixel Size",
        description: "Pick a block size for the mosaic effect.",
      },
      {
        title: "Download the Pixelated Image",
        description: "Save the pixelated file.",
      },
    ],
    faq: [
      {
        question: "Is pixelation reversible from the output?",
        answer:
          "Once downloaded, fine detail is intentionally lost in the pixelated regions.",
      },
      {
        question: "What pixel size should I use?",
        answer:
          "Larger blocks create a stronger mosaic. Start moderate and increase as needed.",
      },
      {
        question: "Does it work on mobile?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "rounded-image-generator",
    name: "Rounded Image Generator",
    slug: "rounded-image-generator",
    category: "image-tools",
    description: "Generate images with rounded corners and transparent edges.",
    shortDescription:
      "Generate images with rounded corners and transparent edges.",
    icon: "image-convert",
    keywords: [
      "rounded image generator",
      "round image corners",
      "rounded corners image",
    ],
    popular: false,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "circular-image-cropper",
      "image-border-generator",
      "image-cropper",
      "background-remover",
      "image-resizer",
    ],
    seoTitle: "Rounded Image Generator — Free Online | ToolMyra",
    seoDescription:
      "Create rounded images online with ToolMyra. Add rounded corners and download a transparent PNG where supported.",
    h1: "Rounded Image Generator",
    intro:
      "Create rounded-corner images online with ToolMyra. Adjust corner radius and download a PNG so transparent corners are preserved.",
    convertHeading: "Create Rounded Images Online",
    howToHeading: "How to Create a Rounded Image",
    featuresHeading: "Rounded Image Generator Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Corner radius control",
      "Transparent corners via PNG",
      "Simple preview workflow",
      "Fast generation",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Set Corner Radius",
        description: "Choose how rounded the corners should be.",
      },
      {
        title: "Download the Rounded PNG",
        description: "Save the rounded-corner PNG.",
      },
    ],
    faq: [
      {
        question: "Why PNG output?",
        answer:
          "PNG preserves transparent corners outside the rounded rectangle.",
      },
      {
        question: "Can I make a full circle?",
        answer: "For a true circle, use Circular Image Cropper.",
      },
      {
        question: "Does this crop content?",
        answer:
          "It masks corners; content under the rounded rectangle remains.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "circular-image-cropper",
    name: "Circular Image Cropper",
    slug: "circular-image-cropper",
    category: "image-tools",
    description: "Crop images into a circular cutout with transparent corners.",
    shortDescription:
      "Crop images into a circular cutout with transparent corners.",
    icon: "image-convert",
    keywords: [
      "circular image cropper",
      "circle crop image",
      "round profile picture maker",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "rounded-image-generator",
      "image-cropper",
      "image-border-generator",
      "image-resizer",
      "background-remover",
    ],
    seoTitle: "Circular Image Cropper — Free Online | ToolMyra",
    seoDescription:
      "Create circular images online with ToolMyra. Crop to a circle and download a PNG with transparent corners.",
    h1: "Circular Image Cropper",
    intro:
      "Create circular images online with ToolMyra. Position the circular crop, generate a true circular mask, and download a transparent PNG.",
    convertHeading: "Create Circular Images Online",
    howToHeading: "How to Create a Circular Image",
    featuresHeading: "Circular Image Cropper Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Circular crop interface",
      "Zoom and position controls",
      "Transparent PNG output",
      "Useful for avatars and badges",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Position the Circular Crop",
        description: "Move and zoom the circular selection.",
      },
      {
        title: "Download the Circular PNG",
        description: "Save the circular PNG.",
      },
    ],
    faq: [
      {
        question: "Is the output truly circular?",
        answer: "Yes. Outside the circle is transparent in the PNG.",
      },
      {
        question: "Can I reposition the subject?",
        answer: "Yes. Move and zoom within the circular crop area.",
      },
      {
        question: "What format do I download?",
        answer: "PNG, so transparency is preserved.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "image-border-generator",
    name: "Image Border Generator",
    slug: "image-border-generator",
    category: "image-tools",
    description: "Add custom borders, padding, and optional corner radius.",
    shortDescription:
      "Add custom borders, padding, and optional corner radius.",
    icon: "image",
    keywords: [
      "image border generator",
      "add border to image",
      "photo border",
      "frame image",
    ],
    popular: false,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "rounded-image-generator",
      "circular-image-cropper",
      "image-resizer",
      "image-cropper",
      "image-compressor",
    ],
    seoTitle: "Image Border Generator — Free Online | ToolMyra",
    seoDescription:
      "Add image borders online with ToolMyra. Customize border width, color, and padding, then download the result.",
    h1: "Image Border Generator",
    intro:
      "Add borders to images online with ToolMyra. Choose border width, color, padding, and corner radius, then download the framed result.",
    convertHeading: "Add Image Borders Online",
    howToHeading: "How to Add an Image Border",
    featuresHeading: "Image Border Generator Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Border width and color",
      "Optional padding",
      "Optional corner radius",
      "Live control inputs",
      "Fast generation",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Customize the Border",
        description: "Set width, color, padding, and radius.",
      },
      {
        title: "Download the Bordered Image",
        description: "Save the bordered image.",
      },
    ],
    faq: [
      {
        question: "Can I use brand colors?",
        answer: "Yes. Pick any border color with the color control.",
      },
      {
        question: "Does padding sit inside the border?",
        answer: "Yes. Padding adds space between the image and the border.",
      },
      {
        question: "Will transparency be kept?",
        answer:
          "PNG output is used when transparency matters for rounded borders.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["JPG", "PNG", "WebP"],
  }),
  tool({
    id: "background-remover",
    name: "Background Remover",
    slug: "background-remover",
    category: "image-tools",
    description:
      "Remove image backgrounds and download a transparent PNG where supported.",
    shortDescription:
      "Remove image backgrounds and download a transparent PNG where supported.",
    icon: "image",
    keywords: [
      "background remover",
      "remove image background",
      "remove background from image",
      "transparent background",
    ],
    popular: true,
    new: true,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-cropper",
      "circular-image-cropper",
      "rounded-image-generator",
      "image-compressor",
      "image-resizer",
    ],
    seoTitle: "Background Remover — Free Online | ToolMyra",
    seoDescription:
      "Remove image backgrounds online with ToolMyra and download a transparent PNG that keeps the foreground subject intact.",
    h1: "Background Remover",
    intro:
      "Remove the background from your image and download a transparent PNG. The foreground subject is preserved while the background becomes transparent.",
    convertHeading: "Remove Image Background",
    howToHeading: "How to Remove an Image Background",
    featuresHeading: "Background Remover Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Removes background only",
      "Preserves the foreground subject",
      "Transparent PNG download",
      "Original and result preview",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Remove Background",
        description: "Start removal and wait for the result.",
      },
      {
        title: "Download the Transparent PNG",
        description: "Save the background-removed PNG.",
      },
    ],
    faq: [
      {
        question: "Does this remove only the background?",
        answer:
          "Yes. The tool is designed to make the background transparent while keeping the foreground subject as intact as possible. Results can still vary with complex scenes, thin edges, or low contrast.",
      },
      {
        question: "Why PNG?",
        answer:
          "PNG supports transparency. JPEG cannot store transparent pixels, so JPG uploads are exported as PNG.",
      },
      {
        question: "What if removal fails?",
        answer:
          "You will see a clear error and can try another image. The tool does not show a fake success state.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["PNG"],
  }),
  tool({
    id: "image-color-picker",
    name: "Image Color Picker",
    slug: "image-color-picker",
    category: "image-tools",
    description:
      "Sample colors from an image and copy HEX, RGB, or HSL values.",
    shortDescription:
      "Sample colors from an image and copy HEX, RGB, or HSL values.",
    icon: "image",
    keywords: [
      "image color picker",
      "pick color from image",
      "color picker from image",
      "hex from image",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JPG", "JPEG", "PNG", "WebP"],
    relatedToolIds: [
      "image-metadata-viewer",
      "image-cropper",
      "image-resizer",
      "image-border-generator",
      "rounded-image-generator",
    ],
    seoTitle: "Image Color Picker — Free Online | ToolMyra",
    seoDescription:
      "Pick colors from an image online with ToolMyra. Sample HEX, RGB, and HSL values and copy them instantly.",
    h1: "Image Color Picker",
    intro:
      "Pick colors from an image online with ToolMyra. Click or tap a pixel to sample HEX, RGB, and HSL values, then copy them to your clipboard.",
    convertHeading: "Pick Colors From Images Online",
    howToHeading: "How to Pick a Color From an Image",
    featuresHeading: "Image Color Picker Features",
    supportedFormatsHeading: "Supported Image Formats",
    relatedToolsHeading: "Related Image Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Click/tap sampling",
      "HEX, RGB, and HSL readout",
      "Real clipboard copy",
      "Touch-friendly interaction",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Upload Your Image",
        description: "Choose an image from your device.",
      },
      {
        title: "Click or Tap to Sample",
        description: "Select a pixel color from the image.",
      },
      {
        title: "Copy the Color Values",
        description: "Copy HEX, RGB, or HSL to your clipboard.",
      },
    ],
    faq: [
      {
        question: "Do the copy buttons really work?",
        answer:
          "Yes. They use the browser clipboard API and show a Copied confirmation.",
      },
      {
        question: "Can I use this on mobile?",
        answer: "Yes. Tap the image to sample a color.",
      },
      {
        question: "Does this change the image?",
        answer: "No. It only reads pixel colors.",
      },
    ],
    inputFormats: ["JPG", "JPEG", "PNG", "WebP"],
    outputFormats: ["HEX", "RGB", "HSL"],
  }),
];
