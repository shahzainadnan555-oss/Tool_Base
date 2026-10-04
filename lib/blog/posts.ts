import type { BlogPost } from "@/lib/blog/types";
import { imageConversionGuide } from "@/lib/blog/articles/image-conversion-guide";
import { pdfToolsGuide } from "@/lib/blog/articles/pdf-tools-guide";
import { videoAudioGuide } from "@/lib/blog/articles/video-audio-guide";
import { developerTextGuide } from "@/lib/blog/articles/developer-text-guide";
import { calculatorsGuide } from "@/lib/blog/articles/calculators-guide";
import { fileDataGuide } from "@/lib/blog/articles/file-data-guide";

export const blogPosts: BlogPost[] = [
  imageConversionGuide,
  pdfToolsGuide,
  videoAudioGuide,
  developerTextGuide,
  calculatorsGuide,
  fileDataGuide,
];

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getRelatedArticles(post: BlogPost): BlogPost[] {
  return post.relatedArticleIds
    .map((id) => getBlogPostById(id))
    .filter((item): item is BlogPost => Boolean(item));
}

export function getBlogCategories(): string[] {
  return [...new Set(blogPosts.map((post) => post.category))].sort();
}

export function getBlogTags(): string[] {
  return [...new Set(blogPosts.flatMap((post) => post.tags))].sort();
}
