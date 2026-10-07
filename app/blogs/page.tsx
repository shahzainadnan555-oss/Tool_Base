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
    <div className="pb-14">
      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
          <header className="mt-4 max-w-3xl">
            <p className="tm-eyebrow">Knowledge</p>
            <h1 className="tm-h1 mt-4">Tool Base Guides</h1>
            <p className="tm-lead mt-4">
              Practical guides for converters, image tools, PDF utilities, media tools,
              developer utilities, text tools, and everyday calculators — written to help
              you choose a format and open the right tool.
            </p>
          </header>
        </div>
      </div>

      <div className="tm-container mt-10">
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
    </div>
  );
}
