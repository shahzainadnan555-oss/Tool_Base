import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/site";
import { getAllBlogPosts } from "@/lib/blog/posts";
import { categories } from "@/lib/tools/categories";
import { getAllTools } from "@/lib/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{
    path: string;
    changeFrequency: "daily" | "weekly" | "monthly";
    priority: number;
  }> = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/tools", changeFrequency: "daily", priority: 0.9 },
    { path: "/categories", changeFrequency: "weekly", priority: 0.8 },
    { path: "/popular", changeFrequency: "weekly", priority: 0.7 },
    { path: "/new", changeFrequency: "weekly", priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/about", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
    { path: "/disclaimer", changeFrequency: "monthly", priority: 0.3 },
  ];

  const now = new Date();

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(category.route),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllTools().map((tool) => ({
      url: absoluteUrl(tool.route),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: tool.popular ? 0.85 : 0.75,
    })),
    ...getAllBlogPosts().map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
