import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LegalRichText } from "@/components/layout/LegalRichText";

export interface LegalSection {
  heading: string;
  /** Prefer paragraphs for multi-block sections. */
  paragraphs?: string[];
  /** Optional bullet list under the paragraphs. */
  bullets?: string[];
  /** Legacy single-paragraph body. */
  body?: string;
}

interface LegalPageProps {
  title: string;
  description: string;
  effectiveDate?: string;
  sections: LegalSection[];
}

export function LegalPage({
  title,
  description,
  effectiveDate,
  sections,
}: LegalPageProps) {
  return (
    <div className="pb-14">
      <div className="border-b border-tm-border tm-hero-bg">
        <div className="tm-container py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
          <header className="mt-4 max-w-3xl">
            <h1 className="tm-h1">{title}</h1>
            <p className="tm-lead mt-4">{description}</p>
            {effectiveDate ? (
              <p className="mt-4 text-sm font-bold text-tm-muted">
                Effective date: {effectiveDate}
              </p>
            ) : null}
          </header>
        </div>
      </div>
      <article className="tm-container mt-10 max-w-3xl">
        {sections.map((section) => {
          const paragraphs =
            section.paragraphs?.length
              ? section.paragraphs
              : section.body
                ? [section.body]
                : [];

          return (
            <section key={section.heading} className="mt-10 first:mt-0">
              <h2 className="tm-h2">{section.heading}</h2>
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${section.heading}-p-${index}`}
                  className="mt-4 text-base font-medium leading-relaxed text-tm-muted"
                >
                  <LegalRichText text={paragraph} />
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base font-medium text-tm-muted">
                  {section.bullets.map((item, index) => (
                    <li key={`${section.heading}-b-${index}`}>
                      <LegalRichText text={item} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </article>
    </div>
  );
}
