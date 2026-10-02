"use client";

import { useId, useState } from "react";
import { siteConfig } from "@/lib/config/site";

const SUPPORT_EMAIL = "support@toolmyra.com";

/**
 * Opens the visitor's email client with a prefilled message.
 * Does not claim server-side delivery — there is no contact API yet.
 */
export function ContactForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (message.trim().length < 20) {
      setError("Please enter a message with at least 20 characters.");
      return;
    }
    if (message.trim().length > 5000) {
      setError("Please keep your message under 5,000 characters.");
      return;
    }

    const subject = encodeURIComponent(`ToolMyra contact from ${name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}\n`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-tm-border bg-white p-5"
      aria-labelledby={`${formId}-title`}
    >
      <h2 id={`${formId}-title`} className="text-base font-bold text-tm-text">
        Send a message
      </h2>
      <p className="mt-2 text-sm font-medium text-tm-muted">
        This opens your email app with a message addressed to {SUPPORT_EMAIL}.{" "}
        {siteConfig.name} does not claim the message was delivered until your email
        client sends it.
      </p>

      <label className="mt-4 block text-sm font-bold text-tm-text" htmlFor={`${formId}-name`}>
        Name
      </label>
      <input
        id={`${formId}-name`}
        className="tm-input mt-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
        maxLength={120}
      />

      <label className="mt-4 block text-sm font-bold text-tm-text" htmlFor={`${formId}-email`}>
        Email
      </label>
      <input
        id={`${formId}-email`}
        type="email"
        className="tm-input mt-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        maxLength={200}
      />

      <label className="mt-4 block text-sm font-bold text-tm-text" htmlFor={`${formId}-message`}>
        Message
      </label>
      <textarea
        id={`${formId}-message`}
        className="tm-input mt-2 min-h-32 resize-y"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        maxLength={5000}
      />

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-tm-error">
          {error}
        </p>
      ) : null}

      <button type="submit" className="tm-btn tm-btn-primary mt-4">
        Open email draft
      </button>
    </form>
  );
}
