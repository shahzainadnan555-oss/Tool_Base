import type { UnitCategory, UnitDef } from "./types";

/** Exact factors relative to a base unit per category. */
export const UNIT_SETS: Record<UnitCategory, { base: string; units: UnitDef[] }> = {
  length: {
    base: "m",
    units: [
      { id: "mm", label: "Millimeter (mm)", toBase: 0.001 },
      { id: "cm", label: "Centimeter (cm)", toBase: 0.01 },
      { id: "m", label: "Meter (m)", toBase: 1 },
      { id: "km", label: "Kilometer (km)", toBase: 1000 },
      { id: "in", label: "Inch (in)", toBase: 0.0254 },
      { id: "ft", label: "Foot (ft)", toBase: 0.3048 },
      { id: "yd", label: "Yard (yd)", toBase: 0.9144 },
      { id: "mi", label: "Mile (mi)", toBase: 1609.344 },
      { id: "nmi", label: "Nautical mile (nmi)", toBase: 1852 },
      { id: "um", label: "Micrometer (µm)", toBase: 1e-6 },
    ],
  },
  weight: {
    base: "kg",
    units: [
      { id: "mg", label: "Milligram (mg)", toBase: 1e-6 },
      { id: "g", label: "Gram (g)", toBase: 0.001 },
      { id: "kg", label: "Kilogram (kg)", toBase: 1 },
      { id: "t", label: "Metric ton (t)", toBase: 1000 },
      { id: "oz", label: "Ounce (oz)", toBase: 0.028349523125 },
      { id: "lb", label: "Pound (lb)", toBase: 0.45359237 },
      { id: "st", label: "Stone (st)", toBase: 6.35029318 },
    ],
  },
  temperature: {
    base: "C",
    units: [
      { id: "C", label: "Celsius (°C)" },
      { id: "F", label: "Fahrenheit (°F)" },
      { id: "K", label: "Kelvin (K)" },
    ],
  },
  area: {
    base: "m2",
    units: [
      { id: "mm2", label: "Square millimeter (mm²)", toBase: 1e-6 },
      { id: "cm2", label: "Square centimeter (cm²)", toBase: 1e-4 },
      { id: "m2", label: "Square meter (m²)", toBase: 1 },
      { id: "km2", label: "Square kilometer (km²)", toBase: 1e6 },
      { id: "in2", label: "Square inch (in²)", toBase: 0.00064516 },
      { id: "ft2", label: "Square foot (ft²)", toBase: 0.09290304 },
      { id: "yd2", label: "Square yard (yd²)", toBase: 0.83612736 },
      { id: "acre", label: "Acre", toBase: 4046.8564224 },
      { id: "ha", label: "Hectare (ha)", toBase: 10000 },
    ],
  },
  volume: {
    base: "L",
    units: [
      { id: "mL", label: "Milliliter (mL)", toBase: 0.001 },
      { id: "L", label: "Liter (L)", toBase: 1 },
      { id: "cm3", label: "Cubic centimeter (cm³)", toBase: 0.001 },
      { id: "m3", label: "Cubic meter (m³)", toBase: 1000 },
      { id: "floz", label: "US fluid ounce (fl oz)", toBase: 0.0295735295625 },
      { id: "cup", label: "US cup", toBase: 0.2365882365 },
      { id: "pt", label: "US pint (pt)", toBase: 0.473176473 },
      { id: "qt", label: "US quart (qt)", toBase: 0.946352946 },
      { id: "gal", label: "US gallon (gal)", toBase: 3.785411784 },
    ],
  },
  speed: {
    base: "mps",
    units: [
      { id: "mps", label: "Meters per second (m/s)", toBase: 1 },
      { id: "kmh", label: "Kilometers per hour (km/h)", toBase: 1000 / 3600 },
      { id: "mph", label: "Miles per hour (mph)", toBase: 1609.344 / 3600 },
      { id: "fps", label: "Feet per second (ft/s)", toBase: 0.3048 },
      { id: "kn", label: "Knot (kn)", toBase: 1852 / 3600 },
    ],
  },
  time: {
    base: "s",
    units: [
      { id: "ms", label: "Milliseconds (ms)", toBase: 0.001 },
      { id: "s", label: "Seconds (s)", toBase: 1 },
      { id: "min", label: "Minutes (min)", toBase: 60 },
      { id: "h", label: "Hours (h)", toBase: 3600 },
      { id: "d", label: "Days (d)", toBase: 86400 },
      { id: "wk", label: "Weeks (wk)", toBase: 604800 },
    ],
  },
  data: {
    base: "B",
    units: [
      { id: "bit", label: "Bit (b)", toBase: 1 / 8 },
      { id: "B", label: "Byte (B)", toBase: 1 },
      { id: "KB", label: "Kilobyte (KB, decimal)", toBase: 1000 },
      { id: "MB", label: "Megabyte (MB, decimal)", toBase: 1e6 },
      { id: "GB", label: "Gigabyte (GB, decimal)", toBase: 1e9 },
      { id: "TB", label: "Terabyte (TB, decimal)", toBase: 1e12 },
      { id: "PB", label: "Petabyte (PB, decimal)", toBase: 1e15 },
      { id: "KiB", label: "Kibibyte (KiB, binary)", toBase: 1024 },
      { id: "MiB", label: "Mebibyte (MiB, binary)", toBase: 1024 ** 2 },
      { id: "GiB", label: "Gibibyte (GiB, binary)", toBase: 1024 ** 3 },
      { id: "TiB", label: "Tebibyte (TiB, binary)", toBase: 1024 ** 4 },
    ],
  },
};

export const CATEGORY_LABELS: Record<UnitCategory, string> = {
  length: "Length",
  weight: "Weight / Mass",
  temperature: "Temperature",
  area: "Area",
  volume: "Volume",
  speed: "Speed",
  time: "Time",
  data: "Data Storage",
};

export function getUnits(category: UnitCategory): UnitDef[] {
  return UNIT_SETS[category].units;
}

export function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "C") celsius = value;
  else if (from === "F") celsius = ((value - 32) * 5) / 9;
  else if (from === "K") celsius = value - 273.15;
  else throw new Error("Unsupported temperature unit.");

  if (to === "C") return celsius;
  if (to === "F") return (celsius * 9) / 5 + 32;
  if (to === "K") return celsius + 273.15;
  throw new Error("Unsupported temperature unit.");
}

export function convertLinear(
  value: number,
  category: UnitCategory,
  fromId: string,
  toId: string,
): number {
  if (category === "temperature") return convertTemperature(value, fromId, toId);
  const units = UNIT_SETS[category].units;
  const from = units.find((u) => u.id === fromId);
  const to = units.find((u) => u.id === toId);
  if (!from?.toBase || !to?.toBase) throw new Error("Unsupported unit.");
  const base = value * from.toBase;
  return base / to.toBase;
}

export function formatNumber(value: number, maxDecimals = 8): string {
  if (!Number.isFinite(value)) throw new Error("Result is not a finite number.");
  if (Object.is(value, -0)) return "0";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-6)) {
    return value.toExponential(6);
  }
  const fixed = value.toFixed(maxDecimals);
  return fixed.replace(/\.?0+$/, "");
}
