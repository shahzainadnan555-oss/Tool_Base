import type { IndentStyle } from "./types";

export async function formatSql(input: string, indent: IndentStyle = "2"): Promise<string> {
  if (!input.trim()) throw new Error("Please enter SQL to format.");
  const { format } = await import("sql-formatter");
  try {
    return format(input, {
      language: "sql",
      tabWidth: indent === "tab" ? 2 : Number(indent),
      useTabs: indent === "tab",
      keywordCase: "upper",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to format this SQL.";
    throw new Error(message);
  }
}

/**
 * Conservative SQL minify: tokenize-aware enough to preserve string literals
 * and comments while collapsing whitespace outside them.
 */
export function minifySql(input: string): string {
  if (!input.trim()) throw new Error("Please enter SQL to minify.");
  let out = "";
  let i = 0;
  const s = input;
  while (i < s.length) {
    const ch = s[i];
    const next = s[i + 1];

    // Line comment
    if (ch === "-" && next === "-") {
      while (i < s.length && s[i] !== "\n") i += 1;
      continue;
    }
    // Block comment
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) i += 1;
      i += 2;
      continue;
    }
    // Single-quoted string
    if (ch === "'") {
      out += ch;
      i += 1;
      while (i < s.length) {
        out += s[i];
        if (s[i] === "'" && s[i + 1] === "'") {
          out += s[i + 1];
          i += 2;
          continue;
        }
        if (s[i] === "'") {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    // Double-quoted identifier
    if (ch === '"') {
      out += ch;
      i += 1;
      while (i < s.length) {
        out += s[i];
        if (s[i] === '"' && s[i + 1] === '"') {
          out += s[i + 1];
          i += 2;
          continue;
        }
        if (s[i] === '"') {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    // Backtick identifier
    if (ch === "`") {
      out += ch;
      i += 1;
      while (i < s.length) {
        out += s[i];
        if (s[i] === "`") {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    if (/\s/.test(ch)) {
      // Collapse whitespace to a single space when between tokens
      if (out && !/\s$/.test(out) && i + 1 < s.length && !/[),;]/.test(s[i + 1])) {
        // skip spaces before punctuation
        let j = i;
        while (j < s.length && /\s/.test(s[j])) j += 1;
        if (j < s.length && !/[),;]/.test(s[j]) && !/[([,]/.test(out.slice(-1))) {
          out += " ";
        } else if (j < s.length && /[([,]/.test(out.slice(-1))) {
          // no space after openers
        } else if (j < s.length && /[),;]/.test(s[j])) {
          // no space before closers
        } else if (out && !/\s$/.test(out)) {
          out += " ";
        }
      }
      i += 1;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out.trim().replace(/\s+([),;])/g, "$1").replace(/([(])\s+/g, "$1");
}
