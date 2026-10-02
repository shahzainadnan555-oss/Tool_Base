import type { TextStats } from "./types";

const ABBREVIATIONS = new Set([
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
  "sr",
  "jr",
  "st",
  "vs",
  "etc",
  "eg",
  "ie",
  "approx",
  "dept",
  "univ",
]);

function segmentGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

export function countGraphemes(text: string): number {
  return segmentGraphemes(text).length;
}

export function countGraphemesNoSpaces(text: string): number {
  return segmentGraphemes(text.replace(/\s/g, "")).length;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
    let count = 0;
    for (const { segment, isWordLike } of segmenter.segment(trimmed)) {
      if (isWordLike && segment.trim()) count += 1;
    }
    return count;
  }
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function countLines(text: string): number {
  if (!text) return 0;
  return text.split(/\r\n|\n|\r/).length;
}

export function countParagraphs(text: string): number {
  if (!text.trim()) return 0;
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean).length;
}

export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  // Heuristic sentence splitter that softens common abbreviations.
  const normalized = trimmed.replace(/\s+/g, " ");
  const parts: string[] = [];
  let buffer = "";
  for (let i = 0; i < normalized.length; i += 1) {
    const ch = normalized[i];
    buffer += ch;
    if (/[.!?]/.test(ch)) {
      const next = normalized[i + 1];
      const prevWord = buffer
        .slice(0, -1)
        .split(/\s+/)
        .pop()
        ?.replace(/[^a-zA-Z]/g, "")
        .toLowerCase();
      const isAbbrev = prevWord ? ABBREVIATIONS.has(prevWord) : false;
      const looksLikeInitial = Boolean(prevWord && prevWord.length === 1);
      if (!isAbbrev && !looksLikeInitial && (next == null || /\s|"|'|\)|]/.test(next))) {
        parts.push(buffer.trim());
        buffer = "";
      }
    }
  }
  if (buffer.trim()) parts.push(buffer.trim());
  return Math.max(parts.filter(Boolean).length, trimmed ? 1 : 0);
}

export function estimateReadingMinutes(words: number, wordsPerMinute = 200): number {
  const wpm = Math.max(60, Math.min(600, wordsPerMinute || 200));
  if (words <= 0) return 0;
  return Math.max(1, Math.ceil(words / wpm));
}

export function computeTextStats(text: string, readingSpeed = 200): TextStats {
  const words = countWords(text);
  return {
    words,
    characters: countGraphemes(text),
    charactersNoSpaces: countGraphemesNoSpaces(text),
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    lines: countLines(text),
    readingMinutes: estimateReadingMinutes(words, readingSpeed),
  };
}

export function reverseGraphemes(text: string): string {
  return segmentGraphemes(text).reverse().join("");
}

export function reverseWords(text: string): string {
  const lines = text.split(/(\r\n|\n|\r)/);
  return lines
    .map((part) => {
      if (/^(\r\n|\n|\r)$/.test(part)) return part;
      const words = part.match(/\S+|\s+/g);
      if (!words) return part;
      const tokens = words.filter((w) => /\S/.test(w));
      const reversed = [...tokens].reverse();
      let ti = 0;
      return words
        .map((w) => {
          if (/^\s+$/.test(w)) return w;
          const next = reversed[ti];
          ti += 1;
          return next ?? w;
        })
        .join("");
    })
    .join("");
}
