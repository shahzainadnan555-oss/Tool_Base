import { formatFixed, formatMoney, formatNumber, formatPercent } from "./format";
import {
  currencySelect,
  def,
  moneyField,
  numberField,
  percentField,
  selectField,
} from "./catalog-helpers";
import { parseDate, parseNumber, parseOptionalNumber, parsePositiveInt } from "./parse";
import type { FormulaCalculatorSpec } from "./types";

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 86400000);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function ymd(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export const practicalCatalog: FormulaCalculatorSpec[] = [
  // Date & time
  def({
    slug: "date-calculator",
    name: "Date Calculator",
    subcategory: "date-time",
    shortDescription: "Add or subtract days from a date, or find a date offset.",
    keywords: ["date calculator", "add days to date", "date offset"],
    relatedToolIds: ["date-difference-calculator", "day-counter", "day-of-the-week-calculator", "age-calculator"],
    featured: true,
    fields: [
      { id: "start", label: "Start date", type: "date", defaultValue: "2026-01-01" },
      numberField("days", "Days to add (negative to subtract)", "30", { step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const start = parseDate(v.start, "start date");
      const days = parseNumber(v.days, "days");
      if (!Number.isInteger(days)) throw new Error("Days must be a whole number.");
      const result = addDays(start, days);
      return {
        primaryLabel: "Resulting date",
        primary: ymd(result),
        formula: "Result = start date ± days (calendar days, UTC date parts)",
        copyText: ymd(result),
      };
    },
  }),

  def({
    slug: "time-calculator",
    name: "Time Calculator",
    subcategory: "date-time",
    shortDescription: "Add or subtract hours, minutes, and seconds.",
    keywords: ["time calculator", "add time", "hours minutes seconds"],
    relatedToolIds: ["hours-calculator", "time-duration-calculator", "time-card-calculator"],
    fields: [
      selectField("op", "Operation", "add", [
        { value: "add", label: "Add" },
        { value: "sub", label: "Subtract" },
      ]),
      numberField("h1", "Hours A", "2", { step: "1", inputMode: "numeric" }),
      numberField("m1", "Minutes A", "45", { step: "1", inputMode: "numeric" }),
      numberField("s1", "Seconds A", "0", { step: "1", inputMode: "numeric" }),
      numberField("h2", "Hours B", "1", { step: "1", inputMode: "numeric" }),
      numberField("m2", "Minutes B", "20", { step: "1", inputMode: "numeric" }),
      numberField("s2", "Seconds B", "30", { step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const toSec = (h: string, m: string, s: string, label: string) =>
        parseNumber(h, `${label} hours`) * 3600 +
        parseNumber(m, `${label} minutes`) * 60 +
        parseNumber(s, `${label} seconds`);
      const a = toSec(v.h1, v.m1, v.s1, "A");
      const b = toSec(v.h2, v.m2, v.s2, "B");
      let total = v.op === "add" ? a + b : a - b;
      const neg = total < 0;
      total = Math.abs(total);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = Math.floor(total % 60);
      const text = `${neg ? "-" : ""}${h}h ${m}m ${s}s`;
      return { primaryLabel: "Result", primary: text, copyText: text };
    },
  }),

  def({
    slug: "hours-calculator",
    name: "Hours Calculator",
    subcategory: "date-time",
    shortDescription: "Convert between hours, minutes, seconds, and decimal hours.",
    keywords: ["hours calculator", "decimal hours", "time conversion"],
    relatedToolIds: ["time-calculator", "time-card-calculator", "time-duration-calculator"],
    fields: [
      selectField("mode", "Convert from", "hms", [
        { value: "hms", label: "H:M:S → decimal hours" },
        { value: "decimal", label: "Decimal hours → H:M:S" },
      ]),
      numberField("h", "Hours", "7", { step: "1", inputMode: "numeric" }),
      numberField("m", "Minutes", "30", { step: "1", inputMode: "numeric" }),
      numberField("s", "Seconds", "0", { step: "1", inputMode: "numeric" }),
      numberField("decimal", "Decimal hours", "7.5", { step: "0.01" }),
    ],
    compute: (v) => {
      if (v.mode === "hms") {
        const h = parseNumber(v.h, "hours");
        const m = parseNumber(v.m, "minutes");
        const s = parseNumber(v.s, "seconds");
        const dec = h + m / 60 + s / 3600;
        return {
          primaryLabel: "Decimal hours",
          primary: formatNumber(dec, 6),
          copyText: formatNumber(dec, 6),
        };
      }
      const dec = parseNumber(v.decimal, "decimal hours");
      const sign = dec < 0 ? "-" : "";
      const abs = Math.abs(dec);
      const h = Math.floor(abs);
      const mFloat = (abs - h) * 60;
      const m = Math.floor(mFloat);
      const s = Math.round((mFloat - m) * 60);
      const text = `${sign}${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      return { primaryLabel: "H:M:S", primary: text, copyText: text };
    },
  }),

  def({
    slug: "time-card-calculator",
    name: "Time Card Calculator",
    subcategory: "date-time",
    shortDescription: "Calculate worked hours between clock-in and clock-out with a break.",
    keywords: ["time card calculator", "timesheet hours", "hours worked"],
    relatedToolIds: ["hours-calculator", "time-duration-calculator", "salary-calculator"],
    fields: [
      { id: "in", label: "Clock in (HH:MM)", type: "text", defaultValue: "09:00" },
      { id: "out", label: "Clock out (HH:MM)", type: "text", defaultValue: "17:30" },
      numberField("breakMin", "Break (minutes)", "30", { min: "0", step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const parseHm = (raw: string, label: string) => {
        const m = /^(\d{1,2}):(\d{2})$/.exec(raw.trim());
        if (!m) throw new Error(`Enter ${label} as HH:MM.`);
        const h = Number(m[1]);
        const min = Number(m[2]);
        if (h > 23 || min > 59) throw new Error(`Invalid ${label}.`);
        return h * 60 + min;
      };
      const start = parseHm(v.in, "clock in");
      let end = parseHm(v.out, "clock out");
      if (end < start) end += 24 * 60;
      const br = parseOptionalNumber(v.breakMin, "break", 0);
      const worked = Math.max(0, end - start - br);
      return {
        primaryLabel: "Hours worked",
        primary: formatFixed(worked / 60, 2),
        breakdown: [{ label: "Minutes worked", value: String(worked) }],
        copyText: `${formatFixed(worked / 60, 2)} hours`,
      };
    },
  }),

  def({
    slug: "time-zone-calculator",
    name: "Time Zone Calculator",
    subcategory: "date-time",
    shortDescription: "Compare local times using IANA time zone identifiers.",
    keywords: ["time zone calculator", "timezone convert", "world clock"],
    relatedToolIds: ["time-zone-converter", "time-calculator", "day-of-the-week-calculator"],
    notices: ["Uses the browser/runtime IANA time zone database, including DST where applicable."],
    fields: [
      { id: "date", label: "Date", type: "date", defaultValue: "2026-06-15" },
      { id: "time", label: "Time (HH:MM)", type: "text", defaultValue: "12:00" },
      {
        id: "fromTz",
        label: "From time zone (IANA)",
        type: "text",
        defaultValue: "America/New_York",
      },
      {
        id: "toTz",
        label: "To time zone (IANA)",
        type: "text",
        defaultValue: "Europe/London",
      },
    ],
    compute: (v) => {
      const date = v.date.trim();
      const time = v.time.trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Enter a valid date.");
      if (!/^\d{1,2}:\d{2}$/.test(time)) throw new Error("Enter time as HH:MM.");
      const fromTz = v.fromTz.trim();
      const toTz = v.toTz.trim();
      // Interpret wall time in fromTz by formatting a UTC probe — use temporal-less approach:
      const localStamp = `${date}T${time.padStart(5, "0")}:00`;
      // Find UTC ms such that fromTz displays localStamp
      const guess = Date.parse(`${localStamp}Z`);
      if (!Number.isFinite(guess)) throw new Error("Invalid date/time.");
      const fmt = (ms: number, tz: string) => {
        try {
          return new Intl.DateTimeFormat("en-CA", {
            timeZone: tz,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(ms));
        } catch {
          throw new Error(`Unrecognized time zone: ${tz}`);
        }
      };
      // Adjust guess so fromTz matches requested wall clock
      let ms = guess;
      for (let i = 0; i < 3; i++) {
        const shown = fmt(ms, fromTz).replace(", ", "T").replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");
        // en-CA gives YYYY-MM-DD, HH:MM
        const parts = fmt(ms, fromTz).split(", ");
        const shownDate = parts[0];
        const shownTime = parts[1];
        const target = `${date} ${time.padStart(5, "0")}`;
        const current = `${shownDate} ${shownTime}`;
        const deltaMin =
          (Date.parse(`${target}:00Z`) - Date.parse(`${current}:00Z`)) / 60000;
        ms += deltaMin * 60000;
        void shown;
      }
      const result = fmt(ms, toTz);
      return {
        primaryLabel: `Time in ${toTz}`,
        primary: result,
        breakdown: [{ label: `Original (${fromTz})`, value: fmt(ms, fromTz) }],
        copyText: result,
      };
    },
  }),

  def({
    slug: "time-duration-calculator",
    name: "Time Duration Calculator",
    subcategory: "date-time",
    shortDescription: "Measure the duration between two date-times.",
    keywords: ["time duration", "duration calculator", "elapsed time"],
    relatedToolIds: ["date-difference-calculator", "hours-calculator", "day-counter"],
    fields: [
      { id: "start", label: "Start date", type: "date", defaultValue: "2026-01-01" },
      { id: "startTime", label: "Start time (HH:MM)", type: "text", defaultValue: "09:00" },
      { id: "end", label: "End date", type: "date", defaultValue: "2026-01-02" },
      { id: "endTime", label: "End time (HH:MM)", type: "text", defaultValue: "17:00" },
    ],
    compute: (v) => {
      const start = Date.parse(`${v.start}T${v.startTime.padStart(5, "0")}:00`);
      const end = Date.parse(`${v.end}T${v.endTime.padStart(5, "0")}:00`);
      if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error("Enter valid date/times.");
      const ms = end - start;
      if (ms < 0) throw new Error("End must be after start.");
      const minutes = Math.floor(ms / 60000);
      const days = Math.floor(minutes / (60 * 24));
      const hours = Math.floor((minutes % (60 * 24)) / 60);
      const mins = minutes % 60;
      return {
        primaryLabel: "Duration",
        primary: `${days}d ${hours}h ${mins}m`,
        breakdown: [{ label: "Total hours", value: formatFixed(minutes / 60, 2) }],
        copyText: `${days}d ${hours}h ${mins}m`,
      };
    },
  }),

  def({
    slug: "day-counter",
    name: "Day Counter",
    subcategory: "date-time",
    shortDescription: "Count the number of days between two dates.",
    keywords: ["day counter", "days between dates"],
    relatedToolIds: ["date-difference-calculator", "date-calculator", "day-of-the-week-calculator"],
    fields: [
      { id: "start", label: "Start date", type: "date", defaultValue: "2026-01-01" },
      { id: "end", label: "End date", type: "date", defaultValue: "2026-12-31" },
      selectField("inclusive", "Count", "exclusive", [
        { value: "exclusive", label: "Exclusive (end − start)" },
        { value: "inclusive", label: "Inclusive of both dates" },
      ]),
    ],
    compute: (v) => {
      const start = parseDate(v.start, "start date");
      const end = parseDate(v.end, "end date");
      let days = daysBetween(start, end);
      if (v.inclusive === "inclusive") days += days >= 0 ? 1 : -1;
      return {
        primaryLabel: "Days",
        primary: String(days),
        formula: "UTC calendar-day difference",
        copyText: `${days} days`,
      };
    },
  }),

  def({
    slug: "day-of-the-week-calculator",
    name: "Day of the Week Calculator",
    subcategory: "date-time",
    shortDescription: "Find the weekday for any calendar date.",
    keywords: ["day of the week", "what day was", "weekday calculator"],
    relatedToolIds: ["date-calculator", "day-counter", "age-calculator"],
    fields: [{ id: "date", label: "Date", type: "date", defaultValue: "2026-10-09" }],
    compute: (v) => {
      const d = parseDate(v.date, "date");
      const weekday = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: "UTC",
      }).format(d);
      return {
        primaryLabel: "Weekday",
        primary: weekday,
        copyText: weekday,
      };
    },
  }),

  // Construction
  def({
    slug: "concrete-calculator",
    name: "Concrete Calculator",
    subcategory: "construction",
    shortDescription: "Estimate concrete volume for slabs, footings, or columns.",
    keywords: ["concrete calculator", "concrete volume", "yardage"],
    relatedToolIds: ["square-footage-calculator", "gravel-calculator", "mulch-calculator"],
    featured: true,
    fields: [
      selectField("shape", "Shape", "slab", [
        { value: "slab", label: "Slab" },
        { value: "footing", label: "Footing / wall" },
        { value: "column", label: "Round column" },
      ]),
      numberField("length", "Length (ft)", "10", { min: "0" }),
      numberField("width", "Width (ft)", "10", { min: "0" }),
      numberField("thickness", "Thickness / height (inches)", "4", { min: "0" }),
      numberField("diameter", "Diameter (ft, column)", "1", { min: "0" }),
    ],
    compute: (v) => {
      let cuFt = 0;
      if (v.shape === "column") {
        const d = parseNumber(v.diameter, "diameter", { allowZero: false, allowNegative: false });
        const h = parseNumber(v.thickness, "height inches", { allowZero: false, allowNegative: false }) / 12;
        cuFt = Math.PI * (d / 2) ** 2 * h;
      } else {
        const l = parseNumber(v.length, "length", { allowZero: false, allowNegative: false });
        const w = parseNumber(v.width, "width", { allowZero: false, allowNegative: false });
        const t = parseNumber(v.thickness, "thickness", { allowZero: false, allowNegative: false }) / 12;
        cuFt = l * w * t;
      }
      const cuYd = cuFt / 27;
      return {
        primaryLabel: "Cubic yards",
        primary: formatFixed(cuYd, 3),
        breakdown: [
          { label: "Cubic feet", value: formatFixed(cuFt, 2) },
          { label: "With 10% waste", value: formatFixed(cuYd * 1.1, 3) },
        ],
        formula: "Volume ft³ / 27 = yd³",
        copyText: `${formatFixed(cuYd, 3)} yd³`,
      };
    },
  }),

  def({
    slug: "btu-calculator",
    name: "BTU Calculator",
    subcategory: "construction",
    shortDescription: "Rough HVAC sizing estimate from room size and climate factor.",
    keywords: ["btu calculator", "ac btu", "heating btu"],
    relatedToolIds: ["square-footage-calculator", "electricity-calculator"],
    notices: ["Rule-of-thumb estimate only — not a substitute for Manual J sizing."],
    fields: [
      numberField("sqft", "Room area (sq ft)", "300", { min: "1" }),
      numberField("height", "Ceiling height (ft)", "8", { min: "1" }),
      selectField("climate", "Climate factor", "20", [
        { value: "15", label: "Mild (15 BTU/sq ft)" },
        { value: "20", label: "Average (20)" },
        { value: "30", label: "Hot / cold extreme (30)" },
      ]),
      numberField("people", "Extra people beyond 2", "0", { min: "0", step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const sqft = parseNumber(v.sqft, "area", { min: 1 });
      const factor = parseNumber(v.climate, "climate");
      const people = parseOptionalNumber(v.people, "people", 0);
      const height = parseNumber(v.height, "height", { min: 1 });
      const btu = sqft * factor * (height / 8) + people * 600;
      return {
        primaryLabel: "Estimated BTU/hr",
        primary: formatNumber(btu, 0),
        formula: "BTU ≈ area × climate factor × height/8 + 600×extra people",
        copyText: `${formatNumber(btu, 0)} BTU/hr`,
      };
    },
  }),

  def({
    slug: "square-footage-calculator",
    name: "Square Footage Calculator",
    subcategory: "construction",
    shortDescription: "Calculate area in square feet from length and width measurements.",
    keywords: ["square footage calculator", "sq ft calculator"],
    relatedToolIds: ["concrete-calculator", "tile-calculator", "roofing-calculator"],
    fields: [
      numberField("length", "Length", "20", { min: "0" }),
      numberField("width", "Width", "15", { min: "0" }),
      selectField("unit", "Unit", "ft", [
        { value: "ft", label: "Feet" },
        { value: "in", label: "Inches" },
        { value: "m", label: "Meters" },
      ]),
    ],
    compute: (v) => {
      let l = parseNumber(v.length, "length", { allowNegative: false });
      let w = parseNumber(v.width, "width", { allowNegative: false });
      if (v.unit === "in") {
        l /= 12;
        w /= 12;
      }
      if (v.unit === "m") {
        l *= 3.280839895;
        w *= 3.280839895;
      }
      const sqft = l * w;
      return {
        primaryLabel: "Square feet",
        primary: formatFixed(sqft, 2),
        breakdown: [{ label: "Square meters", value: formatFixed(sqft * 0.092903, 2) }],
        copyText: `${formatFixed(sqft, 2)} sq ft`,
      };
    },
  }),

  def({
    slug: "stair-calculator",
    name: "Stair Calculator",
    subcategory: "construction",
    shortDescription: "Estimate stair risers, treads, and total run from total rise.",
    keywords: ["stair calculator", "riser tread", "staircase"],
    relatedToolIds: ["square-footage-calculator", "roofing-calculator"],
    fields: [
      numberField("rise", "Total rise (inches)", "108", { min: "1" }),
      numberField("idealRiser", "Ideal riser height (inches)", "7", { min: "1" }),
      numberField("tread", "Tread depth (inches)", "10", { min: "1" }),
    ],
    compute: (v) => {
      const rise = parseNumber(v.rise, "total rise", { min: 1 });
      const ideal = parseNumber(v.idealRiser, "ideal riser", { min: 1 });
      const tread = parseNumber(v.tread, "tread", { min: 1 });
      const risers = Math.max(1, Math.round(rise / ideal));
      const riserH = rise / risers;
      const treads = risers - 1;
      const run = treads * tread;
      return {
        primaryLabel: "Number of risers",
        primary: String(risers),
        breakdown: [
          { label: "Riser height", value: `${formatFixed(riserH, 3)} in` },
          { label: "Number of treads", value: String(treads) },
          { label: "Total run", value: `${formatFixed(run, 2)} in` },
        ],
        formula: "risers ≈ round(total rise / ideal riser)",
        copyText: `${risers} risers at ${formatFixed(riserH, 3)} in`,
      };
    },
  }),

  def({
    slug: "roofing-calculator",
    name: "Roofing Calculator",
    subcategory: "construction",
    shortDescription: "Estimate roof area and shingle squares from footprint and pitch.",
    keywords: ["roofing calculator", "roof squares", "shingle calculator"],
    relatedToolIds: ["square-footage-calculator", "tile-calculator"],
    fields: [
      numberField("length", "House length (ft)", "40", { min: "1" }),
      numberField("width", "House width (ft)", "30", { min: "1" }),
      numberField("pitch", "Pitch (rise / 12)", "6", { min: "0" }),
      percentField("waste", "Waste (%)", "10"),
    ],
    compute: (v) => {
      const length = parseNumber(v.length, "length", { min: 1 });
      const width = parseNumber(v.width, "width", { min: 1 });
      const pitch = parseNumber(v.pitch, "pitch", { allowNegative: false });
      const waste = parseNumber(v.waste, "waste", { allowNegative: false }) / 100;
      const factor = Math.sqrt(1 + (pitch / 12) ** 2);
      const area = length * width * factor;
      const withWaste = area * (1 + waste);
      const squares = withWaste / 100;
      return {
        primaryLabel: "Roofing squares",
        primary: formatFixed(squares, 2),
        breakdown: [
          { label: "Roof area (sq ft)", value: formatFixed(area, 1) },
          { label: "With waste", value: formatFixed(withWaste, 1) },
        ],
        formula: "Area ≈ footprint × √(1 + (pitch/12)²)",
        copyText: `${formatFixed(squares, 2)} squares`,
      };
    },
  }),

  def({
    slug: "tile-calculator",
    name: "Tile Calculator",
    subcategory: "construction",
    shortDescription: "Estimate how many tiles you need for a floor or wall.",
    keywords: ["tile calculator", "how many tiles"],
    relatedToolIds: ["square-footage-calculator", "mulch-calculator"],
    fields: [
      numberField("roomL", "Room length (ft)", "12", { min: "0" }),
      numberField("roomW", "Room width (ft)", "10", { min: "0" }),
      numberField("tileL", "Tile length (inches)", "12", { min: "0" }),
      numberField("tileW", "Tile width (inches)", "12", { min: "0" }),
      percentField("waste", "Waste (%)", "10"),
    ],
    compute: (v) => {
      const area = parseNumber(v.roomL, "room length") * parseNumber(v.roomW, "room width");
      const tileFt =
        (parseNumber(v.tileL, "tile length", { allowZero: false }) / 12) *
        (parseNumber(v.tileW, "tile width", { allowZero: false }) / 12);
      const waste = parseNumber(v.waste, "waste", { allowNegative: false }) / 100;
      const tiles = Math.ceil((area / tileFt) * (1 + waste));
      return {
        primaryLabel: "Tiles needed",
        primary: String(tiles),
        breakdown: [{ label: "Room area (sq ft)", value: formatFixed(area, 2) }],
        formula: "tiles = ceil(room area / tile area × (1+waste))",
        copyText: `${tiles} tiles`,
      };
    },
  }),

  def({
    slug: "mulch-calculator",
    name: "Mulch Calculator",
    subcategory: "construction",
    shortDescription: "Estimate mulch volume in cubic yards for a bed.",
    keywords: ["mulch calculator", "mulch yards"],
    relatedToolIds: ["gravel-calculator", "square-footage-calculator"],
    fields: [
      numberField("length", "Length (ft)", "20", { min: "0" }),
      numberField("width", "Width (ft)", "8", { min: "0" }),
      numberField("depth", "Depth (inches)", "3", { min: "0" }),
    ],
    compute: (v) => {
      const cuFt =
        parseNumber(v.length, "length") *
        parseNumber(v.width, "width") *
        (parseNumber(v.depth, "depth") / 12);
      const cuYd = cuFt / 27;
      return {
        primaryLabel: "Cubic yards",
        primary: formatFixed(cuYd, 2),
        copyText: `${formatFixed(cuYd, 2)} yd³`,
      };
    },
  }),

  def({
    slug: "gravel-calculator",
    name: "Gravel Calculator",
    subcategory: "construction",
    shortDescription: "Estimate gravel or crushed stone volume for a project area.",
    keywords: ["gravel calculator", "crushed stone calculator"],
    relatedToolIds: ["mulch-calculator", "concrete-calculator", "square-footage-calculator"],
    fields: [
      numberField("length", "Length (ft)", "30", { min: "0" }),
      numberField("width", "Width (ft)", "10", { min: "0" }),
      numberField("depth", "Depth (inches)", "4", { min: "0" }),
    ],
    compute: (v) => {
      const cuFt =
        parseNumber(v.length, "length") *
        parseNumber(v.width, "width") *
        (parseNumber(v.depth, "depth") / 12);
      return {
        primaryLabel: "Cubic yards",
        primary: formatFixed(cuFt / 27, 2),
        breakdown: [{ label: "Tons (approx @ 1.4 t/yd³)", value: formatFixed((cuFt / 27) * 1.4, 2) }],
        notes: ["Density varies by material; ton estimate is approximate."],
        copyText: `${formatFixed(cuFt / 27, 2)} yd³`,
      };
    },
  }),

  // Measurement / other science-ish safe
  def({
    slug: "conversion-calculator",
    name: "Conversion Calculator",
    subcategory: "measurement",
    shortDescription: "Quick conversions for length, mass, and temperature common pairs.",
    keywords: ["conversion calculator", "unit conversion quick"],
    relatedToolIds: ["unit-converter", "length-converter", "weight-converter", "temperature-converter"],
    fields: [
      selectField("pair", "Conversion", "mi-km", [
        { value: "mi-km", label: "Miles ↔ Kilometers" },
        { value: "lb-kg", label: "Pounds ↔ Kilograms" },
        { value: "f-c", label: "°F ↔ °C" },
        { value: "gal-l", label: "Gallons (US) ↔ Liters" },
      ]),
      numberField("value", "Value", "10"),
      selectField("direction", "Direction", "forward", [
        { value: "forward", label: "First → second" },
        { value: "reverse", label: "Second → first" },
      ]),
    ],
    compute: (v) => {
      const x = parseNumber(v.value, "value");
      const fwd = v.direction === "forward";
      const map: Record<string, (n: number, f: boolean) => number> = {
        "mi-km": (n, f) => (f ? n * 1.609344 : n / 1.609344),
        "lb-kg": (n, f) => (f ? n * 0.45359237 : n / 0.45359237),
        "f-c": (n, f) => (f ? ((n - 32) * 5) / 9 : (n * 9) / 5 + 32),
        "gal-l": (n, f) => (f ? n * 3.785411784 : n / 3.785411784),
      };
      const result = map[v.pair](x, fwd);
      return {
        primaryLabel: "Converted value",
        primary: formatNumber(result, 8),
        copyText: formatNumber(result, 8),
      };
    },
  }),

  def({
    slug: "density-calculator",
    name: "Density Calculator",
    subcategory: "measurement",
    shortDescription: "Calculate density, mass, or volume from the other two values.",
    keywords: ["density calculator", "mass volume density"],
    relatedToolIds: ["mass-calculator", "volume-calculator"],
    fields: [
      selectField("solve", "Solve for", "density", [
        { value: "density", label: "Density" },
        { value: "mass", label: "Mass" },
        { value: "volume", label: "Volume" },
      ]),
      numberField("mass", "Mass", "10", { min: "0" }),
      numberField("volume", "Volume", "2", { min: "0" }),
      numberField("density", "Density", "5", { min: "0" }),
    ],
    compute: (v) => {
      if (v.solve === "density") {
        const mass = parseNumber(v.mass, "mass");
        const volume = parseNumber(v.volume, "volume", { allowZero: false });
        return {
          primaryLabel: "Density",
          primary: formatNumber(mass / volume, 8),
          formula: "ρ = m / V",
          copyText: formatNumber(mass / volume, 8),
        };
      }
      if (v.solve === "mass") {
        const d = parseNumber(v.density, "density");
        const volume = parseNumber(v.volume, "volume");
        return {
          primaryLabel: "Mass",
          primary: formatNumber(d * volume, 8),
          formula: "m = ρ · V",
          copyText: formatNumber(d * volume, 8),
        };
      }
      const mass = parseNumber(v.mass, "mass");
      const d = parseNumber(v.density, "density", { allowZero: false });
      return {
        primaryLabel: "Volume",
        primary: formatNumber(mass / d, 8),
        formula: "V = m / ρ",
        copyText: formatNumber(mass / d, 8),
      };
    },
  }),

  def({
    slug: "mass-calculator",
    name: "Mass Calculator",
    subcategory: "measurement",
    shortDescription: "Convert common mass units or compute mass from density and volume.",
    keywords: ["mass calculator", "mass conversion"],
    relatedToolIds: ["weight-converter", "density-calculator", "molarity-calculator"],
    fields: [
      selectField("mode", "Mode", "convert", [
        { value: "convert", label: "kg ↔ lb" },
        { value: "density", label: "Mass from density × volume" },
      ]),
      numberField("value", "Value / density", "10"),
      numberField("volume", "Volume (density mode)", "2"),
      selectField("direction", "kg → lb?", "yes", [
        { value: "yes", label: "kg → lb" },
        { value: "no", label: "lb → kg" },
      ]),
    ],
    compute: (v) => {
      if (v.mode === "convert") {
        const x = parseNumber(v.value, "value");
        const result = v.direction === "yes" ? x * 2.2046226218 : x / 2.2046226218;
        return { primaryLabel: "Converted mass", primary: formatNumber(result, 8), copyText: formatNumber(result, 8) };
      }
      const d = parseNumber(v.value, "density");
      const vol = parseNumber(v.volume, "volume");
      return {
        primaryLabel: "Mass",
        primary: formatNumber(d * vol, 8),
        formula: "m = ρ · V",
        copyText: formatNumber(d * vol, 8),
      };
    },
  }),

  def({
    slug: "weight-calculator",
    name: "Weight Calculator",
    subcategory: "measurement",
    shortDescription: "Convert between newtons and kilograms-force style weight estimates on Earth.",
    keywords: ["weight calculator", "newtons to kg", "force weight"],
    relatedToolIds: ["mass-calculator", "weight-converter"],
    notices: ["Uses g = 9.80665 m/s² for Earth-surface weight estimates."],
    fields: [
      selectField("mode", "Convert", "kg-to-n", [
        { value: "kg-to-n", label: "Mass (kg) → Weight (N)" },
        { value: "n-to-kg", label: "Weight (N) → Mass (kg)" },
      ]),
      numberField("value", "Value", "70", { min: "0" }),
    ],
    compute: (v) => {
      const g = 9.80665;
      const x = parseNumber(v.value, "value", { allowNegative: false });
      if (v.mode === "kg-to-n") {
        return {
          primaryLabel: "Weight",
          primary: `${formatNumber(x * g, 6)} N`,
          formula: "W = m · g",
          copyText: `${formatNumber(x * g, 6)} N`,
        };
      }
      return {
        primaryLabel: "Mass",
        primary: `${formatNumber(x / g, 6)} kg`,
        formula: "m = W / g",
        copyText: `${formatNumber(x / g, 6)} kg`,
      };
    },
  }),

  def({
    slug: "speed-calculator",
    name: "Speed Calculator",
    subcategory: "measurement",
    shortDescription: "Solve speed, distance, or time from the other two values.",
    keywords: ["speed calculator", "distance time speed"],
    relatedToolIds: ["speed-converter", "fuel-cost-calculator", "gas-mileage-calculator"],
    fields: [
      selectField("solve", "Solve for", "speed", [
        { value: "speed", label: "Speed" },
        { value: "distance", label: "Distance" },
        { value: "time", label: "Time" },
      ]),
      numberField("distance", "Distance", "120", { min: "0" }),
      numberField("time", "Time (hours)", "2", { min: "0" }),
      numberField("speed", "Speed", "60", { min: "0" }),
    ],
    compute: (v) => {
      if (v.solve === "speed") {
        const d = parseNumber(v.distance, "distance");
        const t = parseNumber(v.time, "time", { allowZero: false });
        return { primaryLabel: "Speed", primary: formatNumber(d / t, 8), formula: "v = d / t", copyText: formatNumber(d / t, 8) };
      }
      if (v.solve === "distance") {
        const s = parseNumber(v.speed, "speed");
        const t = parseNumber(v.time, "time");
        return { primaryLabel: "Distance", primary: formatNumber(s * t, 8), formula: "d = v · t", copyText: formatNumber(s * t, 8) };
      }
      const d = parseNumber(v.distance, "distance");
      const s = parseNumber(v.speed, "speed", { allowZero: false });
      return { primaryLabel: "Time (hours)", primary: formatNumber(d / s, 8), formula: "t = d / v", copyText: formatNumber(d / s, 8) };
    },
  }),

  def({
    slug: "molarity-calculator",
    name: "Molarity Calculator",
    subcategory: "measurement",
    shortDescription: "Calculate molarity, moles, or solution volume.",
    keywords: ["molarity calculator", "moles concentration"],
    relatedToolIds: ["molecular-weight-calculator", "density-calculator"],
    notices: ["Educational chemistry helper — not for clinical dosing."],
    fields: [
      selectField("solve", "Solve for", "molarity", [
        { value: "molarity", label: "Molarity (mol/L)" },
        { value: "moles", label: "Moles" },
        { value: "volume", label: "Volume (L)" },
      ]),
      numberField("moles", "Moles", "0.5", { min: "0" }),
      numberField("volume", "Volume (L)", "2", { min: "0" }),
      numberField("molarity", "Molarity (M)", "0.25", { min: "0" }),
    ],
    compute: (v) => {
      if (v.solve === "molarity") {
        const moles = parseNumber(v.moles, "moles");
        const volume = parseNumber(v.volume, "volume", { allowZero: false });
        return { primaryLabel: "Molarity", primary: `${formatNumber(moles / volume, 8)} M`, formula: "M = n / V", copyText: formatNumber(moles / volume, 8) };
      }
      if (v.solve === "moles") {
        const M = parseNumber(v.molarity, "molarity");
        const volume = parseNumber(v.volume, "volume");
        return { primaryLabel: "Moles", primary: formatNumber(M * volume, 8), formula: "n = M · V", copyText: formatNumber(M * volume, 8) };
      }
      const moles = parseNumber(v.moles, "moles");
      const M = parseNumber(v.molarity, "molarity", { allowZero: false });
      return { primaryLabel: "Volume (L)", primary: formatNumber(moles / M, 8), formula: "V = n / M", copyText: formatNumber(moles / M, 8) };
    },
  }),

  def({
    slug: "molecular-weight-calculator",
    name: "Molecular Weight Calculator",
    subcategory: "measurement",
    shortDescription: "Sum atomic weights from a simple element count list.",
    keywords: ["molecular weight", "molar mass calculator"],
    relatedToolIds: ["molarity-calculator", "density-calculator"],
    notices: ["Enter pairs like H:2, O:1. Uses common average atomic weights."],
    fields: [
      {
        id: "formula",
        label: "Element counts (e.g. H:2, O:1 or C:6 H:12 O:6)",
        type: "text",
        defaultValue: "H:2, O:1",
        span: 2,
      },
    ],
    compute: (v) => {
      const weights: Record<string, number> = {
        H: 1.008,
        C: 12.011,
        N: 14.007,
        O: 15.999,
        Na: 22.99,
        Mg: 24.305,
        P: 30.974,
        S: 32.06,
        Cl: 35.45,
        K: 39.098,
        Ca: 40.078,
        Fe: 55.845,
        Cu: 63.546,
        Zn: 65.38,
        Br: 79.904,
        I: 126.9,
      };
      const parts = v.formula.match(/([A-Z][a-z]?)[:\s]*(\d+)/g);
      if (!parts?.length) throw new Error("Enter element counts like H:2, O:1.");
      let total = 0;
      const breakdown: { label: string; value: string }[] = [];
      for (const part of parts) {
        const m = /([A-Z][a-z]?)[:\s]*(\d+)/.exec(part);
        if (!m) continue;
        const el = m[1];
        const count = Number(m[2]);
        const w = weights[el];
        if (w == null) throw new Error(`Unsupported element: ${el}`);
        total += w * count;
        breakdown.push({ label: `${el} × ${count}`, value: formatFixed(w * count, 3) });
      }
      return {
        primaryLabel: "Molar mass",
        primary: `${formatFixed(total, 3)} g/mol`,
        breakdown,
        copyText: `${formatFixed(total, 3)} g/mol`,
      };
    },
  }),

  def({
    slug: "roman-numeral-converter",
    name: "Roman Numeral Converter",
    subcategory: "measurement",
    shortDescription: "Convert between Roman numerals and integers.",
    keywords: ["roman numeral converter", "roman numerals"],
    relatedToolIds: ["number-to-words", "basic-calculator"],
    fields: [
      selectField("mode", "Mode", "toRoman", [
        { value: "toRoman", label: "Number → Roman" },
        { value: "toNumber", label: "Roman → Number" },
      ]),
      { id: "value", label: "Value", type: "text", defaultValue: "2026" },
    ],
    compute: (v) => {
      if (v.mode === "toRoman") {
        let n = parsePositiveInt(v.value, "number");
        if (n > 3999) throw new Error("Enter a number from 1 to 3999.");
        const map: [number, string][] = [
          [1000, "M"],
          [900, "CM"],
          [500, "D"],
          [400, "CD"],
          [100, "C"],
          [90, "XC"],
          [50, "L"],
          [40, "XL"],
          [10, "X"],
          [9, "IX"],
          [5, "V"],
          [4, "IV"],
          [1, "I"],
        ];
        let out = "";
        for (const [val, sym] of map) {
          while (n >= val) {
            out += sym;
            n -= val;
          }
        }
        return { primaryLabel: "Roman numeral", primary: out, copyText: out };
      }
      const roman = v.value.trim().toUpperCase();
      if (!/^[MDCLXVI]+$/.test(roman)) throw new Error("Enter a valid Roman numeral.");
      const vals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      for (let i = 0; i < roman.length; i++) {
        const cur = vals[roman[i]];
        const next = vals[roman[i + 1]] || 0;
        total += cur < next ? -cur : cur;
      }
      return { primaryLabel: "Number", primary: String(total), copyText: String(total) };
    },
  }),

  // Electrical
  def({
    slug: "ohms-law-calculator",
    name: "Ohms Law Calculator",
    subcategory: "electrical",
    shortDescription: "Solve voltage, current, resistance, or power using Ohm’s law.",
    keywords: ["ohms law calculator", "voltage current resistance"],
    relatedToolIds: ["voltage-drop-calculator", "resistor-calculator", "electricity-calculator"],
    featured: true,
    fields: [
      selectField("solve", "Solve for", "V", [
        { value: "V", label: "Voltage (V)" },
        { value: "I", label: "Current (A)" },
        { value: "R", label: "Resistance (Ω)" },
        { value: "P", label: "Power (W)" },
      ]),
      numberField("V", "Voltage (V)", "12"),
      numberField("I", "Current (A)", "2"),
      numberField("R", "Resistance (Ω)", "6"),
      numberField("P", "Power (W)", "24"),
    ],
    compute: (v) => {
      if (v.solve === "V") {
        const I = parseNumber(v.I, "current");
        const R = parseNumber(v.R, "resistance");
        return { primaryLabel: "Voltage", primary: `${formatNumber(I * R, 8)} V`, formula: "V = I·R", copyText: formatNumber(I * R, 8) };
      }
      if (v.solve === "I") {
        const V = parseNumber(v.V, "voltage");
        const R = parseNumber(v.R, "resistance", { allowZero: false });
        return { primaryLabel: "Current", primary: `${formatNumber(V / R, 8)} A`, formula: "I = V/R", copyText: formatNumber(V / R, 8) };
      }
      if (v.solve === "R") {
        const V = parseNumber(v.V, "voltage");
        const I = parseNumber(v.I, "current", { allowZero: false });
        return { primaryLabel: "Resistance", primary: `${formatNumber(V / I, 8)} Ω`, formula: "R = V/I", copyText: formatNumber(V / I, 8) };
      }
      const V = parseNumber(v.V, "voltage");
      const I = parseNumber(v.I, "current");
      return { primaryLabel: "Power", primary: `${formatNumber(V * I, 8)} W`, formula: "P = V·I", copyText: formatNumber(V * I, 8) };
    },
  }),

  def({
    slug: "voltage-drop-calculator",
    name: "Voltage Drop Calculator",
    subcategory: "electrical",
    shortDescription: "Estimate single-phase DC/AC voltage drop in a conductor.",
    keywords: ["voltage drop calculator", "cable voltage drop"],
    relatedToolIds: ["ohms-law-calculator", "electricity-calculator", "resistor-calculator"],
    notices: ["Simplified estimate. Always verify with local electrical codes."],
    fields: [
      numberField("current", "Current (A)", "15", { min: "0" }),
      numberField("length", "One-way length (ft)", "50", { min: "0" }),
      numberField("resistance", "Conductor resistance (Ω/1000 ft)", "1.98", { min: "0" }),
      selectField("phase", "Circuit", "dc", [
        { value: "dc", label: "DC / single-phase (×2)" },
        { value: "three", label: "3-phase (×√3)" },
      ]),
    ],
    compute: (v) => {
      const I = parseNumber(v.current, "current");
      const L = parseNumber(v.length, "length");
      const R = parseNumber(v.resistance, "resistance");
      const factor = v.phase === "three" ? Math.sqrt(3) : 2;
      const drop = (factor * I * R * L) / 1000;
      return {
        primaryLabel: "Voltage drop",
        primary: `${formatNumber(drop, 4)} V`,
        formula: "VD = factor · I · R · L / 1000",
        copyText: `${formatNumber(drop, 4)} V`,
      };
    },
  }),

  def({
    slug: "resistor-calculator",
    name: "Resistor Calculator",
    subcategory: "electrical",
    shortDescription: "Combine resistors in series or parallel.",
    keywords: ["resistor calculator", "series parallel resistors"],
    relatedToolIds: ["ohms-law-calculator", "voltage-drop-calculator"],
    fields: [
      selectField("mode", "Configuration", "series", [
        { value: "series", label: "Series" },
        { value: "parallel", label: "Parallel" },
      ]),
      {
        id: "values",
        label: "Resistances in ohms (comma separated)",
        type: "text",
        defaultValue: "100, 220, 330",
        span: 2,
      },
    ],
    compute: (v) => {
      const rs = v.values
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s));
      if (!rs.length || rs.some((n) => !Number.isFinite(n) || n <= 0)) {
        throw new Error("Enter positive resistance values.");
      }
      const result =
        v.mode === "series" ? rs.reduce((a, b) => a + b, 0) : 1 / rs.reduce((a, b) => a + 1 / b, 0);
      return {
        primaryLabel: "Equivalent resistance",
        primary: `${formatNumber(result, 6)} Ω`,
        formula: v.mode === "series" ? "R = Σ Ri" : "1/R = Σ 1/Ri",
        copyText: `${formatNumber(result, 6)} Ω`,
      };
    },
  }),

  def({
    slug: "electricity-calculator",
    name: "Electricity Calculator",
    subcategory: "electrical",
    shortDescription: "Estimate energy use and cost from power and time.",
    keywords: ["electricity calculator", "kwh cost", "power usage"],
    relatedToolIds: ["ohms-law-calculator", "btu-calculator"],
    fields: [
      numberField("watts", "Power (W)", "100", { min: "0" }),
      numberField("hours", "Hours per day", "5", { min: "0" }),
      numberField("days", "Days", "30", { min: "0" }),
      moneyField("rate", "Cost per kWh", "0.15"),
      currencySelect,
    ],
    compute: (v) => {
      const watts = parseNumber(v.watts, "power", { allowNegative: false });
      const hours = parseNumber(v.hours, "hours", { allowNegative: false });
      const days = parseNumber(v.days, "days", { allowNegative: false });
      const rate = parseNumber(v.rate, "rate", { allowNegative: false });
      const kwh = (watts * hours * days) / 1000;
      const cost = kwh * rate;
      return {
        primaryLabel: "Estimated cost",
        primary: formatMoney(cost, v.currency || "USD"),
        breakdown: [{ label: "Energy used", value: `${formatFixed(kwh, 3)} kWh` }],
        formula: "kWh = W · hours · days / 1000; cost = kWh · rate",
        copyText: `${formatMoney(cost, v.currency || "USD")} for ${formatFixed(kwh, 3)} kWh`,
      };
    },
  }),

  // Internet / technical
  def({
    slug: "ip-subnet-calculator",
    name: "IP Subnet Calculator",
    subcategory: "internet",
    shortDescription: "Calculate IPv4 network, broadcast, and host range from CIDR.",
    keywords: ["ip subnet calculator", "cidr calculator", "ipv4 subnet"],
    relatedToolIds: ["bandwidth-calculator", "base64-encoder"],
    featured: true,
    fields: [
      { id: "ip", label: "IPv4 address", type: "text", defaultValue: "192.168.1.10" },
      numberField("prefix", "Prefix length", "24", { min: "0", max: "32", step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const parts = v.ip.trim().split(".").map((p) => Number(p));
      if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) {
        throw new Error("Enter a valid IPv4 address.");
      }
      const prefix = parseNumber(v.prefix, "prefix", { min: 0, max: 32 });
      if (!Number.isInteger(prefix)) throw new Error("Prefix must be an integer.");
      const ipNum = ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const network = (ipNum & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;
      const toIp = (n: number) =>
        [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
      const hosts = prefix >= 31 ? 0 : broadcast - network - 1;
      return {
        primaryLabel: "Network",
        primary: `${toIp(network)}/${prefix}`,
        breakdown: [
          { label: "Subnet mask", value: toIp(mask) },
          { label: "Broadcast", value: toIp(broadcast) },
          {
            label: "Host range",
            value: hosts > 0 ? `${toIp(network + 1)} – ${toIp(broadcast - 1)}` : "N/A",
          },
          { label: "Usable hosts", value: String(hosts) },
        ],
        copyText: `${toIp(network)}/${prefix}`,
      };
    },
  }),

  def({
    slug: "bandwidth-calculator",
    name: "Bandwidth Calculator",
    subcategory: "internet",
    shortDescription: "Estimate download time or required bandwidth for a file size.",
    keywords: ["bandwidth calculator", "download time", "mbps"],
    relatedToolIds: ["ip-subnet-calculator", "data-storage-converter", "base64-encoder"],
    fields: [
      selectField("solve", "Solve for", "time", [
        { value: "time", label: "Transfer time" },
        { value: "bandwidth", label: "Required bandwidth" },
      ]),
      numberField("size", "File size", "1", { min: "0" }),
      selectField("sizeUnit", "Size unit", "GB", [
        { value: "MB", label: "MB (decimal)" },
        { value: "GB", label: "GB (decimal)" },
      ]),
      numberField("rate", "Bandwidth (Mbps)", "100", { min: "0" }),
      numberField("seconds", "Available seconds (bandwidth mode)", "60", { min: "0" }),
    ],
    compute: (v) => {
      const size = parseNumber(v.size, "size", { allowNegative: false });
      const bits = size * (v.sizeUnit === "GB" ? 8e9 : 8e6);
      if (v.solve === "time") {
        const mbps = parseNumber(v.rate, "bandwidth", { allowZero: false });
        const seconds = bits / (mbps * 1e6);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return {
          primaryLabel: "Transfer time",
          primary: `${h}h ${m}m ${formatFixed(s, 1)}s`,
          formula: "time = bits / (Mbps × 10^6)",
          copyText: `${formatFixed(seconds, 2)} seconds`,
        };
      }
      const seconds = parseNumber(v.seconds, "seconds", { allowZero: false });
      const mbps = bits / seconds / 1e6;
      return {
        primaryLabel: "Required bandwidth",
        primary: `${formatFixed(mbps, 3)} Mbps`,
        copyText: `${formatFixed(mbps, 3)} Mbps`,
      };
    },
  }),

  // Transportation
  def({
    slug: "fuel-cost-calculator",
    name: "Fuel Cost Calculator",
    subcategory: "transportation",
    shortDescription: "Estimate trip fuel cost from distance, efficiency, and price.",
    keywords: ["fuel cost calculator", "gas cost", "trip fuel"],
    relatedToolIds: ["gas-mileage-calculator", "mileage-calculator", "speed-calculator"],
    featured: true,
    fields: [
      numberField("distance", "Distance", "300", { min: "0" }),
      selectField("distUnit", "Distance unit", "mi", [
        { value: "mi", label: "Miles" },
        { value: "km", label: "Kilometers" },
      ]),
      numberField("efficiency", "Fuel efficiency", "28", { min: "0" }),
      selectField("effUnit", "Efficiency unit", "mpg", [
        { value: "mpg", label: "MPG" },
        { value: "l100", label: "L/100km" },
      ]),
      moneyField("price", "Fuel price per unit", "3.5"),
      currencySelect,
    ],
    compute: (v) => {
      let distance = parseNumber(v.distance, "distance", { allowNegative: false });
      const eff = parseNumber(v.efficiency, "efficiency", { allowZero: false, allowNegative: false });
      const price = parseNumber(v.price, "price", { allowNegative: false });
      if (v.distUnit === "km") distance *= 0.621371;
      let gallons: number;
      if (v.effUnit === "mpg") gallons = distance / eff;
      else {
        // L/100km with distance currently in miles → convert to km
        const km = distance / 0.621371;
        const liters = (eff * km) / 100;
        gallons = liters / 3.785411784;
      }
      const cost = gallons * price;
      return {
        primaryLabel: "Estimated fuel cost",
        primary: formatMoney(cost, v.currency || "USD"),
        breakdown: [{ label: "Fuel needed (gallons approx.)", value: formatFixed(gallons, 2) }],
        copyText: formatMoney(cost, v.currency || "USD"),
      };
    },
  }),

  def({
    slug: "gas-mileage-calculator",
    name: "Gas Mileage Calculator",
    subcategory: "transportation",
    shortDescription: "Calculate MPG or L/100km from distance and fuel used.",
    keywords: ["gas mileage calculator", "mpg calculator", "fuel economy"],
    relatedToolIds: ["fuel-cost-calculator", "mileage-calculator"],
    fields: [
      numberField("distance", "Distance traveled", "250", { min: "0" }),
      numberField("fuel", "Fuel used", "10", { min: "0" }),
      selectField("unit", "Units", "us", [
        { value: "us", label: "Miles & gallons → MPG" },
        { value: "metric", label: "Kilometers & liters → L/100km" },
      ]),
    ],
    compute: (v) => {
      const d = parseNumber(v.distance, "distance", { allowZero: false, allowNegative: false });
      const f = parseNumber(v.fuel, "fuel", { allowZero: false, allowNegative: false });
      if (v.unit === "us") {
        return {
          primaryLabel: "MPG",
          primary: formatFixed(d / f, 2),
          formula: "MPG = miles / gallons",
          copyText: `${formatFixed(d / f, 2)} MPG`,
        };
      }
      return {
        primaryLabel: "L/100km",
        primary: formatFixed((f / d) * 100, 2),
        formula: "L/100km = liters / km × 100",
        copyText: `${formatFixed((f / d) * 100, 2)} L/100km`,
      };
    },
  }),

  def({
    slug: "horsepower-calculator",
    name: "Horsepower Calculator",
    subcategory: "transportation",
    shortDescription: "Estimate horsepower from torque and RPM.",
    keywords: ["horsepower calculator", "hp from torque"],
    relatedToolIds: ["engine-horsepower-calculator", "speed-calculator"],
    fields: [
      numberField("torque", "Torque (lb-ft)", "250", { min: "0" }),
      numberField("rpm", "RPM", "5000", { min: "0" }),
    ],
    compute: (v) => {
      const torque = parseNumber(v.torque, "torque", { allowNegative: false });
      const rpm = parseNumber(v.rpm, "rpm", { allowNegative: false });
      const hp = (torque * rpm) / 5252;
      return {
        primaryLabel: "Horsepower",
        primary: formatFixed(hp, 2),
        formula: "HP = torque × RPM / 5252",
        copyText: `${formatFixed(hp, 2)} HP`,
      };
    },
  }),

  def({
    slug: "engine-horsepower-calculator",
    name: "Engine Horsepower Calculator",
    subcategory: "transportation",
    shortDescription: "Estimate wheel horsepower from quarter-mile ET and vehicle weight.",
    keywords: ["engine horsepower", "dyno estimate", "et horsepower"],
    relatedToolIds: ["horsepower-calculator", "speed-calculator"],
    notices: ["Rule-of-thumb dragstrip estimate only."],
    fields: [
      numberField("weight", "Vehicle weight (lb)", "3500", { min: "1" }),
      numberField("et", "1/4-mile ET (seconds)", "13.5", { min: "1" }),
    ],
    compute: (v) => {
      const w = parseNumber(v.weight, "weight", { min: 1 });
      const et = parseNumber(v.et, "ET", { min: 1 });
      const hp = w / (et / 5.825) ** 3;
      return {
        primaryLabel: "Estimated HP",
        primary: formatFixed(hp, 1),
        formula: "HP ≈ weight / (ET/5.825)³",
        copyText: `${formatFixed(hp, 1)} HP`,
      };
    },
  }),

  def({
    slug: "mileage-calculator",
    name: "Mileage Calculator",
    subcategory: "transportation",
    shortDescription: "Track total miles and average distance across trips.",
    keywords: ["mileage calculator", "trip mileage"],
    relatedToolIds: ["gas-mileage-calculator", "fuel-cost-calculator", "speed-calculator"],
    fields: [
      {
        id: "trips",
        label: "Trip distances (comma separated)",
        type: "textarea",
        defaultValue: "12, 8.5, 30, 5",
        span: 2,
      },
    ],
    compute: (v) => {
      const trips = v.trips
        .split(/[,\n\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s));
      if (!trips.length || trips.some((n) => !Number.isFinite(n) || n < 0)) {
        throw new Error("Enter non-negative trip distances.");
      }
      const total = trips.reduce((a, b) => a + b, 0);
      return {
        primaryLabel: "Total distance",
        primary: formatFixed(total, 2),
        breakdown: [
          { label: "Trips", value: String(trips.length) },
          { label: "Average", value: formatFixed(total / trips.length, 2) },
        ],
        copyText: formatFixed(total, 2),
      };
    },
  }),

  def({
    slug: "tire-size-calculator",
    name: "Tire Size Calculator",
    subcategory: "transportation",
    shortDescription: "Compare tire diameters and speedometer impact between sizes.",
    keywords: ["tire size calculator", "tire diameter", "speedometer error"],
    relatedToolIds: ["speed-calculator", "gas-mileage-calculator"],
    fields: [
      { id: "tireA", label: "Tire A (e.g. 225/45R17)", type: "text", defaultValue: "225/45R17" },
      { id: "tireB", label: "Tire B (e.g. 245/40R18)", type: "text", defaultValue: "245/40R18" },
      numberField("speed", "Indicated speed", "60", { min: "0" }),
    ],
    compute: (v) => {
      const parseTire = (raw: string, label: string) => {
        const m = /(\d{3})\/(\d{2})R(\d{2})/i.exec(raw.trim());
        if (!m) throw new Error(`Enter ${label} like 225/45R17.`);
        const width = Number(m[1]);
        const aspect = Number(m[2]);
        const rim = Number(m[3]);
        const sidewall = width * (aspect / 100);
        const diameterMm = sidewall * 2 + rim * 25.4;
        return diameterMm / 25.4; // inches
      };
      const a = parseTire(v.tireA, "tire A");
      const b = parseTire(v.tireB, "tire B");
      const speed = parseNumber(v.speed, "speed", { allowNegative: false });
      const actual = speed * (b / a);
      return {
        primaryLabel: "Actual speed with tire B",
        primary: formatFixed(actual, 2),
        breakdown: [
          { label: "Tire A diameter (in)", value: formatFixed(a, 3) },
          { label: "Tire B diameter (in)", value: formatFixed(b, 3) },
          { label: "Diameter difference", value: formatPercent(((b - a) / a) * 100) },
        ],
        formula: "actual speed ≈ indicated × (new diameter / old diameter)",
        copyText: `Actual ~ ${formatFixed(actual, 2)}`,
      };
    },
  }),

  // Education (non-duplicate GPA)
  def({
    slug: "grade-calculator",
    name: "Grade Calculator",
    subcategory: "education",
    shortDescription: "Compute a weighted course grade from component scores.",
    keywords: ["grade calculator", "weighted grade", "course grade"],
    relatedToolIds: ["weighted-grade-calculator", "final-grade-needed-calculator", "college-gpa-calculator"],
    fields: [
      {
        id: "rows",
        label: "Components as score:weight pairs (e.g. 88:20, 92:30)",
        type: "textarea",
        defaultValue: "88:20, 92:30, 80:50",
        span: 2,
      },
    ],
    compute: (v) => {
      const pairs = v.rows
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (!pairs.length) throw new Error("Enter at least one score:weight pair.");
      let weighted = 0;
      let totalW = 0;
      for (const pair of pairs) {
        const m = /^([\d.]+)\s*:\s*([\d.]+)$/.exec(pair);
        if (!m) throw new Error(`Invalid pair: ${pair}`);
        const score = Number(m[1]);
        const w = Number(m[2]);
        if (!Number.isFinite(score) || !Number.isFinite(w) || w < 0) throw new Error("Invalid numbers.");
        weighted += score * w;
        totalW += w;
      }
      if (totalW <= 0) throw new Error("Total weight must be positive.");
      const grade = weighted / totalW;
      return {
        primaryLabel: "Course grade",
        primary: formatFixed(grade, 2),
        breakdown: [{ label: "Total weight", value: formatNumber(totalW, 2) }],
        formula: "Grade = Σ(score×weight) / Σ weight",
        copyText: formatFixed(grade, 2),
      };
    },
  }),

  def({
    slug: "shoe-size-conversion",
    name: "Shoe Size Conversion",
    subcategory: "other",
    shortDescription: "Approximate conversion between US, UK, and EU adult shoe sizes.",
    keywords: ["shoe size conversion", "us uk eu shoe size"],
    relatedToolIds: ["conversion-calculator", "unit-converter"],
    notices: ["Sizing varies by brand; treat results as approximate."],
    fields: [
      selectField("system", "From system", "usM", [
        { value: "usM", label: "US Men" },
        { value: "usW", label: "US Women" },
        { value: "uk", label: "UK" },
        { value: "eu", label: "EU" },
      ]),
      numberField("size", "Size", "9", { step: "0.5" }),
    ],
    compute: (v) => {
      const size = parseNumber(v.size, "size");
      // Convert everything to a mondopoint-ish mm via rough adult formulas, then out
      let usM = size;
      if (v.system === "usW") usM = size - 1.5;
      if (v.system === "uk") usM = size + 1;
      if (v.system === "eu") usM = (size - 33) / 1.27;
      const usW = usM + 1.5;
      const uk = usM - 1;
      const eu = usM * 1.27 + 33;
      return {
        primaryLabel: "US Men",
        primary: formatFixed(usM, 1),
        breakdown: [
          { label: "US Women", value: formatFixed(usW, 1) },
          { label: "UK", value: formatFixed(uk, 1) },
          { label: "EU", value: formatFixed(eu, 1) },
        ],
        copyText: `US M ${formatFixed(usM, 1)} / UK ${formatFixed(uk, 1)} / EU ${formatFixed(eu, 1)}`,
      };
    },
  }),

  def({
    slug: "golf-handicap-calculator",
    name: "Golf Handicap Calculator",
    subcategory: "other",
    shortDescription: "Estimate a simple handicap differential and average handicap index.",
    keywords: ["golf handicap calculator", "handicap index"],
    relatedToolIds: ["average-calculator", "statistics-calculator"],
    notices: ["Simplified educational estimate — not an official WHS index."],
    fields: [
      {
        id: "scores",
        label: "Score:Course Rating:Slope (one per line)",
        type: "textarea",
        defaultValue: "85:72.0:130\n90:71.2:125\n88:72.5:128",
        span: 2,
      },
    ],
    compute: (v) => {
      const lines = v.scores
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!lines.length) throw new Error("Enter at least one round.");
      const diffs = lines.map((line) => {
        const m = /^([\d.]+)\s*:\s*([\d.]+)\s*:\s*([\d.]+)$/.exec(line);
        if (!m) throw new Error(`Invalid round: ${line}`);
        const score = Number(m[1]);
        const rating = Number(m[2]);
        const slope = Number(m[3]);
        if ([score, rating, slope].some((n) => !Number.isFinite(n)) || slope <= 0) {
          throw new Error("Invalid numbers in round entry.");
        }
        return ((score - rating) * 113) / slope;
      });
      const used = [...diffs].sort((a, b) => a - b).slice(0, Math.min(8, diffs.length));
      const index = used.reduce((a, b) => a + b, 0) / used.length;
      return {
        primaryLabel: "Estimated handicap index",
        primary: formatFixed(index, 1),
        breakdown: used.map((d, i) => ({ label: `Differential ${i + 1}`, value: formatFixed(d, 1) })),
        formula: "Differential = (score − rating) × 113 / slope",
        copyText: formatFixed(index, 1),
      };
    },
  }),

  // Weather practical (safe)
  def({
    slug: "wind-chill-calculator",
    name: "Wind Chill Calculator",
    subcategory: "other",
    shortDescription: "Estimate wind chill temperature using the NWS formula.",
    keywords: ["wind chill calculator", "feels like cold"],
    relatedToolIds: ["heat-index-calculator", "dew-point-calculator"],
    fields: [
      numberField("temp", "Air temperature (°F)", "20"),
      numberField("wind", "Wind speed (mph)", "15", { min: "0" }),
    ],
    compute: (v) => {
      const T = parseNumber(v.temp, "temperature");
      const V = parseNumber(v.wind, "wind", { allowNegative: false });
      if (T > 50 || V < 3) {
        return {
          primaryLabel: "Wind chill",
          primary: "Formula applies for ≤50°F and ≥3 mph",
          breakdown: [{ label: "Air temperature", value: `${T} °F` }],
          copyText: `${T} °F`,
        };
      }
      const wc =
        35.74 +
        0.6215 * T -
        35.75 * Math.pow(V, 0.16) +
        0.4275 * T * Math.pow(V, 0.16);
      return {
        primaryLabel: "Wind chill",
        primary: `${formatFixed(wc, 1)} °F`,
        formula: "NWS wind chill formula",
        copyText: `${formatFixed(wc, 1)} °F`,
      };
    },
  }),

  def({
    slug: "heat-index-calculator",
    name: "Heat Index Calculator",
    subcategory: "other",
    shortDescription: "Estimate heat index from temperature and relative humidity.",
    keywords: ["heat index calculator", "feels like heat"],
    relatedToolIds: ["wind-chill-calculator", "dew-point-calculator"],
    fields: [
      numberField("temp", "Temperature (°F)", "90"),
      percentField("rh", "Relative humidity (%)", "60"),
    ],
    compute: (v) => {
      const T = parseNumber(v.temp, "temperature");
      const R = parseNumber(v.rh, "humidity", { min: 0, max: 100 });
      if (T < 80) {
        return {
          primaryLabel: "Heat index",
          primary: `${formatFixed(T, 1)} °F (formula typically for ≥80°F)`,
          copyText: `${formatFixed(T, 1)} °F`,
        };
      }
      const HI =
        -42.379 +
        2.04901523 * T +
        10.14333127 * R -
        0.22475541 * T * R -
        0.00683783 * T * T -
        0.05481717 * R * R +
        0.00122874 * T * T * R +
        0.00085282 * T * R * R -
        0.00000199 * T * T * R * R;
      return {
        primaryLabel: "Heat index",
        primary: `${formatFixed(HI, 1)} °F`,
        formula: "Rothfusz regression (NWS)",
        copyText: `${formatFixed(HI, 1)} °F`,
      };
    },
  }),

  def({
    slug: "dew-point-calculator",
    name: "Dew Point Calculator",
    subcategory: "other",
    shortDescription: "Estimate dew point from temperature and relative humidity.",
    keywords: ["dew point calculator", "dewpoint"],
    relatedToolIds: ["heat-index-calculator", "wind-chill-calculator"],
    fields: [
      numberField("temp", "Temperature (°C)", "25"),
      percentField("rh", "Relative humidity (%)", "60"),
    ],
    compute: (v) => {
      const T = parseNumber(v.temp, "temperature");
      const RH = parseNumber(v.rh, "humidity", { min: 0.01, max: 100 });
      const a = 17.27;
      const b = 237.7;
      const alpha = (a * T) / (b + T) + Math.log(RH / 100);
      const Td = (b * alpha) / (a - alpha);
      return {
        primaryLabel: "Dew point",
        primary: `${formatFixed(Td, 1)} °C`,
        formula: "Magnus approximation",
        copyText: `${formatFixed(Td, 1)} °C`,
      };
    },
  }),

  def({
    slug: "gdp-calculator",
    name: "GDP Calculator",
    subcategory: "other",
    shortDescription: "Compute GDP via the expenditure approach: C + I + G + (X − M).",
    keywords: ["gdp calculator", "gross domestic product", "expenditure approach"],
    relatedToolIds: ["investment-calculator", "budget-calculator"],
    notices: ["Educational macro identity only — not an official statistical release."],
    fields: [
      moneyField("c", "Consumption (C)", "1000000000000"),
      moneyField("i", "Investment (I)", "400000000000"),
      moneyField("g", "Government (G)", "350000000000"),
      moneyField("x", "Exports (X)", "200000000000"),
      moneyField("m", "Imports (M)", "220000000000"),
      currencySelect,
    ],
    compute: (v) => {
      const C = parseNumber(v.c, "consumption");
      const I = parseNumber(v.i, "investment");
      const G = parseNumber(v.g, "government");
      const X = parseNumber(v.x, "exports");
      const M = parseNumber(v.m, "imports");
      const gdp = C + I + G + (X - M);
      return {
        primaryLabel: "GDP",
        primary: formatMoney(gdp, v.currency || "USD"),
        breakdown: [{ label: "Net exports", value: formatMoney(X - M, v.currency || "USD") }],
        formula: "GDP = C + I + G + (X − M)",
        copyText: formatMoney(gdp, v.currency || "USD"),
      };
    },
  }),

  def({
    slug: "height-calculator",
    name: "Height Calculator",
    subcategory: "measurement",
    shortDescription: "Convert height between centimeters, meters, feet, and inches.",
    keywords: ["height calculator", "cm to feet", "height conversion"],
    relatedToolIds: ["length-converter", "conversion-calculator", "unit-converter"],
    fields: [
      selectField("from", "From", "cm", [
        { value: "cm", label: "Centimeters" },
        { value: "m", label: "Meters" },
        { value: "ftin", label: "Feet + inches" },
      ]),
      numberField("value", "Value (cm/m) or feet", "175"),
      numberField("inches", "Extra inches (ft+in mode)", "0", { min: "0" }),
    ],
    compute: (v) => {
      let cm = 0;
      if (v.from === "cm") cm = parseNumber(v.value, "centimeters", { allowNegative: false });
      else if (v.from === "m") cm = parseNumber(v.value, "meters", { allowNegative: false }) * 100;
      else {
        const ft = parseNumber(v.value, "feet", { allowNegative: false });
        const inches = parseOptionalNumber(v.inches, "inches", 0);
        cm = (ft * 12 + inches) * 2.54;
      }
      const totalIn = cm / 2.54;
      const ft = Math.floor(totalIn / 12);
      const inches = totalIn - ft * 12;
      return {
        primaryLabel: "Height",
        primary: `${formatFixed(cm, 1)} cm`,
        breakdown: [
          { label: "Meters", value: formatFixed(cm / 100, 3) },
          { label: "Feet & inches", value: `${ft}′ ${formatFixed(inches, 1)}″` },
        ],
        copyText: `${formatFixed(cm, 1)} cm / ${ft}' ${formatFixed(inches, 1)}"`,
      };
    },
  }),
];
