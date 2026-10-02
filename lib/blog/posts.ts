export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  relatedSlugs: string[];
  relatedToolSlugs: string[];
  content: Array<{
    type: "paragraph" | "heading" | "list";
    text?: string;
    items?: string[];
  }>;
}

/**
 * Blog/guides foundation. Keep posts original and genuinely useful.
 * Do not mass-generate empty SEO articles.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-the-right-image-format",
    title: "How to Choose the Right Image Format",
    description:
      "A practical guide to JPG, PNG, WebP, and SVG so you can pick the right format for quality, size, and compatibility.",
    excerpt:
      "Learn when to use JPG, PNG, WebP, or SVG based on quality needs, transparency, and file size.",
    category: "Guides",
    publishedAt: "2026-03-01",
    readingTime: "6 min read",
    seoTitle: "How to Choose the Right Image Format | ToolMyra Guides",
    seoDescription:
      "Compare JPG, PNG, WebP, and SVG with practical guidance from ToolMyra. Learn which image format fits quality, transparency, and file-size needs.",
    relatedSlugs: [],
    relatedToolSlugs: ["jpg-to-png", "png-to-jpg", "jpg-to-webp", "image-compressor"],
    content: [
      {
        type: "paragraph",
        text: "Choosing an image format is less about brand preference and more about what the file needs to do. Transparency, photographic detail, sharp graphics, and file size all point toward different formats.",
      },
      {
        type: "heading",
        text: "JPG for photographs",
      },
      {
        type: "paragraph",
        text: "JPG (JPEG) is a strong default for photographs and complex images with many colors. It usually produces smaller files than PNG for photos, but it does not support transparency.",
      },
      {
        type: "heading",
        text: "PNG for sharp graphics and transparency",
      },
      {
        type: "paragraph",
        text: "PNG is useful when you need clean edges, text-like graphics, or transparent backgrounds. Files can be larger than JPG for photos, so it is not always the best choice for large camera images.",
      },
      {
        type: "heading",
        text: "WebP for modern web delivery",
      },
      {
        type: "paragraph",
        text: "WebP is widely used on the web because it often balances quality and size well. If your audience uses modern browsers and your publishing stack supports WebP, it can be an efficient option.",
      },
      {
        type: "heading",
        text: "SVG for scalable icons and simple illustrations",
      },
      {
        type: "paragraph",
        text: "SVG works best for logos, icons, and simple illustrations that need to scale cleanly. It is not a replacement for photographs.",
      },
      {
        type: "heading",
        text: "A simple decision checklist",
      },
      {
        type: "list",
        items: [
          "Need transparency? Start with PNG or WebP.",
          "Sharing a photo? JPG or WebP are usually better.",
          "Building a logo or icon? Prefer SVG when possible.",
          "Optimizing for the web? Compress after choosing the right format.",
        ],
      },
      {
        type: "paragraph",
        text: "ToolMyra includes converters and compressors so you can move between formats and reduce file size when your workflow needs it.",
      },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
