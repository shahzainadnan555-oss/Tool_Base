"use client";

import { useId, useMemo, useState } from "react";
import {
  CURRENCIES,
  calculateCapitalGains,
  calculateMiddleSchoolGpa,
  calculateRetirement,
  calculateTotaledCar,
  calculateTreeRemoval,
  DEFAULT_GPA_SCALE,
  estimateApScore,
  getApConfig,
  getLatestApConfig,
  listApYears,
  type ApCourseId,
  type GpaCourse,
  type SpecializedCalculatorConfig,
  type SpecializedCalcResult,
} from "@/lib/specialized-calculators";
import { copyText as copyClipboard } from "@/lib/calculator/utils";

interface Props {
  config: SpecializedCalculatorConfig;
  convertHeading?: string;
}

const DEFAULT_SCALE = Object.entries(DEFAULT_GPA_SCALE)
  .map(([grade, points]) => `${grade} = ${points}`)
  .join("\n");

function Field({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-tm-text">
        {label}
      </label>
      {children}
    </div>
  );
}

function ResultPanel({
  result,
  error,
}: {
  result: SpecializedCalcResult | null;
  error: string | null;
}) {
  if (error) {
    return (
      <p className="tm-notice tm-notice-error" role="alert">
        {error}
      </p>
    );
  }
  if (!result) {
    return (
      <p className="rounded-2xl border border-dashed border-tm-border bg-tm-soft px-4 py-8 text-sm font-medium text-tm-muted">
        Enter values to see an estimated result.
      </p>
    );
  }
  return (
    <div className="rounded-2xl border border-tm-border bg-tm-soft p-5" aria-live="polite">
      <p className="text-xs font-extrabold tracking-wide text-tm-accent uppercase">Result</p>
      <p className="mt-2 text-sm font-bold text-tm-muted">{result.primaryLabel}</p>
      <p className="tm-h2 mt-1">{result.primary}</p>
      {result.subhead ? (
        <p className="mt-2 text-sm font-medium text-tm-muted">{result.subhead}</p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {result.breakdown.map((row) => (
          <li
            key={row.label}
            className="flex flex-wrap justify-between gap-2 border-b border-tm-border pb-2 text-sm last:border-0"
          >
            <span className="font-semibold text-tm-muted">{row.label}</span>
            <span className="font-bold text-tm-text">{row.value}</span>
          </li>
        ))}
      </ul>
      {result.formula ? (
        <p className="mt-4 text-sm font-medium text-tm-muted">{result.formula}</p>
      ) : null}
    </div>
  );
}

export function SpecializedCalculatorWorkspace({ config, convertHeading }: Props) {
  const id = useId();
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const [vehicleValue, setVehicleValue] = useState("20000");
  const [deductible, setDeductible] = useState("1000");
  const [additions, setAdditions] = useState("");
  const [deductions, setDeductions] = useState("");
  const [keepSalvage, setKeepSalvage] = useState(false);
  const [salvageValue, setSalvageValue] = useState("");

  const [jurisdiction, setJurisdiction] = useState("");
  const [taxYear, setTaxYear] = useState("2026");
  const [purchase, setPurchase] = useState("300000");
  const [improvements, setImprovements] = useState("");
  const [acquisition, setAcquisition] = useState("");
  const [sale, setSale] = useState("500000");
  const [selling, setSelling] = useState("20000");
  const [ownership, setOwnership] = useState("long");
  const [exemption, setExemption] = useState("");
  const [taxRate, setTaxRate] = useState("15");

  const [courses, setCourses] = useState<GpaCourse[]>([
    { name: "Math", grade: "A", credits: "1" },
    { name: "Science", grade: "B", credits: "1" },
    { name: "English", grade: "A", credits: "1" },
    { name: "History", grade: "A", credits: "1" },
  ]);
  const [scaleText, setScaleText] = useState(DEFAULT_SCALE);
  const [weighted, setWeighted] = useState(false);

  const apCourse = config.apCourse as ApCourseId | undefined;
  const years = apCourse ? listApYears(apCourse) : [];
  const [examYear, setExamYear] = useState(years[0] ?? 2026);
  const apConfig = apCourse ? getApConfig(apCourse, examYear) : undefined;
  const [mcCorrect, setMcCorrect] = useState("");
  const [frqEarned, setFrqEarned] = useState("");

  const [currentAge, setCurrentAge] = useState("30");
  const [retireAge, setRetireAge] = useState("60");
  const [savings, setSavings] = useState("10000");
  const [income, setIncome] = useState("");
  const [contribPct, setContribPct] = useState("");
  const [annual, setAnnual] = useState("6000");
  const [retReturn, setRetReturn] = useState("7");
  const [inflation, setInflation] = useState("2");
  const [match, setMatch] = useState("0");
  const [targetIncome, setTargetIncome] = useState("");

  const [height, setHeight] = useState("medium");
  const [treeCount, setTreeCount] = useState("1");
  const [access, setAccess] = useState("easy");
  const [condition, setCondition] = useState("healthy");
  const [stump, setStump] = useState(false);
  const [cleanup, setCleanup] = useState(false);

  const computed = useMemo(() => {
    try {
      if (config.kind === "totaled-car") {
        return {
          result: calculateTotaledCar({
            vehicleValue,
            deductible,
            additions,
            deductions,
            salvageValue,
            keepSalvage,
            currency,
          }),
          error: null,
        };
      }
      if (config.kind === "capital-gains") {
        return {
          result: calculateCapitalGains({
            purchaseBasis: purchase,
            improvements,
            acquisitionCosts: acquisition,
            salePrice: sale,
            sellingCosts: selling,
            exemption,
            taxRate,
            currency,
          }),
          error: null,
        };
      }
      if (config.kind === "middle-school-gpa") {
        return {
          result: calculateMiddleSchoolGpa({ courses, scaleText, weighted }),
          error: null,
        };
      }
      if (config.kind === "ap-score") {
        if (!apCourse) return { result: null, error: "AP course is not configured." };
        const yearConfig = getApConfig(apCourse, examYear);
        if (!yearConfig) {
          return {
            result: null,
            error: "A verified scoring model for this exam year is not currently available.",
          };
        }
        const mc = Number(mcCorrect);
        const frq = Number(frqEarned);
        if (mcCorrect.trim() === "" || frqEarned.trim() === "") {
          return { result: null, error: null };
        }
        const ap = estimateApScore(yearConfig, { mcCorrect: mc, frqEarned: frq });
        const result: SpecializedCalcResult = {
          headline: ap.estimatedRange,
          subhead: ap.estimatedLabel,
          primaryLabel: "Estimated AP score range",
          primary: ap.estimatedRange,
          breakdown: ap.breakdown,
          formula: ap.formula,
          notes: ap.notes,
          copyText: `${yearConfig.course} ${yearConfig.examYear}: composite ${ap.composite.toFixed(1)}, estimated range ${ap.estimatedRange}`,
        };
        return { result, error: null };
      }
      if (config.kind === "retirement-ramsey-style") {
        return {
          result: calculateRetirement({
            currentAge,
            retirementAge: retireAge,
            currentSavings: savings,
            annualContribution: annual,
            annualIncome: income,
            contributionPercent: contribPct,
            annualReturnPercent: retReturn,
            inflationPercent: inflation,
            employerMatchPercent: match,
            targetRetirementIncome: targetIncome,
            currency,
          }),
          error: null,
        };
      }
      return {
        result: calculateTreeRemoval({
          height,
          trees: treeCount,
          access,
          condition,
          stump,
          cleanup,
          currency,
        }),
        error: null,
      };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : "Check your inputs." };
    }
  }, [
    config.kind,
    apCourse,
    examYear,
    vehicleValue,
    deductible,
    additions,
    deductions,
    salvageValue,
    keepSalvage,
    currency,
    purchase,
    improvements,
    acquisition,
    sale,
    selling,
    exemption,
    taxRate,
    courses,
    scaleText,
    weighted,
    mcCorrect,
    frqEarned,
    currentAge,
    retireAge,
    savings,
    annual,
    income,
    contribPct,
    retReturn,
    inflation,
    match,
    targetIncome,
    height,
    treeCount,
    access,
    condition,
    stump,
    cleanup,
  ]);

  function resetAll() {
    setCopied(false);
    setVehicleValue("20000");
    setDeductible("1000");
    setAdditions("");
    setDeductions("");
    setKeepSalvage(false);
    setSalvageValue("");
    setJurisdiction("");
    setTaxYear("2026");
    setPurchase("300000");
    setImprovements("");
    setAcquisition("");
    setSale("500000");
    setSelling("20000");
    setOwnership("long");
    setExemption("");
    setTaxRate("15");
    setCourses([
      { name: "Math", grade: "A", credits: "1" },
      { name: "Science", grade: "B", credits: "1" },
      { name: "English", grade: "A", credits: "1" },
      { name: "History", grade: "A", credits: "1" },
    ]);
    setScaleText(DEFAULT_SCALE);
    setWeighted(false);
    setExamYear(apCourse ? getLatestApConfig(apCourse).examYear : 2026);
    setMcCorrect("");
    setFrqEarned("");
    setCurrentAge("30");
    setRetireAge("60");
    setSavings("10000");
    setIncome("");
    setContribPct("");
    setAnnual("6000");
    setRetReturn("7");
    setInflation("2");
    setMatch("0");
    setTargetIncome("");
    setHeight("medium");
    setTreeCount("1");
    setAccess("easy");
    setCondition("healthy");
    setStump(false);
    setCleanup(false);
    setCurrency("USD");
  }

  async function handleCopy() {
    if (!computed.result?.copyText) return;
    const ok = await copyClipboard(computed.result.copyText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  const currencySelect = (
    <Field id={`${id}-ccy`} label="Currency">
      <select
        id={`${id}-ccy`}
        className="tm-input"
        value={currency}
        onChange={(event) => setCurrency(event.target.value)}
      >
        {CURRENCIES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <div className="space-y-6">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}
      {config.notices.map((notice) => (
        <p key={notice} className="tm-notice tm-notice-info">
          {notice}
        </p>
      ))}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-4">
          {config.kind === "totaled-car" ? (
            <>
              <h3 className="tm-h3">Enter Your Vehicle Value</h3>
              {currencySelect}
              <Field id={`${id}-value`} label="Estimated pre-loss / actual cash value">
                <input
                  id={`${id}-value`}
                  className="tm-input"
                  inputMode="decimal"
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(e.target.value)}
                />
              </Field>
              <h3 className="tm-h3">Enter Your Deductible</h3>
              <Field id={`${id}-ded`} label="Deductible">
                <input
                  id={`${id}-ded`}
                  className="tm-input"
                  inputMode="decimal"
                  value={deductible}
                  onChange={(e) => setDeductible(e.target.value)}
                />
              </Field>
              <Field id={`${id}-add`} label="Optional additions (taxes/fees)">
                <input
                  id={`${id}-add`}
                  className="tm-input"
                  inputMode="decimal"
                  value={additions}
                  onChange={(e) => setAdditions(e.target.value)}
                />
              </Field>
              <Field id={`${id}-sub`} label="Optional other deductions">
                <input
                  id={`${id}-sub`}
                  className="tm-input"
                  inputMode="decimal"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--tm-accent)]"
                  checked={keepSalvage}
                  onChange={(e) => setKeepSalvage(e.target.checked)}
                />
                I keep the vehicle (subtract salvage)
              </label>
              {keepSalvage ? (
                <Field id={`${id}-salv`} label="Salvage value">
                  <input
                    id={`${id}-salv`}
                    className="tm-input"
                    inputMode="decimal"
                    value={salvageValue}
                    onChange={(e) => setSalvageValue(e.target.value)}
                  />
                </Field>
              ) : null}
            </>
          ) : null}

          {config.kind === "capital-gains" ? (
            <>
              {currencySelect}
              <Field id={`${id}-jur`} label="Jurisdiction / country">
                <input
                  id={`${id}-jur`}
                  className="tm-input"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="e.g. United States — for your notes"
                />
              </Field>
              <Field id={`${id}-ty`} label="Tax year">
                <input
                  id={`${id}-ty`}
                  className="tm-input"
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                />
              </Field>
              <Field id={`${id}-own`} label="Ownership period">
                <select
                  id={`${id}-own`}
                  className="tm-input"
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value)}
                >
                  <option value="short">Short-term (you still enter the rate)</option>
                  <option value="long">Long-term (you still enter the rate)</option>
                </select>
              </Field>
              <Field id={`${id}-basis`} label="Purchase price / basis">
                <input
                  id={`${id}-basis`}
                  className="tm-input"
                  inputMode="decimal"
                  value={purchase}
                  onChange={(e) => setPurchase(e.target.value)}
                />
              </Field>
              <Field id={`${id}-imp`} label="Eligible basis improvements">
                <input
                  id={`${id}-imp`}
                  className="tm-input"
                  inputMode="decimal"
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                />
              </Field>
              <Field id={`${id}-acq`} label="Eligible acquisition costs">
                <input
                  id={`${id}-acq`}
                  className="tm-input"
                  inputMode="decimal"
                  value={acquisition}
                  onChange={(e) => setAcquisition(e.target.value)}
                />
              </Field>
              <Field id={`${id}-sale`} label="Sale price">
                <input
                  id={`${id}-sale`}
                  className="tm-input"
                  inputMode="decimal"
                  value={sale}
                  onChange={(e) => setSale(e.target.value)}
                />
              </Field>
              <Field id={`${id}-sell`} label="Selling costs">
                <input
                  id={`${id}-sell`}
                  className="tm-input"
                  inputMode="decimal"
                  value={selling}
                  onChange={(e) => setSelling(e.target.value)}
                />
              </Field>
              <Field id={`${id}-ex`} label="Applicable exemption (if you qualify)">
                <input
                  id={`${id}-ex`}
                  className="tm-input"
                  inputMode="decimal"
                  value={exemption}
                  onChange={(e) => setExemption(e.target.value)}
                />
              </Field>
              <Field id={`${id}-rate`} label="Applicable tax rate (%)">
                <input
                  id={`${id}-rate`}
                  className="tm-input"
                  inputMode="decimal"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </Field>
            </>
          ) : null}

          {config.kind === "middle-school-gpa" ? (
            <>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--tm-accent)]"
                  checked={weighted}
                  onChange={(e) => setWeighted(e.target.checked)}
                />
                Use credits / weights
              </label>
              <Field id={`${id}-scale`} label="Grading scale (one grade per line)">
                <textarea
                  id={`${id}-scale`}
                  className="tm-input min-h-32"
                  value={scaleText}
                  onChange={(e) => setScaleText(e.target.value)}
                />
              </Field>
              <div className="overflow-x-auto">
                <table className="tm-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Grade</th>
                      {weighted ? <th>Credits</th> : null}
                      <th>
                        <span className="sr-only">Remove</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, index) => (
                      <tr key={`${id}-c-${index}`}>
                        <td>
                          <input
                            className="tm-input"
                            value={course.name}
                            onChange={(e) => {
                              const next = [...courses];
                              next[index] = { ...course, name: e.target.value };
                              setCourses(next);
                            }}
                            aria-label={`Course ${index + 1} name`}
                          />
                        </td>
                        <td>
                          <input
                            className="tm-input"
                            value={course.grade}
                            onChange={(e) => {
                              const next = [...courses];
                              next[index] = { ...course, grade: e.target.value };
                              setCourses(next);
                            }}
                            aria-label={`Course ${index + 1} grade`}
                          />
                        </td>
                        {weighted ? (
                          <td>
                            <input
                              className="tm-input"
                              value={course.credits}
                              onChange={(e) => {
                                const next = [...courses];
                                next[index] = { ...course, credits: e.target.value };
                                setCourses(next);
                              }}
                              aria-label={`Course ${index + 1} credits`}
                            />
                          </td>
                        ) : null}
                        <td>
                          <button
                            type="button"
                            className="tm-btn tm-btn-ghost text-sm"
                            onClick={() => setCourses(courses.filter((_, i) => i !== index))}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="tm-btn tm-btn-secondary"
                onClick={() => setCourses([...courses, { name: "", grade: "", credits: "1" }])}
              >
                Add course
              </button>
            </>
          ) : null}

          {config.kind === "ap-score" && apCourse ? (
            <>
              <Field id={`${id}-year`} label="Exam year">
                <select
                  id={`${id}-year`}
                  className="tm-input"
                  value={examYear}
                  onChange={(e) => setExamYear(Number(e.target.value))}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                  <option value={0}>Older year (not listed)</option>
                </select>
              </Field>
              {apConfig ? (
                <p className="text-sm font-medium text-tm-muted">{apConfig.structureNotes}</p>
              ) : (
                <p className="tm-notice tm-notice-warning">
                  A verified scoring model for this exam year is not currently available.
                </p>
              )}
              <h3 className="tm-h3">Enter Multiple-Choice Performance</h3>
              <Field
                id={`${id}-mc`}
                label={`Multiple-choice correct (of ${apConfig?.multipleChoiceQuestions ?? "—"})`}
              >
                <input
                  id={`${id}-mc`}
                  className="tm-input"
                  inputMode="numeric"
                  value={mcCorrect}
                  onChange={(e) => setMcCorrect(e.target.value)}
                />
              </Field>
              <h3 className="tm-h3">Enter Free-Response Points</h3>
              <Field
                id={`${id}-frq`}
                label={`Free-response points (max ${apConfig?.freeResponseMaximumPoints ?? "—"})`}
              >
                <input
                  id={`${id}-frq`}
                  className="tm-input"
                  inputMode="decimal"
                  value={frqEarned}
                  onChange={(e) => setFrqEarned(e.target.value)}
                />
              </Field>
            </>
          ) : null}

          {config.kind === "retirement-ramsey-style" ? (
            <>
              {currencySelect}
              <Field id={`${id}-age`} label="Current age">
                <input
                  id={`${id}-age`}
                  className="tm-input"
                  inputMode="numeric"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                />
              </Field>
              <Field id={`${id}-rage`} label="Retirement age">
                <input
                  id={`${id}-rage`}
                  className="tm-input"
                  inputMode="numeric"
                  value={retireAge}
                  onChange={(e) => setRetireAge(e.target.value)}
                />
              </Field>
              <Field id={`${id}-sav`} label="Current savings">
                <input
                  id={`${id}-sav`}
                  className="tm-input"
                  inputMode="decimal"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                />
              </Field>
              <Field id={`${id}-inc`} label="Annual income (optional)">
                <input
                  id={`${id}-inc`}
                  className="tm-input"
                  inputMode="decimal"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </Field>
              <Field id={`${id}-cpct`} label="Contribution percentage of income (optional)">
                <input
                  id={`${id}-cpct`}
                  className="tm-input"
                  inputMode="decimal"
                  value={contribPct}
                  onChange={(e) => setContribPct(e.target.value)}
                />
              </Field>
              <Field id={`${id}-ann`} label="Annual contribution">
                <input
                  id={`${id}-ann`}
                  className="tm-input"
                  inputMode="decimal"
                  value={annual}
                  onChange={(e) => setAnnual(e.target.value)}
                />
              </Field>
              <Field id={`${id}-ret`} label="Expected annual return (%)">
                <input
                  id={`${id}-ret`}
                  className="tm-input"
                  inputMode="decimal"
                  value={retReturn}
                  onChange={(e) => setRetReturn(e.target.value)}
                />
              </Field>
              <Field id={`${id}-inf`} label="Inflation assumption (%)">
                <input
                  id={`${id}-inf`}
                  className="tm-input"
                  inputMode="decimal"
                  value={inflation}
                  onChange={(e) => setInflation(e.target.value)}
                />
              </Field>
              <Field id={`${id}-match`} label="Optional employer match (% of contribution)">
                <input
                  id={`${id}-match`}
                  className="tm-input"
                  inputMode="decimal"
                  value={match}
                  onChange={(e) => setMatch(e.target.value)}
                />
              </Field>
              <Field id={`${id}-tgt`} label="Target retirement income (optional, per year)">
                <input
                  id={`${id}-tgt`}
                  className="tm-input"
                  inputMode="decimal"
                  value={targetIncome}
                  onChange={(e) => setTargetIncome(e.target.value)}
                />
              </Field>
            </>
          ) : null}

          {config.kind === "tree-removal" ? (
            <>
              {currencySelect}
              <Field id={`${id}-h`} label="Tree height">
                <select
                  id={`${id}-h`}
                  className="tm-input"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="very-large">Very large</option>
                </select>
              </Field>
              <Field id={`${id}-n`} label="Number of trees">
                <input
                  id={`${id}-n`}
                  className="tm-input"
                  inputMode="numeric"
                  value={treeCount}
                  onChange={(e) => setTreeCount(e.target.value)}
                />
              </Field>
              <Field id={`${id}-a`} label="Accessibility">
                <select
                  id={`${id}-a`}
                  className="tm-input"
                  value={access}
                  onChange={(e) => setAccess(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="difficult">Difficult</option>
                </select>
              </Field>
              <Field id={`${id}-cond`} label="Tree condition">
                <select
                  id={`${id}-cond`}
                  className="tm-input"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="healthy">Healthy</option>
                  <option value="dead">Dead</option>
                  <option value="hazardous">Hazardous</option>
                </select>
              </Field>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--tm-accent)]"
                  checked={stump}
                  onChange={(e) => setStump(e.target.checked)}
                />
                Include stump removal
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--tm-accent)]"
                  checked={cleanup}
                  onChange={(e) => setCleanup(e.target.checked)}
                />
                Include debris cleanup
              </label>
            </>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="tm-btn tm-btn-secondary"
              onClick={() => void handleCopy()}
              disabled={!computed.result}
            >
              {copied ? "Copied" : "Copy Result"}
            </button>
            <button type="button" className="tm-btn tm-btn-ghost" onClick={resetAll}>
              Reset
            </button>
          </div>
        </div>

        <ResultPanel result={computed.result} error={computed.error} />
      </div>
      {computed.result?.notes.map((note) => (
        <p key={note} className="text-sm font-medium text-tm-muted">
          {note}
        </p>
      ))}
    </div>
  );
}
