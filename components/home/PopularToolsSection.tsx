import Link from "next/link";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { getPopularTools } from "@/lib/tools/registry";

const popularOrder = [
  "jpg-to-png",
  "png-to-jpg",
  "jpg-to-webp",
  "webp-to-jpg",
  "image-compressor",
  "image-resizer",
  "svg-to-png",
  "png-to-svg",
  "jpg-to-pdf",
  "pdf-compressor",
  "mp4-to-mp3",
  "mp3-to-wav",
  "word-counter",
  "qr-code-generator",
  "json-formatter",
  "percentage-calculator",
];

export function PopularToolsSection() {
  const popularMap = new Map(getPopularTools().map((tool) => [tool.id, tool]));
  const tools = popularOrder
    .map((id) => popularMap.get(id))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <section className="tm-section">
      <div className="tm-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h2 className="tm-h2">Popular Online Tools</h2>
            <p className="tm-lead mt-4">
              Quickly access some of ToolMyra’s most useful online utilities for converting
              files, compressing media, editing content, generating results, and completing
              everyday digital tasks.
            </p>
          </div>
          <Link href="/popular" className="text-sm font-bold text-tm-accent hover:text-tm-accent-hover">
            View popular tools
          </Link>
        </div>
        <div className="mt-8">
          <ToolGrid tools={tools} />
        </div>
      </div>
    </section>
  );
}
