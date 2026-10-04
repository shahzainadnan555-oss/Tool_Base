import type { Metadata } from "next";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getNewTools, sortToolsAz } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "New Online Tools",
  description:
    "See the newest free online tools added to Tool Base, including converters, generators, and everyday utilities.",
  path: "/new",
});

export default function NewToolsPage() {
  const tools = sortToolsAz(getNewTools());

  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "New Tools" }]} />
      <header className="max-w-3xl">
        <h1 className="tm-h1">New Tools</h1>
        <p className="tm-lead mt-4">
          Recently added Tool Base utilities. This list grows as new converters, generators,
          and calculators are introduced.
        </p>
      </header>
      <div className="mt-8">
        {tools.length ? (
          <ToolGrid tools={tools} />
        ) : (
          <EmptyState
            title="No new tools listed yet"
            description="Check back soon, or browse the full directory for current utilities."
            action={<Button href="/tools">Explore All Tools</Button>}
          />
        )}
      </div>
    </div>
  );
}
