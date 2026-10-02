import type { Metadata } from "next";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getPopularTools, sortToolsAz } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "Popular Online Tools",
  description:
    "Explore popular free online tools on ToolMyra, including image converters, compressors, PDF utilities, audio tools, and everyday calculators.",
  path: "/popular",
});

export default function PopularToolsPage() {
  const tools = sortToolsAz(getPopularTools());

  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Popular Tools" }]} />
      <header className="max-w-3xl">
        <h1 className="tm-h1">Popular Online Tools</h1>
        <p className="tm-lead mt-4">
          Start with ToolMyra’s most commonly useful utilities for converting files,
          compressing media, formatting content, and completing everyday digital tasks.
        </p>
      </header>
      <div className="mt-8">
        <ToolGrid tools={tools} />
      </div>
      <div className="mt-10">
        <Button href="/tools" variant="secondary">
          Browse all tools
        </Button>
      </div>
    </div>
  );
}
