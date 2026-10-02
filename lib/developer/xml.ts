import { XMLBuilder, XMLParser, XMLValidator } from "fast-xml-parser";
import type { IndentStyle, ValidationResult } from "./types";
import { indentUnit } from "./utils";

const SAFE_PARSER_OPTIONS = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
  cdataPropName: "__cdata",
  commentPropName: "__comment",
  processEntities: false,
  htmlEntities: false,
  ignoreDeclaration: false,
  ignorePiTags: false,
  preserveOrder: true,
  trimValues: false,
};

export function validateXml(input: string): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, message: "Please enter XML to validate." };
  }
  const result = XMLValidator.validate(trimmed, {
    allowBooleanAttributes: true,
  });
  if (result === true) {
    return { valid: true, message: "Valid XML" };
  }
  const err = result.err;
  return {
    valid: false,
    message: err?.msg || "Invalid XML",
    line: err?.line,
    column: err?.col,
  };
}

export function formatXml(input: string, indent: IndentStyle = "2"): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter XML to format.");
  const validation = validateXml(trimmed);
  if (!validation.valid) {
    const loc =
      validation.line != null
        ? ` (line ${validation.line}${validation.column != null ? `, column ${validation.column}` : ""})`
        : "";
    throw new Error(`Invalid XML${loc}: ${validation.message}`);
  }

  const parser = new XMLParser(SAFE_PARSER_OPTIONS);
  const parsed = parser.parse(trimmed);
  const builder = new XMLBuilder({
    ...SAFE_PARSER_OPTIONS,
    format: true,
    indentBy: indentUnit(indent),
    suppressEmptyNode: false,
    unpairedTags: [],
  });
  return builder.build(parsed).trim();
}
