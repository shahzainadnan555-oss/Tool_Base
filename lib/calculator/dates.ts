import type { CalculatorResult } from "./types";

function parseYmd(value: string): { y: number; m: number; d: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) throw new Error("Please enter a valid date.");
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    throw new Error("Please enter a valid calendar date.");
  }
  return { y, m, d };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Calendar-aware Y/M/D difference (end − start), non-negative when end >= start. */
export function calendarDiff(
  start: string,
  end: string,
): { years: number; months: number; days: number; totalDays: number } {
  const s = parseYmd(start);
  const e = parseYmd(end);
  const startUtc = Date.UTC(s.y, s.m - 1, s.d);
  const endUtc = Date.UTC(e.y, e.m - 1, e.d);
  if (endUtc < startUtc) {
    throw new Error("End date must be on or after the start date.");
  }
  const totalDays = Math.round((endUtc - startUtc) / 86400000);

  let years = e.y - s.y;
  let months = e.m - s.m;
  let days = e.d - s.d;

  if (days < 0) {
    months -= 1;
    const prevMonth = e.m === 1 ? 12 : e.m - 1;
    const prevYear = e.m === 1 ? e.y - 1 : e.y;
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days, totalDays };
}

export function calculateDateDifference(
  start: string,
  end: string,
  inclusive: boolean,
): CalculatorResult {
  const diff = calendarDiff(start, end);
  const totalDays = inclusive ? diff.totalDays + 1 : diff.totalDays;
  const weeks = Math.floor(totalDays / 7);
  const remDays = totalDays % 7;
  return {
    primary: `${diff.years} years, ${diff.months} months, ${diff.days} days`,
    details: {
      "Total days": String(totalDays),
      "Weeks + days": `${weeks} weeks, ${remDays} days`,
      Mode: inclusive ? "Inclusive" : "Exclusive of end date overlap adjustment (calendar span)",
    },
    formula:
      "Years/months/days use calendar-aware subtraction. Total days count whole midnights between dates" +
      (inclusive ? " plus one for inclusive mode." : "."),
    copyText: `${diff.years} years, ${diff.months} months, ${diff.days} days (${totalDays} total days)`,
  };
}

/**
 * Age calculation. Feb 29 birthdays in non-leap years are treated as March 1
 * for the anniversary date (common civil convention).
 */
export function calculateAge(birth: string, target: string): CalculatorResult {
  const b = parseYmd(birth);
  const t = parseYmd(target);
  const birthUtc = Date.UTC(b.y, b.m - 1, b.d);
  const targetUtc = Date.UTC(t.y, t.m - 1, t.d);
  if (targetUtc < birthUtc) {
    throw new Error("Target date must be on or after the date of birth.");
  }

  // Adjust leap-day birthday for non-leap anniversary years
  let anniversaryDay = b.d;
  if (b.m === 2 && b.d === 29 && !isLeapYear(t.y)) {
    anniversaryDay = 1; // treat as March 1
  }
  const anniversaryMonth = b.m === 2 && b.d === 29 && !isLeapYear(t.y) ? 3 : b.m;

  let years = t.y - b.y;
  let months = t.m - anniversaryMonth;
  let days = t.d - anniversaryDay;

  if (days < 0) {
    months -= 1;
    const prevMonth = t.m === 1 ? 12 : t.m - 1;
    const prevYear = t.m === 1 ? t.y - 1 : t.y;
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.round((targetUtc - birthUtc) / 86400000);
  const totalMonths = years * 12 + months;
  const totalWeeks = Math.floor(totalDays / 7);

  return {
    primary: `${years} years, ${months} months, ${days} days`,
    details: {
      "Total months": String(totalMonths),
      "Total weeks": String(totalWeeks),
      "Total days": String(totalDays),
    },
    formula:
      "Age uses calendar-aware years/months/days. Feb 29 birthdays are treated as March 1 in non-leap years.",
    copyText: `${years} years, ${months} months, ${days} days`,
  };
}

export { parseYmd, isLeapYear };
