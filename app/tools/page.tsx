import type { Metadata } from "next";
import { CategoryNav } from "@/components/home/CategoryNav";
import { CategoryToolSections } from "@/components/home/CategoryToolSections";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SuggestTool } from "@/components/feedback/SuggestTool";
import { SearchBar } from "@/components/search/SearchBar";
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
    <div className="pb-14">
      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All Tools" }]} />
          <header className="mt-4 max-w-3xl">
            <h1 id="tools-directory-heading" className="tm-h1">
              All Online Tools
            </h1>
            <p className="tm-lead mt-4">
              Browse Tool Base by category, then open a complete hub when you want every
              tool in that group. Search if you already know the job you need to finish.
            </p>
          </header>
          <div className="mt-8 max-w-2xl">
            <SearchBar placeholder="Search tools by name, alias, or keyword" />
          </div>
        </div>
      </div>

      <div className="tm-container mt-8 md:mt-10">
        {initialQuery || initialCategory !== "all" ? (
          <ToolsDirectory
            tools={tools}
            initialQuery={initialQuery}
            initialCategory={initialCategory}
            headingId="tools-directory-heading"
          />
        ) : (
          <>
            <CategoryNav sticky={false} />
            <div className="mt-10">
              <CategoryToolSections limit={8} />
            </div>
          </>
        )}

        <div className="mt-14 max-w-2xl">
          <SuggestTool />
        </div>
      </div>
    </div>
  );
}
