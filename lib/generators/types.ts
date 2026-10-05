export type GeneratorKind =
  | "username"
  | "business-name"
  | "blog-title"
  | "hashtag"
  | "url-slug"
  | "utm-url"
  | "color-palette"
  | "css-gradient"
  | "css-box-shadow"
  | "css-border-radius"
  | "css-clamp"
  | "html-boilerplate"
  | "meta-tags"
  | "open-graph"
  | "robots-txt"
  | "sitemap-xml"
  | "gitignore"
  | "json-mock"
  | "csv-test"
  | "cron";

export interface GeneratorToolConfig {
  slug: string;
  kind: GeneratorKind;
  actionLabel: string;
  downloadName?: string;
  notices?: string[];
}

export interface GeneratorResult {
  text: string;
  items?: string[];
  meta?: Record<string, string>;
  previewCss?: string;
  previewHtml?: string;
  colors?: string[];
}

export const LIMITS = {
  usernames: 50,
  businessNames: 30,
  blogTitles: 25,
  hashtags: 40,
  mockRecords: 100,
  csvRows: 500,
  sitemapUrls: 100,
} as const;
