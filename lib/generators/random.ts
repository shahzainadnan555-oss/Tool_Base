export function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

export function pick<T>(list: readonly T[]): T {
  return list[randomInt(list.length)];
}

export function randomDigits(count: number): string {
  let out = "";
  for (let i = 0; i < count; i += 1) out += String(randomInt(10));
  return out;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function clampQuantity(value: number, max: number, label: string): number {
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(`Enter a ${label} of at least 1.`);
  }
  if (value > max) {
    throw new Error(`Please choose a smaller number of results (max ${max}).`);
  }
  return Math.floor(value);
}
