import { clampQuantity, pick, randomDigits, randomInt } from "./random";
import {
  ADJECTIVES,
  BUSINESS_ROOTS,
  BUSINESS_SUFFIXES,
  HASHTAG_MODIFIERS,
  NOUNS,
} from "./words";
import { LIMITS, type GeneratorResult } from "./types";

function slugifyToken(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

export function generateUsernames(input: {
  style: string;
  length: string;
  numbers: boolean;
  underscore: boolean;
  separator: string;
  quantity: string;
}): GeneratorResult {
  const quantity = clampQuantity(Number(input.quantity), LIMITS.usernames, "quantity");
  const targetLen = Math.min(24, Math.max(4, Number(input.length) || 10));
  const sep = input.separator === "none" ? "" : input.separator === "dash" ? "-" : "_";
  const results: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < quantity * 8 && results.length < quantity; i += 1) {
    const adj = pick(ADJECTIVES);
    const noun = pick(NOUNS);
    let local = "";
    if (input.style === "word-number") {
      local = `${pick(NOUNS)}${input.numbers ? randomDigits(2 + randomInt(2)) : ""}`;
    } else if (input.style === "short") {
      local = `${adj.slice(0, 3)}${noun.slice(0, 3)}${input.numbers ? randomDigits(2) : ""}`;
    } else if (input.style === "adj-noun-number" || input.numbers) {
      local = `${adj}${sep}${noun}${randomDigits(1 + randomInt(2))}`;
    } else {
      local = `${adj}${sep}${noun}`;
    }
    if (input.underscore && sep !== "_") {
      local = local.replace(/-/g, "_");
      if (!local.includes("_") && input.numbers) {
        local = local.replace(/(\d+)/, "_$1");
      }
    }
    local = local.replace(/[^a-z0-9_-]/gi, "").toLowerCase();
    if (local.length > targetLen) local = local.slice(0, targetLen);
    if (local.length < 3 || seen.has(local)) continue;
    seen.add(local);
    results.push(local);
  }
  if (!results.length) throw new Error("Could not generate usernames with these options.");
  return { text: results.join("\n"), items: results };
}

export function generateBusinessNames(input: {
  industry: string;
  keyword: string;
  style: string;
  length: string;
  prefix: string;
  suffix: string;
  quantity: string;
}): GeneratorResult {
  const quantity = clampQuantity(Number(input.quantity), LIMITS.businessNames, "quantity");
  const keyword = slugifyToken(input.keyword) || pick(BUSINESS_ROOTS).toLowerCase();
  const industry = slugifyToken(input.industry);
  const prefix = input.prefix.trim();
  const suffix = input.suffix.trim();
  const maxLen = Math.min(40, Math.max(4, Number(input.length) || 18));
  const results: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < quantity * 10 && results.length < quantity; i += 1) {
    const root = pick(BUSINESS_ROOTS);
    const styleBit =
      input.style === "tech"
        ? pick(["Tech", "Soft", "Cloud", "Data"])
        : input.style === "premium"
          ? pick(["Prime", "Luxe", "Elite", "Apex"])
          : input.style === "minimal"
            ? ""
            : input.style === "creative"
              ? pick(["Studio", "Atelier", "Canvas"])
              : input.style === "professional"
                ? pick(["Group", "Partners", "Advisory"])
                : pick(["Hub", "Base", "Labs"]);
    let name = [prefix, keyword ? capitalize(keyword) : "", styleBit, industry ? capitalize(industry) : "", root, suffix]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (input.style === "modern") name = `${capitalize(keyword)}${pick(BUSINESS_SUFFIXES)}`;
    if (name.length > maxLen) name = name.slice(0, maxLen).trim();
    if (name.length < 3 || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    results.push(name);
  }
  return {
    text: results.join("\n"),
    items: results,
    meta: {
      note: "These are idea names only — not trademark or domain availability checks.",
    },
  };
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function generateBlogTitles(input: {
  topic: string;
  keyword: string;
  audience: string;
  tone: string;
  quantity: string;
}): GeneratorResult {
  const quantity = clampQuantity(Number(input.quantity), LIMITS.blogTitles, "quantity");
  const topic = input.topic.trim() || "your topic";
  const keyword = input.keyword.trim() || topic;
  const audience = input.audience.trim() || "readers";
  const tone = input.tone || "practical";
  const numbers = [5, 7, 9, 10, 12, 15];
  const templates = [
    () => `How to ${topic} Without the Usual Mistakes`,
    () => `The Complete Guide to ${topic}`,
    () => `${pick(numbers)} Practical Ways to ${topic}`,
    () => `${keyword}: What ${audience} Need to Know`,
    () => `A ${tone} Playbook for ${topic}`,
    () => `Why ${topic} Matters More Than You Think`,
    () => `${pick(numbers)} ${keyword} Tips for Busy ${audience}`,
    () => `From Zero to Useful: ${topic} Basics`,
    () => `Stop Overcomplicating ${topic}`,
    () => `${topic} Checklist for ${audience}`,
  ];
  const results: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < quantity * 4 && results.length < quantity; i += 1) {
    const title = pick(templates)();
    if (seen.has(title)) continue;
    seen.add(title);
    results.push(title);
  }
  return { text: results.join("\n"), items: results };
}

