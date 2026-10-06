import { TYPING_NUMBERS, TYPING_PUNCT, TYPING_SENTENCES, TYPING_WORDS } from "./corpus";

export type TypingMode = "time" | "words" | "sentence";
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;

export interface TypingOptions {
  mode: TypingMode;
  timeLimit: TimeOption;
  wordCount: WordOption;
  punctuation: boolean;
  numbers: boolean;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  totalTyped: number;
  elapsedMs: number;
}

function randomInt(max: number): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pickWord(punctuation: boolean, numbers: boolean): string {
  if (numbers && randomInt(10) === 0) return TYPING_NUMBERS[randomInt(TYPING_NUMBERS.length)];
  let word = TYPING_WORDS[randomInt(TYPING_WORDS.length)];
  if (punctuation && randomInt(8) === 0) {
    word += TYPING_PUNCT[randomInt(TYPING_PUNCT.length)];
  }
  return word;
}

export function buildTargetText(options: TypingOptions): string {
  if (options.mode === "sentence") {
    const count = Math.max(2, Math.min(6, Math.ceil(options.wordCount / 12)));
    const parts: string[] = [];
    const used = new Set<number>();
    while (parts.length < count) {
      const idx = randomInt(TYPING_SENTENCES.length);
      if (used.has(idx) && used.size < TYPING_SENTENCES.length) continue;
      used.add(idx);
      let sentence: string = TYPING_SENTENCES[idx];
      if (options.punctuation) {
        sentence = `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`;
      }
      if (options.numbers && randomInt(3) === 0) {
        sentence = `${sentence} ${TYPING_NUMBERS[randomInt(TYPING_NUMBERS.length)]}`;
      }
      parts.push(sentence);
    }
    return parts.join(" ");
  }

  const count =
    options.mode === "words"
      ? options.wordCount
      : Math.max(80, options.timeLimit * 4);
  const words: string[] = [];
  let previous = "";
  for (let i = 0; i < count; i += 1) {
    let next = pickWord(options.punctuation, options.numbers);
    let guard = 0;
    while (next === previous && guard < 8) {
      next = pickWord(options.punctuation, options.numbers);
      guard += 1;
    }
    previous = next;
    words.push(next);
  }
  return words.join(" ");
}

/** Net WPM from correct characters using 5-char word convention. */
export function calcWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return (correctChars / 5) / minutes;
}

/** Raw WPM from all typed characters using 5-char word convention. */
export function calcRawWpm(totalTyped: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return (totalTyped / 5) / minutes;
}

export function calcAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  return (correctKeystrokes / totalKeystrokes) * 100;
}

export function compareTyped(target: string, typed: string): {
  correctChars: number;
  incorrectChars: number;
} {
  let correctChars = 0;
  let incorrectChars = 0;
  const len = typed.length;
  for (let i = 0; i < len; i += 1) {
    if (typed[i] === target[i]) correctChars += 1;
    else incorrectChars += 1;
  }
  return { correctChars, incorrectChars };
}

export function wordModeComplete(target: string, typed: string, wordCount: number): boolean {
  const words = target.split(" ").slice(0, wordCount);
  const required = words.join(" ");
  return typed.length >= required.length && typed.slice(0, required.length) === required;
}

export function createSessionId(): string {
  return `${Date.now().toString(36)}-${randomInt(1e9).toString(36)}`;
}

export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m <= 0) return `${s}s`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatRemaining(ms: number): string {
  return formatElapsed(ms);
}
