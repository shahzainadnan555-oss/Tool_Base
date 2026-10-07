import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { dump as yamlDump, load as yamlLoad } from "js-yaml";
import { jsPDF } from "jspdf";
import { marked } from "marked";
import Papa from "papaparse";
import TurndownService from "turndown";
import { loadPdfjsDocument, extractPdfText } from "@/lib/pdf/pdfjs";
import { reportStage } from "@/lib/processing/report";
import type {
  DocumentDataConfig,
  DocumentDataOptions,
  DocumentDataResult,
} from "./types";
import {
  buildOutputName,
  csvEscape,
  escapeXml,
  formatBytes,
  readFileAsArrayBuffer,
  readFileAsText,
  stripRtf,
} from "./utils";
import { friendlyDocumentError } from "./validate";

function textResult(
  text: string,
  config: DocumentDataConfig,
  sourceName: string,
  extras: Partial<DocumentDataResult> = {},
): DocumentDataResult {
  const blob = new Blob([text], { type: config.outputMime });
  return {
    blob,
    fileName: buildOutputName(sourceName, config.filenameSuffix, config.outputExtension),
    mimeType: config.outputMime,
    sizeBytes: blob.size,
    textPreview: text,
    ...extras,
  };
}

function binaryResult(
  bytes: Uint8Array | ArrayBuffer | Blob,
  config: DocumentDataConfig,
  sourceName: string,
  extras: Partial<DocumentDataResult> = {},
): DocumentDataResult {
  const blob =
    bytes instanceof Blob
      ? bytes
      : new Blob([bytes instanceof Uint8Array ? Uint8Array.from(bytes) : bytes], {
          type: config.outputMime,
        });
  return {
    blob,
    fileName: buildOutputName(sourceName, config.filenameSuffix, config.outputExtension),
    mimeType: config.outputMime,
    sizeBytes: blob.size,
    ...extras,
  };
}

async function getInputText(
  file: File | null,
  options: DocumentDataOptions,
): Promise<{ text: string; name: string }> {
  if (options.textInput != null && options.textInput.length > 0) {
    return { text: options.textInput, name: options.sourceName || "document.txt" };
  }
  if (!file) throw new Error("Please upload a file or paste input.");
  return { text: await readFileAsText(file), name: file.name };
}

async function textToPdfBytes(text: string, onProgress?: DocumentDataOptions["onProgress"]) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const margin = 48;
  const pageWidth = 595;
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = fontSize * 1.35;
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");
  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;
  let lineCount = 0;
  const totalEstimate = Math.max(1, paragraphs.length);

  const wrapLine = (line: string): string[] => {
    if (!line) return [""];
    const words = line.split(/(\s+)/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const next = current + word;
      if (font.widthOfTextAtSize(next, fontSize) > maxWidth && current) {
        lines.push(current);
        current = word.trimStart();
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [""];
  };

  for (let i = 0; i < paragraphs.length; i += 1) {
    const wrapped = wrapLine(paragraphs[i]);
    for (const line of wrapped) {
      if (y < margin + lineHeight) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(line || " ", {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
        maxWidth,
      });
      y -= lineHeight;
      lineCount += 1;
    }
    onProgress?.(i + 1, totalEstimate, "Writing PDF…");
  }

  if (lineCount === 0) {
    page.drawText(" ", { x: margin, y, size: fontSize, font });
  }
  return doc.save();
}

function sanitizeHtmlForOfflineRender(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "data:text/plain");
}

async function htmlStringToPdf(html: string): Promise<Uint8Array> {
  const { default: html2canvas } = await import("html2canvas");
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = "800px";
  host.style.padding = "32px";
  host.style.background = "#ffffff";
  host.style.color = "#111827";
  host.style.fontFamily = "Helvetica, Arial, sans-serif";
  host.style.fontSize = "14px";
  host.style.lineHeight = "1.5";
  host.innerHTML = sanitizeHtmlForOfflineRender(html);
  document.body.appendChild(host);
  try {
    const canvas = await html2canvas(host, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    const buffer = pdf.output("arraybuffer");
    return new Uint8Array(buffer);
  } finally {
    host.remove();
  }
}

async function textToDocxBlob(text: string): Promise<Blob> {
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line || " ", size: 22 })],
        spacing: { after: 120 },
      }),
  );
  const doc = new Document({
    sections: [{ children: paragraphs.length ? paragraphs : [new Paragraph("")] }],
  });
  return Packer.toBlob(doc);
}

