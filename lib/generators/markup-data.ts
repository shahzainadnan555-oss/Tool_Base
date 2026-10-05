import { escapeHtmlAttr, escapeXml, clampQuantity, pick, randomDigits, randomInt } from "./random";
import { COUNTRIES, FIRST_NAMES, LAST_NAMES } from "./words";
import { LIMITS, type GeneratorResult } from "./types";

export function generateCssGradient(input: {
  type: string;
  angle: string;
  position: string;
  color1: string;
  color2: string;
  color3: string;
  useThird: boolean;
}): GeneratorResult {
  const stops = [input.color1, input.color2, input.useThird ? input.color3 : ""]
    .map((c) => c.trim())
    .filter(Boolean);
  if (stops.length < 2) throw new Error("Provide at least two colors.");
  for (const c of stops) {
    if (!/^#[0-9a-fA-F]{6}$/.test(c)) throw new Error(`Invalid color: ${c}`);
  }
  const css =
    input.type === "radial"
      ? `background: radial-gradient(circle at ${input.position || "center"}, ${stops.join(", ")});`
      : `background: linear-gradient(${Number(input.angle) || 90}deg, ${stops.join(", ")});`;
  return { text: css, previewCss: css };
}

export function generateBoxShadow(input: {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
  opacity: string;
  inset: boolean;
}): GeneratorResult {
  const x = Number(input.x);
  const y = Number(input.y);
  const blur = Number(input.blur);
  const spread = Number(input.spread);
  const opacity = Number(input.opacity);
  if (![x, y, blur, spread, opacity].every(Number.isFinite)) {
    throw new Error("Enter valid numeric shadow values.");
  }
  if (opacity < 0 || opacity > 1) throw new Error("Opacity must be between 0 and 1.");
  const color = input.color.trim() || "#000000";
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error("Enter a valid HEX color.");
  const rgba = hexToRgba(color, opacity);
  const css = `box-shadow: ${input.inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba};`;
  return { text: css, previewCss: css };
}

function hexToRgba(hex: string, alpha: number): string {
  const n = hex.slice(1);
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function generateBorderRadius(input: {
  tl: string;
  tr: string;
  br: string;
  bl: string;
  linked: boolean;
}): GeneratorResult {
  const tl = Number(input.tl);
  if (!Number.isFinite(tl) || tl < 0) throw new Error("Enter valid radius values.");
  const tr = input.linked ? tl : Number(input.tr);
  const br = input.linked ? tl : Number(input.br);
  const bl = input.linked ? tl : Number(input.bl);
  if (![tr, br, bl].every((n) => Number.isFinite(n) && n >= 0)) {
    throw new Error("Enter valid radius values.");
  }
  const value =
    tl === tr && tr === br && br === bl
      ? `${tl}px`
      : `${tl}px ${tr}px ${br}px ${bl}px`;
  const css = `border-radius: ${value};`;
  return { text: css, previewCss: css };
}

export function generateClamp(input: {
  property: string;
  min: string;
  preferred: string;
  max: string;
  unit: string;
}): GeneratorResult {
  const unit = input.unit || "rem";
  const min = Number(input.min);
  const preferred = Number(input.preferred);
  const max = Number(input.max);
  if (![min, preferred, max].every(Number.isFinite)) {
    throw new Error("Enter numeric min, preferred, and max values.");
  }
  if (min > max) throw new Error("Minimum cannot be greater than maximum.");
  const prop = input.property.trim() || "font-size";
  const preferredUnit = unit === "rem" || unit === "em" ? "vw" : unit === "px" ? "vw" : "vw";
  const css = `${prop}: clamp(${min}${unit}, ${preferred}${preferredUnit}, ${max}${unit});`;
  return { text: css, previewCss: prop === "font-size" ? css : undefined };
}

export function generateHtmlBoilerplate(input: {
  lang: string;
  title: string;
  description: string;
  stylesheet: string;
  script: string;
  favicon: string;
}): GeneratorResult {
  const lang = escapeHtmlAttr(input.lang.trim() || "en");
  const title = escapeHtmlAttr(input.title.trim() || "Document");
  const description = escapeHtmlAttr(input.description.trim());
  const lines = [
    "<!DOCTYPE html>",
    `<html lang="${lang}">`,
    "<head>",
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `  <title>${title}</title>`,
  ];
  if (description) lines.push(`  <meta name="description" content="${description}" />`);
  if (input.favicon.trim()) {
    lines.push(
      `  <link rel="icon" href="${escapeHtmlAttr(input.favicon.trim())}" />`,
    );
  }
  if (input.stylesheet.trim()) {
    lines.push(
      `  <link rel="stylesheet" href="${escapeHtmlAttr(input.stylesheet.trim())}" />`,
    );
  }
  lines.push("</head>", "<body>", "  <!-- Content goes here -->");
  if (input.script.trim()) {
    lines.push(
      `  <script src="${escapeHtmlAttr(input.script.trim())}"></script>`,
    );
  }
  lines.push("</body>", "</html>");
  return { text: lines.join("\n") };
}

export function generateMetaTags(input: {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
  canonical: string;
}): GeneratorResult {
  const lines: string[] = [];
  if (input.title.trim()) {
    lines.push(`<title>${escapeHtmlAttr(input.title.trim())}</title>`);
    lines.push(
      `<meta name="title" content="${escapeHtmlAttr(input.title.trim())}" />`,
    );
  }
  if (input.description.trim()) {
    lines.push(
      `<meta name="description" content="${escapeHtmlAttr(input.description.trim())}" />`,
    );
  }
  if (input.keywords.trim()) {
    lines.push(
      `<meta name="keywords" content="${escapeHtmlAttr(input.keywords.trim())}" />`,
    );
  }
  if (input.author.trim()) {
    lines.push(
      `<meta name="author" content="${escapeHtmlAttr(input.author.trim())}" />`,
    );
  }
  lines.push(
    `<meta name="robots" content="${escapeHtmlAttr(input.robots.trim() || "index, follow")}" />`,
  );
  lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
  if (input.canonical.trim()) {
    lines.push(
      `<link rel="canonical" href="${escapeHtmlAttr(input.canonical.trim())}" />`,
    );
  }
  if (!lines.length) throw new Error("Enter at least a title or description.");
  return {
    text: lines.join("\n"),
    meta: {
      note: "Meta keywords have limited modern SEO ranking value; focus on title and description.",
    },
  };
}

export function generateOpenGraph(input: {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  type: string;
  twitter: boolean;
}): GeneratorResult {
  if (!input.title.trim()) throw new Error("Enter an Open Graph title.");
  const lines = [
    `<meta property="og:title" content="${escapeHtmlAttr(input.title.trim())}" />`,
    `<meta property="og:description" content="${escapeHtmlAttr(input.description.trim())}" />`,
    `<meta property="og:type" content="${escapeHtmlAttr(input.type.trim() || "website")}" />`,
  ];
  if (input.url.trim()) {
    validateHttpUrl(input.url.trim(), "Open Graph URL");
    lines.push(
      `<meta property="og:url" content="${escapeHtmlAttr(input.url.trim())}" />`,
    );
  }
  if (input.image.trim()) {
    validateHttpUrl(input.image.trim(), "Image URL");
    lines.push(
      `<meta property="og:image" content="${escapeHtmlAttr(input.image.trim())}" />`,
    );
  }
  if (input.siteName.trim()) {
    lines.push(
      `<meta property="og:site_name" content="${escapeHtmlAttr(input.siteName.trim())}" />`,
    );
  }
  if (input.twitter) {
    lines.push('<meta name="twitter:card" content="summary_large_image" />');
    lines.push(
      `<meta name="twitter:title" content="${escapeHtmlAttr(input.title.trim())}" />`,
    );
    if (input.description.trim()) {
      lines.push(
        `<meta name="twitter:description" content="${escapeHtmlAttr(input.description.trim())}" />`,
      );
    }
    if (input.image.trim()) {
      lines.push(
        `<meta name="twitter:image" content="${escapeHtmlAttr(input.image.trim())}" />`,
      );
    }
  }
  return { text: lines.join("\n") };
}

function validateHttpUrl(value: string, label: string) {
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) throw new Error("bad");
  } catch {
    throw new Error(`Enter a valid http(s) ${label}.`);
  }
}