export function generateHashtags(input: {
  topic: string;
  platform: string;
  quantity: string;
  mode: string;
}): GeneratorResult {
  const quantity = clampQuantity(Number(input.quantity), LIMITS.hashtags, "quantity");
  const base = slugifyToken(input.topic);
  if (!base) throw new Error("Enter a topic or keyword.");
  const results: string[] = [];
  const seen = new Set<string>();
  const add = (tag: string) => {
    const clean = tag.replace(/[^a-z0-9_]/gi, "");
    if (!clean || seen.has(clean.toLowerCase())) return;
    seen.add(clean.toLowerCase());
    results.push(`#${clean}`);
  };
  add(base);
  add(`${base}tips`);
  add(`${base}ideas`);
  while (results.length < quantity) {
    const mod = pick(HASHTAG_MODIFIERS);
    if (input.mode === "niche") add(`${base}${mod}${randomDigits(1)}`);
    else add(`${base}${mod}`);
    if (input.platform === "instagram") add(`${mod}${base}`);
    if (input.platform === "linkedin") add(`${base}career`);
    if (results.length >= quantity) break;
    if (results.length < 3) add(`${pick(ADJECTIVES)}${base}`);
  }
  return {
    text: results.slice(0, quantity).join(" "),
    items: results.slice(0, quantity),
    meta: {
      note: "Generated from local rules — not live trending data.",
    },
  };
}

export function generateUrlSlug(input: {
  text: string;
  separator: string;
  removeStopWords: boolean;
  maxLength: string;
}): GeneratorResult {
  const sep = input.separator === "underscore" ? "_" : "-";
  const max = Math.min(200, Math.max(1, Number(input.maxLength) || 80));
  const stop = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "of",
    "to",
    "in",
    "on",
    "for",
    "with",
    "by",
  ]);
  let tokens = input.text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  if (input.removeStopWords) tokens = tokens.filter((t) => !stop.has(t));
  let slug = tokens.join(sep).replace(new RegExp(`${sep}+`, "g"), sep).replace(new RegExp(`^${sep}|${sep}$`, "g"), "");
  if (slug.length > max) slug = slug.slice(0, max).replace(new RegExp(`${sep}$`), "");
  if (!slug) throw new Error("Enter text that can become a slug.");
  return { text: slug };
}

export function buildUtmUrl(input: {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}): GeneratorResult {
  const raw = input.baseUrl.trim();
  if (!raw) throw new Error("Enter a base URL.");
  let url: URL;
  try {
    url = new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    throw new Error("Enter a valid base URL.");
  }
  const params = [
    ["utm_source", input.source],
    ["utm_medium", input.medium],
    ["utm_campaign", input.campaign],
    ["utm_term", input.term],
    ["utm_content", input.content],
  ] as const;
  for (const [key, value] of params) {
    const trimmed = value.trim();
    if (trimmed) url.searchParams.set(key, trimmed);
  }
  if (![input.source, input.medium, input.campaign].some((v) => v.trim())) {
    throw new Error("Enter at least utm_source, utm_medium, or utm_campaign.");
  }
  return { text: url.toString() };
}

export function generatePalette(input: {
  size: string;
  seedColors?: string[];
  locked?: boolean[];
}): GeneratorResult {
  const size = clampQuantity(Number(input.size), 8, "palette size");
  const colors: string[] = [];
  for (let i = 0; i < size; i += 1) {
    if (input.locked?.[i] && input.seedColors?.[i]) {
      colors.push(normalizeHex(input.seedColors[i]));
      continue;
    }
    const h = randomInt(360);
    const s = 45 + randomInt(40);
    const l = 35 + randomInt(35);
    colors.push(hslToHex(h, s, l));
  }
  return {
    text: colors.join("\n"),
    items: colors,
    colors,
  };
}

function normalizeHex(value: string): string {
  const v = value.trim();
  if (!/^#?[0-9a-fA-F]{6}$/.test(v)) throw new Error(`Invalid color: ${value}`);
  return v.startsWith("#") ? v.toLowerCase() : `#${v.toLowerCase()}`;
}

function hslToHex(h: number, s: number, l: number): string {
  const ss = s / 100;
  const ll = l / 100;
  const c = (1 - Math.abs(2 * ll - 1)) * ss;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ll - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
