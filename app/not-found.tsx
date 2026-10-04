import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getPopularTools } from "@/lib/tools/registry";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found",
  description: "The Tool Base page you requested could not be found.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  const popular = getPopularTools().slice(0, 6);

  return (
    <div className="tm-container flex flex-1 flex-col items-start py-16 md:py-24">
      <p className="text-sm font-extrabold tracking-wide text-tm-accent uppercase">404</p>
      <h1 className="tm-h1 mt-3">Page Not Found</h1>
      <p className="tm-lead mt-4 max-w-2xl">
        The page you requested does not exist or may have moved. Use search from the
        navigation, browse popular tools below, or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/tools">Explore All Tools</Button>
        <Button href="/" variant="secondary">
          Go Home
        </Button>
      </div>

      <section className="mt-14 w-full max-w-3xl">
        <h2 className="tm-h2">Popular tools</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {popular.map((tool) => (
            <li key={tool.id}>
              <Link
                href={tool.route}
                className="block rounded-2xl border border-tm-border bg-tm-white px-4 py-3 font-bold text-tm-text transition-colors hover:border-tm-accent hover:text-tm-accent"
              >
                {tool.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