export function generateRobotsTxt(input: {
  preset: string;
  userAgent: string;
  allow: string;
  disallow: string;
  sitemap: string;
}): GeneratorResult {
  const ua = input.userAgent.trim() || "*";
  let allow = input.allow;
  let disallow = input.disallow;
  if (input.preset === "allow-all") {
    allow = "/";
    disallow = "";
  } else if (input.preset === "block-all") {
    allow = "";
    disallow = "/";
  } else if (input.preset === "common") {
    allow = "/";
    disallow = "/admin/\n/private/";
  } else if (input.preset === "cms") {
    allow = "/";
    disallow = "/wp-admin/\n/admin/\n/cgi-bin/";
  }
  const lines = [`User-agent: ${ua}`];
  for (const path of allow.split("\n").map((s) => s.trim()).filter(Boolean)) {
    lines.push(`Allow: ${path}`);
  }
  for (const path of disallow.split("\n").map((s) => s.trim()).filter(Boolean)) {
    lines.push(`Disallow: ${path}`);
  }
  if (input.sitemap.trim()) {
    validateHttpUrl(input.sitemap.trim(), "sitemap URL");
    lines.push(`Sitemap: ${input.sitemap.trim()}`);
  }
  const text = `${lines.join("\n")}\n`;
  const blocksAll = disallow.split("\n").some((p) => p.trim() === "/");
  return {
    text,
    meta: blocksAll
      ? {
          warning:
            "This robots.txt blocks the whole site for the selected user-agent. Confirm before publishing.",
        }
      : {},
  };
}

