import {
  calculateAge,
  calculateDateDifference,
} from "./dates";
import {
  calculateAverage,
  calculateDiscount,
  calculateFraction,
  calculatePercentage,
  calculateRatio,
  calculateTax,
  calculateTip,
} from "./math";
import { numberToWords } from "./number-words";
import { convertTimeZone } from "./timezone";
import type {
  CalculatorOptions,
  CalculatorResult,
  CalculatorToolConfig,
  UnitCategory,
} from "./types";
import { convertLinear, formatNumber, getUnits } from "./units";

function parseValue(raw: string): number {
  const trimmed = raw.trim().replace(/,/g, "");
  if (!trimmed) throw new Error("Please enter a valid number.");
  const n = Number(trimmed);
  if (!Number.isFinite(n)) throw new Error("Please enter a valid number.");
  return n;
}

export function processCalculator(
  config: CalculatorToolConfig,
  options: CalculatorOptions,
): CalculatorResult {
  switch (config.kind) {
    case "unit-converter":
    case "length":
    case "weight":
    case "temperature":
    case "area":
    case "volume":
    case "speed":
    case "time":
    case "data-storage": {
      const category =
        (config.unitCategory || options.category || "length") as UnitCategory;
      const value = parseValue(options.value || "");
      const from = options.fromUnit || getUnits(category)[0].id;
      const to = options.toUnit || getUnits(category)[1]?.id || from;
      const result = convertLinear(value, category, from, to);
      const fromLabel = getUnits(category).find((u) => u.id === from)?.label || from;
      const toLabel = getUnits(category).find((u) => u.id === to)?.label || to;
      return {
        primary: `${formatNumber(result)} ${to}`,
        secondary: `${formatNumber(value)} ${from} = ${formatNumber(result)} ${to}`,
        formula: `${fromLabel} → ${toLabel}`,
        copyText: formatNumber(result),
      };
    }
    case "number-words":
      return {
        primary: numberToWords(options.numberInput || options.value || ""),
        copyText: numberToWords(options.numberInput || options.value || ""),
      };
    case "percentage": {
      const mode = options.percentMode || "of";
      if (mode === "of") {
        return calculatePercentage("of", options.percent || "", options.number || "");
      }
      if (mode === "is-what") {
        return calculatePercentage(
          "is-what",
          options.number || "",
          options.original || "",
        );
      }
      return calculatePercentage(
        "change",
        options.original || "",
        options.next || "",
      );
    }
    case "fraction":
      return calculateFraction(
        options.fracOp || "add",
        options.num1 || "0",
        options.den1 || "1",
        options.num2 || "0",
        options.den2 || "1",
      );
    case "average":
      return calculateAverage(options.numbersText || "");
    case "ratio":
      return calculateRatio(
        options.ratioMode || "simplify",
        options.ratioA || "",
        options.ratioB || "",
        options.ratioC,
      );
    case "discount":
      return calculateDiscount(options.price || "", options.rate || "");
    case "tax":
      return calculateTax(options.taxMode || "add", options.price || "", options.rate || "");
    case "tip":
      return calculateTip(
        options.price || "",
        options.rate || "",
        options.people || "1",
      );
    case "date-difference":
      return calculateDateDifference(
        options.startDate || "",
        options.endDate || "",
        Boolean(options.inclusive),
      );
    case "age":
      return calculateAge(
        options.birthDate || "",
        options.targetDate || new Date().toISOString().slice(0, 10),
      );
    case "timezone":
      return convertTimeZone(
        options.date || "",
        options.time || "",
        options.fromTz || "",
        options.toTz || "",
      );
    default:
      throw new Error("Unsupported calculator.");
  }
}