function parseCsv(text: string, delimiter = ",") {
  const parsed = Papa.parse<Record<string, string> | string[]>(text, {
    header: true,
    skipEmptyLines: "greedy",
    delimiter,
    dynamicTyping: false,
  });
  if (parsed.errors.length) {
    const first = parsed.errors[0];
    throw new Error(
      `CSV parse error${first.row != null ? ` on row ${first.row + 1}` : ""}: ${first.message}`,
    );
  }
  return parsed;
}

function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) throw new Error("JSON must be a non-empty array of objects for CSV conversion.");
  const keys = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>()),
  );
  const lines = [keys.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(
      keys
        .map((key) => {
          const value = row[key];
          if (value == null) return "";
          if (typeof value === "object") return csvEscape(JSON.stringify(value));
          return csvEscape(String(value));
        })
        .join(","),
    );
  }
  return lines.join("\n");
}

function jsonToXmlValue(value: unknown, key = "item"): string {
  if (value == null) return `<${key}/>`;
  if (Array.isArray(value)) {
    return value.map((item) => jsonToXmlValue(item, key)).join("");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const inner = entries.map(([k, v]) => jsonToXmlValue(v, k)).join("");
    return `<${key}>${inner}</${key}>`;
  }
  return `<${key}>${escapeXml(String(value))}</${key}>`;
}

async function convertDocxToPdf(
  file: File,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  reportStage(options.onProgress, "Reading DOCX…");
  const mammoth = await import("mammoth");
  const buffer = await readFileAsArrayBuffer(file);
  reportStage(options.onProgress, "Parsing document…");
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  if (!result.value.trim()) {
    throw new Error("This DOCX did not contain extractable content.");
  }
  reportStage(options.onProgress, "Generating PDF…");
  const html = `<article>${result.value}</article>`;
  const pdfBytes = await htmlStringToPdf(html);
  
  return binaryResult(pdfBytes, config, file.name, {
    notice: result.messages.length
      ? "Some DOCX features may have been simplified during conversion."
      : undefined,
  });
}

async function convertPdfToDocx(
  file: File,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  reportStage(options.onProgress, "Reading PDF…");
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await loadPdfjsDocument(buffer);
  try {
    const text = await extractPdfText(pdf, (completed, total) => {
      options.onProgress?.(completed, total, `Reading page ${completed}…`);
    });
    if (!text.trim()) {
      throw new Error(
        "No extractable text was found. This PDF may be scanned images without a text layer. OCR is not applied.",
      );
    }
    reportStage(options.onProgress, "Building DOCX…");
    const blob = await textToDocxBlob(text);
    return binaryResult(blob, config, file.name, {
      notice:
        "Created an editable DOCX from the PDF text layer. Layout and formatting are approximated.",
      textPreview: text.slice(0, 4000),
    });
  } finally {
    await pdf.cleanup();
  }
}

async function convertTxtToPdf(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  if (!text.trim()) throw new Error("Please provide text to convert.");
  const bytes = await textToPdfBytes(text, options.onProgress);
  return binaryResult(bytes, config, name);
}

async function convertTxtToDocx(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  if (!text.trim()) throw new Error("Please provide text to convert.");
  reportStage(options.onProgress, "Creating DOCX…");
  const blob = await textToDocxBlob(text);
  
  return binaryResult(blob, config, name);
}

async function convertDocxToTxt(
  file: File,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  reportStage(options.onProgress, "Extracting text…");
  const mammoth = await import("mammoth");
  const buffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  
  const text = result.value.replace(/\n{3,}/g, "\n\n").trim();
  if (!text) throw new Error("No text could be extracted from this DOCX.");
  return textResult(text, config, file.name);
}

