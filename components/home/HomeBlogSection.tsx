import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts } from "@/lib/blog/posts";

export function HomeBlogSection() {
  const posts = getAllBlogPosts().slice(0, 3);
  if (!posts.length) return null;

  return (
    <section className="tm-section border-b border-tm-border">
      <div className="tm-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="tm-eyebrow">Resources</p>
            <h2 className="tm-h2 mt-3">Helpful Guides</h2>
            <p className="tm-lead mt-3">
              Practical articles that explain formats, workflows, and when to open which
              Tool Base utility.
            </p>
          </div>
          <Link
            href="/blogs"
            className="text-sm font-bold text-tm-accent transition-colors hover:text-tm-accent-hover"
          >
            View All →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
