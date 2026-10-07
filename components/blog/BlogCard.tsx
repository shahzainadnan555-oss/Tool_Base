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
      className={`tm-card group flex h-full min-w-0 flex-col overflow-hidden ${featured ? "p-5 sm:p-7 md:p-8" : "p-5 sm:p-6"}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="tm-badge bg-tm-surface-2 text-tm-accent">{post.category}</p>
        <span className="text-xs font-bold text-tm-muted">{readingTimeLabel(post)}</span>
      </div>
      <h3 className={featured ? "tm-h2 mt-4 break-words" : "tm-h3 mt-4 break-words"}>
        <Link
          href={`/blogs/${post.slug}`}
          className="transition-colors group-hover:text-tm-accent"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-tm-muted">
        {post.excerpt}
      </p>
      <div className="mt-5">
        <Link
          href={`/blogs/${post.slug}`}
          className="inline-flex min-h-11 items-center text-sm font-bold text-tm-accent transition-colors hover:text-tm-accent-hover"
        >
          Read guide →
        </Link>
      </div>
    </article>
  );
}
