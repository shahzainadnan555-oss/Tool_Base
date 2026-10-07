"use client";

import { useId, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface ReportToolProps {
  toolName: string;
  toolSlug: string;
}

const issueTypes = [
  "Broken tool",
  "Conversion error",
  "Incorrect result",
  "UI problem",
  "Other issue",
] as const;

export function ReportTool({ toolName, toolSlug }: ReportToolProps) {
  const formId = useId();
  const [issueType, setIssueType] = useState<(typeof issueTypes)[number]>("Broken tool");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (details.trim().length < 10) {
      setError("Please describe the issue in at least 10 characters.");
      return;
    }

    // Frontend scaffolding only — ready for a future API connection.
    trackEvent("problem_reported", {
      toolSlug,
      issueType,
      detailsLength: details.trim().length,
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-tm-border bg-tm-soft p-5">
        <h3 className="text-base font-bold text-tm-text">Thanks for the feedback</h3>
        <p className="mt-2 text-sm font-medium text-tm-muted">
          Your report for {toolName} was recorded as a browser analytics event only. It is
          not stored in a Tool Base inbox until a reporting backend is connected.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-tm-border bg-tm-elevated p-5"
      aria-labelledby={`${formId}-title`}
    >
      <h3 id={`${formId}-title`} className="text-base font-bold text-tm-text">
        Report a Problem
      </h3>
      <p className="mt-2 text-sm font-medium text-tm-muted">
        Tell us what went wrong with {toolName}. No personal information is required.
      </p>

      <label className="mt-4 block text-sm font-bold text-tm-text" htmlFor={`${formId}-type`}>
        Issue type
      </label>
      <select
        id={`${formId}-type`}
        className="tm-input mt-2"
        value={issueType}
        onChange={(event) => setIssueType(event.target.value as (typeof issueTypes)[number])}
      >
        {issueTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label className="mt-4 block text-sm font-bold text-tm-text" htmlFor={`${formId}-details`}>
        Details
      </label>
      <textarea
        id={`${formId}-details`}
        className="tm-input mt-2 min-h-28 resize-y"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        placeholder="Describe what happened, what you expected, and any steps to reproduce."
        required
      />

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-tm-error">
          {error}
        </p>
      ) : null}

      <button type="submit" className="tm-btn tm-btn-secondary mt-4">
        Submit report
      </button>
    </form>
  );
}