export function generateSitemapXml(input: {
  urls: string;
  changefreq: string;
  priority: string;
  lastmod: string;
}): GeneratorResult {
  const rows = input.urls
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!rows.length) throw new Error("Enter at least one URL.");
  if (rows.length > LIMITS.sitemapUrls) {
    throw new Error(`Please choose a smaller number of results (max ${LIMITS.sitemapUrls}).`);
  }
  const parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const loc of rows) {
    validateHttpUrl(loc, "URL");
    parts.push("  <url>");
    parts.push(`    <loc>${escapeXml(loc)}</loc>`);
    if (input.lastmod.trim()) {
      parts.push(`    <lastmod>${escapeXml(input.lastmod.trim())}</lastmod>`);
    }
    if (input.changefreq.trim()) {
      parts.push(`    <changefreq>${escapeXml(input.changefreq.trim())}</changefreq>`);
    }
    if (input.priority.trim()) {
      parts.push(`    <priority>${escapeXml(input.priority.trim())}</priority>`);
    }
    parts.push("  </url>");
  }
  parts.push("</urlset>");
  return {
    text: parts.join("\n"),
    meta: {
      note: "Creating a sitemap does not automatically submit it to Google or other search engines.",
    },
  };
}

const GITIGNORE_TEMPLATES: Record<string, string[]> = {
  node: ["node_modules/", "npm-debug.log*", "yarn-error.log*", "dist/", "coverage/"],
  react: [".env.local", ".env.*.local", "build/"],
  nextjs: [".next/", "out/", ".vercel/", "next-env.d.ts"],
  python: ["__pycache__/", "*.py[cod]", ".venv/", "venv/", ".pytest_cache/", "*.egg-info/"],
  java: ["*.class", "*.jar", "target/", ".idea/", "*.iml"],
  php: ["vendor/", ".env", "*.log"],
  go: ["bin/", "*.exe", "*.test", "vendor/"],
  rust: ["/target/", "**/*.rs.bk", "Cargo.lock"],
  android: ["*.apk", "*.ap_", "local.properties", ".gradle/", "build/"],
  macos: [".DS_Store", ".AppleDouble", ".LSOverride"],
  windows: ["Thumbs.db", "Desktop.ini", "ehthumbs.db"],
};

export function generateGitignore(input: { templates: string[] }): GeneratorResult {
  if (!input.templates.length) throw new Error("Select at least one template.");
  const lines = ["# Generated by Tool Base .gitignore Generator", ""];
  for (const key of input.templates) {
    const entries = GITIGNORE_TEMPLATES[key];
    if (!entries) continue;
    lines.push(`# ${key}`);
    lines.push(...entries, "");
  }
  return { text: lines.join("\n").trimEnd() + "\n" };
}

export function generateJsonMock(input: {
  count: string;
  fields: Array<{ name: string; type: string }>;
}): GeneratorResult {
  const count = clampQuantity(Number(input.count), LIMITS.mockRecords, "record count");
  const fields = input.fields.filter((f) => f.name.trim());
  if (!fields.length) throw new Error("Add at least one field.");
  const rows = Array.from({ length: count }, (_, index) => {
    const row: Record<string, unknown> = {};
    for (const field of fields) {
      const key = field.name.trim();
      row[key] = mockValue(field.type, index);
    }
    return row;
  });
  return { text: JSON.stringify(rows, null, 2) };
}

