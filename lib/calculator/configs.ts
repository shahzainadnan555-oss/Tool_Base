import type { CalculatorToolConfig, CalculatorToolKind, UnitCategory } from "./types";

function make(
  slug: string,
  kind: CalculatorToolKind,
  extras: Partial<CalculatorToolConfig> = {},
): CalculatorToolConfig {
  return {
    slug,
    kind,
    live: extras.live ?? true,
    notices: extras.notices ?? [],
    unitCategory: extras.unitCategory,
    allowCategorySelect: extras.allowCategorySelect,
    actionLabel: extras.actionLabel,
  };
}

export const calculatorToolConfigs: Record<string, CalculatorToolConfig> = {
  "unit-converter": make("unit-converter", "unit-converter", {
    allowCategorySelect: true,
    unitCategory: "length",
  }),
  "length-converter": make("length-converter", "length", { unitCategory: "length" }),
  "weight-converter": make("weight-converter", "weight", { unitCategory: "weight" }),
  "temperature-converter": make("temperature-converter", "temperature", {
    unitCategory: "temperature",
  }),
  "area-converter": make("area-converter", "area", { unitCategory: "area" }),
  "volume-converter": make("volume-converter", "volume", { unitCategory: "volume" }),
  "speed-converter": make("speed-converter", "speed", { unitCategory: "speed" }),
  "time-converter": make("time-converter", "time", {
    unitCategory: "time",
    notices: [
      "This converter uses fixed-duration units only (milliseconds through weeks).",
    ],
  }),
  "data-storage-converter": make("data-storage-converter", "data-storage", {
    unitCategory: "data",
    notices: [
      "Decimal units (KB, MB, GB) use powers of 1,000. Binary units (KiB, MiB, GiB) use powers of 1,024.",
    ],
  }),
  "number-to-words": make("number-to-words", "number-words"),
  "percentage-calculator": make("percentage-calculator", "percentage"),
  "fraction-calculator": make("fraction-calculator", "fraction"),
  "average-calculator": make("average-calculator", "average"),
  "ratio-calculator": make("ratio-calculator", "ratio"),
  "discount-calculator": make("discount-calculator", "discount"),
  "vat-tax-calculator": make("vat-tax-calculator", "tax", {
    notices: [
      "This calculator provides a general mathematical calculation. Tax rates and tax rules vary by location and situation.",
    ],
  }),
  "tip-calculator": make("tip-calculator", "tip"),
  "date-difference-calculator": make("date-difference-calculator", "date-difference"),
  "age-calculator": make("age-calculator", "age"),
  "time-zone-converter": make("time-zone-converter", "timezone", {
    notices: [
      "Conversions use IANA time zone identifiers and platform timezone rules, including daylight saving where applicable.",
    ],
  }),
};

export function getCalculatorToolConfig(
  slug: string,
): CalculatorToolConfig | undefined {
  return calculatorToolConfigs[slug];
}

export function isCalculatorToolSlug(slug: string): boolean {
  return Boolean(calculatorToolConfigs[slug]);
}

export const calculatorToolSlugs = Object.keys(calculatorToolConfigs);

export function defaultUnitsFor(category: UnitCategory): [string, string] {
  const map: Record<UnitCategory, [string, string]> = {
    length: ["m", "ft"],
    weight: ["kg", "lb"],
    temperature: ["C", "F"],
    area: ["m2", "ft2"],
    volume: ["L", "gal"],
    speed: ["kmh", "mph"],
    time: ["h", "min"],
    data: ["MB", "MiB"],
  };
  return map[category];
}
