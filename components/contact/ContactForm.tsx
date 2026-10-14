"use client";

import { useId, useMemo, useState } from "react";
import {
  SUPPORT_EMAIL,
  contactEmailBody,
  contactSubject,
  isValidContactEmail,
  supportGmailComposeUrl,
  supportMailto,
} from "@/lib/config/support";

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
};

export function ContactForm() {
  const formId = useId();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [composeBlocked, setComposeBlocked] = useState(false);

  const fallbackMailto = useMemo(() => {
    const fields = { firstName, lastName, email, message };
    return supportMailto(contactSubject(firstName, lastName), contactEmailBody(fields));
  }, [firstName, lastName, email, message]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!firstName.trim()) next.firstName = "Please enter your first name.";
    if (!lastName.trim()) next.lastName = "Please enter your last name.";
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!isValidContactEmail(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!message.trim()) next.message = "Please enter your message.";
    return next;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComposeBlocked(false);

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const fields = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    };
    const subject = contactSubject(fields.firstName, fields.lastName);
    const body = contactEmailBody(fields);
    const href = supportGmailComposeUrl(body, subject);

    const opened = window.open(href, "_blank", "noopener,noreferrer");
    if (!opened) {
      try {
        window.location.assign(href);
      } catch {
        setComposeBlocked(true);
      }
    }
  }

  const inputClass = (hasError: boolean) =>
    `tm-input ${hasError ? "border-tm-error focus:border-tm-error" : ""}`;

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-first-name`} className="mb-2 block text-sm font-bold text-tm-text">
            First Name
          </label>
          <input
            id={`${formId}-first-name`}
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            placeholder="Enter your first name"
            className={inputClass(Boolean(errors.firstName))}
            value={firstName}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? `${formId}-first-name-error` : undefined}
            onChange={(event) => {
              setFirstName(event.target.value);
              if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
            }}
          />
          {errors.firstName ? (
            <p id={`${formId}-first-name-error`} className="mt-2 text-sm font-semibold text-tm-error" role="alert">
              {errors.firstName}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-last-name`} className="mb-2 block text-sm font-bold text-tm-text">
            Last Name
          </label>
          <input
            id={`${formId}-last-name`}
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Enter your last name"
            className={inputClass(Boolean(errors.lastName))}
            value={lastName}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? `${formId}-last-name-error` : undefined}
            onChange={(event) => {
              setLastName(event.target.value);
              if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
            }}
          />
          {errors.lastName ? (
            <p id={`${formId}-last-name-error`} className="mt-2 text-sm font-semibold text-tm-error" role="alert">
              {errors.lastName}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className="mb-2 block text-sm font-bold text-tm-text">
          Email Address
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="Enter your email address"
          className={inputClass(Boolean(errors.email))}
          value={email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        {errors.email ? (
          <p id={`${formId}-email-error`} className="mt-2 text-sm font-semibold text-tm-error" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="mb-2 block text-sm font-bold text-tm-text">
          Your Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={6}
          placeholder="Tell us how we can help..."
          className={`${inputClass(Boolean(errors.message))} min-h-36 resize-y`}
          value={message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          onChange={(event) => {
            setMessage(event.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
        />
        {errors.message ? (
          <p id={`${formId}-message-error`} className="mt-2 text-sm font-semibold text-tm-error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 pt-1">
        <button type="submit" className="tm-btn tm-btn-primary w-full sm:w-auto">
          Open Gmail and Send Message
        </button>

        <p className="text-sm font-medium leading-relaxed text-tm-muted">
          This opens a Gmail draft for you to review and send. Prefer your own email app?{" "}
          <a
            className="font-bold text-tm-accent break-all hover:text-tm-accent-hover"
            href={fallbackMailto}
          >
            Email {SUPPORT_EMAIL}
          </a>
        </p>

        {composeBlocked ? (
          <p className="rounded-xl border border-tm-border bg-tm-soft px-4 py-3 text-sm font-semibold text-tm-text" role="status">
            Gmail could not be opened in this browser. Use the email link above to compose your message to{" "}
            <span className="break-all">{SUPPORT_EMAIL}</span>.
          </p>
        ) : null}
      </div>
    </form>
  );
}
