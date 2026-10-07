const items = [
  {
    title: "Organized by category",
    description: "Browse Images, PDF, Text, Calculators, and more without a wall of cards.",
  },
  {
    title: "Fast tool discovery",
    description: "Search by name, keyword, or alias and jump straight into the right utility.",
  },
  {
    title: "No account required",
    description: "Open a tool, finish the job, and take the result — free for everyday use.",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Why Tool Base" className="border-b border-tm-border bg-tm-soft">
      <div className="tm-container grid gap-4 py-8 md:grid-cols-3 md:gap-6 md:py-10">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-tm-border bg-tm-elevated p-5">
            <p className="text-base font-bold text-tm-text">{item.title}</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-tm-muted">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
