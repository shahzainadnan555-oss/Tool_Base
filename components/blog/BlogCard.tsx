import Link from "next/link";
import type { BlogPost } from "@/lib/blog/posts";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="tm-card flex h-full flex-col p-6">
      <p className="text-xs font-bold tracking-wide text-tm-accent uppercase">
        {post.category}
      </p>
      <h2 className="tm-h3 mt-3">
        <Link href={`/blog/${post.slug}`} className="hover:text-tm-accent">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-tm-muted">
        {post.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 text-xs font-bold text-tm-muted">
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        <span>{post.readingTime}</span>
      </div>
    </article>
  );
}
