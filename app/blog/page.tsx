import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getAllBlogPosts } from "@/lib/blog/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Guides & Blog",
  description:
    "Practical ToolMyra guides on image formats, conversions, compression, and everyday digital workflows. Original, useful content — not empty SEO pages.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <header className="max-w-3xl">
        <h1 className="tm-h1">Guides & Blog</h1>
        <p className="tm-lead mt-4">
          Practical explanations and how-to guidance related to ToolMyra utilities. Articles
          are written to be useful first, with natural search relevance second.
        </p>
      </header>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <p className="mt-8 text-sm font-medium text-tm-muted">
        Looking for a tool instead?{" "}
        <Link href="/tools" className="font-bold text-tm-accent hover:text-tm-accent-hover">
          Explore all online tools
        </Link>
        .
      </p>
    </div>
  );
}