async function convertRtfToTxt(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, {
    ...options,
    textInput: options.textInput,
  });
  reportStage(options.onProgress, "Parsing RTF…");
  const source = file ? await readFileAsText(file) : text;
  const plain = stripRtf(source);
  
  if (!plain) throw new Error("No text could be extracted from this RTF file.");
  return textResult(plain, config, name.endsWith(".rtf") ? name : `${name}.rtf`);
}

async function convertRtfToPdf(
  file: File,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  reportStage(options.onProgress, "Parsing RTF…");
  const plain = stripRtf(await readFileAsText(file));
  if (!plain) throw new Error("No text could be extracted from this RTF file.");
  reportStage(options.onProgress, "Generating PDF…");
  const bytes = await textToPdfBytes(plain, options.onProgress);
  
  return binaryResult(bytes, config, file.name);
}

async function convertMarkdownToHtml(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Converting Markdown…");
  const html = await marked.parse(text, { async: true, gfm: true, breaks: false });
  
  const documentHtml = `<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="utf-8"><title>Converted Markdown</title></head>\n<body>\n${html}\n</body>\n</html>\n`;
  return textResult(documentHtml, config, name);
}

async function convertHtmlToMarkdown(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Converting HTML…");
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });
  const markdown = turndown.turndown(text);
  
  return textResult(markdown, config, name);
}

async function convertMarkdownToPdf(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Rendering Markdown…");
  const htmlBody = await marked.parse(text, { async: true, gfm: true });
  reportStage(options.onProgress, "Generating PDF…");
  const pdfBytes = await htmlStringToPdf(`<article>${htmlBody}</article>`);
  
  return binaryResult(pdfBytes, config, name);
}

async function convertCsvToJson(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing CSV…");
  const parsed = parseCsv(text);
  const json = JSON.stringify(parsed.data, null, 2);
  
  return textResult(json, config, name, {
    stats: { Rows: String(parsed.data.length) },
  });
}

async function convertJsonToCsv(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing JSON…");
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Invalid JSON";
    throw new Error(`Invalid JSON: ${detail}`);
  }
  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of objects to convert to CSV.");
  }
  if (!data.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
    throw new Error("Each JSON array item must be an object for CSV conversion.");
  }
  const csv = rowsToCsv(data as Record<string, unknown>[]);
  
  return textResult(csv, config, name, { stats: { Rows: String(data.length) } });
}

async function convertCsvToXml(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing CSV…");
  const parsed = parseCsv(text);
  const root = options.xmlRootName || "root";
  const rowName = options.xmlRowName || "record";
  const rows = parsed.data as Record<string, string>[];
  const body = rows
    .map((row) => {
      const fields = Object.entries(row)
        .map(([key, value]) => {
          const safeKey = key.replace(/[^\w.-]/g, "_") || "field";
          return `<${safeKey}>${escapeXml(value ?? "")}</${safeKey}>`;
        })
        .join("");
      return `<${rowName}>${fields}</${rowName}>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${root}>${body}</${root}>\n`;
  
  return textResult(xml, config, name, { stats: { Records: String(rows.length) } });
}

async function convertXmlToJson(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing XML…");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    processEntities: false,
    htmlEntities: true,
  });
  let data: unknown;
  try {
    data = parser.parse(text);
  } catch (error) {
    throw new Error(
      `Invalid XML: ${error instanceof Error ? error.message : "Could not parse XML."}`,
    );
  }
  const json = JSON.stringify(data, null, 2);
  
  return textResult(json, config, name);
}

