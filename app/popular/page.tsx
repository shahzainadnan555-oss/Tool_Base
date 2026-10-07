import type { Metadata } from "next";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getPopularTools, sortToolsAz } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "Featured Online Tools",
  description:
    "Explore featured free online tools on Tool Base, including image converters, compressors, PDF utilities, audio tools, and everyday calculators.",
  path: "/popular",
});

export default function PopularToolsPage() {
  const tools = sortToolsAz(getPopularTools());

  return (
    <>
      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Featured Tools" }]} />
          <header className="max-w-3xl">
            <h1 className="tm-h1">Featured Online Tools</h1>
            <p className="tm-lead mt-4">
              Start with Tool Base’s most commonly useful utilities for converting files,
              compressing media, formatting content, and completing everyday digital tasks.
            </p>
          </header>
        </div>
      </div>
      <div className="tm-container py-10 md:py-14">
        <ToolGrid tools={tools} />
        <div className="mt-10">
          <Button href="/tools" variant="secondary">
            Browse all tools
          </Button>
        </div>
      </div>
    </>
  );
}
