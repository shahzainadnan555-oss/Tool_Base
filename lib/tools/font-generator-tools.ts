import { fontStyles } from "@/lib/font-generator";
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

export const fontGeneratorTools: ToolDefinition[] = [
  tool({
    id: "font-generator",
    name: "Font Generator",
    slug: "font-generator",
    category: "design-creative",
    description:
      "Turn ordinary text into stylish Unicode fonts you can copy and paste into social posts, bios, messages, and designs. Browse bold, script, bubble, aesthetic, and dozens more original Tool Base styles.",
    shortDescription: "Create stylish Unicode text fonts to copy and paste.",
    icon: "text",
    keywords: [
      "font generator",
      "fonts",
      "fancy font",
      "cool font",
      "text font",
      "stylish text",
      "fancy text",
      "unicode text",
      "text generator",
      "cool text styles",
      "bubble text",
      "cursive text",
    ],
    aliases: ["fancy text generator", "unicode font generator", "cool text generator"],
    popular: true,
    new: true,
    supportedFormats: ["Unicode text styles"],
    relatedToolIds: [
      "text-case-converter",
      "text-to-image",
      "random-string-generator",
      "username-generator",
      "character-counter",
      "word-counter",
      "typing-speed-test",
    ],
    seoTitle: "Font Generator – Cool Fancy Text Styles | Tool Base",
    seoDescription:
      "Generate stylish Unicode text fonts with Tool Base. Type once, preview bold, script, bubble, aesthetic, and more, then copy any style for social media or messages.",
    h1: "Font Generator",
    intro:
      "Type or paste your text and explore a large library of original Unicode text styles. Previews update instantly, favorites and recent copies stay on your device, and every Copy action places real styled text on your clipboard—not a font file download.",
    convertHeading: "Create Stylish Text",
    howToHeading: "How to Use the Font Generator",
    featuresHeading: "Font Generator Features",
    relatedToolsHeading: "Related Text & Creative Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      `${fontStyles.length}+ original Unicode text styles`,
      "Instant live previews as you type",
      "One-tap copy with clear feedback",
      "Favorites and recent history saved locally",
      "Category filters and style search",
      "Preview size control that never changes copied text",
      "Safe fallbacks for unsupported characters and emoji",
    ],
    howToSteps: [
      {
        title: "Enter your text",
        description: "Type or paste into the input. Style previews update as you go.",
      },
      {
        title: "Browse the styles",
        description: "Filter by category, search by name, or open Favorites and Recent.",
      },
      {
        title: "Choose a style",
        description: "Scan the preview cards until you find a look that fits your message.",
      },
      {
        title: "Copy it",
        description: "Tap Copy or the preview itself. Tool Base places the Unicode text on your clipboard.",
      },
      {
        title: "Paste it wherever you need",
        description: "Use the styled text in bios, captions, chats, documents, and more.",
      },
    ],
    faq: [
      {
        question: "What is a fancy font generator?",
        answer:
          "It is a tool that transforms normal letters into lookalike Unicode characters so your text appears bold, cursive, bubbled, or decorative when pasted into apps that support those symbols.",
      },
      {
        question: "How do these stylish text styles work?",
        answer:
          "Each style maps supported letters and digits to Unicode equivalents or carefully applied combining marks. Characters without a safe mapping stay unchanged.",
      },
      {
        question: "Can I copy and paste the generated text?",
        answer:
          "Yes. Use the Copy button on any style card. The clipboard receives the actual transformed Unicode string.",
      },
      {
        question: "Can I use the generated text on social media?",
        answer:
          "Usually yes, in places that accept Unicode. Support varies by platform, font, and device.",
      },
      {
        question: "Why do some characters remain unchanged?",
        answer:
          "Not every letter, accent, or symbol has a reliable styled equivalent. Tool Base keeps the original character instead of inserting broken placeholders.",
      },
      {
        question: "Are these actual font files?",
        answer:
          "No. The Font Generator creates Unicode text transformations you can copy and paste. It does not produce downloadable .ttf or .otf font files.",
      },
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Unicode styled text"],
    examples: [
      {
        title: "Bold social bio",
        input: "Hello World",
        output: "Mathematical bold Unicode letters for Hello World",
      },
      {
        title: "Bubble caption",
        input: "New drop",
        output: "Circled / bubble-style Unicode letters",
      },
    ],
    tips: [
      "Favorite styles you reuse often — they stay in your browser only.",
      "Preview size changes how cards look, not what gets copied.",
      "For screen-reader clarity, keep an ordinary text version of important messages.",
    ],
  }),
];

export function isFontGeneratorSlug(slug: string): boolean {
  return slug === "font-generator";
}