async function convertJsonToXml(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing JSON…");
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : "Invalid JSON"}`);
  }
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    format: true,
  });
  let xml: string;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n${builder.build(data)}`;
  } else {
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>${jsonToXmlValue(data, "item")}</root>\n`;
  }
  
  return textResult(xml, config, name);
}

async function convertTxtToCsv(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  const delimiter = options.delimiter || ",";
  reportStage(options.onProgress, "Building CSV…");
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((line) => line.length > 0);
  if (!lines.length) throw new Error("Please provide text lines to convert.");
  const rows = lines.map((line) =>
    line
      .split(delimiter)
      .map((cell) => csvEscape(cell.trim()))
      .join(","),
  );
  const csv = rows.join("\n");
  
  return textResult(csv, config, name, { stats: { Rows: String(rows.length) } });
}

async function convertCsvToTsv(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing CSV…");
  const parsed = Papa.parse<string[]>(text, {
    header: false,
    skipEmptyLines: "greedy",
  });
  if (parsed.errors.length) {
    throw new Error(`CSV parse error: ${parsed.errors[0].message}`);
  }
  const tsv = (parsed.data as string[][])
    .map((row) =>
      row
        .map((cell) => {
          const value = cell ?? "";
          if (/[\t\n\r"]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
          return value;
        })
        .join("\t"),
    )
    .join("\n");
  
  return textResult(tsv, config, name);
}

async function convertTsvToCsv(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing TSV…");
  const parsed = Papa.parse<string[]>(text, {
    header: false,
    skipEmptyLines: "greedy",
    delimiter: "\t",
  });
  if (parsed.errors.length) {
    throw new Error(`TSV parse error: ${parsed.errors[0].message}`);
  }
  const csv = (parsed.data as string[][])
    .map((row) => row.map((cell) => csvEscape(cell ?? "")).join(","))
    .join("\n");
  
  return textResult(csv, config, name);
}

async function convertYamlToJson(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing YAML…");
  let data: unknown;
  try {
    data = yamlLoad(text);
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : "Could not parse YAML."}`);
  }
  const json = JSON.stringify(data, null, 2);
  
  return textResult(json, config, name);
}

async function convertJsonToYaml(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions,
): Promise<DocumentDataResult> {
  const { text, name } = await getInputText(file, options);
  reportStage(options.onProgress, "Parsing JSON…");
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : "Invalid JSON"}`);
  }
  const output = yamlDump(data, { lineWidth: 100, noRefs: true });
  
  return textResult(output, config, name);
}

export async function processDocumentData(
  file: File | null,
  config: DocumentDataConfig,
  options: DocumentDataOptions = {},
): Promise<DocumentDataResult> {
  try {
    switch (config.kind) {
      case "docx-to-pdf":
        if (!file) throw new Error("Please upload a DOCX file.");
        return await convertDocxToPdf(file, config, options);
      case "pdf-to-docx":
        if (!file) throw new Error("Please upload a PDF file.");
        return await convertPdfToDocx(file, config, options);
      case "txt-to-pdf":
        return await convertTxtToPdf(file, config, options);
      case "txt-to-docx":
        return await convertTxtToDocx(file, config, options);
      case "docx-to-txt":
        if (!file) throw new Error("Please upload a DOCX file.");
        return await convertDocxToTxt(file, config, options);
      case "rtf-to-pdf":
        if (!file) throw new Error("Please upload an RTF file.");
        return await convertRtfToPdf(file, config, options);
      case "rtf-to-txt":
        return await convertRtfToTxt(file, config, options);
      case "markdown-to-html":
        return await convertMarkdownToHtml(file, config, options);
      case "html-to-markdown":
        return await convertHtmlToMarkdown(file, config, options);
      case "markdown-to-pdf":
        return await convertMarkdownToPdf(file, config, options);
      case "csv-to-json":
        return await convertCsvToJson(file, config, options);
      case "json-to-csv":
        return await convertJsonToCsv(file, config, options);
      case "csv-to-xml":
        return await convertCsvToXml(file, config, options);
      case "xml-to-json":
        return await convertXmlToJson(file, config, options);
      case "json-to-xml":
        return await convertJsonToXml(file, config, options);
      case "txt-to-csv":
        return await convertTxtToCsv(file, config, options);
      case "csv-to-tsv":
        return await convertCsvToTsv(file, config, options);
      case "tsv-to-csv":
        return await convertTsvToCsv(file, config, options);
      case "yaml-to-json":
        return await convertYamlToJson(file, config, options);
      case "json-to-yaml":
        return await convertJsonToYaml(file, config, options);
      default:
        throw new Error("Unsupported converter.");
    }
  } catch (error) {
    throw new Error(friendlyDocumentError(error));
  }
}

export { formatBytes };
