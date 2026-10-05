import type { GeneratorToolConfig } from "./types";

function make(
  slug: string,
  kind: GeneratorToolConfig["kind"],
  actionLabel: string,
  downloadName?: string,
  notices: string[] = [],
): GeneratorToolConfig {
  return { slug, kind, actionLabel, downloadName, notices };
}

export const generatorToolConfigs: Record<string, GeneratorToolConfig> = {
  "username-generator": make("username-generator", "username", "Generate Usernames", "usernames.txt"),
  "business-name-generator": make(
    "business-name-generator",
    "business-name",
    "Generate Names",
    "business-names.txt",
    ["Generated names are ideas only — not trademark or domain availability checks."],
  ),
  "blog-title-generator": make(
    "blog-title-generator",
    "blog-title",
    "Generate Titles",
    "blog-titles.txt",
    ["Titles are built from local templates — not AI-generated."],
  ),
  "hashtag-generator": make(
    "hashtag-generator",
    "hashtag",
    "Generate Hashtags",
    "hashtags.txt",
    ["Hashtags are generated from local rules — not live trending data."],
  ),
  "url-slug-generator": make("url-slug-generator", "url-slug", "Generate Slug"),
  "utm-url-builder": make("utm-url-builder", "utm-url", "Generate URL"),
  "color-palette-generator": make("color-palette-generator", "color-palette", "Generate Palette"),
  "css-gradient-generator": make("css-gradient-generator", "css-gradient", "Generate CSS"),
  "css-box-shadow-generator": make("css-box-shadow-generator", "css-box-shadow", "Generate CSS"),
  "css-border-radius-generator": make(
    "css-border-radius-generator",
    "css-border-radius",
    "Generate CSS",
  ),
  "css-clamp-generator": make("css-clamp-generator", "css-clamp", "Generate CSS"),
  "html-boilerplate-generator": make(
    "html-boilerplate-generator",
    "html-boilerplate",
    "Generate HTML",
    "html-boilerplate.html",
  ),
  "meta-tags-generator": make(
    "meta-tags-generator",
    "meta-tags",
    "Generate Meta Tags",
    "meta-tags.html",
  ),
  "open-graph-generator": make(
    "open-graph-generator",
    "open-graph",
    "Generate Tags",
    "open-graph-tags.html",
  ),
  "robots-txt-generator": make(
    "robots-txt-generator",
    "robots-txt",
    "Generate robots.txt",
    "robots.txt",
    ["Review restrictive Disallow rules carefully before publishing."],
  ),
  "sitemap-xml-generator": make(
    "sitemap-xml-generator",
    "sitemap-xml",
    "Generate Sitemap",
    "sitemap.xml",
    ["Creating a sitemap does not submit it to Google automatically."],
  ),
  "gitignore-generator": make(
    "gitignore-generator",
    "gitignore",
    "Generate .gitignore",
    ".gitignore",
  ),
  "json-mock-data-generator": make(
    "json-mock-data-generator",
    "json-mock",
    "Generate JSON",
    "mock-data.json",
    ["Values are synthetic test data, not real personal records."],
  ),
  "csv-test-data-generator": make(
    "csv-test-data-generator",
    "csv-test",
    "Generate CSV",
    "test-data.csv",
    ["Values are synthetic test data, not real personal records."],
  ),
  "cron-expression-generator": make(
    "cron-expression-generator",
    "cron",
    "Generate Expression",
    undefined,
    ["Uses a 5-field UNIX crontab dialect — not every scheduler is identical."],
  ),
};

export function getGeneratorToolConfig(slug: string): GeneratorToolConfig | undefined {
  return generatorToolConfigs[slug];
}

export function isExtendedGeneratorSlug(slug: string): boolean {
  return Boolean(generatorToolConfigs[slug]);
}
