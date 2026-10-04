import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getAllBlogPosts } from "@/lib/blog/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Admin · Blog",
  description: "Blog and guides management foundation for Tool Base.",
  path: "/admin/blog",
  noIndex: true,
});

export default function AdminBlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div>
      <h1 className="tm-h1">Blog / guides management</h1>
      <p className="tm-lead mt-4">
        Current guide inventory from the local blog foundation. Avoid generating empty SEO
        articles from this panel.
      </p>
      <ul className="mt-8 space-y-3">
        {posts.map((post) => (
          <li key={post.slug} className="rounded-2xl border border-tm-border bg-tm-white p-5">
            <p className="font-bold text-tm-text">{post.title}</p>
            <p className="mt-1 text-sm font-medium text-tm-muted">/blogs/{post.slug}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
