const reasons = [
  {
    title: "Simple by Design",
    description:
      "ToolMyra focuses on a direct path: find a tool, complete the task, and download or copy the result. No onboarding flow stands in the way.",
  },
  {
    title: "Fast Results",
    description:
      "Pages are organized for quick discovery with search, categories, popular tools, and related recommendations so you spend less time hunting for the right utility.",
  },
  {
    title: "No Account Required",
    description:
      "You do not need to create an account, subscribe, or enter payment details to use ToolMyra’s public tools.",
  },
  {
    title: "A Growing Library of Useful Tools",
    description:
      "The platform is built to scale across image, PDF, audio, video, text, developer, encoding, and calculator utilities while keeping one consistent experience.",
  },
  {
    title: "Built for Everyday Tasks",
    description:
      "Whether you need to convert a file, compress media, format data, generate a QR code, or calculate a percentage, ToolMyra is designed for practical day-to-day work.",
  },
];

export function WhyToolMyraSection() {
  return (
    <section className="tm-section">
      <div className="tm-container">
        <div className="max-w-3xl">
          <h2 className="tm-h2">Why Use ToolMyra?</h2>
          <p className="tm-lead mt-4">
            ToolMyra is built to make common digital tasks easier without forcing accounts,
            plans, or unnecessary steps.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <article key={reason.title} className="rounded-2xl border border-tm-border bg-white p-6">
              <h3 className="tm-h3">{reason.title}</h3>
              <p className="mt-3 text-base font-medium leading-relaxed text-tm-muted">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