function mockValue(type: string, index: number): unknown {
  switch (type) {
    case "email":
      return `user${index + 1}.${randomDigits(3)}@example.com`;
    case "integer":
      return 18 + randomInt(50);
    case "boolean":
      return randomInt(2) === 1;
    case "uuid":
      return crypto.randomUUID
        ? crypto.randomUUID()
        : `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
    case "date":
      return `2026-0${1 + (index % 9)}-${String(10 + (index % 18)).padStart(2, "0")}`;
    case "country":
      return pick(COUNTRIES);
    case "name":
      return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    default:
      return `Sample ${pick(FIRST_NAMES)} ${index + 1}`;
  }
}

export function generateCsvTest(input: {
  rows: string;
  delimiter: string;
  columns: Array<{ name: string; type: string }>;
}): GeneratorResult {
  const rowCount = clampQuantity(Number(input.rows), LIMITS.csvRows, "row count");
  const columns = input.columns.filter((c) => c.name.trim());
  if (!columns.length) throw new Error("Add at least one column.");
  const delimiter = input.delimiter === ";" ? ";" : input.delimiter === "\t" ? "\t" : ",";
  const header = columns.map((c) => csvEscape(c.name.trim(), delimiter)).join(delimiter);
  const lines = [header];
  for (let i = 0; i < rowCount; i += 1) {
    lines.push(
      columns
        .map((c) => csvEscape(String(mockValue(c.type, i)), delimiter))
        .join(delimiter),
    );
  }
  return { text: lines.join("\n") };
}

function csvEscape(value: string, delimiter: string): string {
  if (/["\n\r]/.test(value) || value.includes(delimiter)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCron(input: {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  preset: string;
}): GeneratorResult {
  let minute = input.minute.trim() || "*";
  let hour = input.hour.trim() || "*";
  let dayOfMonth = input.dayOfMonth.trim() || "*";
  let month = input.month.trim() || "*";
  let dayOfWeek = input.dayOfWeek.trim() || "*";

  if (input.preset === "every-minute") [minute, hour, dayOfMonth, month, dayOfWeek] = ["*", "*", "*", "*", "*"];
  if (input.preset === "every-hour") [minute, hour, dayOfMonth, month, dayOfWeek] = ["0", "*", "*", "*", "*"];
  if (input.preset === "every-day") [minute, hour, dayOfMonth, month, dayOfWeek] = ["0", "0", "*", "*", "*"];
  if (input.preset === "every-weekday") [minute, hour, dayOfMonth, month, dayOfWeek] = ["0", "9", "*", "*", "1-5"];
  if (input.preset === "every-week") [minute, hour, dayOfMonth, month, dayOfWeek] = ["0", "9", "*", "*", "1"];
  if (input.preset === "every-month") [minute, hour, dayOfMonth, month, dayOfWeek] = ["0", "0", "1", "*", "*"];

  const fields = [minute, hour, dayOfMonth, month, dayOfWeek];
  for (const field of fields) {
    if (!/^[0-9*,\/\-]+$/.test(field)) {
      throw new Error(`Invalid cron field: ${field}`);
    }
  }
  const expression = fields.join(" ");
  return {
    text: expression,
    meta: {
      dialect: "5-field UNIX crontab (minute hour day-of-month month day-of-week)",
      readable: describeCron(minute, hour, dayOfMonth, month, dayOfWeek),
    },
  };
}

function describeCron(
  minute: string,
  hour: string,
  dayOfMonth: string,
  month: string,
  dayOfWeek: string,
): string {
  if (minute === "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return "Runs every minute.";
  }
  if (minute === "0" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return "Runs at minute 0 of every hour.";
  }
  if (minute === "0" && hour === "0" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return "Runs every day at midnight.";
  }
  if (minute === "0" && hour === "9" && dayOfMonth === "*" && month === "*" && dayOfWeek === "1-5") {
    return "Runs at 9:00 AM, Monday through Friday.";
  }
  if (minute === "0" && hour === "9" && dayOfMonth === "*" && month === "*" && dayOfWeek === "1") {
    return "Runs at 9:00 AM every Monday.";
  }
  if (minute === "0" && hour === "0" && dayOfMonth === "1" && month === "*" && dayOfWeek === "*") {
    return "Runs at midnight on the first day of every month.";
  }
  return `Custom schedule: ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek} (UNIX 5-field).`;
}
