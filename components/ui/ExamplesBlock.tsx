import type { ToolExample } from "@/lib/tools/types";

interface ExamplesBlockProps {
  examples: ToolExample[];
  title?: string;
}

export function ExamplesBlock({
  examples,
  title = "Examples",
}: ExamplesBlockProps) {
  if (!examples.length) return null;

  return (
    <section>
      <h2 className="tm-h2">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {examples.map((example) => (
          <article
            key={example.title}
            className="rounded-2xl border border-tm-border bg-tm-elevated p-5"
          >
            <h3 className="tm-h3">{example.title}</h3>
            {example.description ? (
              <p className="mt-2 text-sm font-medium text-tm-muted">{example.description}</p>
            ) : null}
            {example.formula ? (
              <p className="mt-3 rounded-xl bg-tm-soft px-3 py-2 font-mono text-sm font-semibold text-tm-text">
                {example.formula}
              </p>
            ) : null}
            {example.input ? (
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-tm-muted">Input</p>
                <pre className="mt-1 overflow-x-auto rounded-xl bg-tm-navy p-3 text-sm text-white">
                  {example.input}
                </pre>
              </div>
            ) : null}
            {example.output ? (
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-tm-muted">Output</p>
                <pre className="mt-1 overflow-x-auto rounded-xl bg-tm-soft p-3 text-sm font-semibold text-tm-text">
                  {example.output}
                </pre>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
