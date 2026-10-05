/* eslint-disable no-console */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const slugs = [
  "totaled-car-value-calculator",
  "capital-gains-tax-calculator-on-sale-of-property",
  "middle-school-gpa-calculator",
  "ap-chem-score-calculator",
  "ap-bio-score-calculator",
  "ap-calc-bc-score-calculator",
  "retirement-calculator-dave-ramsey",
  "tree-removal-cost-calculator",
  "ap-lit-score-calculator",
];

const toolsSrc = fs.readFileSync(
  path.join(ROOT, "lib/tools/specialized-calculator-tools.ts"),
  "utf8",
);
const registrySrc = fs.readFileSync(path.join(ROOT, "lib/tools/registry.ts"), "utf8");
const page = fs.readFileSync(path.join(ROOT, "app/tools/[slug]/page.tsx"), "utf8");
const workspace = fs.readFileSync(
  path.join(ROOT, "components/tools/ToolWorkspace.tsx"),
  "utf8",
);

assert.ok(registrySrc.includes("specializedCalculatorTools"));
assert.ok(page.includes("isSpecializedCalculatorSlug"));
assert.ok(workspace.includes("SpecializedCalculatorWorkspace"));
assert.ok(!toolsSrc.toLowerCase().includes("blox fruits"));
assert.ok(!toolsSrc.toLowerCase().includes("dose calculator"));

for (const slug of slugs) {
  assert.ok(toolsSrc.includes(`slug: "${slug}"`), `missing ${slug}`);
}

const keywords = [
  "totaled car value calculator",
  "capital gains tax calculator on sale of property",
  "middle school gpa calculator",
  "ap chem score calculator",
  "ap bio score calculator",
  "ap calc bc score calculator",
  "retirement calculator dave ramsey",
  "tree removal cost calculator",
  "ap lit score calculator",
];
for (const keyword of keywords) {
  assert.ok(toolsSrc.includes(`"${keyword}"`), `missing keyword ${keyword}`);
}

function totaled(value, deductible, additions = 0, deductions = 0, salvage = 0) {
  return value - deductible + additions - deductions - salvage;
}
assert.strictEqual(totaled(20000, 1000), 19000);

function capitalGain(sale, selling, basis) {
  return sale - selling - basis;
}
assert.strictEqual(capitalGain(500000, 20000, 300000), 180000);

function gpa(points) {
  return points.reduce((a, b) => a + b, 0) / points.length;
}
assert.strictEqual(gpa([4, 3, 4, 4]), 3.75);

function retirement(pv, pmt, r, n) {
  const growth = (1 + r) ** n;
  return pv * growth + pmt * ((growth - 1) / r);
}
const projected = retirement(10000, 6000, 0.07, 30);
assert.ok(Math.abs(projected - 642887.27) < 1, `retirement FV ${projected}`);

function treeTypical(heightBase, access, condition, trees, stump, cleanupRate) {
  const removal = heightBase * access * condition * trees;
  const extraStump = stump;
  const cleanup = cleanupRate ? removal * 0.12 : 0;
  return removal + extraStump + cleanup;
}
const easySmall = treeTypical(280, 1, 1, 1, 0, false);
const hardLarge = treeTypical(1250, 1.85, 1.4, 1, 0, false);
assert.ok(hardLarge > easySmall);
const withStump = treeTypical(620, 1, 1, 1, 160, false);
assert.ok(withStump > treeTypical(620, 1, 1, 1, 0, false));

function apComposite(mc, mcTotal, frq, frqMax, mcW, frqW) {
  return (mc / mcTotal) * mcW * 100 + (frq / frqMax) * frqW * 100;
}
assert.strictEqual(apComposite(0, 60, 0, 46, 0.5, 0.5), 0);
assert.strictEqual(apComposite(60, 60, 46, 46, 0.5, 0.5), 100);
assert.ok(Math.abs(apComposite(36, 60, 20, 34, 0.5, 0.5) - 59.4117647) < 0.01);
assert.ok(Math.abs(apComposite(44, 55, 12, 18, 0.45, 0.55) - 72.666666) < 0.02);
assert.strictEqual(apComposite(45, 45, 54, 54, 0.5, 0.5), 100);
assert.strictEqual(apComposite(42, 42, 54, 54, 0.5, 0.5), 100);

const engine = fs.readFileSync(
  path.join(ROOT, "lib/specialized-calculators/ap-engine.ts"),
  "utf8",
);
assert.ok(engine.includes("class APScoreCalculatorEngine"));
assert.ok(engine.includes("illustrative-composite-bands"));

const configs = fs.readFileSync(
  path.join(ROOT, "lib/specialized-calculators/ap-configs.ts"),
  "utf8",
);
assert.ok(configs.includes("multipleChoiceQuestions: 60"));
assert.ok(configs.includes("multipleChoiceQuestions: 45"));
assert.ok(configs.includes("multipleChoiceQuestions: 42"));
assert.ok(configs.includes("multipleChoiceQuestions: 55"));
assert.ok(configs.includes("College Board / AP Central"));

console.log("smoke-specialized-calculators: OK");
