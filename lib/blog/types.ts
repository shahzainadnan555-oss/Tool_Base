export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; text: string; language?: string };

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  relatedToolSlugs: string[];
  relatedArticleIds: string[];
  publishedAt: string;
  updatedAt?: string;
  content: BlogBlock[];
  faqs: BlogFaq[];
}

export function countWords(post: BlogPost): number {
  const chunks: string[] = [
    post.title,
    post.excerpt,
    ...post.content.flatMap((block) => {
      if (block.type === "p" || block.type === "h2" || block.type === "h3") return [block.text];
      if (block.type === "ul" || block.type === "ol") return block.items;
      if (block.type === "table") return [...block.headers, ...block.rows.flat()];
      if (block.type === "code") return [block.text];
      return [];
    }),
    ...post.faqs.flatMap((item) => [item.question, item.answer]),
  ];
  const text = chunks.join(" ").replace(/\[\[[^\]]+\]\]/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingTimeLabel(post: BlogPost): string {
  const minutes = Math.max(4, Math.round(countWords(post) / 225));
  return `${minutes} min read`;
}
