/** Public support contact for Tool Base. */
export const SUPPORT_EMAIL = "support@toolbaseworld.com";

export const SUPPORT_SUBJECT = "Contact Us — Tool Base Inquiry";

export type ContactMessageFields = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export function supportMailto(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject?.trim()) params.set("subject", subject.trim());
  if (body?.trim()) params.set("body", body.trim());
  const query = params.toString();
  return `mailto:${SUPPORT_EMAIL}${query ? `?${query}` : ""}`;
}

/** Prefill a Gmail compose draft for the visitor to review and send. */
export function supportGmailComposeUrl(body: string, subject = SUPPORT_SUBJECT): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: SUPPORT_EMAIL,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function contactSubject(firstName: string, lastName: string): string {
  const name = `${firstName.trim()} ${lastName.trim()}`.replace(/\s+/g, " ").trim();
  return name ? `Contact Us — ${name}` : SUPPORT_SUBJECT;
}

export function contactEmailBody(fields: ContactMessageFields): string {
  const firstName = fields.firstName.trim();
  const lastName = fields.lastName.trim();
  const fullName = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
  const email = fields.email.trim();
  const message = fields.message.replace(/\r\n/g, "\n").trim();

  return [
    "Hello Tool Base Team,",
    "",
    "I am contacting you through the Tool Base website.",
    "",
    `Name: ${fullName}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
    "",
    "Best regards,",
    fullName,
  ].join("\n");
}

export function isValidContactEmail(email: string): boolean {
  const value = email.trim();
  // Practical HTML-like email check — enough for client-side guidance.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
