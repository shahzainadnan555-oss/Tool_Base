import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { categories } from "@/lib/tools/categories";

export const metadata: Metadata = createPageMetadata({
  title: "About Tool Base",
  description:
    "Learn what Tool Base is: a free online utility platform for converting, compressing, editing, generating, and calculating — with no account required.",
  path: "/about",
  absoluteTitle: true,
});

export default function AboutPage() {
  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <article className="max-w-3xl">
        <h1 className="tm-h1">About Tool Base</h1>
        <p className="tm-lead mt-4">
          Tool Base is a free online utility platform that helps people complete common
          digital tasks — converting files, compressing media, formatting data, generating
          useful outputs, and running everyday calculations — without creating an account.
        </p>

        <h2 className="tm-h2 mt-10">What Is Tool Base?</h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          Tool Base is a collection of practical browser-based utilities gathered in one
          place. Instead of hunting across many disconnected sites for a converter,
          compressor, formatter, or calculator, you can search Tool Base, open the tool you
          need, complete the task, and download or copy the result.
        </p>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          The public experience is intentionally direct. There is no mandatory signup,
          subscription, or payment step to use the tools listed in the catalog.
        </p>

        <h2 className="tm-h2 mt-10">What You Can Do With Tool Base</h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          Tool Base covers everyday work across files, media, text, and numbers. Depending
          on the tool, you can convert image formats, process PDF documents, transform
          audio or video, clean and count text, format developer data, encode or hash
          values, and calculate percentages, units, dates, and related values.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base font-medium text-tm-muted">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={category.route}
                className="font-bold text-tm-accent hover:text-tm-accent-hover"
              >
                {category.name}
              </Link>
              {" — "}
              {category.shortDescription}
            </li>
          ))}
        </ul>

        <h2 className="tm-h2 mt-10">Our Approach to Useful Online Tools</h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          Each tool is meant to do one clear job well. Tool pages explain what the utility
          does, how to use it, and what kind of result to expect. Related tools and
          category browsing help you move to the next useful step without leaving the
          platform.
        </p>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          Tools are registered through a central catalog so navigation, search, SEO
          structure, accessibility patterns, and related recommendations stay consistent as
          the library grows.
        </p>

        <h2 className="tm-h2 mt-10">Designed for Simple, Everyday Tasks</h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          Many digital chores are small but frequent: convert a photo, shrink a PDF,
          extract audio from a video, format JSON, or calculate a percentage. Tool Base is
          organized around those practical moments — find the tool, provide the input,
          process it, and take the result with you.
        </p>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          Processing behavior can differ by tool. Some utilities run primarily in your
          browser; others may load supporting libraries or follow a different processing
          path. Tool pages and the Privacy Policy describe how Tool Base handles files and
          inputs in general terms that match the current implementation.
        </p>

        <h2 className="tm-h2 mt-10">A Growing Library of Utilities</h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          Tool Base continues to expand its catalog of converters, compressors, editors,
          generators, and calculators. New tools are added when they fit a clear everyday
          need and can be presented with useful explanations, not empty keyword pages.
        </p>
        <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
          If you want to explore the full directory, start with{" "}
          <Link href="/tools" className="font-bold text-tm-accent hover:text-tm-accent-hover">
            all online tools
          </Link>
          , browse{" "}
          <Link
            href="/categories"
            className="font-bold text-tm-accent hover:text-tm-accent-hover"
          >
            categories
          </Link>
          , or read practical{" "}
          <Link href="/blogs" className="font-bold text-tm-accent hover:text-tm-accent-hover">
            guides
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
