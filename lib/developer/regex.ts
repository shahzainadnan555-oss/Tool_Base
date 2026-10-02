import type {
  RegexGeneratorOptions,
  RegexMatchInfo,
  RegexTestResult,
} from "./types";
import {
  MAX_REGEX_PATTERN_CHARS,
  MAX_REGEX_TEST_CHARS,
  REGEX_TIMEOUT_MS,
} from "./types";

export const REGEX_TEMPLATES: Array<{
  id: string;
  label: string;
  description: string;
  pattern: string;
  flags?: string;
}> = [
  {
    id: "email",
    label: "Email-like",
    description: "Common email-shaped addresses (not a full RFC validator).",
    pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
  },
  {
    id: "url",
    label: "URL-like",
    description: "http(s) URLs with an optional path.",
    pattern: "^https?:\\/\\/[^\\s/$.?#].[^\\s]*$",
    flags: "i",
  },
  {
    id: "numbers",
    label: "Numbers",
    description: "Integer or decimal numbers.",
    pattern: "^-?\\d+(?:\\.\\d+)?$",
  },
  {
    id: "digits",
    label: "Digits only",
    description: "One or more digits.",
    pattern: "^\\d+$",
  },
  {
    id: "letters",
    label: "Letters only",
    description: "Unicode letters only.",
    pattern: "^\\p{L}+$",
    flags: "u",
  },
  {
    id: "alphanumeric",
    label: "Alphanumeric",
    description: "Letters and digits.",
    pattern: "^[A-Za-z0-9]+$",
  },
  {
    id: "zip",
    label: "ZIP / postal-style",
    description: "5-digit ZIP or ZIP+4.",
    pattern: "^\\d{5}(?:-\\d{4})?$",
  },
  {
    id: "date",
    label: "Date-style (YYYY-MM-DD)",
    description: "ISO-like date shape.",
    pattern: "^\\d{4}-\\d{2}-\\d{2}$",
  },
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function generateRegex(options: RegexGeneratorOptions): {
  pattern: string;
  flags: string;
  notice: string;
} {
  const template = REGEX_TEMPLATES.find((t) => t.id === options.template);
  if (options.template === "custom") {
    const set = (options.customSet || "A-Za-z0-9").replace(/]/g, "\\]");
    const min = Math.max(0, options.minLength ?? 1);
    const max = Math.max(min, options.maxLength ?? 32);
    let body = `[${set}]{${min},${max}}`;
    if (options.startsWith) body = `${escapeRegex(options.startsWith)}${body}`;
    if (options.endsWith) body = `${body}${escapeRegex(options.endsWith)}`;
    if (options.contains) body = `.*${escapeRegex(options.contains)}.*`;
    return {
      pattern: `^${body}$`,
      flags: "",
      notice:
        "Generated from your selected rules. Patterns are templates and may not match every real-world edge case.",
    };
  }

  if (!template) {
    throw new Error("Please choose a regex template.");
  }

  let pattern = template.pattern;
  if (options.startsWith || options.endsWith || options.contains) {
    const parts: string[] = [];
    if (options.startsWith) parts.push(`(?=^${escapeRegex(options.startsWith)})`);
    if (options.contains) parts.push(`(?=.*${escapeRegex(options.contains)})`);
    if (options.endsWith) parts.push(`(?=${escapeRegex(options.endsWith)}$)`);
    // Keep base template but strip anchors then re-wrap carefully
    const core = template.pattern.replace(/^\^/, "").replace(/\$$/, "");
    pattern = `^${parts.join("")}${core}$`;
  }

  return {
    pattern,
    flags: template.flags || "",
    notice:
      "Generated from a structured template. This is a practical starting point, not a universal validator.",
  };
}

