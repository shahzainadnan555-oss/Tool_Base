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
      "Free online image tools from Tool Base. Convert JPG, PNG, WebP, and SVG files, compress images, resize photos, and optimize visuals.",
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
      "Financial, math, date, construction, electrical, transportation, and everyday conversion calculators.",
    shortDescription: "Financial, math, date, and conversion calculators.",
    icon: "calculator",
    seoTitle:
      "Calculators & Converters — Mortgage, Math, Units & More | Tool Base",
    seoDescription:
      "Free online calculators and converters from Tool Base. Explore mortgage, loan, math, date, construction, and everyday conversion tools.",
    h1: "Calculators & Converters",
    intro:
      "Browse Tool Base calculators for finance, math, dates, construction, measurement, electrical work, internet utilities, transportation, and education—plus everyday converters. Specialized Calculators for GPA, AP scores, auto, tax, and home-service estimates live in this parent group as well. Results follow the formulas shown on each tool page and should be verified before important use. Start from /tools/calculators for category navigation.",
    route: "/categories/calculators-converters",
  },
  {
    id: "specialized-calculators",
    name: "Specialized Calculators",
    slug: "specialized-calculators",
    description:
      "Focused estimators for totaled-car value, property capital gains, GPA, AP scores, car loans, commissions, retirement projections, and tree-removal costs.",
    shortDescription: "Specialized estimates for auto, tax, school, and home.",
    icon: "calculator",
    seoTitle: "Specialized Calculators — GPA, AP, Auto, Tax | Tool Base",
    seoDescription:
      "Free specialized calculators from Tool Base. Estimate GPA, AP scores, car loan payments, commissions, totaled-car value, capital gains, retirement savings, and tree-removal cost.",
    h1: "Specialized Calculators",
    intro:
      "Specialized Calculators sit under the Calculators & Converters parent group. Use them for GPA and AP score estimates, auto and tax figures, commission math, retirement compounding, and tree-removal budgeting. Results follow the inputs and assumptions you provide and are not official determinations from an insurer, tax authority, College Board, or contractor.",
    route: "/categories/specialized-calculators",
    faq: [
      { question: "Are AP score results official?", answer: "No. They estimate from published exam structure. College Board issues official scores." },
      { question: "Can I use the GPA tools for any school?", answer: "Yes, if you set the scale and credits to match that school. The registrar’s record remains official." },
      { question: "Are finance results quotes?", answer: "No. Loan and commission figures use the formulas on each page and are not lender or payroll quotes." },
    ],
  },
  {
    id: "generators",
    name: "Generators",
    slug: "generators",
    description:
      "Generate usernames, titles, CSS, meta tags, robots.txt, sitemaps, mock data, cron expressions, and more.",
    shortDescription: "Generate text, CSS, SEO, and test data.",
    icon: "text",
    seoTitle: "Generators — Email, CSS, SEO & Data Tools | Tool Base",
    seoDescription:
      "Free generator tools from Tool Base. Create temporary emails, usernames, CSS, meta tags, robots.txt, sitemaps, mock data, and cron expressions.",
    h1: "Generators",
    intro:
      "Generator tools create synthetic values for testing, mockups, content ideas, CSS snippets, SEO files, and developer fixtures. The Temporary Email Generator produces a temporary-looking address only — it does not provide an inbox or receive email.",
    route: "/categories/generators",
  },
  {
    id: "typing-productivity",
    name: "Typing & Productivity",
    slug: "typing-productivity",
    description:
      "Typing speed tests, timers, notepads, lists, and everyday productivity helpers.",
    shortDescription: "Typing tests, timers, and productivity helpers.",
    icon: "text",
    seoTitle: "Typing & Productivity — WPM, Timers & Lists | Tool Base",
    seoDescription:
      "Free typing and productivity tools from Tool Base. Measure WPM, run focus timers, draft notes, and pick from lists.",
    h1: "Typing & Productivity",
    intro:
      "Typing & Productivity tools cover speed tests, timers, notes, checklists, and quick decision helpers. The Typing Speed Test measures words per minute with timestamp-based timing. Companion tools help you plan sessions, draft text, and pick from lists.",
    route: "/categories/typing-productivity",
    faq: [
      { question: "How is typing WPM calculated?", answer: "WPM uses (typed characters ÷ 5) ÷ elapsed minutes, with elapsed time from timestamps." },
      { question: "Do timers keep accurate remaining time?", answer: "Remaining time is derived from start timestamps rather than counting animation frames as the clock." },
      { question: "Are notes stored in an account?", answer: "The notepad keeps a draft in this browser until you clear it." },
    ],
  },
  {
    id: "design-creative",
    name: "Design & Creative",
    slug: "design-creative",
    description:
      "Create memes, signatures, invoices, CSS snippets, palettes, SVG shapes, and image canvases.",
    shortDescription: "Creative CSS, image, and document tools.",
    icon: "image",
    seoTitle: "Design & Creative Tools — CSS, Memes & Images | Tool Base",
    seoDescription:
      "Free design and creative tools from Tool Base. Generate CSS, extract palettes, build placeholders, draw pixel art, and create invoices or memes.",
    h1: "Design & Creative",
    intro:
      "Design & Creative tools cover captioned images, signatures, invoices, icon SVG copy, CSS generators, palettes, placeholders, and SVG shapes. Use them to draft visuals and copy the output into your project.",
    route: "/categories/design-creative",
    faq: [
      { question: "Do CSS tools output real CSS?", answer: "Yes. Each generator shows a live preview and a copyable declaration or snippet." },
      { question: "Can I download images?", answer: "Favicon, placeholder, social-size, pixel art, and meme tools export PNG where that is the result." },
      { question: "Are palettes sampled from my image?", answer: "The palette extractor groups sampled pixels from the file you upload." },
    ],
  },
  {
    id: "utilities",
    name: "Utilities",
    slug: "utilities",
    description:
      "Check screens, parse URLs, generate barcodes, inspect files, and look up HTTP status codes.",
    shortDescription: "Device checks, parsers, and lookup utilities.",
    icon: "qr",
    seoTitle: "Utilities — Screen, URL, Barcode & Lookups | Tool Base",
    seoDescription:
      "Free utilities from Tool Base including screen and viewport checks, barcode generation, URL parsing, MIME lookup, and HTTP status codes.",
    h1: "Utilities",
    intro:
      "Utilities cover device and viewport checks, user-agent reading, keyboard and mouse tests, barcodes, data URIs, MIME and file-signature lookup, and HTTP status codes. Each page reports the values it can actually read or generate.",
    route: "/categories/utilities",
    faq: [
      { question: "Where do screen numbers come from?", answer: "They are the values this browser reports for screen, viewport, and devicePixelRatio." },
      { question: "Does the barcode tool create QR codes?", answer: "The barcode tool encodes Code 39. Use the QR Code Generator for QR codes." },
      { question: "Does file signature reading upload my file?", answer: "The checker reads leading bytes in the page to compare known signatures." },
    ],
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
