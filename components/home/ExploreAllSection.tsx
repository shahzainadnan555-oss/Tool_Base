import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getAllTools } from "@/lib/tools/registry";

export function ExploreAllSection() {
  const count = getAllTools().length;

  return (
    <section className="tm-section bg-tm-elevated">
      <div className="tm-container">
        <div className="rounded-3xl border border-tm-border bg-tm-soft px-6 py-12 md:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="tm-h2">Explore All Tools</h2>
              <p className="tm-lead mt-4 max-w-2xl">
                Browse the full Tool Base directory with search, category filters, popular
                tools, new tools, and A–Z sorting. The catalog is built to scale as more
                utilities are added.
              </p>
              <p className="mt-4 text-sm font-bold text-tm-muted">
                Currently listed: {count} tools
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button href="/tools">Open tools directory</Button>
              <Button href="/categories" variant="secondary">
                Browse categories
              </Button>
              <Link
                href="/tools/json-formatter"
                className="inline-flex items-center text-sm font-bold text-tm-accent hover:text-tm-accent-hover"
              >
                Try JSON Formatter →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
