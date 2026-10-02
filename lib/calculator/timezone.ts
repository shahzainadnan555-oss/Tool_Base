import type { CalculatorResult } from "./types";

export function listTimeZones(): string[] {
  try {
    const supported = (
      Intl as unknown as { supportedValuesOf?: (key: string) => string[] }
    ).supportedValuesOf;
    if (typeof supported === "function") {
      return supported("timeZone");
    }
  } catch {
    // fall through
  }
  return [
    "UTC",
    "Asia/Karachi",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Australia/Sydney",
    "Pacific/Auckland",
  ];
}

export function filterTimeZones(query: string, limit = 40): string[] {
  const q = query.trim().toLowerCase();
  const all = listTimeZones();
  if (!q) return all.slice(0, limit);
  return all.filter((tz) => tz.toLowerCase().includes(q)).slice(0, limit);
}

function partsInZone(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "shortOffset",
  });
  const map: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return map;
}

/**
 * Interpret local wall time in fromTz, convert to toTz using Intl.
 */
export function convertTimeZone(
  date: string,
  time: string,
  fromTz: string,
  toTz: string,
): CalculatorResult {
  if (!date) throw new Error("Please enter a date.");
  if (!time) throw new Error("Please enter a time.");
  if (!fromTz || !toTz) throw new Error("Please select a valid time zone.");

  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  if (![y, m, d, hh, mm].every((n) => Number.isFinite(n))) {
    throw new Error("Please enter a valid date and time.");
  }

  // Binary search UTC instant whose wall time in fromTz matches the inputs.
  let lo = Date.UTC(y, m - 1, d, hh, mm, 0) - 48 * 3600 * 1000;
  let hi = Date.UTC(y, m - 1, d, hh, mm, 0) + 48 * 3600 * 1000;
  let found: number | null = null;

  for (let i = 0; i < 48; i += 1) {
    const mid = Math.floor((lo + hi) / 2);
    const p = partsInZone(new Date(mid), fromTz);
    const key = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
    const target = `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    if (key === target) {
      found = mid;
      break;
    }
    if (key < target) lo = mid + 1;
    else hi = mid - 1;
  }

  if (found == null) {
    // Fallback: try minute-level scan around estimated UTC
    const estimate = Date.UTC(y, m - 1, d, hh, mm, 0);
    for (let delta = -36 * 60; delta <= 36 * 60; delta += 1) {
      const ts = estimate + delta * 60 * 1000;
      const p = partsInZone(new Date(ts), fromTz);
      if (
        Number(p.year) === y &&
        Number(p.month) === m &&
        Number(p.day) === d &&
        Number(p.hour) === hh &&
        Number(p.minute) === mm
      ) {
        found = ts;
        break;
      }
    }
  }

  if (found == null) {
    throw new Error(
      "Unable to resolve that local date/time in the selected time zone (it may fall in a DST gap).",
    );
  }

  // Snap to the exact local second = 00 within the matched minute.
  let exact: number | null = null;
  for (let delta = -120; delta <= 120; delta += 1) {
    const ts = found + delta * 1000;
    const p = partsInZone(new Date(ts), fromTz);
    if (
      Number(p.year) === y &&
      Number(p.month) === m &&
      Number(p.day) === d &&
      Number(p.hour) === hh &&
      Number(p.minute) === mm &&
      Number(p.second || "0") === 0
    ) {
      exact = ts;
      break;
    }
  }
  if (exact == null) exact = found;

  const source = partsInZone(new Date(exact), fromTz);
  const dest = partsInZone(new Date(exact), toTz);
  const destText = `${dest.year}-${dest.month}-${dest.day} ${dest.hour}:${dest.minute} (${dest.timeZoneName || toTz})`;

  return {
    primary: destText,
    details: {
      From: `${source.year}-${source.month}-${source.day} ${source.hour}:${source.minute} (${fromTz})`,
      To: `${dest.year}-${dest.month}-${dest.day} ${dest.hour}:${dest.minute} (${toTz})`,
      UTC: new Date(exact).toISOString(),
    },
    formula:
      "Conversion uses IANA time zone identifiers and platform timezone rules (including DST where applicable).",
    copyText: destText,
  };
}
