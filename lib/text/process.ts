import {
  computeTextStats,
  reverseGraphemes,
  reverseWords as reverseWordsFn,
} from "./stats";
import type {
  CaseMode,
  TextProcessOptions,
  TextProcessResult,
  TextToolConfig,
} from "./types";
import { MAX_LOREM_COUNT, MAX_REPEAT_COUNT } from "./types";

const TITLE_SMALL = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "nor",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

function capitalizeWord(word: string): string {
  if (!word) return word;
  const chars = Array.from(word);
  return chars[0].toLocaleUpperCase() + chars.slice(1).join("").toLocaleLowerCase();
}

export function toTitleCase(text: string): string {
  return text
    .split(/(\r\n|\n|\r)/)
    .map((line) => {
      if (/^(\r\n|\n|\r)$/.test(line)) return line;
      const words = line.split(/(\s+)/);
      let wordIndex = 0;
      return words
        .map((token) => {
          if (/^\s+$/.test(token) || !token) return token;
          const lower = token.toLocaleLowerCase();
          const isFirst = wordIndex === 0;
          wordIndex += 1;
          const bare = lower.replace(/^[^a-zA-Z0-9\u00C0-\u024F]+|[^a-zA-Z0-9\u00C0-\u024F]+$/g, "");
          if (!isFirst && TITLE_SMALL.has(bare)) {
            return token.replace(new RegExp(bare.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), bare);
          }
          return token.replace(/[^\s]+/u, (w) => capitalizeWord(w));
        })
        .join("");
    })
    .join("");
}

export function toSentenceCase(text: string): string {
  const lower = text.toLocaleLowerCase();
  let capitalizeNext = true;
  let result = "";
  for (const ch of Array.from(lower)) {
    if (capitalizeNext && /\S/u.test(ch)) {
      result += ch.toLocaleUpperCase();
      capitalizeNext = false;
    } else {
      result += ch;
    }
    if (/[.!?]/.test(ch)) capitalizeNext = true;
    if (ch === "\n") capitalizeNext = true;
  }
  return result;
}

export function toCapitalizedCase(text: string): string {
  return text.replace(/\S+/gu, (word) => capitalizeWord(word));
}

export function toAlternatingCase(text: string): string {
  let upper = true;
  return Array.from(text)
    .map((ch) => {
      if (!/\p{L}/u.test(ch)) return ch;
      const next = upper ? ch.toLocaleUpperCase() : ch.toLocaleLowerCase();
      upper = !upper;
      return next;
    })
    .join("");
}

export function toInverseCase(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const upper = ch.toLocaleUpperCase();
      const lower = ch.toLocaleLowerCase();
      if (ch === upper && ch !== lower) return lower;
      if (ch === lower && ch !== upper) return upper;
      return ch;
    })
    .join("");
}

export function applyCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toLocaleUpperCase();
    case "lower":
      return text.toLocaleLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "capitalized":
      return toCapitalizedCase(text);
    case "alternating":
      return toAlternatingCase(text);
    case "inverse":
      return toInverseCase(text);
    default:
      return text;
  }
}

export function removeExtraSpaces(
  text: string,
  options: { collapseSpaces?: boolean; trimLines?: boolean } = {},
): string {
  const collapse = options.collapseSpaces !== false;
  const trimLines = options.trimLines !== false;
  let result = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (trimLines) {
    result = result
      .split("\n")
      .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
      .join("\n");
  } else if (collapse) {
    result = result.replace(/[^\S\n]+/g, " ");
  }
  if (collapse) {
    result = result.replace(/[^\S\n]{2,}/g, " ");
  }
  return result;
}

export function removeDuplicateLines(
  text: string,
  options: {
    caseSensitive?: boolean;
    preserveFirst?: boolean;
    removeBlankDuplicates?: boolean;
  } = {},
): string {
  const caseSensitive = options.caseSensitive !== false;
  const preserveFirst = options.preserveFirst !== false;
  const lines = text.split(/\r\n|\n|\r/);
  const seen = new Set<string>();
  const out: string[] = [];

  const consider = (line: string) => {
    const key = caseSensitive ? line : line.toLocaleLowerCase();
    const isBlank = line.trim() === "";
    if (isBlank && !options.removeBlankDuplicates) {
      out.push(line);
      return;
    }
    if (seen.has(key)) return;
    seen.add(key);
    out.push(line);
  };

  if (preserveFirst) {
    for (const line of lines) consider(line);
  } else {
    const reversed = [...lines].reverse();
    const temp: string[] = [];
    for (const line of reversed) {
      const key = caseSensitive ? line : line.toLocaleLowerCase();
      const isBlank = line.trim() === "";
      if (isBlank && !options.removeBlankDuplicates) {
        temp.push(line);
        continue;
      }
      if (seen.has(key)) continue;
      seen.add(key);
      temp.push(line);
    }
    out.push(...temp.reverse());
  }
  return out.join("\n");
}