function runRegexSync(
  pattern: string,
  flags: string,
  text: string,
): RegexTestResult {
  const safeFlags = Array.from(new Set((flags || "").replace(/[^gimsuy]/g, "").split(""))).join(
    "",
  );
  const hasG = safeFlags.includes("g");
  const finalFlags = hasG ? safeFlags : `${safeFlags}g`;
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, finalFlags);
  } catch (err) {
    return {
      matchCount: 0,
      matches: [],
      error: err instanceof Error ? err.message : "Invalid regular expression",
    };
  }

  const matches: RegexMatchInfo[] = [];
  let match: RegExpExecArray | null;
  let guard = 0;
  const maxMatches = 5_000;
  while ((match = regex.exec(text)) !== null) {
    guard += 1;
    if (guard > maxMatches) break;
    if (match[0] === "" && regex.lastIndex === match.index) {
      regex.lastIndex += 1;
      continue;
    }
    const groups = match.slice(1).map((g) => g ?? "");
    matches.push({
      match: match[0],
      index: match.index,
      end: match.index + match[0].length,
      groups,
      namedGroups: match.groups ? { ...match.groups } : undefined,
    });
    if (!hasG) break;
  }
  return { matchCount: matches.length, matches };
}

export async function testRegexSafe(
  pattern: string,
  flags: string,
  text: string,
): Promise<RegexTestResult> {
  if (!pattern) {
    return { matchCount: 0, matches: [], error: "Please enter a regular expression pattern." };
  }
  if (pattern.length > MAX_REGEX_PATTERN_CHARS) {
    return {
      matchCount: 0,
      matches: [],
      error: `Pattern is too long (max ${MAX_REGEX_PATTERN_CHARS} characters).`,
    };
  }
  if (text.length > MAX_REGEX_TEST_CHARS) {
    return {
      matchCount: 0,
      matches: [],
      error: `Test text is too long (max ${MAX_REGEX_TEST_CHARS.toLocaleString()} characters).`,
    };
  }

  const canUseBlobWorker =
    typeof window !== "undefined" &&
    typeof Worker !== "undefined" &&
    typeof Blob !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function";

  if (!canUseBlobWorker) {
    return Promise.race([
      Promise.resolve().then(() => runRegexSync(pattern, flags, text)),
      new Promise<RegexTestResult>((resolve) => {
        setTimeout(() => {
          resolve({
            matchCount: 0,
            matches: [],
            timedOut: true,
            error:
              "This pattern took too long to evaluate. Try a simpler expression.",
          });
        }, REGEX_TIMEOUT_MS);
      }),
    ]);
  }

  return new Promise((resolve) => {
    const workerCode = `
      self.onmessage = function (event) {
        var data = event.data || {};
        var pattern = data.pattern || "";
        var flags = data.flags || "";
        var text = data.text || "";
        try {
          var safeFlags = Array.from(new Set(String(flags).replace(/[^gimsuy]/g, "").split(""))).join("");
          var hasG = safeFlags.indexOf("g") !== -1;
          var finalFlags = hasG ? safeFlags : safeFlags + "g";
          var regex = new RegExp(pattern, finalFlags);
          var matches = [];
          var match;
          var guard = 0;
          while ((match = regex.exec(text)) !== null) {
            guard += 1;
            if (guard > 5000) break;
            if (match[0] === "" && regex.lastIndex === match.index) {
              regex.lastIndex += 1;
              continue;
            }
            matches.push({
              match: match[0],
              index: match.index,
              end: match.index + match[0].length,
              groups: match.slice(1).map(function (g) { return g == null ? "" : g; }),
              namedGroups: match.groups ? Object.assign({}, match.groups) : undefined
            });
            if (!hasG) break;
          }
          self.postMessage({ matchCount: matches.length, matches: matches });
        } catch (err) {
          self.postMessage({
            matchCount: 0,
            matches: [],
            error: err && err.message ? err.message : "Invalid regular expression"
          });
        }
      };
    `;
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    let settled = false;

    const finish = (result: RegexTestResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };

    const timer = window.setTimeout(() => {
      finish({
        matchCount: 0,
        matches: [],
        timedOut: true,
        error:
          "This pattern took too long to evaluate. Try a simpler expression.",
      });
    }, REGEX_TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<RegexTestResult>) => {
      finish(event.data);
    };
    worker.onerror = () => {
      finish({
        matchCount: 0,
        matches: [],
        error: "Unable to evaluate this regular expression safely.",
      });
    };

    worker.postMessage({ pattern, flags, text });
  });
}
