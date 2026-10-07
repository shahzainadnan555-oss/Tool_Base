import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/Button";

const searchHints = [
  "Compress an image",
  "Convert PDF",
  "Calculate GPA",
  "Generate QR code",
  "Test typing speed",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-tm-border tm-hero-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tm-accent/40 to-transparent"
      />
      <div className="tm-container relative py-14 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center tm-animate-fade-up">
          <p className="tm-eyebrow">Free online tools · No sign-up</p>
          <h1 className="tm-h1 mt-5">
            Online Tools for{" "}
            <span className="bg-gradient-to-r from-tm-accent to-tm-cyan bg-clip-text text-transparent">
              Everyday Digital Tasks
            </span>
          </h1>
          <p className="tm-lead mx-auto mt-5 max-w-2xl">
            Convert, compress, edit, generate, and calculate with a clear library of free
            Tool Base utilities — organized by category so you can find the right tool fast.
          </p>

          <div className="mx-auto mt-8 max-w-2xl text-left">
            <SearchBar
              placeholder="Search for a tool…"
              className="[&_.tm-search-shell]:min-h-14"
            />
          </div>

          <ul className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            {searchHints.map((hint) => (
              <li key={hint}>
                <span className="inline-flex rounded-full border border-tm-border bg-tm-elevated/80 px-3 py-1.5 text-xs font-bold text-tm-muted">
                  {hint}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/tools">Explore All Tools</Button>
            <Button href="/categories" variant="secondary">
              Browse Categories
            </Button>
          </div>

          <p className="mt-6 text-sm font-semibold text-tm-muted">
            Images · PDFs · Text · Calculators · Generators · Design · Utilities
          </p>
        </div>
      </div>
      <div className="tm-container pb-8 text-center md:pb-10">
        <Link
          href="#categories"
          className="text-sm font-bold text-tm-accent transition-colors hover:text-tm-accent-hover"
        >
          Jump to categories ↓
        </Link>
      </div>
    </section>
  );
}
