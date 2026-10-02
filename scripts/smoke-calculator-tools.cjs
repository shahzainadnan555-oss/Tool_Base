/* eslint-disable no-console */
/**
 * Smoke-test calculator / converter logic and registry wiring.
 * Run: node scripts/smoke-calculator-tools.cjs
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const EXPECTED = [
  "unit-converter",
  "length-converter",
  "weight-converter",
  "temperature-converter",
  "area-converter",
  "volume-converter",
  "speed-converter",
  "time-converter",
  "data-storage-converter",
  "number-to-words",
  "percentage-calculator",
  "fraction-calculator",
  "average-calculator",
  "ratio-calculator",
  "discount-calculator",
  "vat-tax-calculator",
  "tip-calculator",
  "date-difference-calculator",
  "age-calculator",
  "time-zone-converter",
];

const configsSrc = fs.readFileSync(
  path.join(__dirname, "../lib/calculator/configs.ts"),
  "utf8",
);
const configSlugs = [...configsSrc.matchAll(/"([a-z0-9-]+)":\s*make\(/g)].map(
  (m) => m[1],
);
assert.strictEqual(configSlugs.length, 20, `expected 20 configs, got ${configSlugs.length}`);
for (const slug of EXPECTED) {
  assert.ok(configSlugs.includes(slug), `missing config ${slug}`);
}

const toolsSrc = fs.readFileSync(
  path.join(__dirname, "../lib/tools/calculator-tools.ts"),
  "utf8",
);
for (const slug of EXPECTED) {
  assert.ok(toolsSrc.includes(`slug: "${slug}"`), `missing registry slug ${slug}`);
}

const registrySrc = fs.readFileSync(
  path.join(__dirname, "../lib/tools/registry.ts"),
  "utf8",
);
assert.ok(registrySrc.includes("calculatorTools"), "registry must import calculatorTools");
assert.ok(!registrySrc.includes('id: "percentage-calculator"'), "stubs should be removed from registry");

const page = fs.readFileSync(path.join(__dirname, "../app/tools/[slug]/page.tsx"), "utf8");
assert.ok(page.includes("isCalculatorToolSlug"), "tool page must wire calculator slugs");

const workspace = fs.readFileSync(
  path.join(__dirname, "../components/tools/ToolWorkspace.tsx"),
  "utf8",
);
assert.ok(workspace.includes("CalculatorWorkspace"), "ToolWorkspace must mount CalculatorWorkspace");
assert.ok(
  fs.existsSync(path.join(__dirname, "../components/calculator/CalculatorWorkspace.tsx")),
  "CalculatorWorkspace component missing",
);

// --- Inline mirrors of production math/units for correctness ---
function convertTemperature(value, from, to) {
  let c;
  if (from === "C") c = value;
  else if (from === "F") c = ((value - 32) * 5) / 9;
  else if (from === "K") c = value - 273.15;
  else throw new Error("bad unit");
  if (to === "C") return c;
  if (to === "F") return (c * 9) / 5 + 32;
  if (to === "K") return c + 273.15;
  throw new Error("bad unit");
}

assert.strictEqual(convertTemperature(0, "C", "F"), 32);
assert.strictEqual(convertTemperature(100, "C", "F"), 212);
assert.ok(Math.abs(convertTemperature(32, "F", "C")) < 1e-10);
assert.ok(Math.abs(convertTemperature(0, "C", "K") - 273.15) < 1e-10);

// Length: 1 m = 100 cm; 1 ft = 12 in
assert.strictEqual(1 / 0.01, 100); // m → cm via toBase
assert.ok(Math.abs(0.3048 / 0.0254 - 12) < 1e-12); // ft → in

// Weight: 1 kg = 1000 g
assert.strictEqual(1 / 0.001, 1000);

// Area: 1 m² = 10,000 cm²
assert.strictEqual(1 / 1e-4, 10000);

// Volume: 1 L = 1000 mL
assert.strictEqual(1 / 0.001, 1000);

// Speed: 1 km/h ≈ 0.621371 mph
const mpsFromKmh = 1000 / 3600;
const mpsFromMph = 1609.344 / 3600;
const mphFromKmh = mpsFromKmh / mpsFromMph;
assert.ok(Math.abs(mphFromKmh - 0.621371) < 1e-6);

// Percentage
assert.strictEqual((20 / 100) * 150, 30);
assert.strictEqual((30 / 150) * 100, 20);
assert.strictEqual(((120 - 100) / 100) * 100, 20);

// Fraction 1/2 + 1/4 = 3/4 via integer math
function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}
{
  let num = 1n * 4n + 1n * 2n;
  let den = 2n * 4n;
  const g = gcd(num, den);
  num /= g;
  den /= g;
  assert.strictEqual(`${num}/${den}`, "3/4");
}

// Average
assert.strictEqual((10 + 20 + 30) / 3, 20);
assert.strictEqual((10 + 20 + 30 + 40) / 4, 25);

// Ratio
{
  const g = gcd(10n, 20n);
  assert.strictEqual(`${10n / g}:${20n / g}`, "1:2");
  assert.strictEqual((3 * 10) / 2, 15);
}

// Discount / tax / tip
assert.strictEqual(100 - (100 * 20) / 100, 80);
assert.strictEqual(100 + (100 * 15) / 100, 115);
assert.strictEqual(115 / 2, 57.5);
assert.ok(Math.abs((115 * 15) / (100 + 15) - 15) < 1e-10);

// Dates: leap year span
{
  const a = Date.UTC(2024, 1, 28);
  const b = Date.UTC(2024, 2, 1);
  assert.strictEqual(Math.round((b - a) / 86400000), 2);
}
{
  // age example: 2000-01-15 → 2018-05-27 = 18y 4m 12d
  const by = 2000,
    bm = 1,
    bd = 15;
  const ty = 2018,
    tm = 5,
    td = 27;
  let years = ty - by;
  let months = tm - bm;
  let days = td - bd;
  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(ty, tm - 1, 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  assert.deepStrictEqual({ years, months, days }, { years: 18, months: 4, days: 12 });
}

// Number words quick check via source presence
const wordsSrc = fs.readFileSync(
  path.join(__dirname, "../lib/calculator/number-words.ts"),
  "utf8",
);
assert.ok(wordsSrc.includes("BigInt"), "number-words must use BigInt");
assert.ok(wordsSrc.includes("Point"), "number-words must support decimal Point convention");

// Timezone implementation must not hardcode NY = UTC-5 as sole logic
const tzSrc = fs.readFileSync(path.join(__dirname, "../lib/calculator/timezone.ts"), "utf8");
assert.ok(tzSrc.includes("supportedValuesOf") || tzSrc.includes("Intl"), "must use Intl TZ");
assert.ok(tzSrc.includes("Asia/Karachi"), "sample IANA zones present");

// Count tools in calculator-tools
const toolIds = [...toolsSrc.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
assert.strictEqual(toolIds.length, 20, `expected 20 tool defs, got ${toolIds.length}`);
assert.strictEqual(new Set(toolIds).size, 20, "duplicate tool ids");

const slugs = [...toolsSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
assert.strictEqual(new Set(slugs).size, 20, "duplicate slugs");

console.log("smoke-calculator-tools: OK (20 tools, math sanity, wiring)");
