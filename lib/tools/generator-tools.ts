import type { ToolDefinition } from "./types";
import { contentGeneratorTools } from "./content-generator-tools";

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

export const generatorTools: ToolDefinition[] = [
  tool({
    id: "temporary-email-generator",
    name: "Temporary Email Generator",
    slug: "temporary-email-generator",
    category: "generators",
    exactPrimaryKeyword: "temporary email generator",
    aliases: [
      "temporary email",
      "temp email generator",
      "random temporary email",
      "disposable email address generator",
    ],
    description:
      "Generate a temporary-looking email address for testing, examples, mockups, and development workflows. This tool does not provide an inbox or receive emails.",
    shortDescription: "Generate a temporary-looking test email address.",
    icon: "text",
    keywords: [
      "temporary email generator",
      "temporary email",
      "temp email",
      "temp email generator",
      "random temporary email",
      "random email",
      "email generator",
      "disposable email address generator",
    ],
    popular: false,
    new: true,
    supportedFormats: ["Email address"],
    relatedToolIds: [
      "random-string-generator",
      "random-number-generator",
      "uuid-generator",
      "password-generator",
    ],
    seoTitle: "Temporary Email Generator — Generate Random Email | Tool Base",
    seoDescription:
      "Generate a random temporary-looking email address for testing, examples, and development with Tool Base. This tool does not provide an inbox or receive emails.",
    h1: "Temporary Email Generator",
    intro:
      "Generate a temporary-looking email address for testing and examples. The Temporary Email Generator creates a synthetic address on a reserved test domain in your browser. It does not create a mailbox, inbox, or email-receiving service.",
    convertHeading: "Generate a Temporary Email Address",
    howToHeading: "How the Temporary Email Generator Works",
    featuresHeading: "What This Tool Provides",
    supportedFormatsHeading: "Output Details",
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "Instant random local-part generation in the browser",
      "Reserved example.com domain for clearly synthetic addresses",
      "Copy Email with brief confirmation after a successful clipboard write",
      "Generate New Email replaces the previous address without reloading",
      "No inbox, forwarding, OTP capture, or mail delivery",
    ],
    howToSteps: [
      {
        title: "Generate a New Address",
        description:
          "Open the page or click Generate New Email to create a random temporary-looking address.",
      },
      {
        title: "Copy the Email Address",
        description:
          "Use Copy Email to place the address on your clipboard for forms, fixtures, or mockups.",
      },
      {
        title: "Use It Only as a Test String",
        description:
          "Treat the result as a synthetic string. This tool does not receive messages or verification codes.",
      },
    ],
    faq: [
      {
        question: "Does this tool receive emails?",
        answer:
          "No. This frontend-only tool generates a temporary-looking address for testing and examples; it does not provide an inbox or receive messages.",
      },
      {
        question: "Can I use the generated address for email verification?",
        answer:
          "Do not position the tool as an email-verification or OTP-receiving service. It only generates a synthetic/test address.",
      },
      {
        question: "Does the generated address belong to a real mailbox?",
        answer:
          "No. The frontend generator does not create or provision a real mailbox.",
      },
      {
        question: "Where does the address come from?",
        answer:
          "A random local-part is created with browser randomness and paired with the reserved example.com domain used for documentation and testing.",
      },
    ],
    inputFormats: ["None — generate on demand"],
    outputFormats: ["Synthetic email address"],
    examples: [
      {
        title: "Example synthetic address",
        description:
          "Static illustration of the format — not a live inbox address.",
        input: "Generate New Email",
        output: "m7q2k9xa@example.com",
      },
    ],
  }),
  ...contentGeneratorTools,
];

export function isGeneratorToolSlug(slug: string): boolean {
  return generatorTools.some((tool) => tool.slug === slug);
}
