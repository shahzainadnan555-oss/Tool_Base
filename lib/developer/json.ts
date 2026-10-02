import type { IndentStyle, ValidationResult } from "./types";
import { indentUnit, locateLineColumn, parseJsonError } from "./utils";

export function validateJson(input: string): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, message: "Please enter JSON to validate." };
  }
  try {
    JSON.parse(trimmed);
    return { valid: true, message: "Valid JSON" };
  } catch (err) {
    const parsed = parseJsonError(err);
    const loc = locateLineColumn(trimmed, parsed.position);
    return {
      valid: false,
      message: parsed.message.replace(/^JSON\.parse:\s*/i, "").replace(/^Unexpected/, "Unexpected"),
      position: parsed.position,
      ...loc,
    };
  }
}

export function formatJson(input: string, indent: IndentStyle = "2"): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter JSON to format.");
  const value = JSON.parse(trimmed);
  const space = indent === "tab" ? "\t" : Number(indent);
  return JSON.stringify(value, null, space);
}

export function minifyJson(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter JSON to minify.");
  const value = JSON.parse(trimmed);
  return JSON.stringify(value);
}

export { indentUnit };
