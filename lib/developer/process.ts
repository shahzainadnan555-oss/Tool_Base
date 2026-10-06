import { hexToRgb, rgbToHex } from "@/lib/utilities/color";
import { decodeBase64, decodeHtmlEntities, decodeUrl, encodeBase64, encodeHtmlEntities, encodeUrl } from "./encode";
import {
  formatCss,
  formatHtml,
  formatJavaScript,
  minifyCss,
  minifyHtml,
  minifyJavaScript,
} from "./formatters";
import { formatJson, minifyJson, validateJson } from "./json";
import { generateRegex, testRegexSafe } from "./regex";
import { formatSql, minifySql } from "./sql";
import type {
  DeveloperProcessOptions,
  DeveloperProcessResult,
  DeveloperToolConfig,
} from "./types";
import { MAX_DEV_INPUT_CHARS } from "./types";
import { formatXml, validateXml } from "./xml";

function assertSize(input: string) {
  if (input.length > MAX_DEV_INPUT_CHARS) {
    throw new Error(
      `Input is too large (max ${MAX_DEV_INPUT_CHARS.toLocaleString()} characters).`,
    );
  }
}

export async function processDeveloperTool(
  config: DeveloperToolConfig,
  input: string,
  options: DeveloperProcessOptions = {},
): Promise<DeveloperProcessResult> {
  assertSize(input);
  const indent = options.indent ?? "2";

  switch (config.kind) {
    case "json-format":
      return { output: formatJson(input, indent) };
    case "json-validate": {
      const validation = validateJson(input);
      return { output: input, validation };
    }
    case "json-minify":
      return { output: minifyJson(input) };
    case "html-format":
      return { output: await formatHtml(input, indent) };
    case "html-minify":
      return { output: await minifyHtml(input) };
    case "css-format":
      return { output: await formatCss(input, indent) };
    case "css-minify":
      return { output: await minifyCss(input) };
    case "js-format":
      return { output: await formatJavaScript(input, indent) };
    case "js-minify":
      return { output: await minifyJavaScript(input) };
    case "xml-format":
      return { output: formatXml(input, indent) };
    case "xml-validate": {
      const validation = validateXml(input);
      return { output: input, validation };
    }
    case "sql-format":
      return { output: await formatSql(input, indent) };
    case "sql-minify":
      return { output: minifySql(input) };
    case "regex-test": {
      const regex = await testRegexSafe(
        options.regexPattern ?? "",
        options.regexFlags ?? "g",
        options.regexTestText ?? input,
      );
      const summary = regex.error
        ? ""
        : regex.matches
            .map((m, i) => {
              const groups =
                m.groups.length > 0
                  ? `\n  groups: ${m.groups.map((g, gi) => `#${gi + 1}=${JSON.stringify(g)}`).join(", ")}`
                  : "";
              const named =
                m.namedGroups && Object.keys(m.namedGroups).length
                  ? `\n  named: ${JSON.stringify(m.namedGroups)}`
                  : "";
              return `${i + 1}. ${JSON.stringify(m.match)} @ ${m.index}-${m.end}${groups}${named}`;
            })
            .join("\n");
      return {
        output: summary,
        regex,
      };
    }
    case "regex-generate": {
      const generated = generateRegex(
        options.regexOptions ?? { template: options.regexTemplate || "email" },
      );
      return {
        output: generated.pattern,
        notice: generated.notice,
      };
    }
    case "base64-encode":
      return { output: encodeBase64(input) };
    case "base64-decode":
      return { output: decodeBase64(input) };
    case "url-encode":
      return { output: encodeUrl(input, options.urlMode ?? "component") };
    case "url-decode":
      return { output: decodeUrl(input) };
    case "html-entity-encode":
      return { output: encodeHtmlEntities(input) };
    case "html-entity-decode":
      return { output: decodeHtmlEntities(input) };
    case "hex-to-rgb":
      return { output: hexToRgb(input) };
    case "rgb-to-hex":
      return { output: rgbToHex(input) };
    default:
      return { output: input };
  }
}
