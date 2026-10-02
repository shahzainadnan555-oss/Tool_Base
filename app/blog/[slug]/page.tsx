import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
} from "@/lib/blog/posts";
import { getToolBySlug } from "@/lib/tools/registry";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return createPageMetadata({
      title: "Article Not Found",
      description: "The requested ToolMyra guide could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.seoTitle.replace(" | ToolMyra Guides", "").replace(" | ToolMyra", ""),
    description: post.seoDescription,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedTools = post.relatedToolSlugs
    .map((toolSlug) => getToolBySlug(toolSlug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          category: post.category,
        })}
      />
      <article className="tm-container py-10 md:py-14">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/blog" },
            { label: post.title },
          ]}
        />
        <header className="max-w-3xl">
          <p className="text-sm font-bold tracking-wide text-tm-accent uppercase">
            {post.category}
          </p>
          <h1 className="tm-h1 mt-3">{post.title}</h1>
          <p className="tm-lead mt-4">{post.description}</p>
          <p className="mt-4 text-sm font-bold text-tm-muted">
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span aria-hidden="true"> · </span>
            {post.readingTime}
          </p>
        </header>

        <div className="prose-tm mt-10 max-w-3xl space-y-6">
          {post.content.map((block, index) => {
            if (block.type === "heading" && block.text) {
              return (
                <h2 key={`${block.text}-${index}`} className="tm-h2">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "list" && block.items) {
              return (
                <ul key={`list-${index}`} className="list-disc space-y-2 pl-5">
                  {block.items.map((item) => (
                    <li key={item} className="text-base font-medium text-tm-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={`p-${index}`} className="text-base font-medium leading-relaxed text-tm-muted">
                {block.text}
              </p>
            );
          })}
        </div>

        {relatedTools.length ? (
          <section className="mt-12 max-w-3xl">
            <h2 className="tm-h2">Related Tools</h2>
            <ul className="mt-4 space-y-2">
              {relatedTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.route}
                    className="font-bold text-tm-accent hover:text-tm-accent-hover"
                  >
                    {tool.name}
                  </Link>
                  <span className="text-sm font-medium text-tm-muted">
                    {" "}
                    — {tool.shortDescription}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
