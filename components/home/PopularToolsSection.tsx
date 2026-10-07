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
    <section className="tm-section border-b border-tm-border bg-tm-white">
      <div className="tm-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
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
            className="text-sm font-bold text-tm-accent transition-colors hover:text-tm-accent-hover"
          >
            Browse all tools →
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
