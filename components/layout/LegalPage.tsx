import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageProps {
  title: string;
  description: string;
  sections: LegalSection[];
}

export function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <div className="tm-container py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <article className="max-w-3xl">
        <h1 className="tm-h1">{title}</h1>
        <p className="tm-lead mt-4">{description}</p>
        {sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="tm-h2">{section.heading}</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-tm-muted">
              {section.body}
            </p>
          </section>
        ))}
      </article>
    </div>
  );
}
