/** Public support contact for Tool Base. */
export const SUPPORT_EMAIL = "support@toolbaseworld.com";

export function supportMailto(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject?.trim()) params.set("subject", subject.trim());
  if (body?.trim()) params.set("body", body.trim());
  const query = params.toString();
  return `mailto:${SUPPORT_EMAIL}${query ? `?${query}` : ""}`;
}
