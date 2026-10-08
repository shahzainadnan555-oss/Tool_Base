export function parseNumber(raw: string, label: string, opts?: { min?: number; max?: number; allowZero?: boolean; allowNegative?: boolean }): number {
  const trimmed = raw.trim().replace(/,/g, "");
  if (!trimmed) throw new Error(`Please enter ${label}.`);
  const n = Number(trimmed);
  if (!Number.isFinite(n)) throw new Error(`Please enter a valid ${label}.`);
  if (opts?.allowNegative === false && n < 0) {
    throw new Error(`${label} cannot be negative.`);
  }
  if (opts?.allowZero === false && n === 0) {
    throw new Error(`${label} cannot be zero.`);
  }
  if (opts?.min != null && n < opts.min) {
    throw new Error(`${label} must be at least ${opts.min}.`);
  }
  if (opts?.max != null && n > opts.max) {
    throw new Error(`${label} must be at most ${opts.max}.`);
  }
  return n;
}

export function parseOptionalNumber(raw: string, label: string, fallback = 0): number {
  const trimmed = raw.trim().replace(/,/g, "");
  if (!trimmed) return fallback;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) throw new Error(`Please enter a valid ${label}.`);
  return n;
}

export function parsePositiveInt(raw: string, label: string): number {
  const n = parseNumber(raw, label, { allowNegative: false, allowZero: false });
  if (!Number.isInteger(n)) throw new Error(`${label} must be a whole number.`);
  return n;
}

export function parseDate(raw: string, label: string): Date {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error(`Please enter ${label}.`);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!m) throw new Error(`Please enter a valid ${label} (YYYY-MM-DD).`);
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== mo - 1 ||
    date.getUTCDate() !== d
  ) {
    throw new Error(`Please enter a valid ${label}.`);
  }
  return date;
}

export function assertFinite(n: number, label = "Result"): number {
  if (!Number.isFinite(n)) throw new Error(`${label} is not defined for these inputs.`);
  return n;
}
