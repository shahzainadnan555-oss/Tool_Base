interface FeatureSectionProps {
  title: string;
  description?: string;
  features: Array<{
    title: string;
    description: string;
  }>;
}

export function FeatureSection({ title, description, features }: FeatureSectionProps) {
  return (
    <section>
      <h2 className="tm-h2">{title}</h2>
      {description ? <p className="tm-lead mt-4 max-w-3xl">{description}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-tm-border bg-white p-5">
            <h3 className="tm-h3">{feature.title}</h3>
            <p className="mt-2 text-base font-medium leading-relaxed text-tm-muted">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
