import Link from "next/link";
import { ToolCard } from "@/components/tools/ToolCard";
import { getPopularTools, getToolById } from "@/lib/tools/registry";

const featuredOrder = [
  "jpg-to-png",
  "image-compressor",
  "pdf-compressor",
  "jpg-to-pdf",
  "word-counter",
  "qr-code-generator",
  "typing-speed-test",
  "json-formatter",
];

export function PopularToolsSection() {
  const popularMap = new Map(getPopularTools().map((tool) => [tool.id, tool]));
  const tools = featuredOrder
    .map((id) => popularMap.get(id) ?? getToolById(id))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))
    .slice(0, 8);

  return (
    <section className="tm-section border-b border-tm-border bg-tm-elevated">
      <div className="tm-container">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
          <div className="max-w-2xl">
            <p className="tm-eyebrow">Quick access</p>
            <h2 className="tm-h2 mt-3">Featured Tools</h2>
            <p className="tm-lead mt-3">
              A short list of useful Tool Base utilities to start with — convert an image,
              compress a PDF, count words, or open a generator.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex min-h-11 items-center text-sm font-bold text-tm-accent transition-colors hover:text-tm-accent-hover"
          >
            Browse all tools →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
