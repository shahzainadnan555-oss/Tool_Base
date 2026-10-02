import { CTASection } from "@/components/ui/CTASection";

export function FinalCtaSection() {
  return (
    <section className="tm-section pt-0">
      <div className="tm-container">
        <CTASection
          dark
          title="Start with a free online tool"
          description="Find a converter, compressor, generator, or calculator and complete your task in a few clear steps — no account required."
          primaryHref="/tools"
          primaryLabel="Explore All Tools"
          secondaryHref="/categories"
          secondaryLabel="Browse Categories"
        />
      </div>
    </section>
  );
}
