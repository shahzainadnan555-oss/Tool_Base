import type { DeveloperToolConfig, DeveloperToolKind } from "./types";

function make(
  slug: string,
  kind: DeveloperToolKind,
  extras: Partial<DeveloperToolConfig> & {
    actionLabel: string;
    downloadName: string;
    inputLabel: string;
  },
): DeveloperToolConfig {
  return {
    slug,
    kind,
    live: extras.live ?? false,
    showOutput: extras.showOutput ?? true,
    dualInput: extras.dualInput,
    notices: extras.notices ?? [],
    languageHint: extras.languageHint,
    outputLabel: extras.outputLabel,
    actionLabel: extras.actionLabel,
    downloadName: extras.downloadName,
    inputLabel: extras.inputLabel,
  };
}

export const developerToolConfigs: Record<string, DeveloperToolConfig> = {
  "json-formatter": make("json-formatter", "json-format", {
    actionLabel: "Format JSON",
    downloadName: "formatted.json",
    inputLabel: "JSON input",
    outputLabel: "Formatted JSON",
    languageHint: "json",
  }),
  "json-validator": make("json-validator", "json-validate", {
    actionLabel: "Validate JSON",
    downloadName: "validated.json",
    inputLabel: "JSON input",
    showOutput: false,
    live: true,
    languageHint: "json",
  }),
  "json-minifier": make("json-minifier", "json-minify", {
    actionLabel: "Minify JSON",
    downloadName: "minified.json",
    inputLabel: "JSON input",
    outputLabel: "Minified JSON",
    languageHint: "json",
  }),
  "html-formatter": make("html-formatter", "html-format", {
    actionLabel: "Format HTML",
    downloadName: "formatted.html",
    inputLabel: "HTML input",
    outputLabel: "Formatted HTML",
    languageHint: "html",
    notices: ["HTML is treated as source text and is never executed in the browser."],
  }),
  "html-minifier": make("html-minifier", "html-minify", {
    actionLabel: "Minify HTML",
    downloadName: "minified.html",
    inputLabel: "HTML input",
    outputLabel: "Minified HTML",
    languageHint: "html",
    notices: ["Minification is conservative and does not execute scripts."],
  }),
  "css-formatter": make("css-formatter", "css-format", {
    actionLabel: "Format CSS",
    downloadName: "formatted.css",
    inputLabel: "CSS input",
    outputLabel: "Formatted CSS",
    languageHint: "css",
  }),
  "css-minifier": make("css-minifier", "css-minify", {
    actionLabel: "Minify CSS",
    downloadName: "minified.css",
    inputLabel: "CSS input",
    outputLabel: "Minified CSS",
    languageHint: "css",
  }),
  "javascript-formatter": make("javascript-formatter", "js-format", {
    actionLabel: "Format JavaScript",
    downloadName: "formatted.js",
    inputLabel: "JavaScript input",
    outputLabel: "Formatted JavaScript",
    languageHint: "javascript",
    notices: ["JavaScript is formatted as source text and is never executed."],
  }),
  "javascript-minifier": make("javascript-minifier", "js-minify", {
    actionLabel: "Minify JavaScript",
    downloadName: "minified.js",
    inputLabel: "JavaScript input",
    outputLabel: "Minified JavaScript",
    languageHint: "javascript",
    notices: ["JavaScript is minified as source text and is never executed."],
  }),
  "xml-formatter": make("xml-formatter", "xml-format", {
    actionLabel: "Format XML",
    downloadName: "formatted.xml",
    inputLabel: "XML input",
    outputLabel: "Formatted XML",
    languageHint: "xml",
  }),
  "xml-validator": make("xml-validator", "xml-validate", {
    actionLabel: "Validate XML",
    downloadName: "validated.xml",
    inputLabel: "XML input",
    showOutput: false,
    live: true,
    languageHint: "xml",
  }),
  "sql-formatter": make("sql-formatter", "sql-format", {
    actionLabel: "Format SQL",
    downloadName: "formatted.sql",
    inputLabel: "SQL input",
    outputLabel: "Formatted SQL",
    languageHint: "sql",
    notices: ["SQL is only formatted as text. Nothing is executed against a database."],
  }),
  "sql-minifier": make("sql-minifier", "sql-minify", {
    actionLabel: "Minify SQL",
    downloadName: "minified.sql",
    inputLabel: "SQL input",
    outputLabel: "Minified SQL",
    languageHint: "sql",
    notices: ["SQL is only minified as text. Nothing is executed against a database."],
  }),
  "regex-tester": make("regex-tester", "regex-test", {
    actionLabel: "Test Regex",
    downloadName: "regex-matches.txt",
    inputLabel: "Test text",
    showOutput: false,
    languageHint: "regex",
    notices: [
      "Expensive patterns are stopped automatically so they cannot freeze the page.",
    ],
  }),
  "regex-generator": make("regex-generator", "regex-generate", {
    actionLabel: "Generate Regex",
    downloadName: "generated-regex.txt",
    inputLabel: "Options",
    outputLabel: "Generated regex",
    languageHint: "regex",
    notices: [
      "Generated expressions are practical templates, not universal validators.",
    ],
  }),
  "base64-encoder": make("base64-encoder", "base64-encode", {
    actionLabel: "Encode",
    downloadName: "encoded-base64.txt",
    inputLabel: "Text to encode",
    outputLabel: "Base64 output",
    live: true,
    languageHint: "text",
  }),
  "base64-decoder": make("base64-decoder", "base64-decode", {
    actionLabel: "Decode",
    downloadName: "decoded.txt",
    inputLabel: "Base64 input",
    outputLabel: "Decoded text",
    live: true,
    languageHint: "text",
  }),
  "url-encoder": make("url-encoder", "url-encode", {
    actionLabel: "Encode URL",
    downloadName: "encoded-url.txt",
    inputLabel: "Text / URI component",
    outputLabel: "Encoded output",
    live: true,
    languageHint: "text",
  }),
  "url-decoder": make("url-decoder", "url-decode", {
    actionLabel: "Decode URL",
    downloadName: "decoded-url.txt",
    inputLabel: "Encoded text",
    outputLabel: "Decoded output",
    live: true,
    languageHint: "text",
  }),
  "html-entity-encoder": make("html-entity-encoder", "html-entity-encode", {
    actionLabel: "Encode HTML",
    downloadName: "encoded-entities.txt",
    inputLabel: "Text to encode",
    outputLabel: "HTML entities",
    live: true,
    languageHint: "html",
    notices: ["Encoded text is shown as source only and is never rendered as HTML."],
  }),
  "html-decode": make("html-decode", "html-entity-decode", {
    actionLabel: "Decode HTML",
    downloadName: "decoded-html.txt",
    inputLabel: "HTML entities",
    outputLabel: "Decoded text",
    live: true,
    languageHint: "html",
  }),
  "hex-to-rgb": make("hex-to-rgb", "hex-to-rgb", {
    actionLabel: "Convert to RGB",
    downloadName: "rgb.txt",
    inputLabel: "HEX color",
    outputLabel: "RGB",
    live: true,
    languageHint: "text",
  }),
  "rgb-to-hex": make("rgb-to-hex", "rgb-to-hex", {
    actionLabel: "Convert to HEX",
    downloadName: "hex.txt",
    inputLabel: "RGB color",
    outputLabel: "HEX",
    live: true,
    languageHint: "text",
  }),
};

export function getDeveloperToolConfig(slug: string): DeveloperToolConfig | undefined {
  return developerToolConfigs[slug];
}

export function isDeveloperToolSlug(slug: string): boolean {
  return Boolean(developerToolConfigs[slug]);
}

export const developerToolSlugs = Object.keys(developerToolConfigs);
