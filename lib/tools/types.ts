export type CategoryId =
  | "image-tools"
  | "pdf-tools"
  | "document-data-tools"
  | "audio-tools"
  | "video-tools"
  | "text-tools"
  | "developer-tools"
  | "security-encoding"
  | "calculators-converters"
  | "specialized-calculators"
  | "generators"
  | "typing-productivity"
  | "design-creative"
  | "utilities";

export type ProcessingMode = "browser" | "server" | "hybrid" | "unspecified";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolHowToStep {
  title: string;
  description: string;
}

export interface ToolExample {
  title: string;
  description?: string;
  input?: string;
  output?: string;
  formula?: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  subcategory?: string;
  tags?: string[];
  exactPrimaryKeyword?: string;
  aliases?: string[];
  description: string;
  shortDescription: string;
  icon: string;
  keywords: string[];
  popular: boolean;
  new: boolean;
  route: string;
  supportedFormats: string[];
  relatedToolIds: string[];
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  features: string[];
  howToSteps: ToolHowToStep[];
  faq: ToolFaq[];
  inputFormats: string[];
  outputFormats: string[];
  processingMode?: ProcessingMode;
  examples?: ToolExample[];
  status?: "available" | "coming-soon" | "maintenance";
  /** Optional SEO section headings for tool pages */
  convertHeading?: string;
  howToHeading?: string;
  featuresHeading?: string;
  supportedFormatsHeading?: string;
  tipsHeading?: string;
  tips?: string[];
  relatedToolsHeading?: string;
  /** Hide report UI for focused converter experiences */
  hideReport?: boolean;
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  slug: CategoryId;
  description: string;
  shortDescription: string;
  icon: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  route: string;
  faq?: ToolFaq[];
}
