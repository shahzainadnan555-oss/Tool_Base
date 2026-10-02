import type { ToolFaq } from "@/lib/tools/types";

/** Single source for homepage FAQ (visible UI + JSON-LD must match). */
export const homepageFaq: ToolFaq[] = [
  {
    question: "What is ToolMyra?",
    answer:
      "ToolMyra is a free website with online utilities for converting, compressing, editing, generating, calculating, and transforming files and content. The goal is to help you finish everyday digital tasks quickly without creating an account.",
  },
  {
    question: "Is ToolMyra free?",
    answer:
      "Yes. ToolMyra’s public tools are free to use. There is no paid plan, membership, or credit-card requirement built into the product experience.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. You can visit ToolMyra, find a tool, use it, and download or copy the result without signing up.",
  },
  {
    question: "What types of tools does ToolMyra provide?",
    answer:
      "ToolMyra includes image tools, PDF tools, audio tools, video tools, text tools, developer utilities, security and encoding tools, and calculators and converters — with more tools added over time.",
  },
  {
    question: "Can I use ToolMyra on my phone?",
    answer:
      "Yes. The site is designed to work on desktop and mobile browsers, with responsive navigation, search, and tool pages.",
  },
  {
    question: "Where possible, does processing happen in my browser?",
    answer:
      "Many ToolMyra tools are designed for browser-based processing when that approach is technically practical. Each tool page explains its processing model clearly. ToolMyra does not make blanket privacy claims that are not technically guaranteed.",
  },
];