export function sortLines(
  text: string,
  options: {
    direction?: "asc" | "desc";
    caseSensitive?: boolean;
    numeric?: boolean;
    ignoreLeadingWhitespace?: boolean;
  } = {},
): string {
  const direction = options.direction ?? "asc";
  const lines = text.split(/\r\n|\n|\r/);
  const sorted = [...lines].sort((a, b) => {
    const left = options.ignoreLeadingWhitespace ? a.trimStart() : a;
    const right = options.ignoreLeadingWhitespace ? b.trimStart() : b;
    const cmp = left.localeCompare(right, undefined, {
      sensitivity: options.caseSensitive ? "variant" : "base",
      numeric: Boolean(options.numeric),
    });
    return direction === "asc" ? cmp : -cmp;
  });
  return sorted.join("\n");
}

export function cleanText(
  text: string,
  options: {
    collapseSpaces?: boolean;
    trimLines?: boolean;
    removeEmptyLines?: boolean;
    normalizeLineEndings?: boolean;
    collapseBlankLines?: boolean;
  } = {},
): string {
  let result = text;
  if (options.normalizeLineEndings !== false) {
    result = result.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }
  if (options.trimLines !== false) {
    result = result
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  }
  if (options.collapseSpaces !== false) {
    result = result.replace(/[^\S\n]+/g, " ");
  }
  if (options.collapseBlankLines) {
    result = result.replace(/\n{3,}/g, "\n\n");
  }
  if (options.removeEmptyLines) {
    result = result
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .join("\n");
  }
  return result;
}

export function findAndReplace(
  text: string,
  findText: string,
  replaceText: string,
  options: {
    caseSensitive?: boolean;
    replaceAll?: boolean;
    wholeWord?: boolean;
  } = {},
): { output: string; matchCount: number } {
  if (!findText) return { output: text, matchCount: 0 };
  const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = options.wholeWord ? `\\b${escaped}\\b` : escaped;
  const globalFlags = options.caseSensitive ? "g" : "gi";
  const globalRegex = new RegExp(pattern, globalFlags);
  const matches = text.match(globalRegex);
  const matchCount = matches ? matches.length : 0;
  if (!matchCount) return { output: text, matchCount: 0 };
  if (options.replaceAll === false) {
    const onceFlags = options.caseSensitive ? "" : "i";
    const onceRegex = new RegExp(pattern, onceFlags);
    return { output: text.replace(onceRegex, replaceText), matchCount: 1 };
  }
  return { output: text.replace(globalRegex, replaceText), matchCount };
}

export function repeatText(
  text: string,
  count: number,
  separator: "newline" | "space" | "none" = "newline",
): string {
  const n = Math.max(0, Math.min(MAX_REPEAT_COUNT, Math.floor(count)));
  if (n === 0) return "";
  const sep = separator === "newline" ? "\n" : separator === "space" ? " " : "";
  return Array.from({ length: n }, () => text).join(sep);
}

export function generateLorem(
  mode: "paragraphs" | "sentences" | "words",
  count: number,
  startClassic = true,
): string {
  const n = Math.max(1, Math.min(MAX_LOREM_COUNT, Math.floor(count || 1)));
  let wordIndex = 0;
  const nextWord = () => {
    const word = LOREM_WORDS[wordIndex % LOREM_WORDS.length];
    wordIndex += 1;
    return word;
  };
  const makeSentence = (wordsInSentence: number) => {
    const words = Array.from({ length: wordsInSentence }, () => nextWord());
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return `${words.join(" ")}.`;
  };

  if (mode === "words") {
    const words = Array.from({ length: n }, () => nextWord());
    if (startClassic && n >= 2) {
      words[0] = "Lorem";
      words[1] = "ipsum";
    }
    return words.join(" ");
  }

  if (mode === "sentences") {
    const sentences = Array.from({ length: n }, (_, i) => {
      const sentence = makeSentence(8 + ((i * 3) % 7));
      if (i === 0 && startClassic) {
        return sentence.replace(/^[^.]+/, "Lorem ipsum dolor sit amet");
      }
      return sentence;
    });
    return sentences.join(" ");
  }

  const paragraphs = Array.from({ length: n }, (_, p) => {
    const sentenceCount = 3 + (p % 3);
    const sentences = Array.from({ length: sentenceCount }, (_, i) => {
      const sentence = makeSentence(8 + ((i + p) % 6));
      if (p === 0 && i === 0 && startClassic) {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      }
      return sentence;
    });
    return sentences.join(" ");
  });
  return paragraphs.join("\n\n");
}

