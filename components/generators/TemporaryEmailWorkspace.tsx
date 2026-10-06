"use client";

import { useId, useState } from "react";
import { generateTemporaryEmail } from "@/lib/generators/temporary-email";
import { copyText } from "@/lib/calculator/utils";

interface Props {
  convertHeading?: string;
}

export function TemporaryEmailWorkspace({ convertHeading }: Props) {
  const resultId = useId();
  const [email, setEmail] = useState(() => generateTemporaryEmail());
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setCopied(false);
    setEmail((prev) => generateTemporaryEmail(prev));
  }

  async function handleCopy() {
    const ok = await copyText(email);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <div className="space-y-6">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      <p className="tm-notice tm-notice-info">
        This tool generates a temporary-looking email address for testing and
        examples. It does not provide an inbox or receive emails.
      </p>

      <div className="rounded-2xl border border-tm-border bg-tm-soft p-5 md:p-7">
        <p className="text-xs font-extrabold tracking-wide text-tm-accent uppercase">
          Temporary Email
        </p>
        <p
          id={resultId}
          className="tm-h2 mt-3 break-all font-mono text-xl sm:text-2xl md:text-3xl"
          aria-live="polite"
        >
          {email}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="tm-btn tm-btn-secondary"
            onClick={() => void handleCopy()}
            aria-label="Copy email address"
          >
            {copied ? "Copied" : "Copy Email"}
          </button>
          <button
            type="button"
            className="tm-btn tm-btn-primary"
            onClick={handleGenerate}
            aria-label="Generate new email address"
          >
            Generate New Email
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="tm-h3">Generate a New Address</h3>
        <p className="text-sm font-medium leading-relaxed text-tm-muted">
          Choose Generate New Email to create another random local-part on the
          reserved <span className="font-bold text-tm-text">example.com</span>{" "}
          domain. Addresses are synthetic and exist only for this session.
        </p>
        <h3 className="tm-h3">Copy the Email Address</h3>
        <p className="text-sm font-medium leading-relaxed text-tm-muted">
          Use Copy Email to place the current address on your clipboard for
          mockups, forms, or development fixtures.
        </p>
      </div>
    </div>
  );
}
