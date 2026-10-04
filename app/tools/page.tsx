import type { Metadata } from "next";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SuggestTool } from "@/components/feedback/SuggestTool";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getAllTools } from "@/lib/tools/registry";
import type { CategoryId } from "@/lib/tools/types";

export const metadata: Metadata = createPageMetadata({
  title: "All Online Tools — Free Converters & Utilities",
  description:
    "Browse all free online tools on Tool Base. Search converters, compressors, generators, calculators, and utilities by category, popularity, or keyword.",
  path: "/tools",
});

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const tools = getAllTools();
  const initialQuery = params.q?.trim() ?? "";
  const initialCategory =
    params.category && tools.some((tool) => tool.category === params.category)
      ? (params.category as CategoryId)
      : "all";

  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All Tools" }]} />
      <header className="max-w-3xl">
        <h1 id="tools-directory-heading" className="tm-h1">
          All Online Tools
        </h1>
        <p className="tm-lead mt-4">
          Explore Tool Base’s growing directory of free online tools for images, PDFs,
          audio, video, text, developers, encoding, and everyday calculations. Search by
          name or keyword, filter by category, and sort by popular, new, or A–Z.
        </p>
      </header>

      <div className="mt-8">
        <ToolsDirectory
          tools={tools}
          initialQuery={initialQuery}
          initialCategory={initialCategory}
          headingId="tools-directory-heading"
        />
      </div>

      <div className="mt-14 max-w-2xl">
        <SuggestTool />
      </div>
    </div>
  );
}
