import type { ToolDefinition } from "./types";

function tool(
  partial: Omit<ToolDefinition, "route" | "status"> & {
    status?: ToolDefinition["status"];
  },
): ToolDefinition {
  return {
    ...partial,
    route: `/tools/${partial.slug}`,
    status: partial.status ?? "available",
  };
}

/** Document & data converters — Prompt 5 */
export const documentDataTools: ToolDefinition[] = [
  tool({
    id: "docx-to-pdf",
    name: "DOCX to PDF Converter",
    slug: "docx-to-pdf",
    category: "document-data-tools",
    description: "Convert DOCX Word documents into PDF files.",
    shortDescription: "Convert DOCX documents to PDF.",
    icon: "text",
    keywords: [
      "docx to pdf",
      "word to pdf",
      "convert docx to pdf",
      "docx pdf converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["DOCX", "PDF"],
    relatedToolIds: [
      "pdf-to-docx",
      "docx-to-txt",
      "txt-to-docx",
      "rtf-to-pdf",
      "txt-to-pdf",
    ],
    seoTitle: "DOCX to PDF Converter — Free Online | Tool Base",
    seoDescription:
      "Convert DOCX documents to PDF with Tool Base. Upload a Word document, convert it to PDF, and download the result online.",
    h1: "DOCX to PDF Converter",
    intro:
      "Convert DOCX documents into shareable PDF files. Upload a .docx file, convert it, and download a valid PDF.",
    convertHeading: "Convert DOCX to PDF Online",
    howToHeading: "How to Convert DOCX to PDF",
    featuresHeading: "DOCX to PDF Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert DOCX to PDF",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the source document.",
      },
      {
        title: "Convert Your Document",
        description: "Generate the output format.",
      },
      {
        title: "Download Your File",
        description: "Save the converted document.",
      },
    ],
    faq: [
      {
        question: "Is DOCX to PDF Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["DOCX"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "pdf-to-docx",
    name: "PDF to DOCX Converter",
    slug: "pdf-to-docx",
    category: "document-data-tools",
    description: "Convert PDF text into an editable DOCX document.",
    shortDescription: "Convert PDF files to DOCX.",
    icon: "text",
    keywords: [
      "pdf to docx",
      "pdf to word",
      "convert pdf to docx",
      "pdf docx converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["DOCX", "PDF"],
    relatedToolIds: [
      "docx-to-pdf",
      "docx-to-txt",
      "pdf-text-extractor",
      "pdf-to-text",
    ],
    seoTitle: "PDF to DOCX Converter — Free Online | Tool Base",
    seoDescription:
      "Convert PDF to DOCX online with Tool Base. Create an editable Word document from PDF text where a text layer is available.",
    h1: "PDF to DOCX Converter",
    intro:
      "Turn PDF text into an editable DOCX file. Layout is approximated because PDF is a fixed-layout format.",
    convertHeading: "Convert PDF to DOCX Online",
    howToHeading: "How to Convert PDF to DOCX",
    featuresHeading: "PDF to DOCX Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert PDF to DOCX",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the source document.",
      },
      {
        title: "Convert Your Document",
        description: "Generate the output format.",
      },
      {
        title: "Download Your File",
        description: "Save the converted document.",
      },
    ],
    faq: [
      {
        question: "Is PDF to DOCX Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Does this use OCR?",
        answer:
          "No. It reconstructs editable text from the PDF text layer. Scanned image-only PDFs may not contain extractable text.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["PDF"],
    outputFormats: ["DOCX"],
  }),
  tool({
    id: "txt-to-pdf",
    name: "TXT to PDF Converter",
    slug: "txt-to-pdf",
    category: "document-data-tools",
    description: "Convert plain text files into PDF documents.",
    shortDescription: "Convert TXT files to PDF.",
    icon: "text",
    keywords: ["txt to pdf", "text to pdf", "convert txt to pdf"],
    popular: false,
    new: false,
    supportedFormats: ["PDF", "TXT"],
    relatedToolIds: [
      "txt-to-docx",
      "markdown-to-pdf",
      "rtf-to-pdf",
      "docx-to-pdf",
    ],
    seoTitle: "TXT to PDF Converter — Free Online | Tool Base",
    seoDescription:
      "Convert TXT to PDF online with Tool Base. Upload or paste plain text, generate a PDF, and download the result.",
    h1: "TXT to PDF Converter",
    intro:
      "Create a PDF from plain text while preserving line breaks and readable spacing.",
    convertHeading: "Convert TXT to PDF Online",
    howToHeading: "How to Convert TXT to PDF",
    featuresHeading: "TXT to PDF Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert TXT to PDF",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is TXT to PDF Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["TXT"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "txt-to-docx",
    name: "TXT to DOCX Converter",
    slug: "txt-to-docx",
    category: "document-data-tools",
    description: "Convert plain text into a DOCX Word document.",
    shortDescription: "Convert TXT files to DOCX.",
    icon: "text",
    keywords: ["txt to docx", "text to word", "convert txt to docx"],
    popular: false,
    new: true,
    supportedFormats: ["DOCX", "TXT"],
    relatedToolIds: ["docx-to-txt", "txt-to-pdf", "docx-to-pdf", "rtf-to-txt"],
    seoTitle: "TXT to DOCX Converter — Free Online | Tool Base",
    seoDescription:
      "Convert TXT to DOCX online with Tool Base. Turn plain text into a downloadable Word document.",
    h1: "TXT to DOCX Converter",
    intro:
      "Create a DOCX file from plain text with paragraph-friendly line breaks.",
    convertHeading: "Convert TXT to DOCX Online",
    howToHeading: "How to Convert TXT to DOCX",
    featuresHeading: "TXT to DOCX Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert TXT to DOCX",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is TXT to DOCX Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["TXT"],
    outputFormats: ["DOCX"],
  }),
  tool({
    id: "docx-to-txt",
    name: "DOCX to TXT Converter",
    slug: "docx-to-txt",
    category: "document-data-tools",
    description: "Extract plain text from DOCX Word documents.",
    shortDescription: "Convert DOCX files to TXT.",
    icon: "text",
    keywords: ["docx to txt", "word to text", "extract text from docx"],
    popular: false,
    new: false,
    supportedFormats: ["DOCX", "TXT"],
    relatedToolIds: ["txt-to-docx", "docx-to-pdf", "pdf-to-docx", "rtf-to-txt"],
    seoTitle: "DOCX to TXT Converter — Free Online | Tool Base",
    seoDescription:
      "Convert DOCX to TXT online with Tool Base. Extract readable text from Word documents and copy or download the result.",
    h1: "DOCX to TXT Converter",
    intro:
      "Extract clean text from a DOCX file for editing, searching, or reuse.",
    convertHeading: "Convert DOCX to TXT Online",
    howToHeading: "How to Convert DOCX to TXT",
    featuresHeading: "DOCX to TXT Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert DOCX to TXT",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is DOCX to TXT Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["DOCX"],
    outputFormats: ["TXT"],
  }),
  tool({
    id: "rtf-to-pdf",
    name: "RTF to PDF Converter",
    slug: "rtf-to-pdf",
    category: "document-data-tools",
    description: "Convert RTF documents into PDF files.",
    shortDescription: "Convert RTF files to PDF.",
    icon: "text",
    keywords: ["rtf to pdf", "convert rtf to pdf", "rtf pdf converter"],
    popular: false,
    new: true,
    supportedFormats: ["PDF", "RTF"],
    relatedToolIds: [
      "rtf-to-txt",
      "txt-to-pdf",
      "docx-to-pdf",
      "markdown-to-pdf",
    ],
    seoTitle: "RTF to PDF Converter — Free Online | Tool Base",
    seoDescription:
      "Convert RTF to PDF online with Tool Base. Parse Rich Text content and download a generated PDF.",
    h1: "RTF to PDF Converter",
    intro:
      "Turn RTF documents into PDF files using the extracted text content.",
    convertHeading: "Convert RTF to PDF Online",
    howToHeading: "How to Convert RTF to PDF",
    featuresHeading: "RTF to PDF Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert RTF to PDF",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the source document.",
      },
      {
        title: "Convert Your Document",
        description: "Generate the output format.",
      },
      {
        title: "Download Your File",
        description: "Save the converted document.",
      },
    ],
    faq: [
      {
        question: "Is RTF to PDF Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["RTF"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "rtf-to-txt",
    name: "RTF to TXT Converter",
    slug: "rtf-to-txt",
    category: "document-data-tools",
    description: "Extract plain text from RTF documents.",
    shortDescription: "Convert RTF files to TXT.",
    icon: "text",
    keywords: ["rtf to txt", "convert rtf to text", "extract text from rtf"],
    popular: false,
    new: false,
    supportedFormats: ["RTF", "TXT"],
    relatedToolIds: ["rtf-to-pdf", "docx-to-txt", "txt-to-docx", "txt-to-pdf"],
    seoTitle: "RTF to TXT Converter — Free Online | Tool Base",
    seoDescription:
      "Convert RTF to TXT online with Tool Base. Strip RTF control syntax and download clean readable text.",
    h1: "RTF to TXT Converter",
    intro: "Extract readable text from RTF files without control-code clutter.",
    convertHeading: "Convert RTF to TXT Online",
    howToHeading: "How to Convert RTF to TXT",
    featuresHeading: "RTF to TXT Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert RTF to TXT",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is RTF to TXT Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["RTF"],
    outputFormats: ["TXT"],
  }),
  tool({
    id: "markdown-to-html",
    name: "Markdown to HTML Converter",
    slug: "markdown-to-html",
    category: "document-data-tools",
    description: "Convert Markdown into HTML markup.",
    shortDescription: "Convert Markdown to HTML.",
    icon: "text",
    keywords: [
      "markdown to html",
      "convert markdown to html",
      "markdown html converter",
      "md to html",
    ],
    popular: true,
    new: false,
    supportedFormats: ["HTML", "MD", "Markdown"],
    relatedToolIds: ["html-to-markdown", "markdown-to-pdf", "txt-to-pdf"],
    seoTitle: "Markdown to HTML Converter — Free Online | Tool Base",
    seoDescription:
      "Convert Markdown to HTML online with Tool Base. Paste or upload Markdown, convert it, then copy or download the HTML.",
    h1: "Markdown to HTML Converter",
    intro: "Transform Markdown syntax into HTML for pages, docs, and previews.",
    convertHeading: "Convert Markdown to HTML Online",
    howToHeading: "How to Convert Markdown to HTML",
    featuresHeading: "Markdown to HTML Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert MD to HTML",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is Markdown to HTML Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["MD", "Markdown"],
    outputFormats: ["HTML"],
  }),
  tool({
    id: "html-to-markdown",
    name: "HTML to Markdown Converter",
    slug: "html-to-markdown",
    category: "document-data-tools",
    description: "Convert HTML markup into Markdown.",
    shortDescription: "Convert HTML to Markdown.",
    icon: "text",
    keywords: [
      "html to markdown",
      "convert html to markdown",
      "html markdown converter",
    ],
    popular: false,
    new: false,
    supportedFormats: ["HTML", "MD"],
    relatedToolIds: ["markdown-to-html", "markdown-to-pdf", "txt-to-docx"],
    seoTitle: "HTML to Markdown Converter — Free Online | Tool Base",
    seoDescription:
      "Convert HTML to Markdown online with Tool Base. Paste or upload HTML and download clean Markdown output.",
    h1: "HTML to Markdown Converter",
    intro:
      "Turn common HTML structures into readable Markdown while treating input as untrusted data.",
    convertHeading: "Convert HTML to Markdown Online",
    howToHeading: "How to Convert HTML to Markdown",
    featuresHeading: "HTML to Markdown Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert HTML to MD",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is HTML to Markdown Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Is uploaded HTML executed?",
        answer:
          "No. HTML is treated as untrusted data and converted to Markdown without running scripts.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["HTML"],
    outputFormats: ["MD"],
  }),
  tool({
    id: "markdown-to-pdf",
    name: "Markdown to PDF Converter",
    slug: "markdown-to-pdf",
    category: "document-data-tools",
    description: "Convert Markdown documents into PDF files.",
    shortDescription: "Convert Markdown to PDF.",
    icon: "text",
    keywords: ["markdown to pdf", "md to pdf", "convert markdown to pdf"],
    popular: true,
    new: true,
    supportedFormats: ["MD", "Markdown", "PDF"],
    relatedToolIds: [
      "markdown-to-html",
      "html-to-markdown",
      "txt-to-pdf",
      "docx-to-pdf",
    ],
    seoTitle: "Markdown to PDF Converter — Free Online | Tool Base",
    seoDescription:
      "Convert Markdown to PDF online with Tool Base. Render Markdown content into a downloadable PDF document.",
    h1: "Markdown to PDF Converter",
    intro:
      "Generate a PDF from Markdown headings, lists, code, and paragraphs.",
    convertHeading: "Convert Markdown to PDF Online",
    howToHeading: "How to Convert Markdown to PDF",
    featuresHeading: "Markdown to PDF Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Document Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert MD to PDF",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload Your File",
        description: "Choose the source document.",
      },
      {
        title: "Convert Your Document",
        description: "Generate the output format.",
      },
      {
        title: "Download Your File",
        description: "Save the converted document.",
      },
    ],
    faq: [
      {
        question: "Is Markdown to PDF Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["MD", "Markdown"],
    outputFormats: ["PDF"],
  }),
  tool({
    id: "csv-to-json",
    name: "CSV to JSON Converter",
    slug: "csv-to-json",
    category: "document-data-tools",
    description: "Convert CSV tabular data into JSON.",
    shortDescription: "Convert CSV files to JSON.",
    icon: "text",
    keywords: ["csv to json", "csv json converter", "convert csv to json"],
    popular: true,
    new: false,
    supportedFormats: ["CSV", "JSON"],
    relatedToolIds: [
      "json-to-csv",
      "csv-to-xml",
      "tsv-to-csv",
      "json-to-xml",
      "xml-to-json",
    ],
    seoTitle: "CSV to JSON Converter — Free Online | Tool Base",
    seoDescription:
      "Convert CSV data to valid JSON online. Upload or paste your CSV, convert it instantly, then copy or download the resulting JSON.",
    h1: "CSV to JSON Converter",
    intro:
      "Turn CSV rows into a JSON array of objects using the header row as property names.",
    convertHeading: "Convert CSV Data to JSON",
    howToHeading: "How to Convert CSV to JSON",
    featuresHeading: "CSV to JSON Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert CSV to JSON",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste CSV",
        description: "Provide CSV with a header row.",
      },
      {
        title: "Convert Your Data",
        description: "Turn rows into JSON objects.",
      },
      {
        title: "Copy or Download JSON",
        description: "Use the JSON in your app or save it.",
      },
    ],
    faq: [
      {
        question: "Is CSV to JSON Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Are quoted commas supported?",
        answer:
          "Yes. The converter parses standard CSV quoting so commas inside quoted fields stay in the same value.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["CSV"],
    outputFormats: ["JSON"],
  }),
  tool({
    id: "json-to-csv",
    name: "JSON to CSV Converter",
    slug: "json-to-csv",
    category: "document-data-tools",
    description: "Convert JSON arrays of objects into CSV.",
    shortDescription: "Convert JSON files to CSV.",
    icon: "text",
    keywords: ["json to csv", "convert json to csv", "json csv converter"],
    popular: true,
    new: false,
    supportedFormats: ["CSV", "JSON"],
    relatedToolIds: [
      "csv-to-json",
      "csv-to-xml",
      "json-to-xml",
      "json-to-yaml",
    ],
    seoTitle: "JSON to CSV Converter — Free Online | Tool Base",
    seoDescription:
      "Convert JSON to CSV online with Tool Base. Transform arrays of objects into properly escaped CSV files.",
    h1: "JSON to CSV Converter",
    intro:
      "Convert tabular JSON arrays into CSV with correct quoting for commas and newlines.",
    convertHeading: "Convert JSON to CSV Online",
    howToHeading: "How to Convert JSON to CSV",
    featuresHeading: "JSON to CSV Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert JSON to CSV",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is JSON to CSV Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "What JSON shape is required?",
        answer:
          "Use an array of objects. Nested objects are stringified into CSV cells so the table stays valid.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["JSON"],
    outputFormats: ["CSV"],
  }),
  tool({
    id: "csv-to-xml",
    name: "CSV to XML Converter",
    slug: "csv-to-xml",
    category: "document-data-tools",
    description: "Convert CSV rows into structured XML.",
    shortDescription: "Convert CSV files to XML.",
    icon: "text",
    keywords: ["csv to xml", "convert csv to xml", "csv xml converter"],
    popular: false,
    new: true,
    supportedFormats: ["CSV", "XML"],
    relatedToolIds: ["csv-to-json", "xml-to-json", "json-to-xml", "tsv-to-csv"],
    seoTitle: "CSV to XML Converter — Free Online | Tool Base",
    seoDescription:
      "Convert CSV to XML online with Tool Base. Generate well-formed XML records from tabular CSV data.",
    h1: "CSV to XML Converter",
    intro:
      "Map CSV headers and rows into nested XML elements for interchange and storage.",
    convertHeading: "Convert CSV to XML Online",
    howToHeading: "How to Convert CSV to XML",
    featuresHeading: "CSV to XML Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert CSV to XML",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is CSV to XML Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["CSV"],
    outputFormats: ["XML"],
  }),
  tool({
    id: "xml-to-json",
    name: "XML to JSON Converter",
    slug: "xml-to-json",
    category: "document-data-tools",
    description: "Convert XML documents into JSON.",
    shortDescription: "Convert XML files to JSON.",
    icon: "text",
    keywords: ["xml to json", "convert xml to json", "xml json converter"],
    popular: true,
    new: false,
    supportedFormats: ["JSON", "XML"],
    relatedToolIds: [
      "json-to-xml",
      "csv-to-json",
      "yaml-to-json",
      "json-to-yaml",
    ],
    seoTitle: "XML to JSON Converter — Free Online | Tool Base",
    seoDescription:
      "Convert XML to JSON online with Tool Base. Parse XML safely and download structured JSON output.",
    h1: "XML to JSON Converter",
    intro:
      "Convert nested XML elements and attributes into JSON objects and arrays.",
    convertHeading: "Convert XML to JSON Online",
    howToHeading: "How to Convert XML to JSON",
    featuresHeading: "XML to JSON Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert XML to JSON",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is XML to JSON Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["XML"],
    outputFormats: ["JSON"],
  }),
  tool({
    id: "json-to-xml",
    name: "JSON to XML Converter",
    slug: "json-to-xml",
    category: "document-data-tools",
    description: "Convert JSON data into well-formed XML.",
    shortDescription: "Convert JSON files to XML.",
    icon: "text",
    keywords: ["json to xml", "convert json to xml", "json xml converter"],
    popular: false,
    new: false,
    supportedFormats: ["JSON", "XML"],
    relatedToolIds: [
      "xml-to-json",
      "json-to-csv",
      "json-to-yaml",
      "csv-to-xml",
    ],
    seoTitle: "JSON to XML Converter — Free Online | Tool Base",
    seoDescription:
      "Convert JSON to XML online with Tool Base. Transform objects and arrays into well-formed XML.",
    h1: "JSON to XML Converter",
    intro:
      "Generate XML from nested JSON structures with clear array handling.",
    convertHeading: "Convert JSON to XML Online",
    howToHeading: "How to Convert JSON to XML",
    featuresHeading: "JSON to XML Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert JSON to XML",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is JSON to XML Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["JSON"],
    outputFormats: ["XML"],
  }),
  tool({
    id: "txt-to-csv",
    name: "TXT to CSV Converter",
    slug: "txt-to-csv",
    category: "document-data-tools",
    description: "Convert delimited text lines into CSV.",
    shortDescription: "Convert TXT files to CSV.",
    icon: "text",
    keywords: ["txt to csv", "text to csv", "convert txt to csv"],
    popular: false,
    new: true,
    supportedFormats: ["CSV", "TXT"],
    relatedToolIds: ["csv-to-tsv", "tsv-to-csv", "csv-to-json", "txt-to-docx"],
    seoTitle: "TXT to CSV Converter — Free Online | Tool Base",
    seoDescription:
      "Convert TXT to CSV online with Tool Base. Split lines with a delimiter and download a CSV file.",
    h1: "TXT to CSV Converter",
    intro:
      "Turn plain text lines into CSV using a simple delimiter you control.",
    convertHeading: "Convert TXT to CSV Online",
    howToHeading: "How to Convert TXT to CSV",
    featuresHeading: "TXT to CSV Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert TXT to CSV",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is TXT to CSV Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["TXT"],
    outputFormats: ["CSV"],
  }),
  tool({
    id: "csv-to-tsv",
    name: "CSV to TSV Converter",
    slug: "csv-to-tsv",
    category: "document-data-tools",
    description: "Convert CSV files into tab-separated values.",
    shortDescription: "Convert CSV files to TSV.",
    icon: "text",
    keywords: ["csv to tsv", "convert csv to tsv", "csv tsv converter"],
    popular: false,
    new: false,
    supportedFormats: ["CSV", "TSV"],
    relatedToolIds: ["tsv-to-csv", "csv-to-json", "txt-to-csv", "json-to-csv"],
    seoTitle: "CSV to TSV Converter — Free Online | Tool Base",
    seoDescription:
      "Convert CSV to TSV online with Tool Base. Parse quoted CSV fields and download tab-separated output.",
    h1: "CSV to TSV Converter",
    intro:
      "Transform comma-separated values into tab-separated values without losing field boundaries.",
    convertHeading: "Convert CSV to TSV Online",
    howToHeading: "How to Convert CSV to TSV",
    featuresHeading: "CSV to TSV Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert CSV to TSV",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is CSV to TSV Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["CSV"],
    outputFormats: ["TSV"],
  }),
  tool({
    id: "tsv-to-csv",
    name: "TSV to CSV Converter",
    slug: "tsv-to-csv",
    category: "document-data-tools",
    description: "Convert TSV files into properly escaped CSV.",
    shortDescription: "Convert TSV files to CSV.",
    icon: "text",
    keywords: ["tsv to csv", "convert tsv to csv", "tsv csv converter"],
    popular: false,
    new: false,
    supportedFormats: ["CSV", "TSV"],
    relatedToolIds: ["csv-to-tsv", "csv-to-json", "txt-to-csv", "json-to-csv"],
    seoTitle: "TSV to CSV Converter — Free Online | Tool Base",
    seoDescription:
      "Convert TSV to CSV online with Tool Base. Parse tab-separated values and download escaped CSV output.",
    h1: "TSV to CSV Converter",
    intro:
      "Turn tab-separated data into CSV with correct comma and quote escaping.",
    convertHeading: "Convert TSV to CSV Online",
    howToHeading: "How to Convert TSV to CSV",
    featuresHeading: "TSV to CSV Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert TSV to CSV",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is TSV to CSV Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["TSV"],
    outputFormats: ["CSV"],
  }),
  tool({
    id: "yaml-to-json",
    name: "YAML to JSON Converter",
    slug: "yaml-to-json",
    category: "document-data-tools",
    description: "Convert YAML configuration data into JSON.",
    shortDescription: "Convert YAML files to JSON.",
    icon: "text",
    keywords: [
      "yaml to json",
      "yml to json",
      "convert yaml to json",
      "yaml json converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["JSON", "YAML", "YML"],
    relatedToolIds: [
      "json-to-yaml",
      "xml-to-json",
      "json-to-xml",
      "csv-to-json",
    ],
    seoTitle: "YAML to JSON Converter — Free Online | Tool Base",
    seoDescription:
      "Convert YAML to JSON online with Tool Base. Parse YAML structures and download valid JSON.",
    h1: "YAML to JSON Converter",
    intro:
      "Convert YAML objects, arrays, and scalars into JSON for APIs and apps.",
    convertHeading: "Convert YAML to JSON Online",
    howToHeading: "How to Convert YAML to JSON",
    featuresHeading: "YAML to JSON Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert YAML to JSON",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is YAML to JSON Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["YAML", "YML"],
    outputFormats: ["JSON"],
  }),
  tool({
    id: "json-to-yaml",
    name: "JSON to YAML Converter",
    slug: "json-to-yaml",
    category: "document-data-tools",
    description: "Convert JSON data into readable YAML.",
    shortDescription: "Convert JSON files to YAML.",
    icon: "text",
    keywords: ["json to yaml", "convert json to yaml", "json yaml converter"],
    popular: true,
    new: false,
    supportedFormats: ["JSON", "YAML"],
    relatedToolIds: [
      "yaml-to-json",
      "json-to-xml",
      "json-to-csv",
      "xml-to-json",
    ],
    seoTitle: "JSON to YAML Converter — Free Online | Tool Base",
    seoDescription:
      "Convert JSON to YAML online with Tool Base. Validate JSON first, then copy or download clean YAML.",
    h1: "JSON to YAML Converter",
    intro:
      "Turn JSON objects and arrays into readable YAML for configuration files.",
    convertHeading: "Convert JSON to YAML Online",
    howToHeading: "How to Convert JSON to YAML",
    featuresHeading: "JSON to YAML Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Data Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Convert JSON to YAML",
      "Upload or paste input where supported",
      "Clear convert → result → download flow",
      "No account required",
      "Mobile-friendly workspace",
    ],
    howToSteps: [
      {
        title: "Upload or Paste Input",
        description: "Provide the source file or text for conversion.",
      },
      {
        title: "Convert Your Data",
        description: "Start conversion and wait for processing to finish.",
      },
      {
        title: "Copy or Download",
        description: "Copy text output or download the converted file.",
      },
    ],
    faq: [
      {
        question: "Is JSON to YAML Converter free?",
        answer:
          "Yes. Tool Base converters are free to use and do not require an account.",
      },
      {
        question: "Will my formatting stay perfect?",
        answer:
          "Supported content is converted as accurately as practical. Complex layouts may be simplified depending on the formats involved.",
      },
      {
        question: "What if conversion fails?",
        answer:
          "Check that the file is valid and not empty or corrupted, then try again with another file.",
      },
    ],
    inputFormats: ["JSON"],
    outputFormats: ["YAML"],
  }),
];