/** Simple line-oriented diff for display. */
export function diffTexts(
  original: string,
  modified: string,
): Array<{ type: "equal" | "add" | "remove"; value: string }> {
  const a = original.split(/\r\n|\n|\r/);
  const b = modified.split(/\r\n|\n|\r/);
  const m = a.length;
  const n = b.length;
  // LCS DP for moderate inputs; fallback for huge
  if (m * n > 2_000_000) {
    const parts: Array<{ type: "equal" | "add" | "remove"; value: string }> = [];
    if (original) parts.push({ type: "remove", value: original });
    if (modified) parts.push({ type: "add", value: modified });
    return parts;
  }
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const parts: Array<{ type: "equal" | "add" | "remove"; value: string }> = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      parts.push({ type: "equal", value: a[i] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ type: "remove", value: a[i] });
      i += 1;
    } else {
      parts.push({ type: "add", value: b[j] });
      j += 1;
    }
  }
  while (i < m) {
    parts.push({ type: "remove", value: a[i] });
    i += 1;
  }
  while (j < n) {
    parts.push({ type: "add", value: b[j] });
    j += 1;
  }
  return parts;
}

export function processTextTool(
  config: TextToolConfig,
  input: string,
  secondary = "",
  options: TextProcessOptions = {},
): TextProcessResult {
  const readingSpeed = options.readingSpeed ?? 200;
  const stats = config.showStats ? computeTextStats(input, readingSpeed) : undefined;

  switch (config.kind) {
    case "stats":
    case "reading-time":
      return {
        output: input,
        stats: computeTextStats(input, readingSpeed),
        notice:
          config.kind === "reading-time"
            ? "Reading time is an estimate based on your selected words-per-minute speed."
            : config.slug === "sentence-counter"
              ? "Sentence detection is heuristic and may not match every writing style."
              : undefined,
      };
    case "case": {
      const mode =
        config.lockedCaseMode || options.caseMode || config.defaultCaseMode || "upper";
      return { output: applyCase(input, mode), stats };
    }
    case "transform": {
      if (config.slug === "remove-extra-spaces") {
        return {
          output: removeExtraSpaces(input, {
            collapseSpaces: options.collapseSpaces,
            trimLines: options.trimLines,
          }),
          stats,
        };
      }
      if (config.slug === "reverse-text") {
        return { output: reverseGraphemes(input), stats };
      }
      if (config.slug === "reverse-words") {
        return { output: reverseWordsFn(input), stats };
      }
      return { output: input, stats };
    }
    case "dedupe":
      return {
        output: removeDuplicateLines(input, {
          caseSensitive: options.caseSensitive,
          preserveFirst: options.preserveFirst,
          removeBlankDuplicates: options.removeBlankDuplicates,
        }),
        stats,
      };
    case "sort":
      return {
        output: sortLines(input, {
          direction: options.sortDirection,
          caseSensitive: options.sortCaseSensitive,
          numeric: options.sortNumeric,
          ignoreLeadingWhitespace: options.ignoreLeadingWhitespace,
        }),
        stats,
      };
    case "cleaner":
      return {
        output: cleanText(input, {
          collapseSpaces: options.collapseSpaces,
          trimLines: options.trimLines,
          removeEmptyLines: options.removeEmptyLines,
          normalizeLineEndings: options.normalizeLineEndings,
          collapseBlankLines: options.collapseBlankLines,
        }),
        stats,
      };
    case "find-replace": {
      const result = findAndReplace(
        input,
        options.findText ?? "",
        options.replaceText ?? "",
        {
          caseSensitive: options.caseSensitive,
          replaceAll: options.replaceAll !== false,
          wholeWord: options.wholeWord,
        },
      );
      return { ...result, stats };
    }
    case "diff":
      return {
        output: "",
        diffParts: diffTexts(input, secondary),
        stats,
      };
    case "repeater": {
      const count = options.repeatCount ?? 1;
      if (count > MAX_REPEAT_COUNT) {
        throw new Error(`Repeat count must be ${MAX_REPEAT_COUNT} or less.`);
      }
      return {
        output: repeatText(input, count, options.separator ?? "newline"),
        stats,
      };
    }
    case "generate":
      return {
        output: generateLorem(
          options.loremMode ?? "paragraphs",
          options.loremCount ?? 3,
          options.loremStartClassic !== false,
        ),
      };
    default:
      return { output: input, stats };
  }
}
