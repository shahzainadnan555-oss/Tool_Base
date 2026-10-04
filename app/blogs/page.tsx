import type { Metadata } from "next";
import Link from "next/link";
import { BlogsDirectory } from "@/components/blog/BlogsDirectory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getAllBlogPosts, getBlogCategories, getBlogTags } from "@/lib/blog/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Tool Base Guides & Resources",
  description:
    "Practical Tool Base guides for converters, image tools, PDF utilities, media tools, developer utilities, text tools, and everyday calculators.",
  path: "/blogs",
  absoluteTitle: true,
});

export default function BlogsPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blogs" }]} />
      <header className="max-w-3xl">
        <h1 className="tm-h1">Tool Base Guides & Resources</h1>
        <p className="tm-lead mt-4">
          The Tool Base blog explains how to use online converters, image tools, PDF
          utilities, media tools, developer utilities, text tools, and everyday calculators.
          Each guide is written to help you choose a format, avoid common mistakes, and open
          the right tool when you are ready to process a file.
        </p>
      </header>
      <BlogsDirectory
        posts={posts}
        categories={getBlogCategories()}
        tags={getBlogTags()}
      />
      <p className="mt-10 text-sm font-medium text-tm-muted">
        Looking for a utility instead?{" "}
        <Link href="/tools" className="font-bold text-tm-accent hover:text-tm-accent-hover">
          Explore all online tools
        </Link>
        .
      </p>
    </div>
  );
}
