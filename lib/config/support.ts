/** Public support contact for Tool Base. */
export const SUPPORT_EMAIL = "support@toolbaseworld.com";

export const SUPPORT_SUBJECT = "Contact Us — Tool Base Inquiry";

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
