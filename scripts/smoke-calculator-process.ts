import { processCalculator } from "../lib/calculator/process";
import { getCalculatorToolConfig } from "../lib/calculator/configs";
import { numberToWords } from "../lib/calculator/number-words";
import { convertLinear } from "../lib/calculator/units";
import { calculateAge, calculateDateDifference } from "../lib/calculator/dates";
import { convertTimeZone } from "../lib/calculator/timezone";

function cfg(slug: string) {
  const c = getCalculatorToolConfig(slug);
  if (!c) throw new Error("missing " + slug);
  return c;
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

assert(convertLinear(1, "length", "m", "cm") === 100, "1m!=100cm");
assert(Math.abs(convertLinear(1, "length", "ft", "in") - 12) < 1e-10, "ft");
assert(convertLinear(1, "weight", "kg", "g") === 1000, "kg");
assert(convertLinear(0, "temperature", "C", "F") === 32, "0C");
assert(convertLinear(100, "temperature", "C", "F") === 212, "100C");
assert(convertLinear(1, "area", "m2", "cm2") === 10000, "area");
assert(convertLinear(1, "volume", "L", "mL") === 1000, "vol");
assert(
  Math.abs(convertLinear(1, "speed", "kmh", "mph") - 0.621371) < 1e-5,
  "mph",
);

assert(
  processCalculator(cfg("percentage-calculator"), {
    percentMode: "of",
    percent: "20",
    number: "150",
  }).primary === "30",
  "pct",
);
assert(
  processCalculator(cfg("percentage-calculator"), {
    percentMode: "is-what",
    number: "30",
    original: "150",
  }).primary === "20%",
  "is-what",
);
assert(
  processCalculator(cfg("fraction-calculator"), {
    fracOp: "add",
    num1: "1",
    den1: "2",
    num2: "1",
    den2: "4",
  }).primary === "3/4",
  "frac",
);
assert(
  processCalculator(cfg("average-calculator"), { numbersText: "10,20,30" })
    .primary === "20",
  "avg",
);
assert(
  processCalculator(cfg("ratio-calculator"), {
    ratioMode: "simplify",
    ratioA: "10",
    ratioB: "20",
  }).primary === "1:2",
  "ratio",
);
assert(
  processCalculator(cfg("ratio-calculator"), {
    ratioMode: "solve",
    ratioA: "2",
    ratioB: "3",
    ratioC: "10",
  }).primary === "15",
  "ratio solve",
);
assert(
  processCalculator(cfg("discount-calculator"), { price: "100", rate: "20" })
    .primary === "80",
  "disc",
);
assert(
  processCalculator(cfg("vat-tax-calculator"), {
    taxMode: "add",
    price: "100",
    rate: "15",
  }).primary === "115",
  "tax",
);
const tip = processCalculator(cfg("tip-calculator"), {
  price: "100",
  rate: "15",
  people: "2",
});
assert(tip.primary === "115", "tip");
assert(tip.details?.["Per-person Total"] === "57.5", "per person");

assert(numberToWords("125") === "One Hundred Twenty-Five", "words");
assert(
  numberToWords("125.50") === "One Hundred Twenty-Five Point Five Zero",
  "words2",
);

assert(
  calculateAge("2000-01-15", "2018-05-27").primary ===
    "18 years, 4 months, 12 days",
  "age",
);
assert(
  calculateDateDifference("2024-02-28", "2024-03-01", false).details?.[
    "Total days"
  ] === "2",
  "date diff",
);

const tz = convertTimeZone(
  "2024-07-01",
  "15:00",
  "Asia/Karachi",
  "Europe/London",
);
console.log("TZ:", tz.primary);
assert(tz.primary.includes("2024"), "tz year");

// DST-ish sample: winter vs summer London
const winter = convertTimeZone(
  "2024-01-15",
  "12:00",
  "America/New_York",
  "Europe/London",
);
const summer = convertTimeZone(
  "2024-07-15",
  "12:00",
  "America/New_York",
  "Europe/London",
);
console.log("NY->London winter:", winter.primary);
console.log("NY->London summer:", summer.primary);

console.log("smoke-calculator-process: OK");
