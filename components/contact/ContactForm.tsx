"use client";

import { useId, useState } from "react";
import { SUPPORT_EMAIL, supportMailto } from "@/lib/config/support";

const NAME_MAX = 100;
const SUBJECT_MAX = 150;
const MESSAGE_MAX = 4000;

type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "ready" | "blocked">("idle");

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) next.name = "Please enter your name.";
    else if (trimmedName.length > NAME_MAX) next.name = `Name must be ${NAME_MAX} characters or fewer.`;

    if (!trimmedEmail) next.email = "Please enter your email address.";
    else if (!isValidEmail(trimmedEmail)) next.email = "Enter a valid email address.";

    if (!trimmedSubject) next.subject = "Please enter a subject.";
    else if (trimmedSubject.length > SUBJECT_MAX) {
      next.subject = `Subject must be ${SUBJECT_MAX} characters or fewer.`;
    }

    if (!trimmedMessage) next.message = "Please enter your message.";
    else if (trimmedMessage.length < 10) next.message = "Message must be at least 10 characters.";
    else if (trimmedMessage.length > MESSAGE_MAX) {
      next.message = `Message must be ${MESSAGE_MAX} characters or fewer.`;
    }

    return next;
  }

  function resetForm() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
    setStatus("idle");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    // No transactional email provider is configured in this project yet.
    // Open the visitor's email app with a prefilled message — do not claim delivery.
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
      "",
      "— Sent via the Tool Base Contact Us form",
    ].join("\n");

    const href = supportMailto(subject.trim(), body);
    try {
      window.location.href = href;
      setStatus("ready");
    } catch {
      setStatus("blocked");
    }
  }

  return (
    <form
      className="tm-panel space-y-5 p-5 sm:p-6"
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${formId}-note`}
    >
      <p id={`${formId}-note`} className="text-sm font-medium text-tm-muted">
        Required fields are marked with an asterisk (*). Submitting opens your email app with a
        prefilled message to{" "}
        <a className="font-bold text-tm-accent hover:text-tm-accent-hover" href={supportMailto()}>
          {SUPPORT_EMAIL}
        </a>
        . Direct in-browser delivery is not configured yet.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          label="Name"
          required
          error={errors.name}
        >
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className="tm-input"
            value={name}
            maxLength={NAME_MAX}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>

        <Field
          id={`${formId}-email`}
          label="Email Address"
          required
          error={errors.email}
        >
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className="tm-input"
            value={email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
      </div>

      <Field
        id={`${formId}-subject`}
        label="Subject"
        required
        error={errors.subject}
      >
        <input
          id={`${formId}-subject`}
          name="subject"
          type="text"
          className="tm-input"
          value={subject}
          maxLength={SUBJECT_MAX}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? `${formId}-subject-error` : undefined}
          onChange={(event) => setSubject(event.target.value)}
        />
      </Field>

      <Field
        id={`${formId}-message`}
        label="Message"
        required
        error={errors.message}
        hint={`${message.length}/${MESSAGE_MAX}`}
      >
        <textarea
          id={`${formId}-message`}
          name="message"
          className="tm-input min-h-40 resize-y"
          value={message}
          maxLength={MESSAGE_MAX}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          onChange={(event) => setMessage(event.target.value)}
        />
      </Field>

      {status === "ready" ? (
        <div className="tm-notice tm-notice-info" role="status">
          Your email app should open with a prefilled message to {SUPPORT_EMAIL}. Send that email to
          complete your inquiry. If nothing opened, email us directly or check that a mail app is
          installed.
        </div>
      ) : null}

      {status === "blocked" ? (
        <div className="tm-notice tm-notice-error" role="alert">
          We could not open your email app. Please send your message directly to{" "}
          <a className="font-bold underline" href={supportMailto()}>
            {SUPPORT_EMAIL}
          </a>
          .
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="tm-btn tm-btn-primary w-full sm:w-auto">
          Open Email to Submit
        </button>
        <button
          type="button"
          className="tm-btn tm-btn-secondary w-full sm:w-auto"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-bold text-tm-text">
          {label}
          {required ? <span className="text-tm-error"> *</span> : null}
        </label>
        {hint ? <span className="text-xs font-medium text-tm-muted">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-tm-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
