import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog/BlogContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolCard } from "@/components/tools/ToolCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { readingTimeLabel } from "@/lib/blog/types";
import { createPageMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/structured-data";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
  getRelatedArticles,
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
      description: "The requested Tool Base guide could not be found.",
      path: `/blogs/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/blogs/${post.slug}`,
    absoluteTitle: true,
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
  const relatedArticles = getRelatedArticles(post);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blogs", path: "/blogs" },
          { name: post.title, path: `/blogs/${post.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          path: `/blogs/${post.slug}`,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          category: post.category,
        })}
      />
      {post.faqs.length ? <JsonLd data={faqJsonLd(post.faqs)} /> : null}

      <div className="tm-container py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blogs", href: "/blogs" },
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
                {readingTimeLabel(post)}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="tm-badge border border-tm-border bg-tm-soft text-tm-text"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </header>

            <BlogContent blocks={post.content} />

            {post.faqs.length ? (
              <section className="mt-12 max-w-3xl">
                <h2 className="tm-h2">Frequently Asked Questions</h2>
                <div className="mt-6 space-y-6">
                  {post.faqs.map((item) => (
                    <div key={item.question}>
                      <h3 className="tm-h3">{item.question}</h3>
                      <p className="mt-2 text-base font-medium leading-relaxed text-tm-muted">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedArticles.length ? (
              <section className="mt-12 max-w-3xl">
                <h2 className="tm-h2">Related Guides</h2>
                <ul className="mt-4 space-y-2">
                  {relatedArticles.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/blogs/${article.slug}`}
                        className="font-bold text-tm-accent hover:text-tm-accent-hover"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>

          <aside className="lg:pt-16">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-sm font-extrabold tracking-wide text-tm-muted uppercase">
                In this guide
              </h2>
              <p className="mt-2 text-sm font-medium text-tm-muted">
                Jump to a Tool Base utility when you are ready to process a file.
              </p>
              <ul className="mt-4 space-y-2">
                {relatedTools.slice(0, 6).map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.route}
                      className="text-sm font-bold text-tm-accent hover:text-tm-accent-hover"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {relatedTools.length ? (
          <section className="mt-14">
            <h2 className="tm-h2">Useful Tool Base Tools</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTools.slice(0, 8).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
