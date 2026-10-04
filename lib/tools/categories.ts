import type { CategoryDefinition, CategoryId } from "./types";

export const categories: CategoryDefinition[] = [
  {
    id: "image-tools",
    name: "Image Tools",
    slug: "image-tools",
    description:
      "Convert, compress, resize, crop, edit, and optimize images online.",
    shortDescription: "Convert, compress, and optimize images.",
    icon: "image",
    seoTitle: "Image Tools — Convert, Compress & Edit Images Online | Tool Base",
    seoDescription:
      "Free online image tools from Tool Base. Convert JPG, PNG, WebP, and SVG files, compress images, resize photos, and optimize visuals in your browser.",
    h1: "Image Tools",
    intro:
      "Use Tool Base image tools to convert popular formats, compress large files, resize photos, crop visuals, and prepare images for the web. Each utility focuses on a clear everyday task so you can upload, process, and download without creating an account.",
    route: "/categories/image-tools",
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    slug: "pdf-tools",
    description:
      "Convert, compress, merge, split, extract, and process PDF files.",
    shortDescription: "Convert, compress, and process PDFs.",
    icon: "pdf",
    seoTitle: "PDF Tools — Compress, Convert & Process PDFs Online | Tool Base",
    seoDescription:
      "Free online PDF tools from Tool Base. Compress PDFs, convert images to PDF, and process documents quickly with a clean, account-free workflow.",
    h1: "PDF Tools",
    intro:
      "Work with PDF files using Tool Base utilities designed for everyday document tasks such as compression, conversion, merging, splitting, and related preparation steps. Choose a tool, upload your file, and download the result when processing finishes.",
    route: "/categories/pdf-tools",
  },
  {
    id: "document-data-tools",
    name: "Document & Data Tools",
    slug: "document-data-tools",
    description:
      "Convert documents and structured data between DOCX, PDF, TXT, Markdown, CSV, JSON, XML, YAML, and more.",
    shortDescription: "Convert documents and structured data formats.",
    icon: "text",
    seoTitle:
      "Document & Data Tools — DOCX, Markdown, CSV, JSON & More | Tool Base",
    seoDescription:
      "Free online document and data converters from Tool Base. Convert DOCX, PDF, Markdown, CSV, JSON, XML, YAML, and related formats without creating an account.",
    h1: "Document & Data Tools",
    intro:
      "Convert documents and structured data with Tool Base utilities for DOCX, text, Markdown, CSV, JSON, XML, YAML, and related everyday formats. These tools help you move content between formats while keeping the workflow simple and account-free.",
    route: "/categories/document-data-tools",
  },
  {
    id: "audio-tools",
    name: "Audio Tools",
    slug: "audio-tools",
    description: "Convert, trim, compress, edit, and process audio files.",
    shortDescription: "Convert and process audio files.",
    icon: "audio",
    seoTitle: "Audio Tools — Convert & Process Audio Online | Tool Base",
    seoDescription:
      "Free online audio tools from Tool Base. Convert MP3, WAV, and other formats, and process audio files with a simple online experience.",
    h1: "Audio Tools",
    intro:
      "Convert and process audio files with Tool Base tools built for quick everyday media tasks. Format changes, trimming, and related utilities are organized so you can complete a job and download the output without signup.",
    route: "/categories/audio-tools",
  },
  {
    id: "video-tools",
    name: "Video Tools",
    slug: "video-tools",
    description:
      "Convert, compress, trim, resize, extract, and process video files.",
    shortDescription: "Convert and process video files.",
    icon: "video",
    seoTitle: "Video Tools — Convert & Extract Video Online | Tool Base",
    seoDescription:
      "Free online video tools from Tool Base. Convert video formats, extract audio from MP4 files, and handle common video tasks without signing up.",
    h1: "Video Tools",
    intro:
      "Handle common video conversion, compression, trimming, resizing, and extraction tasks with Tool Base’s free online video utilities. Processing can take longer for large files, and output quality may vary by format and settings.",
    route: "/categories/video-tools",
  },
  {
    id: "text-tools",
    name: "Text Tools",
    slug: "text-tools",
    description: "Count, clean, format, transform, compare, and generate text.",
    shortDescription: "Count, format, and transform text.",
    icon: "text",
    seoTitle: "Text Tools — Word Counter, Formatters & Utilities | Tool Base",
    seoDescription:
      "Free online text tools from Tool Base. Count words, clean content, format text, and complete everyday writing utilities instantly.",
    h1: "Text Tools",
    intro:
      "Use Tool Base text tools for counting, formatting, cleaning, comparing, and transforming written content. These utilities are useful for drafting, editing, and preparing text without installing desktop software.",
    route: "/categories/text-tools",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    slug: "developer-tools",
    description:
      "Format, validate, encode, decode, test, and transform developer data and code.",
    shortDescription: "Format, validate, and transform code data.",
    icon: "code",
    seoTitle: "Developer Tools — JSON, Encoding & Code Utilities | Tool Base",
    seoDescription:
      "Free online developer tools from Tool Base. Format JSON, transform data, and use practical coding utilities without creating an account.",
    h1: "Developer Tools",
    intro:
      "Practical developer utilities for formatting, validating, and transforming common data formats such as JSON and related structured text. Use them for quick debugging and conversion tasks during everyday development work.",
    route: "/categories/developer-tools",
  },
  {
    id: "security-encoding",
    name: "Security & Encoding",
    slug: "security-encoding",
    description:
      "Generate hashes, encode and decode data, create UUIDs, and work with technical formats.",
    shortDescription: "Hash, encode, decode, and generate IDs.",
    icon: "shield",
    seoTitle:
      "Security & Encoding Tools — Hash, Encode & UUID Utilities | Tool Base",
    seoDescription:
      "Free online security and encoding utilities from Tool Base. Generate hashes, encode and decode data, create UUIDs, and work with technical formats.",
    h1: "Security & Encoding",
    intro:
      "Encode, decode, hash, and generate technical values with Tool Base utilities designed for developers and everyday technical tasks. These tools are helpers, not a substitute for a security audit or professional cryptography review.",
    route: "/categories/security-encoding",
  },
  {
    id: "calculators-converters",
    name: "Calculators & Converters",
    slug: "calculators-converters",
    description:
      "Convert units and calculate percentages, dates, ages, ratios, storage, time, and more.",
    shortDescription: "Calculate percentages, dates, and conversions.",
    icon: "calculator",
    seoTitle:
      "Calculators & Converters — Percentage, Units & More | Tool Base",
    seoDescription:
      "Free online calculators and converters from Tool Base. Calculate percentages, convert units, and handle everyday math and conversion tasks.",
    h1: "Calculators & Converters",
    intro:
      "Quick calculators and converters for percentages, units, dates, ages, storage, time, and other everyday measurements. Results follow the formulas shown on each tool page and should be verified before important use.",
    route: "/categories/calculators-converters",
  },
];

export function getCategoryById(id: CategoryId): CategoryDefinition | undefined {
  return categories.find((category) => category.id === id);
}

export function getCategoryBySlug(
  slug: string,
): CategoryDefinition | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return categories.map((category) => category.slug);
}
