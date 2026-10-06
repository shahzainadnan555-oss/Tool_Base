import type { CategoryId } from "./types";
import { getToolById, getToolsByCategory } from "./registry";
import type { ToolDefinition } from "./types";

export interface BrowseSection {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  featuredIds?: string[];
  categoryId?: CategoryId;
  extraIds?: string[];
}

export const browseSections: BrowseSection[] = [
  {
    id: "images",
    label: "Images",
    description: "Convert, resize, compress, crop, and transform images.",
    href: "/categories/image-tools",
    icon: "image",
    categoryId: "image-tools",
    featuredIds: [
      "jpg-to-png",
      "png-to-jpg",
      "image-compressor",
      "image-cropper",
      "webp-to-jpg",
      "png-to-svg",
      "image-to-webp",
      "meme-generator",
    ],
  },
  {
    id: "pdf",
    label: "PDF",
    description: "Merge, split, compress, protect, and convert PDF files.",
    href: "/categories/pdf-tools",
    icon: "pdf",
    categoryId: "pdf-tools",
    featuredIds: [
      "pdf-compressor",
      "jpg-to-pdf",
      "pdf-merger",
      "pdf-splitter",
      "pdf-password-protector",
      "pdf-page-extractor",
      "pdf-metadata-viewer",
      "mhtml-to-pdf",
    ],
  },
  {
    id: "documents",
    label: "Documents & Files",
    description: "Move documents and structured data between common formats.",
    href: "/categories/document-data-tools",
    icon: "text",
    categoryId: "document-data-tools",
  },
  {
    id: "text",
    label: "Text & Lists",
    description: "Count, convert, shuffle, and clean written text.",
    href: "/categories/text-tools",
    icon: "text",
    categoryId: "text-tools",
    featuredIds: [
      "word-counter",
      "character-counter",
      "text-case-converter",
      "bionic-reading-converter",
      "randomize-list",
      "text-to-image",
      "capitalize-words",
      "text-diff-checker",
    ],
  },
  {
    id: "encryption",
    label: "Encryption & Encoding",
    description: "Hash, encode, encrypt, and generate technical values.",
    href: "/categories/security-encoding",
    icon: "shield",
    categoryId: "security-encoding",
    featuredIds: [
      "sha256-hash-generator",
      "aes-encrypt",
      "password-generator",
      "qr-code-generator",
      "md5-hash-generator",
      "sha384-hash",
      "base64",
      "uuid-generator",
    ],
  },
  {
    id: "web-developer",
    label: "Web & Developer",
    description: "Format JSON, HTML, CSS, and JavaScript, plus color converters.",
    href: "/categories/developer-tools",
    icon: "code",
    categoryId: "developer-tools",
    featuredIds: [
      "json-formatter",
      "json-viewer",
      "css-minifier",
      "html-formatter",
      "javascript-formatter",
      "json-to-xml",
      "hex-to-rgb",
      "url-encoder",
    ],
  },
  {
    id: "calculators",
    label: "Calculators & Converters",
    description: "Percentages, units, dates, and specialized estimates.",
    href: "/categories/calculators-converters",
    icon: "calculator",
    categoryId: "calculators-converters",
    featuredIds: [
      "percentage-calculator",
      "college-gpa-calculator",
      "car-loan-payment-calculator",
      "ap-chem-score-calculator",
      "unit-converter",
      "date-difference-calculator",
      "weighted-gpa-calculator",
      "retirement-calculator-dave-ramsey",
    ],
  },
  {
    id: "specialized-calculators",
    label: "Specialized Calculators",
    description: "GPA, AP scores, auto, tax, and other focused estimators.",
    href: "/categories/specialized-calculators",
    icon: "calculator",
    categoryId: "specialized-calculators",
    featuredIds: [
      "college-gpa-calculator",
      "final-grade-needed-calculator",
      "car-loan-payment-calculator",
      "ap-lit-score-calculator",
      "totaled-car-value-calculator",
      "weighted-gpa-calculator",
      "ap-psychology-score-calculator",
      "sales-commission-calculator",
    ],
  },
  {
    id: "generators",
    label: "Generators",
    description: "Create CSS, meta tags, mock data, and starter documents.",
    href: "/categories/generators",
    icon: "text",
    categoryId: "generators",
    featuredIds: [
      "temporary-email-generator",
      "username-generator",
      "color-palette-generator",
      "meta-tags-generator",
      "privacy-policy-generator",
      "terms-generator",
      "json-mock-data-generator",
      "cron-expression-generator",
    ],
  },
  {
    id: "social",
    label: "Social Media",
    description: "Hashtags, UTM links, and share-ready snippets.",
    href: "/categories/generators",
    icon: "text",
    extraIds: [
      "hashtag-generator",
      "utm-url-builder",
      "open-graph-generator",
      "url-slug-generator",
      "blog-title-generator",
      "meta-tags-generator",
    ],
  },
  {
    id: "design",
    label: "Design & Creative",
    description: "Memes, CSS generators, palettes, invoices, and image canvases.",
    href: "/categories/design-creative",
    icon: "image",
    categoryId: "design-creative",
    featuredIds: [
      "meme-generator",
      "css-button-generator",
      "color-contrast-checker",
      "favicon-generator",
      "invoice-generator",
      "css-text-shadow-generator",
      "pixel-art-generator",
      "e-signature",
    ],
  },
  {
    id: "productivity",
    label: "Typing & Productivity",
    description: "Typing tests, timers, notes, and everyday helpers.",
    href: "/categories/typing-productivity",
    icon: "text",
    categoryId: "typing-productivity",
    featuredIds: [
      "typing-speed-test",
      "pomodoro-timer",
      "stopwatch",
      "online-notepad",
      "todo-list",
      "focus-timer",
      "password-strength-checker",
      "random-picker",
    ],
  },
  {
    id: "utilities",
    label: "Utilities",
    description: "Screen checks, barcodes, parsers, and device diagnostics.",
    href: "/categories/utilities",
    icon: "qr",
    categoryId: "utilities",
    featuredIds: [
      "webcam-test",
      "screen-resolution-checker",
      "keyboard-tester",
      "barcode-generator",
      "url-parser",
      "http-status-code-lookup",
      "viewport-size-checker",
      "file-signature-checker",
    ],
  },
  {
    id: "audio",
    label: "Audio",
    description: "Convert, trim, and process audio files.",
    href: "/categories/audio-tools",
    icon: "audio",
    categoryId: "audio-tools",
  },
  {
    id: "video",
    label: "Video",
    description: "Convert, compress, and extract video.",
    href: "/categories/video-tools",
    icon: "video",
    categoryId: "video-tools",
  },
];

export function toolsForBrowseSection(
  section: BrowseSection,
  limit?: number,
): ToolDefinition[] {
  const seen = new Set<string>();
  const list: ToolDefinition[] = [];

  const push = (tool?: ToolDefinition) => {
    if (!tool || seen.has(tool.id)) return;
    seen.add(tool.id);
    list.push(tool);
  };

  if (section.featuredIds) {
    for (const id of section.featuredIds) push(getToolById(id));
  }
  if (section.extraIds) {
    for (const id of section.extraIds) push(getToolById(id));
  }
  if (section.categoryId) {
    for (const tool of getToolsByCategory(section.categoryId)) push(tool);
  }

  return typeof limit === "number" ? list.slice(0, limit) : list;
}
