const steps = [
  {
    number: "01",
    title: "Find a tool",
    description:
      "Search by name or browse a category such as Images, PDF, Text, or Calculators.",
  },
  {
    number: "02",
    title: "Complete the task",
    description:
      "Upload a file, paste text, or enter values. Adjust options when the tool needs them.",
  },
  {
    number: "03",
    title: "Use the result",
    description:
      "Preview the output, then copy or download it. Start another job whenever you need to.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="tm-section border-b border-tm-border bg-tm-elevated">
      <div className="tm-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="tm-eyebrow">Simple workflow</p>
          <h2 className="tm-h2 mt-3">How It Works</h2>
          <p className="tm-lead mt-3">
            Three clear steps from discovery to download — without cluttering the page with
            extra account walls.
          </p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-tm-border bg-tm-soft p-6"
            >
              <p className="text-sm font-extrabold tracking-[0.12em] text-tm-accent">
                {step.number}
              </p>
              <h3 className="tm-h3 mt-3">{step.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-tm-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
