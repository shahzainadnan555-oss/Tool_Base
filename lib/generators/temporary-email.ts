const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";
const DOMAIN = "example.com";
const MIN_LENGTH = 8;
const MAX_LENGTH = 14;

/** Short substrings to avoid in generated local-parts (case-insensitive). */
const BLOCKED = [
  "admin",
  "support",
  "contact",
  "abuse",
  "root",
  "fuck",
  "shit",
  "porn",
  "nazi",
  "rape",
  "hate",
];

function randomInt(maxExclusive: number): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

function randomLocalPart(): string {
  const length = MIN_LENGTH + randomInt(MAX_LENGTH - MIN_LENGTH + 1);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += CHARSET[randomInt(CHARSET.length)];
  }
  return out;
}

function isAcceptable(local: string): boolean {
  const lower = local.toLowerCase();
  return !BLOCKED.some((word) => lower.includes(word));
}

/**
 * Generate a synthetic temporary-looking email for testing/examples only.
 * Uses the reserved example.com domain — does not create a mailbox.
 */
export function generateTemporaryEmail(previous?: string): string {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const local = randomLocalPart();
    if (!isAcceptable(local)) continue;
    const email = `${local}@${DOMAIN}`;
    if (email !== previous) return email;
  }
  // Extremely unlikely fallback
  const fallback = `tmp${Date.now().toString(36)}${randomInt(1000)}@${DOMAIN}`;
  return fallback === previous ? `x${fallback}` : fallback;
}

export const TEMPORARY_EMAIL_DOMAIN = DOMAIN;
