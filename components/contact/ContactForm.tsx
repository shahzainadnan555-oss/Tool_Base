"use client";

import { useId, useState } from "react";
import { SUPPORT_EMAIL, supportGmailComposeUrl } from "@/lib/config/support";

export function ContactForm() {
  const formId = useId();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Please enter your message first.");
      return;
    }

    setError(null);
    const href = supportGmailComposeUrl(trimmed);
    const opened = window.open(href, "_blank", "noopener,noreferrer");
    if (!opened) {
      window.location.assign(href);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor={`${formId}-message`} className="mb-2 block text-sm font-bold text-tm-text">
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          className="tm-input min-h-44 resize-y"
          value={message}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${formId}-error` : undefined}
          onChange={(event) => {
            setMessage(event.target.value);
            if (error) setError(null);
          }}
        />
        {error ? (
          <p id={`${formId}-error`} className="mt-2 text-sm font-semibold text-tm-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <button type="submit" className="tm-btn tm-btn-primary w-full sm:w-auto">
        Open Gmail and Send Message
      </button>

      <p className="text-sm font-medium text-tm-muted">
        Or email us at{" "}
        <a
          className="font-bold text-tm-accent hover:text-tm-accent-hover"
          href={`mailto:${SUPPORT_EMAIL}`}
        >
          {SUPPORT_EMAIL}
        </a>
      </p>
    </form>
  );
}
