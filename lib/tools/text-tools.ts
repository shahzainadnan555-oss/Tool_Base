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

/** Text utilities — Prompt 8 */
export const textTools: ToolDefinition[] = [
  tool({
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    category: "text-tools",
    description:
      "Count words, characters, sentences, paragraphs, and estimated reading time as you type.",
    shortDescription: "Count words, characters, and more.",
    icon: "text",
    keywords: [
      "word counter",
      "count words",
      "online word counter",
      "word count tool",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "character-counter",
      "sentence-counter",
      "paragraph-counter",
      "reading-time-calculator",
      "text-cleaner",
    ],
    seoTitle: "Word Counter — Count Words & Characters Online | ToolMyra",
    seoDescription:
      "Count words, characters, sentences, paragraphs, and estimated reading time with ToolMyra’s free online Word Counter.",
    h1: "Word Counter",
    intro:
      "Paste or type your text to instantly count words, characters, sentences, paragraphs, and estimated reading time.",
    convertHeading: "Count Words and Characters Online",
    howToHeading: "How to Use the Word Counter",
    featuresHeading: "Word Counter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Live word and character counts",
      "Sentence and paragraph totals",
      "Estimated reading time",
      "Copy and download support",
      "Works with Unicode text",
    ],
    howToSteps: [
      {
        title: "Paste or Type Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Review Your Text Statistics",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy or Download Your Text",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Does the Word Counter store my text?",
        answer: "No. Counting runs session for this tool.",
      },
      {
        question: "Are character counts Unicode-aware?",
        answer:
          "Yes. Counts use sensible grapheme-aware behavior where supported.",
      },
      {
        question: "Is reading time exact?",
        answer:
          "No. Reading time is an estimate based on average reading speed.",
      },
      {
        question: "Can I download my text?",
        answer: "Yes. Use Download TXT when you want a plain-text file.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "character-counter",
    name: "Character Counter",
    slug: "character-counter",
    category: "text-tools",
    description:
      "Count characters, characters without spaces, words, and lines as you type.",
    shortDescription: "Count characters with or without spaces.",
    icon: "text",
    keywords: ["character counter", "count characters", "character count"],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "word-counter",
      "sentence-counter",
      "paragraph-counter",
      "text-cleaner",
      "text-case-converter",
    ],
    seoTitle: "Character Counter — Count Characters Online | ToolMyra",
    seoDescription:
      "Count characters online with ToolMyra. See characters with and without spaces, plus words and lines.",
    h1: "Character Counter",
    intro:
      "Track character counts for captions, bios, and form limits. Counts update live and handle Unicode text carefully.",
    convertHeading: "Count Characters Online",
    howToHeading: "How to Use the Character Counter",
    featuresHeading: "Character Counter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Live character counts",
      "Characters excluding spaces",
      "Word and line totals",
      "Unicode-aware counting",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Paste or Type Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Review Character Totals",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy or Download Your Text",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Do spaces count?",
        answer: "Yes. You can view characters with spaces and without spaces.",
      },
      {
        question: "Do emojis count as one character?",
        answer:
          "Where supported, grapheme-aware counting treats common emojis as single characters.",
      },
      {
        question: "Is counting live?",
        answer: "Yes. Totals update as you type or paste.",
      },
      {
        question: "Private?",
        answer: "Yes. Your text stays session.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "sentence-counter",
    name: "Sentence Counter",
    slug: "sentence-counter",
    category: "text-tools",
    description:
      "Count sentences with a sensible punctuation heuristic and see related text statistics.",
    shortDescription: "Count sentences in your text.",
    icon: "text",
    keywords: ["sentence counter", "count sentences", "sentence count tool"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "word-counter",
      "paragraph-counter",
      "character-counter",
      "reading-time-calculator",
      "text-cleaner",
    ],
    seoTitle: "Sentence Counter — Count Sentences Online | ToolMyra",
    seoDescription:
      "Count sentences online with ToolMyra. Review sentence totals alongside words and paragraphs.",
    h1: "Sentence Counter",
    intro:
      "Estimate how many sentences are in your draft. Detection is heuristic, so abbreviations like Mr. or e.g. are handled carefully where possible.",
    convertHeading: "Count Sentences Online",
    howToHeading: "How to Use the Sentence Counter",
    featuresHeading: "Sentence Counter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Heuristic sentence detection",
      "Live statistics",
      "Related word and paragraph counts",
      "Clear estimate labeling",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Paste or Type Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Review Sentence Totals",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy or Download Your Text",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is sentence counting exact?",
        answer: "No. It is heuristic and may not match every writing style.",
      },
      {
        question: "How are abbreviations handled?",
        answer:
          "Common abbreviations are softened so they are less likely to split sentences.",
      },
      {
        question: "Does punctuation matter?",
        answer:
          "Yes. Periods, question marks, and exclamation points are primary boundaries.",
      },
      {
        question: "Private?",
        answer: "Yes. Processing stays.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "paragraph-counter",
    name: "Paragraph Counter",
    slug: "paragraph-counter",
    category: "text-tools",
    description:
      "Count paragraphs using consistent blank-line boundaries and review related stats.",
    shortDescription: "Count paragraphs in your text.",
    icon: "text",
    keywords: ["paragraph counter", "count paragraphs", "paragraph count"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "word-counter",
      "sentence-counter",
      "character-counter",
      "text-cleaner",
      "remove-extra-spaces",
    ],
    seoTitle: "Paragraph Counter — Count Paragraphs Online | ToolMyra",
    seoDescription:
      "Count paragraphs online with ToolMyra. See paragraph totals based on consistent text boundaries.",
    h1: "Paragraph Counter",
    intro:
      "Count paragraphs in essays, articles, and pasted documents. Blank-line boundaries are treated consistently across newline styles.",
    convertHeading: "Count Paragraphs Online",
    howToHeading: "How to Use the Paragraph Counter",
    featuresHeading: "Paragraph Counter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Consistent paragraph boundaries",
      "Live totals",
      "Works with pasted formatting",
      "Related text statistics",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Paste or Type Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Review Paragraph Totals",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy or Download Your Text",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "How is a paragraph defined?",
        answer:
          "Paragraphs are split on blank-line boundaries after normalizing newline styles.",
      },
      {
        question: "Do single-line blocks count?",
        answer:
          "Yes. Non-empty blocks separated by blank lines count as paragraphs.",
      },
      {
        question: "Is counting live?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes. Your text stays.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "reading-time-calculator",
    name: "Reading Time Calculator",
    slug: "reading-time-calculator",
    category: "text-tools",
    description:
      "Estimate reading time from word count with an adjustable words-per-minute speed.",
    shortDescription: "Estimate reading time from word count.",
    icon: "text",
    keywords: [
      "reading time calculator",
      "estimate reading time",
      "words per minute",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "word-counter",
      "character-counter",
      "sentence-counter",
      "paragraph-counter",
      "text-cleaner",
    ],
    seoTitle: "Reading Time Calculator — Estimate Reading Time | ToolMyra",
    seoDescription:
      "Estimate reading time online with ToolMyra. Adjust reading speed and see an estimated duration for your text.",
    h1: "Reading Time Calculator",
    intro:
      "Estimate how long your content may take to read. Choose a reading speed in words per minute — results are clearly labeled as estimates.",
    convertHeading: "Estimate Reading Time Online",
    howToHeading: "How to Use the Reading Time Calculator",
    featuresHeading: "Reading Time Calculator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Adjustable words-per-minute speed",
      "Live estimate",
      "Based on actual word count",
      "Clear estimate labeling",
      "Copy and download text",
    ],
    howToSteps: [
      {
        title: "Paste or Type Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Choose Reading Speed",
        description: "Review the live result or run the action.",
      },
      {
        title: "Review Estimated Time",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is reading time exact?",
        answer: "No. It is an estimate based on average reading speed.",
      },
      {
        question: "Can I change the speed?",
        answer: "Yes. Adjust words per minute to match your audience.",
      },
      {
        question: "What if the text is empty?",
        answer: "Reading time shows 0 minutes until words are present.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "text-case-converter",
    name: "Text Case Converter",
    slug: "text-case-converter",
    category: "text-tools",
    description:
      "Convert text to uppercase, lowercase, title case, sentence case, and more.",
    shortDescription: "Convert text between letter cases.",
    icon: "text",
    keywords: [
      "text case converter",
      "change text case",
      "uppercase lowercase converter",
    ],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "uppercase-converter",
      "lowercase-converter",
      "title-case-converter",
      "sentence-case-converter",
      "text-cleaner",
    ],
    seoTitle: "Text Case Converter — Change Text Case Online | ToolMyra",
    seoDescription:
      "Convert text to uppercase, lowercase, title case, sentence case, and other formats with ToolMyra.",
    h1: "Text Case Converter",
    intro:
      "Change letter casing for headlines, captions, and drafts. Choose a case style and copy or download the result.",
    convertHeading: "Convert Text to Different Letter Cases",
    howToHeading: "How to Change Text Case",
    featuresHeading: "Text Case Converter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Multiple case styles",
      "Live conversion",
      "Copy and download",
      "Unicode-friendly casing",
      "Clear input and output",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Choose a Case",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Your Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Which cases are supported?",
        answer:
          "UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Case, alternating, and inverse.",
      },
      {
        question: "Are line breaks kept?",
        answer: "Yes. Line breaks are preserved where practical.",
      },
      {
        question: "Is conversion live?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "uppercase-converter",
    name: "Uppercase Converter",
    slug: "uppercase-converter",
    category: "text-tools",
    description:
      "Convert any text to uppercase instantly while preserving line breaks.",
    shortDescription: "Convert text to UPPERCASE.",
    icon: "text",
    keywords: [
      "uppercase converter",
      "convert to uppercase",
      "all caps converter",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "lowercase-converter",
      "text-case-converter",
      "title-case-converter",
      "sentence-case-converter",
      "text-cleaner",
    ],
    seoTitle: "Uppercase Converter — Convert Text to UPPERCASE | ToolMyra",
    seoDescription:
      "Convert text to uppercase online with ToolMyra. Instant UPPERCASE conversion with copy and download.",
    h1: "Uppercase Converter",
    intro:
      "Turn any draft into uppercase in one step. Line breaks stay in place so formatted text remains readable.",
    convertHeading: "Convert Text to Uppercase",
    howToHeading: "How to Convert Text to Uppercase",
    featuresHeading: "Uppercase Converter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Instant uppercase conversion",
      "Preserves line breaks",
      "Copy and download",
      "Live updates",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Convert to Uppercase",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Your Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is it instant?",
        answer: "Yes. Output updates as you type.",
      },
      {
        question: "Are spaces preserved?",
        answer: "Yes.",
      },
      {
        question: "Unicode support?",
        answer: "Yes. Locale-aware casing is used where available.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "lowercase-converter",
    name: "Lowercase Converter",
    slug: "lowercase-converter",
    category: "text-tools",
    description:
      "Convert any text to lowercase instantly while preserving spacing and line breaks.",
    shortDescription: "Convert text to lowercase.",
    icon: "text",
    keywords: [
      "lowercase converter",
      "convert to lowercase",
      "all lowercase tool",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "uppercase-converter",
      "text-case-converter",
      "title-case-converter",
      "sentence-case-converter",
      "text-cleaner",
    ],
    seoTitle: "Lowercase Converter — Convert Text to lowercase | ToolMyra",
    seoDescription:
      "Convert text to lowercase online with ToolMyra. Instant lowercase conversion with copy and download.",
    h1: "Lowercase Converter",
    intro:
      "Normalize shouting text or mixed casing into lowercase while keeping your line structure intact.",
    convertHeading: "Convert Text to Lowercase",
    howToHeading: "How to Convert Text to Lowercase",
    featuresHeading: "Lowercase Converter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Instant lowercase conversion",
      "Preserves spacing and breaks",
      "Copy and download",
      "Live updates",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Convert to Lowercase",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Your Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Does punctuation stay?",
        answer: "Yes. Only letter casing changes.",
      },
      {
        question: "Is it live?",
        answer: "Yes.",
      },
      {
        question: "Unicode support?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "title-case-converter",
    name: "Title Case Converter",
    slug: "title-case-converter",
    category: "text-tools",
    description:
      "Convert text into title-style capitalization with sensible handling for common short words.",
    shortDescription: "Convert text to Title Case.",
    icon: "text",
    keywords: [
      "title case converter",
      "convert to title case",
      "headline case",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "sentence-case-converter",
      "text-case-converter",
      "uppercase-converter",
      "lowercase-converter",
      "text-cleaner",
    ],
    seoTitle: "Title Case Converter — Convert Text to Title Case | ToolMyra",
    seoDescription:
      "Convert text to title case online with ToolMyra. Create headline-style capitalization quickly.",
    h1: "Title Case Converter",
    intro:
      "Create title-style headings with predictable capitalization. Common short words can remain lowercase except at the start.",
    convertHeading: "Convert Text to Title Case",
    howToHeading: "How to Convert Text to Title Case",
    featuresHeading: "Title Case Converter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Predictable title-case rules",
      "Sensible short-word handling",
      "Live conversion",
      "Copy and download",
      "Unicode-friendly",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Convert to Title Case",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Your Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Are all words capitalized?",
        answer:
          "Not always. Common short words may stay lowercase except at the start.",
      },
      {
        question: "Is behavior predictable?",
        answer: "Yes. The same rules apply each time.",
      },
      {
        question: "Can I copy the result?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "sentence-case-converter",
    name: "Sentence Case Converter",
    slug: "sentence-case-converter",
    category: "text-tools",
    description:
      "Convert text into sentence case with appropriate capitalization after punctuation.",
    shortDescription: "Convert text to sentence case.",
    icon: "text",
    keywords: ["sentence case converter", "convert to sentence case"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "title-case-converter",
      "text-case-converter",
      "uppercase-converter",
      "lowercase-converter",
      "text-cleaner",
    ],
    seoTitle: "Sentence Case Converter — Convert to Sentence Case | ToolMyra",
    seoDescription:
      "Convert text to sentence case online with ToolMyra. Capitalize sentences cleanly and copy the result.",
    h1: "Sentence Case Converter",
    intro:
      "Normalize drafts into sentence case. Letters are lowercased and sentence starts are capitalized after punctuation where detected.",
    convertHeading: "Convert Text to Sentence Case",
    howToHeading: "How to Convert Text to Sentence Case",
    featuresHeading: "Sentence Case Converter Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Sentence-start capitalization",
      "Preserves line breaks where practical",
      "Live conversion",
      "Copy and download",
      "Unicode letter support",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Convert to Sentence Case",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Your Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Does it remove punctuation?",
        answer: "No. Punctuation is preserved.",
      },
      {
        question: "How are new sentences detected?",
        answer:
          "After punctuation like periods, question marks, and exclamation points.",
      },
      {
        question: "Is it live?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    slug: "remove-extra-spaces",
    category: "text-tools",
    description:
      "Remove repeated spaces and trim line whitespace while preserving paragraph structure by default.",
    shortDescription: "Clean repeated whitespace from text.",
    icon: "text",
    keywords: ["remove extra spaces", "trim whitespace", "clean spaces online"],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "text-cleaner",
      "remove-duplicate-lines",
      "sort-lines",
      "word-counter",
      "find-and-replace",
    ],
    seoTitle: "Remove Extra Spaces — Clean Whitespace Online | ToolMyra",
    seoDescription:
      "Remove extra spaces online with ToolMyra. Collapse repeated whitespace and trim lines cleanly.",
    h1: "Remove Extra Spaces",
    intro:
      "Clean up messy pasted text by collapsing repeated spaces and trimming line whitespace. Paragraph structure stays intact unless you choose stronger cleanup.",
    convertHeading: "Remove Extra Spaces Online",
    howToHeading: "How to Remove Extra Spaces",
    featuresHeading: "Remove Extra Spaces Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Collapse repeated spaces",
      "Trim line whitespace",
      "Preserve paragraphs by default",
      "Live preview",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Paste Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Choose Cleanup Options",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Clean Text",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Will paragraphs disappear?",
        answer: "Defaults keep paragraph structure while cleaning spaces.",
      },
      {
        question: "Can I trim lines only?",
        answer: "Yes. Toggle collapse and trim options.",
      },
      {
        question: "Is it live?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    slug: "remove-duplicate-lines",
    category: "text-tools",
    description:
      "Remove duplicate lines while preserving first or last occurrence with optional case sensitivity.",
    shortDescription: "Remove repeated lines from a list.",
    icon: "text",
    keywords: [
      "remove duplicate lines",
      "delete duplicate lines",
      "unique lines tool",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "sort-lines",
      "text-cleaner",
      "find-and-replace",
      "text-diff-checker",
      "remove-extra-spaces",
    ],
    seoTitle: "Remove Duplicate Lines — Unique Lines Online | ToolMyra",
    seoDescription:
      "Remove duplicate lines online with ToolMyra. Keep first occurrences and optionally ignore case.",
    h1: "Remove Duplicate Lines",
    intro:
      "Clean lists by removing repeated lines. Choose case sensitivity and whether to keep the first occurrence.",
    convertHeading: "Remove Duplicate Lines Online",
    howToHeading: "How to Remove Duplicate Lines",
    featuresHeading: "Remove Duplicate Lines Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Preserve first occurrence by default",
      "Optional case sensitivity",
      "Blank lines kept unless chosen otherwise",
      "Live result",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Paste Your Lines",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Choose Options",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Unique Lines",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Are blank lines removed?",
        answer: "Not by default.",
      },
      {
        question: "Can I ignore case?",
        answer: "Yes. Turn off case-sensitive matching.",
      },
      {
        question: "Order preserved?",
        answer: "Yes when preserving first occurrence.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "sort-lines",
    name: "Sort Lines Alphabetically",
    slug: "sort-lines",
    category: "text-tools",
    description:
      "Sort lines alphabetically with optional numeric order, case sensitivity, and whitespace handling.",
    shortDescription: "Sort lines A–Z or Z–A.",
    icon: "text",
    keywords: [
      "sort lines",
      "sort lines alphabetically",
      "alphabetical sort text",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "remove-duplicate-lines",
      "text-cleaner",
      "find-and-replace",
      "text-diff-checker",
      "reverse-text",
    ],
    seoTitle: "Sort Lines Alphabetically — A–Z & Z–A Online | ToolMyra",
    seoDescription:
      "Sort lines alphabetically online with ToolMyra. Sort A to Z or Z to A with optional numeric order.",
    h1: "Sort Lines Alphabetically",
    intro:
      "Sort lists and line-based text A→Z or Z→A. Optional numeric sorting helps when lines start with numbers.",
    convertHeading: "Sort Lines Online",
    howToHeading: "How to Sort Lines Alphabetically",
    featuresHeading: "Sort Lines Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "A→Z and Z→A",
      "Optional numeric order",
      "Case-sensitive option",
      "Ignore leading whitespace",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Paste Your Lines",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Choose Sort Options",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Sorted Lines",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Does sorting change line contents?",
        answer: "No. Only order changes.",
      },
      {
        question: "Can numbers sort naturally?",
        answer: "Yes. Enable numeric order.",
      },
      {
        question: "Is blank line order affected?",
        answer: "Blank lines are sorted with the other lines.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "reverse-text",
    name: "Reverse Text",
    slug: "reverse-text",
    category: "text-tools",
    description:
      "Reverse text by grapheme where supported so emojis and combined characters are less likely to break.",
    shortDescription: "Reverse characters in text.",
    icon: "text",
    keywords: ["reverse text", "text reverser", "backwards text"],
    popular: false,
    new: true,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "reverse-words",
      "text-case-converter",
      "text-repeater",
      "text-cleaner",
      "word-counter",
    ],
    seoTitle: "Reverse Text — Flip Characters Online | ToolMyra",
    seoDescription:
      "Reverse text online with ToolMyra. Flip characters carefully with Unicode-aware reversal where supported.",
    h1: "Reverse Text",
    intro:
      "Flip your text from end to start. Grapheme-aware reversal is used where the browser supports it so common emojis are less likely to split.",
    convertHeading: "Reverse Text Online",
    howToHeading: "How to Reverse Text",
    featuresHeading: "Reverse Text Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Unicode-aware reversal where supported",
      "Live updates",
      "Copy and download",
      "Works with emoji text",
      "No account required",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Reverse Characters",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Your Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Will emojis break?",
        answer:
          "Where grapheme segmentation is available, common emojis are reversed as units.",
      },
      {
        question: "Is it live?",
        answer: "Yes.",
      },
      {
        question: "Are line breaks reversed too?",
        answer: "The full text sequence is reversed.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "reverse-words",
    name: "Reverse Words",
    slug: "reverse-words",
    category: "text-tools",
    description:
      "Reverse the order of words while keeping the words themselves intact.",
    shortDescription: "Reverse word order in text.",
    icon: "text",
    keywords: ["reverse words", "reverse word order", "flip words"],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "reverse-text",
      "text-case-converter",
      "sort-lines",
      "text-cleaner",
      "word-counter",
    ],
    seoTitle: "Reverse Words — Flip Word Order Online | ToolMyra",
    seoDescription:
      "Reverse word order online with ToolMyra. Flip words while preserving each word’s spelling.",
    h1: "Reverse Words",
    intro:
      "Keep each word intact and reverse only the order. Useful for quick transformations and playful edits.",
    convertHeading: "Reverse Words Online",
    howToHeading: "How to Reverse Words",
    featuresHeading: "Reverse Words Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Word-order reversal",
      "Preserves word spelling",
      "Live updates",
      "Copy and download",
      "Line-aware processing",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Reverse Word Order",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Your Result",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Do words themselves reverse?",
        answer: "No. Only order changes. Use Reverse Text to flip characters.",
      },
      {
        question: "Is punctuation handled?",
        answer: "Punctuation attached to words stays with those words.",
      },
      {
        question: "Is it live?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "text-repeater",
    name: "Text Repeater",
    slug: "text-repeater",
    category: "text-tools",
    description:
      "Repeat text with a safe maximum count and flexible separators.",
    shortDescription: "Repeat text a set number of times.",
    icon: "text",
    keywords: ["text repeater", "repeat text", "repeat text online"],
    popular: false,
    new: true,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "lorem-ipsum-generator",
      "text-cleaner",
      "reverse-text",
      "word-counter",
      "text-case-converter",
    ],
    seoTitle: "Text Repeater — Repeat Text Online | ToolMyra",
    seoDescription:
      "Repeat text online with ToolMyra. Set a count, choose a separator, and copy the repeated result.",
    h1: "Text Repeater",
    intro:
      "Repeat a phrase or block of text with a protected maximum so large counts do not freeze your browser.",
    convertHeading: "Repeat Text Online",
    howToHeading: "How to Repeat Text",
    featuresHeading: "Text Repeater Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Safe repeat limits",
      "Newline, space, or no separator",
      "Generate on demand",
      "Copy and download",
      "Clear validation",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Set Repeat Count",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Repeated Text",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is there a maximum?",
        answer: "Yes. Repeat count is capped to keep the browser responsive.",
      },
      {
        question: "Can I separate with new lines?",
        answer: "Yes. Choose newline, space, or none.",
      },
      {
        question: "Does it run live?",
        answer: "Click Repeat Text to generate the output.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "text-cleaner",
    name: "Text Cleaner",
    slug: "text-cleaner",
    category: "text-tools",
    description:
      "Clean text with toggles for spaces, trimming, blank lines, and line endings.",
    shortDescription: "Clean whitespace and blank lines.",
    icon: "text",
    keywords: ["text cleaner", "clean text online", "normalize whitespace"],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "remove-extra-spaces",
      "remove-duplicate-lines",
      "find-and-replace",
      "sort-lines",
      "word-counter",
    ],
    seoTitle: "Text Cleaner — Clean & Normalize Text Online | ToolMyra",
    seoDescription:
      "Clean text online with ToolMyra. Trim lines, collapse spaces, and normalize blank lines with clear toggles.",
    h1: "Text Cleaner",
    intro:
      "Tidy pasted content with explicit cleanup options. Nothing destructive runs unless you enable that toggle.",
    convertHeading: "Clean Text Online",
    howToHeading: "How to Clean Text",
    featuresHeading: "Text Cleaner Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Multiple cleanup toggles",
      "No silent destructive defaults beyond basics",
      "Live preview",
      "Copy and download",
      "Works with large pastes",
    ],
    howToSteps: [
      {
        title: "Paste Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Choose Cleanup Options",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy Clean Text",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Will empty lines be removed by default?",
        answer: "No. Enable Remove empty lines if you want that.",
      },
      {
        question: "Can I normalize line endings?",
        answer: "Yes.",
      },
      {
        question: "Is cleanup live?",
        answer: "Yes as you toggle options and edit text.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "find-and-replace",
    name: "Find & Replace Tool",
    slug: "find-and-replace",
    category: "text-tools",
    description:
      "Find and replace plain text with case sensitivity, whole-word matching, and match counts.",
    shortDescription: "Find and replace text safely.",
    icon: "text",
    keywords: ["find and replace", "find replace online", "text replace tool"],
    popular: true,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "text-diff-checker",
      "remove-duplicate-lines",
      "text-cleaner",
      "sort-lines",
      "word-counter",
    ],
    seoTitle: "Find & Replace Tool — Replace Text Online | ToolMyra",
    seoDescription:
      "Find and replace text online with ToolMyra. Replace matches safely and see how many replacements were made.",
    h1: "Find & Replace Tool",
    intro:
      "Search for plain text and replace matches without running user regular expressions. Match counts help you verify the change.",
    convertHeading: "Find and Replace Text Online",
    howToHeading: "How to Find and Replace",
    featuresHeading: "Find & Replace Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Plain-text matching",
      "Optional whole-word mode",
      "Case-sensitive option",
      "Match count display",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Enter Your Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Set Find and Replace",
        description: "Review the live result or run the action.",
      },
      {
        title: "Apply Replacements",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is regex supported?",
        answer:
          "Not in the default mode. Find text is treated as plain text and escaped safely.",
      },
      {
        question: "Can I replace all matches?",
        answer: "Yes. Replace all is available by default.",
      },
      {
        question: "Do I see match counts?",
        answer: "Yes.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "text-diff-checker",
    name: "Text Diff Checker",
    slug: "text-diff-checker",
    category: "text-tools",
    description:
      "Compare original and modified text with accessible added and removed line highlighting.",
    shortDescription: "Compare two texts and highlight changes.",
    icon: "text",
    keywords: [
      "text diff checker",
      "compare two texts",
      "text comparison tool",
    ],
    popular: true,
    new: true,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "find-and-replace",
      "remove-duplicate-lines",
      "sort-lines",
      "text-cleaner",
      "word-counter",
    ],
    seoTitle: "Text Diff Checker — Compare Two Texts Online | ToolMyra",
    seoDescription:
      "Compare two texts online with ToolMyra. Highlight added and removed lines in an accessible diff view.",
    h1: "Text Diff Checker",
    intro:
      "Paste an original version and a modified version to see line-level differences. Added and removed lines are labeled for accessibility, not color alone.",
    convertHeading: "Compare Two Texts Online",
    howToHeading: "How to Compare Texts",
    featuresHeading: "Text Diff Checker Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Two-pane comparison",
      "Added and removed highlighting",
      "Accessible text labels",
      "Copy summary",
      "Safe plain-text rendering",
    ],
    howToSteps: [
      {
        title: "Paste Original Text",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Paste Modified Text",
        description: "Review the live result or run the action.",
      },
      {
        title: "Review Differences",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Is HTML injected from my text?",
        answer: "No. Your text is treated as data and rendered safely.",
      },
      {
        question: "Are differences line-based?",
        answer: "Yes. The checker compares lines.",
      },
      {
        question: "Can I copy a summary?",
        answer: "Yes. Copy exports a +/- summary.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
  tool({
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    category: "text-tools",
    description:
      "Generate Lorem Ipsum paragraphs, sentences, or words from a local word list with safe limits.",
    shortDescription: "Generate placeholder Lorem Ipsum text.",
    icon: "text",
    keywords: [
      "lorem ipsum generator",
      "dummy text generator",
      "placeholder text",
    ],
    popular: false,
    new: false,
    supportedFormats: ["Text"],
    relatedToolIds: [
      "text-repeater",
      "word-counter",
      "text-cleaner",
      "text-case-converter",
      "character-counter",
    ],
    seoTitle: "Lorem Ipsum Generator — Placeholder Text Online | ToolMyra",
    seoDescription:
      "Generate Lorem Ipsum online with ToolMyra. Create paragraphs, sentences, or words for design mockups.",
    h1: "Lorem Ipsum Generator",
    intro:
      "Generate placeholder copy for layouts and prototypes. Content comes from a local word list with generation limits to keep things fast.",
    convertHeading: "Generate Lorem Ipsum Online",
    howToHeading: "How to Generate Lorem Ipsum",
    featuresHeading: "Lorem Ipsum Generator Features",
    supportedFormatsHeading: "Supported Formats",
    relatedToolsHeading: "Related Text Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Paragraphs, sentences, or words",
      "Optional classic opening",
      "Local word list",
      "Safe generation limits",
      "Copy and download",
    ],
    howToSteps: [
      {
        title: "Choose Generation Options",
        description: "Add or generate the text you want to work with.",
      },
      {
        title: "Generate Placeholder Text",
        description: "Review the live result or run the action.",
      },
      {
        title: "Copy or Download",
        description: "Copy or download when you are ready.",
      },
    ],
    faq: [
      {
        question: "Does this fetch external text?",
        answer: "No. Generation uses a local word list.",
      },
      {
        question: "Is there a maximum?",
        answer: "Yes. Counts are capped for responsiveness.",
      },
      {
        question: "Can it start with Lorem ipsum?",
        answer: "Yes. Enable the classic opening option.",
      },
      {
        question: "Private?",
        answer: "Yes.",
      },
    ],
    inputFormats: ["Text"],
    outputFormats: ["Text"],
  }),
];
