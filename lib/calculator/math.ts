import type { CalculatorResult } from "./types";
import { formatNumber } from "./units";

function parseNumber(raw: string, label = "value"): number {
  const trimmed = raw.trim().replace(/,/g, "");
  if (!trimmed) throw new Error(`Please enter a ${label}.`);
  const n = Number(trimmed);
  if (!Number.isFinite(n)) throw new Error(`Please enter a valid ${label}.`);
  return n;
}

export function calculatePercentage(
  mode: "of" | "is-what" | "change",
  a: string,
  b: string,
): CalculatorResult {
  if (mode === "of") {
    const percent = parseNumber(a, "percentage");
    const number = parseNumber(b, "number");
    const result = (percent / 100) * number;
    return {
      primary: formatNumber(result),
      formula: `Result = (Percentage ÷ 100) × Number`,
      breakdown: [
        `(${formatNumber(percent)} ÷ 100) × ${formatNumber(number)} = ${formatNumber(result)}`,
      ],
      copyText: formatNumber(result),
    };
  }
  if (mode === "is-what") {
    const part = parseNumber(a, "value");
    const whole = parseNumber(b, "total");
    if (whole === 0) throw new Error("The total cannot be zero.");
    const result = (part / whole) * 100;
    return {
      primary: `${formatNumber(result)}%`,
      formula: `Percentage = (Value ÷ Total) × 100`,
      breakdown: [
        `(${formatNumber(part)} ÷ ${formatNumber(whole)}) × 100 = ${formatNumber(result)}%`,
      ],
      copyText: `${formatNumber(result)}%`,
    };
  }
  const original = parseNumber(a, "original value");
  const next = parseNumber(b, "new value");
  if (original === 0) throw new Error("The original value cannot be zero.");
  const result = ((next - original) / original) * 100;
  const label = result >= 0 ? "increase" : "decrease";
  return {
    primary: `${formatNumber(Math.abs(result))}% ${label}`,
    formula: `Percentage change = ((New − Original) ÷ Original) × 100`,
    breakdown: [
      `((${formatNumber(next)} − ${formatNumber(original)}) ÷ ${formatNumber(original)}) × 100 = ${formatNumber(result)}%`,
    ],
    copyText: `${formatNumber(result)}%`,
  };
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < BigInt(0) ? -a : a;
  let y = b < BigInt(0) ? -b : b;
  while (y !== BigInt(0)) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function calculateFraction(
  op: "add" | "sub" | "mul" | "div",
  n1: string,
  d1: string,
  n2: string,
  d2: string,
): CalculatorResult {
  const num1 = BigInt(parseNumber(n1, "numerator").toFixed(0));
  const den1 = BigInt(parseNumber(d1, "denominator").toFixed(0));
  const num2 = BigInt(parseNumber(n2, "numerator").toFixed(0));
  const den2 = BigInt(parseNumber(d2, "denominator").toFixed(0));
  if (den1 === BigInt(0) || den2 === BigInt(0)) {
    throw new Error("The denominator cannot be zero.");
  }

  let num: bigint;
  let den: bigint;
  if (op === "add") {
    num = num1 * den2 + num2 * den1;
    den = den1 * den2;
  } else if (op === "sub") {
    num = num1 * den2 - num2 * den1;
    den = den1 * den2;
  } else if (op === "mul") {
    num = num1 * num2;
    den = den1 * den2;
  } else {
    if (num2 === BigInt(0)) throw new Error("Cannot divide by zero.");
    num = num1 * den2;
    den = den1 * num2;
  }

  if (den < BigInt(0)) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  const decimal = Number(num) / Number(den);
  const fraction = den === BigInt(1) ? `${num}` : `${num}/${den}`;
  return {
    primary: fraction,
    secondary: `Decimal: ${formatNumber(decimal, 10)}`,
    formula: "Fractions are computed with exact integer arithmetic and reduced by GCD.",
    copyText: fraction,
  };
}

export function calculateAverage(text: string): CalculatorResult {
  const parts = text
    .split(/[\n,]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) throw new Error("Please enter one or more numbers.");
  const values = parts.map((p, i) => parseNumber(p, `number ${i + 1}`));
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  return {
    primary: formatNumber(avg),
    details: {
      Count: String(values.length),
      Sum: formatNumber(sum),
      Average: formatNumber(avg),
    },
    formula: "Mean = Sum of values ÷ Number of values",
    breakdown: [
      `${values.map((v) => formatNumber(v)).join(" + ")} = ${formatNumber(sum)}`,
      `${formatNumber(sum)} ÷ ${values.length} = ${formatNumber(avg)}`,
    ],
    copyText: formatNumber(avg),
  };
}

export function calculateRatio(
  mode: "simplify" | "solve",
  a: string,
  b: string,
  c?: string,
): CalculatorResult {
  if (mode === "simplify") {
    const left = BigInt(parseNumber(a, "first term").toFixed(0));
    const right = BigInt(parseNumber(b, "second term").toFixed(0));
    if (left === BigInt(0) && right === BigInt(0)) {
      throw new Error("Both ratio terms cannot be zero.");
    }
    const g = gcd(left, right);
    const sa = left / g;
    const sb = right / g;
    return {
      primary: `${sa}:${sb}`,
      formula: "Simplified by dividing both terms by their greatest common divisor.",
      copyText: `${sa}:${sb}`,
    };
  }
  // a:b = c:x  => x = (b*c)/a
  const ra = parseNumber(a, "ratio part A");
  const rb = parseNumber(b, "ratio part B");
  const rc = parseNumber(c || "", "known value");
  if (ra === 0) throw new Error("The first ratio term cannot be zero.");
  const result = (rb * rc) / ra;
  return {
    primary: formatNumber(result),
    formula: "If A:B = C:X then X = (B × C) ÷ A",
    breakdown: [
      `X = (${formatNumber(rb)} × ${formatNumber(rc)}) ÷ ${formatNumber(ra)} = ${formatNumber(result)}`,
    ],
    copyText: formatNumber(result),
  };
}

export function calculateDiscount(price: string, rate: string): CalculatorResult {
  const original = parseNumber(price, "original price");
  const percent = parseNumber(rate, "discount percentage");
  if (original < 0) throw new Error("Price cannot be negative.");
  const discount = (original * percent) / 100;
  const final = original - discount;
  return {
    primary: formatNumber(final),
    details: {
      "Discount Amount": formatNumber(discount),
      "Final Price": formatNumber(final),
    },
    formula: "Discount = Original × (Rate ÷ 100); Final = Original − Discount",
    breakdown: [
      `${formatNumber(original)} × (${formatNumber(percent)} ÷ 100) = ${formatNumber(discount)}`,
      `${formatNumber(original)} − ${formatNumber(discount)} = ${formatNumber(final)}`,
    ],
    copyText: formatNumber(final),
  };
}

export function calculateTax(
  mode: "add" | "remove",
  price: string,
  rate: string,
): CalculatorResult {
  const amount = parseNumber(price, "price");
  const percent = parseNumber(rate, "tax rate");
  if (amount < 0) throw new Error("Price cannot be negative.");
  if (percent < 0) throw new Error("Tax rate cannot be negative.");

  if (mode === "add") {
    const tax = (amount * percent) / 100;
    const total = amount + tax;
    return {
      primary: formatNumber(total),
      details: {
        "Tax Amount": formatNumber(tax),
        Total: formatNumber(total),
      },
      formula: "Tax = Price × (Rate ÷ 100); Total = Price + Tax",
      breakdown: [
        `${formatNumber(amount)} × (${formatNumber(percent)} ÷ 100) = ${formatNumber(tax)}`,
        `${formatNumber(amount)} + ${formatNumber(tax)} = ${formatNumber(total)}`,
      ],
      copyText: formatNumber(total),
    };
  }

  const tax = (amount * percent) / (100 + percent);
  const net = amount - tax;
  return {
    primary: formatNumber(net),
    details: {
      "Tax Component": formatNumber(tax),
      "Net Price": formatNumber(net),
    },
    formula: "Tax component = Total × Rate ÷ (100 + Rate)",
    breakdown: [
      `${formatNumber(amount)} × ${formatNumber(percent)} ÷ (${formatNumber(100 + percent)}) = ${formatNumber(tax)}`,
      `${formatNumber(amount)} − ${formatNumber(tax)} = ${formatNumber(net)}`,
    ],
    copyText: formatNumber(net),
  };
}

export function calculateTip(
  bill: string,
  tipPercent: string,
  people: string,
): CalculatorResult {
  const amount = parseNumber(bill, "bill amount");
  const percent = parseNumber(tipPercent, "tip percentage");
  const count = parseNumber(people, "number of people");
  if (amount < 0) throw new Error("Bill amount cannot be negative.");
  if (count <= 0) throw new Error("Number of people must be greater than zero.");
  const tip = (amount * percent) / 100;
  const total = amount + tip;
  const perTip = tip / count;
  const perTotal = total / count;
  return {
    primary: formatNumber(total),
    details: {
      "Tip Amount": formatNumber(tip),
      "Total Bill": formatNumber(total),
      "Per-person Tip": formatNumber(perTip, 2),
      "Per-person Total": formatNumber(perTotal, 2),
    },
    formula: "Tip = Bill × (Rate ÷ 100); Total = Bill + Tip",
    breakdown: [
      `${formatNumber(amount)} × (${formatNumber(percent)} ÷ 100) = ${formatNumber(tip)}`,
      `${formatNumber(amount)} + ${formatNumber(tip)} = ${formatNumber(total)}`,
      `${formatNumber(total)} ÷ ${formatNumber(count)} = ${formatNumber(perTotal, 2)} per person`,
    ],
    copyText: formatNumber(total),
  };
}
