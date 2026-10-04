import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { readingTimeLabel } from "@/lib/blog/types";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article
      className={`tm-card flex h-full flex-col p-6 ${featured ? "md:p-8" : ""}`}
    >
      <p className="text-xs font-bold tracking-wide text-tm-accent uppercase">
        {post.category}
      </p>
      <p className={featured ? "tm-h2 mt-3" : "tm-h3 mt-3"}>
        <Link href={`/blogs/${post.slug}`} className="hover:text-tm-accent">
          {post.title}
        </Link>
      </p>
      <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-tm-muted">
        {post.excerpt}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-tm-muted">{readingTimeLabel(post)}</span>
        <Link
          href={`/blogs/${post.slug}`}
          className="text-sm font-bold text-tm-accent hover:text-tm-accent-hover"
        >
          Read Guide
        </Link>
      </div>
    </article>
  );
}
