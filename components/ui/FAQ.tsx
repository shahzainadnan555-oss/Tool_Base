import type { ToolFaq } from "@/lib/tools/types";

interface FAQProps {
  items: ToolFaq[];
  title?: string;
  titledAs?: "h2" | "h3";
  showTitle?: boolean;
}

export function FAQ({
  items,
  title = "Frequently Asked Questions",
  titledAs = "h2",
  showTitle = true,
}: FAQProps) {
  const QuestionTag = titledAs === "h2" ? "h3" : "h4";

  return (
    <section aria-labelledby={showTitle ? "faq-heading" : undefined}>
      {showTitle ? (
        titledAs === "h2" ? (
          <h2 id="faq-heading" className="tm-h2">
            {title}
          </h2>
        ) : (
          <h3 id="faq-heading" className="tm-h3">
            {title}
          </h3>
        )
      ) : null}
      <div className="mt-6 divide-y divide-tm-border overflow-hidden rounded-2xl border border-tm-border bg-tm-white">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-bold text-tm-text marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                <QuestionTag className="text-left text-base font-bold md:text-lg">
                  {item.question}
                </QuestionTag>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl font-bold text-tm-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-tm-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
