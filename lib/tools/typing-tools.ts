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

export const typingTools: ToolDefinition[] = [
  tool({
    id: "typing-speed-test",
    name: "Typing Speed Test",
    slug: "typing-speed-test",
    category: "typing-productivity",
    exactPrimaryKeyword: "typing speed test",
    aliases: [
      "typing test",
      "typing wpm test",
      "typing accuracy test",
      "words per minute test",
      "wpm test",
    ],
    description:
      "Measure typing speed, accuracy, raw WPM, errors, and test time with a free online typing speed test.",
    shortDescription: "Test your typing speed and accuracy online.",
    icon: "text",
    keywords: [
      "typing speed test",
      "typing test",
      "typing speed test online",
      "typing wpm test",
      "typing accuracy test",
      "words per minute test",
      "wpm test",
      "typing speed",
      "typing accuracy",
      "wpm",
    ],
    popular: true,
    new: true,
    supportedFormats: ["Keyboard input"],
    relatedToolIds: [
      "word-counter",
      "character-counter",
      "pomodoro-timer",
      "online-notepad",
      "text-case-converter",
    ],
    seoTitle: "Typing Speed Test — Check Your WPM & Accuracy | Tool Base",
    seoDescription:
      "Take a free online typing speed test with Tool Base and measure your words per minute, typing accuracy, raw speed, errors, and test time.",
    h1: "Typing Speed Test",
    intro:
      "Test your typing speed, accuracy, and consistency online. Start typing the target text to begin a timed or word-count challenge. Tool Base calculates WPM with the common five-characters-per-word convention, tracks raw speed and errors from your real keystrokes, and freezes the final score when the test ends.",
    convertHeading: "Test Your Typing Speed Online",
    howToHeading: "How the Typing Speed Test Works",
    featuresHeading: "How WPM Is Calculated",
    supportedFormatsHeading: "What Is Typing Accuracy?",
    tipsHeading: "Tips for Improving Typing Speed",
    tips: [
      "Prioritize accuracy first, then add speed in short daily practice sessions.",
      "Keep wrists relaxed and read a few words ahead of your fingers.",
      "Use consistent finger placement instead of looking down at the keyboard.",
      "Practice with punctuation and numbers after plain-word tests feel steady.",
      "Short focused sessions often beat long fatigued ones for measurable progress.",
      "WPM is a useful progress signal, not an absolute measure of typing skill.",
    ],
    relatedToolsHeading: "Related Tools",
    hideReport: true,
    processingMode: "browser",
    features: [
      "WPM = (typed characters ÷ 5) ÷ minutes using the common five-characters-per-word convention",
      "Example: 1,500 characters ÷ 5 = 300 words; over 5 minutes that equals 60 WPM",
      "Net WPM uses correct characters; raw WPM uses all typed characters",
      "Accuracy = correct keystrokes ÷ total keystrokes × 100",
      "Example: 194 correct keystrokes out of 200 total keystrokes = 97% accuracy",
      "Time modes: 15, 30, 60, and 120 seconds with timestamp-based elapsed time",
      "Word modes: 10, 25, 50, and 100 words plus sentence mode",
      "No account required — results are calculated from your real keystrokes",
    ],
    howToSteps: [
      {
        title: "Start Typing",
        description:
          "Click the typing area if needed, then type the first character to start the timer.",
      },
      {
        title: "Track Your WPM and Accuracy",
        description:
          "Watch live stats while correct characters complete and mistakes are marked clearly.",
      },
      {
        title: "Review Your Final Score",
        description:
          "When time or words finish, review WPM, accuracy, raw WPM, and errors, then try again.",
      },
    ],
    faq: [
      {
        question: "What does WPM mean?",
        answer:
          "WPM means words per minute. Tool Base uses the common convention that five characters equal one word, then divides by elapsed minutes.",
      },
      {
        question: "How is typing speed calculated?",
        answer:
          "Net WPM = (correct characters ÷ 5) ÷ minutes. Raw WPM uses all typed characters the same way. Elapsed time comes from timestamps, not assumed interval ticks.",
      },
      {
        question: "What is a good typing accuracy?",
        answer:
          "Many people aim for high accuracy first, often above 95%, then increase speed. The “best” accuracy depends on your goals; this tool reports your measured accuracy rather than a universal grade.",
      },
      {
        question: "Does the test require an account?",
        answer: "No. You can take the typing speed test immediately without signing up.",
      },
      {
        question: "Does backspace affect the score?",
        answer:
          "Yes. You can correct text with backspace. Accuracy uses correct keystrokes divided by total keystrokes, so a mistype is counted when it happens and is not counted again merely because you delete it.",
      },
      {
        question: "Are the results saved?",
        answer:
          "No. Results stay on this page for the current test. Tool Base does not create fake leaderboards or stored personal-best claims.",
      },
    ],
    inputFormats: ["Keyboard typing"],
    outputFormats: ["WPM", "Accuracy", "Errors", "Raw WPM"],
    examples: [
      {
        title: "WPM worked example",
        description:
          "Static illustration of the five-characters-per-word convention — not a live score.",
        input: "1,500 correct characters over 5 minutes",
        output: "60 WPM",
        formula: "WPM = (Typed Characters ÷ 5) ÷ Minutes → (1500 ÷ 5) ÷ 5 = 60",
      },
      {
        title: "Accuracy worked example",
        description: "Static illustration of keystroke accuracy accounting.",
        input: "194 correct keystrokes out of 200 total keystrokes",
        output: "97% accuracy",
        formula: "Accuracy = Correct Keystrokes ÷ Total Keystrokes × 100",
      },
    ],
  }),
];

export function isTypingToolSlug(slug: string): boolean {
  return typingTools.some((item) => item.slug === slug);
}
