import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

/** Target for middleware rewrite when admin UI is disabled in production. */
export default function AdminDisabledNotFoundPage() {
  return (
    <div className="tm-container flex flex-1 flex-col items-start py-16 md:py-24">
      <p className="text-sm font-extrabold tracking-wide text-tm-accent uppercase">404</p>
      <h1 className="tm-h1 mt-3">Page Not Found</h1>
      <p className="tm-lead mt-4 max-w-2xl">
        The page you requested does not exist or is not available.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/">Go Home</Button>
        <Button href="/tools" variant="secondary">
          Explore All Tools
        </Button>
      </div>
      <p className="mt-8 text-sm font-medium text-tm-muted">
        Looking for something else?{" "}
        <Link href="/contact" className="font-bold text-tm-accent hover:text-tm-accent-hover">
          Contact ToolMyra
        </Link>
        .
      </p>
    </div>
  );
}
