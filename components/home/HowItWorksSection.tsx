const steps = [
  {
    title: "Choose a Tool",
    description:
      "Search by name or keyword, browse categories, or open a popular utility from the homepage.",
  },
  {
    title: "Upload or Enter Your Content",
    description:
      "Provide the file, text, or values the tool needs. Each tool page explains the expected input clearly.",
  },
  {
    title: "Process and Download",
    description:
      "Run the tool, review the result, and download or copy the output. Then you are done — no account required.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="tm-section bg-white">
      <div className="tm-container">
        <div className="max-w-3xl">
          <h2 className="tm-h2">How ToolMyra Works</h2>
          <p className="tm-lead mt-4">
            A simple three-step workflow keeps every utility easy to understand and use.
          </p>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative overflow-hidden rounded-3xl border border-tm-border bg-tm-soft p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tm-accent text-sm font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="tm-h3 mt-5">{step.title}</h3>
              <p className="mt-3 text-base font-medium leading-relaxed text-tm-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
