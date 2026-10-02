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
    seoTitle: "Image Tools — Convert, Compress & Edit Images Online | ToolMyra",
    seoDescription:
      "Free online image tools from ToolMyra. Convert JPG, PNG, WebP, and SVG files, compress images, resize photos, and optimize visuals in your browser.",
    h1: "Image Tools",
    intro:
      "Use ToolMyra image tools to convert popular formats, compress large files, resize photos, and prepare images for the web — without creating an account.",
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
    seoTitle: "PDF Tools — Compress, Convert & Process PDFs Online | ToolMyra",
    seoDescription:
      "Free online PDF tools from ToolMyra. Compress PDFs, convert images to PDF, and process documents quickly with a clean, account-free workflow.",
    h1: "PDF Tools",
    intro:
      "Work with PDF files using ToolMyra utilities designed for everyday document tasks like compression, conversion, and file preparation.",
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
      "Document & Data Tools — DOCX, Markdown, CSV, JSON & More | ToolMyra",
    seoDescription:
      "Free online document and data converters from ToolMyra. Convert DOCX, PDF, Markdown, CSV, JSON, XML, YAML, and related formats without creating an account.",
    h1: "Document & Data Tools",
    intro:
      "Convert documents and structured data with ToolMyra utilities for DOCX, text, Markdown, CSV, JSON, XML, YAML, and related everyday formats.",
    route: "/categories/document-data-tools",
  },
  {
    id: "audio-tools",
    name: "Audio Tools",
    slug: "audio-tools",
    description: "Convert, trim, compress, edit, and process audio files.",
    shortDescription: "Convert and process audio files.",
    icon: "audio",
    seoTitle: "Audio Tools — Convert & Process Audio Online | ToolMyra",
    seoDescription:
      "Free online audio tools from ToolMyra. Convert MP3, WAV, and other formats, and process audio files with a simple online experience.",
    h1: "Audio Tools",
    intro:
      "Convert and process audio files with ToolMyra tools built for quick everyday media tasks.",
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
    seoTitle: "Video Tools — Convert & Extract Video Online | ToolMyra",
    seoDescription:
      "Free online video tools from ToolMyra. Convert video formats, extract audio from MP4 files, and handle common video tasks without signing up.",
    h1: "Video Tools",
    intro:
      "Handle common video conversion and extraction tasks with ToolMyra’s growing set of free online video utilities.",
    route: "/categories/video-tools",
  },
  {
    id: "text-tools",
    name: "Text Tools",
    slug: "text-tools",
    description: "Count, clean, format, transform, compare, and generate text.",
    shortDescription: "Count, format, and transform text.",
    icon: "text",
    seoTitle: "Text Tools — Word Counter, Formatters & Utilities | ToolMyra",
    seoDescription:
      "Free online text tools from ToolMyra. Count words, clean content, format text, and complete everyday writing utilities instantly.",
    h1: "Text Tools",
    intro:
      "Use ToolMyra text tools for counting, formatting, cleaning, and transforming written content.",
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
    seoTitle: "Developer Tools — JSON, Encoding & Code Utilities | ToolMyra",
    seoDescription:
      "Free online developer tools from ToolMyra. Format JSON, transform data, and use practical coding utilities without creating an account.",
    h1: "Developer Tools",
    intro:
      "Practical developer utilities for formatting, validating, and transforming common data formats.",
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
      "Security & Encoding Tools — Hash, Encode & UUID Utilities | ToolMyra",
    seoDescription:
      "Free online security and encoding utilities from ToolMyra. Generate hashes, encode and decode data, create UUIDs, and work with technical formats.",
    h1: "Security & Encoding",
    intro:
      "Encode, decode, hash, and generate technical values with ToolMyra utilities designed for developers and everyday technical tasks.",
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
      "Calculators & Converters — Percentage, Units & More | ToolMyra",
    seoDescription:
      "Free online calculators and converters from ToolMyra. Calculate percentages, convert units, and handle everyday math and conversion tasks.",
    h1: "Calculators & Converters",
    intro:
      "Quick calculators and converters for percentages, units, dates, and other everyday measurements.",
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
