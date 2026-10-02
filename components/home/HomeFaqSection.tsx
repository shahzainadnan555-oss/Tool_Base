import { FAQ } from "@/components/ui/FAQ";
import { homepageFaq } from "@/lib/content/homepage-faq";

export function HomeFaqSection() {
  return (
    <section className="tm-section">
      <div className="tm-container max-w-4xl">
        <FAQ items={homepageFaq} titledAs="h2" />
      </div>
    </section>
  );
}
