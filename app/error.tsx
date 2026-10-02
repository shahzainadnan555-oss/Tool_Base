"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="tm-container flex flex-1 flex-col items-start py-16 md:py-24">
      <p className="text-sm font-extrabold tracking-wide text-tm-accent uppercase">
        Something went wrong
      </p>
      <h1 className="tm-h1 mt-3">We could not load this page</h1>
      <p className="tm-lead mt-4 max-w-2xl">
        An unexpected error interrupted this view. You can try again, or return to the
        homepage and continue from there.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className="tm-btn tm-btn-primary" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="tm-btn tm-btn-secondary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
