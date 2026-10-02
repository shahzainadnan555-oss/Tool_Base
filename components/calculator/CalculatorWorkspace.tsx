"use client";

import { useEffect, useId, useMemo, useState, useTransition } from "react";
import {
  CATEGORY_LABELS,
  defaultUnitsFor,
  getUnits,
  processCalculator,
  copyText,
  filterTimeZones,
  listTimeZones,
} from "@/lib/calculator";
import type {
  CalculatorOptions,
  CalculatorResult,
  CalculatorToolConfig,
  UnitCategory,
} from "@/lib/calculator";
import { filterUserFacingNotices } from "@/lib/ui/notices";

interface CalculatorWorkspaceProps {
  config: CalculatorToolConfig;
  convertHeading?: string;
}

const UNIT_CATEGORIES = Object.keys(CATEGORY_LABELS) as UnitCategory[];

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function defaultTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-tm-text">
      {children}
    </label>
  );
}

function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  step = "any",
  min,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  step?: string;
  min?: string;
}) {
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="tm-input w-full"
      />
    </div>
  );
}

function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tm-input w-full"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResultCard({
  result,
  error,
  live,
}: {
  result: CalculatorResult | null;
  error: string | null;
  live: boolean;
}) {
  return (
    <div
      className="rounded-2xl border border-tm-border bg-tm-soft p-5"
      aria-live="polite"
      role="status"
    >
      <p className="text-xs font-bold tracking-wide text-tm-accent uppercase">
        Result
      </p>
      {error ? (
        <p className="mt-3 text-base font-bold text-tm-text" role="alert">
          {error}
        </p>
      ) : result ? (
        <>
          <p className="mt-3 break-words text-3xl font-extrabold tracking-tight text-tm-text md:text-4xl">
            {result.primary}
          </p>
          {result.secondary ? (
            <p className="mt-2 text-sm font-semibold text-tm-muted">
              {result.secondary}
            </p>
          ) : null}
          {result.details ? (
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              {Object.entries(result.details).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-xl border border-tm-border bg-white px-3 py-2"
                >
                  <dt className="text-xs font-bold text-tm-muted">{k}</dt>
                  <dd className="mt-1 text-sm font-bold text-tm-text">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {result.formula ? (
            <p className="mt-4 text-sm font-semibold text-tm-muted">
              <span className="font-bold text-tm-text">Formula: </span>
              {result.formula}
            </p>
          ) : null}
          {result.breakdown?.length ? (
            <ul className="mt-3 space-y-1">
              {result.breakdown.map((line) => (
                <li key={line} className="text-sm font-semibold text-tm-muted">
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <p className="mt-3 text-sm font-semibold text-tm-muted">
          {live
            ? "Enter values to see the result instantly."
            : "Enter values and calculate to see the result."}
        </p>
      )}
    </div>
  );
}

function TimeZoneSelector({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const listId = `${id}-list`;
  const [query, setQuery] = useState(value);
  const options = useMemo(() => filterTimeZones(query, 50), [query]);
  const all = useMemo(() => listTimeZones(), []);

  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        list={listId}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (all.includes(e.target.value)) onChange(e.target.value);
        }}
        onBlur={() => {
          if (all.includes(query)) onChange(query);
        }}
        placeholder="Search time zone (e.g. Karachi, London)"
        className="tm-input w-full"
        autoComplete="off"
      />
      <datalist id={listId}>
        {options.map((tz) => (
          <option key={tz} value={tz} />
        ))}
      </datalist>
      {value ? (
        <p className="mt-1 text-xs font-semibold text-tm-muted">Selected: {value}</p>
      ) : null}
    </div>
  );
}

export function CalculatorWorkspace({
  config,
  convertHeading,
}: CalculatorWorkspaceProps) {
  const baseId = useId();
  const [, startTransition] = useTransition();

  const initialCategory = config.unitCategory || "length";
  const [category, setCategory] = useState<UnitCategory>(initialCategory);
  const [fromDefaults, toDefaults] = defaultUnitsFor(initialCategory);
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(fromDefaults);
  const [toUnit, setToUnit] = useState(toDefaults);

  const [percentMode, setPercentMode] = useState<"of" | "is-what" | "change">("of");
  const [percent, setPercent] = useState("20");
  const [number, setNumber] = useState("150");
  const [original, setOriginal] = useState("100");
  const [next, setNext] = useState("120");

  const [fracOp, setFracOp] = useState<"add" | "sub" | "mul" | "div">("add");
  const [num1, setNum1] = useState("1");
  const [den1, setDen1] = useState("2");
  const [num2, setNum2] = useState("1");
  const [den2, setDen2] = useState("4");

  const [numbersText, setNumbersText] = useState("10\n20\n30\n40");

  const [ratioMode, setRatioMode] = useState<"simplify" | "solve">("simplify");
  const [ratioA, setRatioA] = useState("10");
  const [ratioB, setRatioB] = useState("20");
  const [ratioC, setRatioC] = useState("10");

  const [price, setPrice] = useState("100");
  const [rate, setRate] = useState(
    config.kind === "tip" || config.kind === "tax" ? "15" : "20",
  );
  const [people, setPeople] = useState("2");
  const [taxMode, setTaxMode] = useState<"add" | "remove">("add");

  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState(todayIso());
  const [inclusive, setInclusive] = useState(false);
  const [birthDate, setBirthDate] = useState("2000-01-15");
  const [targetDate, setTargetDate] = useState(todayIso());

  const [date, setDate] = useState(todayIso());
  const [time, setTime] = useState(nowTime());
  const [fromTz, setFromTz] = useState(defaultTz());
  const [toTz, setToTz] = useState("Europe/London");
  const [numberInput, setNumberInput] = useState("125");

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isUnitKind =
    config.kind === "unit-converter" ||
    config.kind === "length" ||
    config.kind === "weight" ||
    config.kind === "temperature" ||
    config.kind === "area" ||
    config.kind === "volume" ||
    config.kind === "speed" ||
    config.kind === "time" ||
    config.kind === "data-storage";

  const units = useMemo(() => getUnits(category), [category]);

  const options: CalculatorOptions = useMemo(
    () => ({
      value,
      fromUnit,
      toUnit,
      category,
      percentMode,
      percent,
      number,
      original,
      next,
      fracOp,
      num1,
      den1,
      num2,
      den2,
      numbersText,
      ratioMode,
      ratioA,
      ratioB,
      ratioC,
      price,
      rate,
      people,
      taxMode,
      startDate,
      endDate,
      inclusive,
      birthDate,
      targetDate,
      date,
      time,
      fromTz,
      toTz,
      numberInput,
    }),
    [
      value,
      fromUnit,
      toUnit,
      category,
      percentMode,
      percent,
      number,
      original,
      next,
      fracOp,
      num1,
      den1,
      num2,
      den2,
      numbersText,
      ratioMode,
      ratioA,
      ratioB,
      ratioC,
      price,
      rate,
      people,
      taxMode,
      startDate,
      endDate,
      inclusive,
      birthDate,
      targetDate,
      date,
      time,
      fromTz,
      toTz,
      numberInput,
    ],
  );

  function compute() {
    try {
      const nextResult = processCalculator(config, options);
      setResult(nextResult);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  useEffect(() => {
    if (!config.live) return;
    startTransition(() => {
      compute();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, options]);

  function onCategoryChange(nextCat: UnitCategory) {
    setCategory(nextCat);
    const [from, to] = defaultUnitsFor(nextCat);
    setFromUnit(from);
    setToUnit(to);
  }

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result?.copyText) {
      setValue(result.copyText);
    }
  }

  function resetAll() {
    const cat = config.unitCategory || "length";
    const [from, to] = defaultUnitsFor(cat);
    setCategory(cat);
    setValue("1");
    setFromUnit(from);
    setToUnit(to);
    setPercentMode("of");
    setPercent("20");
    setNumber("150");
    setOriginal("100");
    setNext("120");
    setFracOp("add");
    setNum1("1");
    setDen1("2");
    setNum2("1");
    setDen2("4");
    setNumbersText("10\n20\n30\n40");
    setRatioMode("simplify");
    setRatioA("10");
    setRatioB("20");
    setRatioC("10");
    setPrice("100");
    setRate(config.kind === "tip" || config.kind === "tax" ? "15" : "20");
    setPeople("2");
    setTaxMode("add");
    setStartDate("2020-01-01");
    setEndDate(todayIso());
    setInclusive(false);
    setBirthDate("2000-01-15");
    setTargetDate(todayIso());
    setDate(todayIso());
    setTime(nowTime());
    setFromTz(defaultTz());
    setToTz("Europe/London");
    setNumberInput("125");
    setResult(null);
    setError(null);
    setCopied(false);
  }

  async function handleCopy() {
    if (!result?.copyText) return;
    const ok = await copyText(result.copyText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <div className="space-y-6">
      {convertHeading ? (
        <h2 className="tm-h2">{convertHeading}</h2>
      ) : null}

      {filterUserFacingNotices(config.notices).map((notice) => (
        <p
          key={notice}
          className="rounded-xl border border-tm-border bg-tm-soft px-4 py-3 text-sm font-semibold text-tm-muted"
        >
          {notice}
        </p>
      ))}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          {isUnitKind ? (
            <>
              {config.allowCategorySelect ? (
                <SelectInput
                  id={`${baseId}-cat`}
                  label="Category"
                  value={category}
                  onChange={(v) => onCategoryChange(v as UnitCategory)}
                  options={UNIT_CATEGORIES.map((c) => ({
                    value: c,
                    label: CATEGORY_LABELS[c],
                  }))}
                />
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  id={`${baseId}-value`}
                  label="Value"
                  value={value}
                  onChange={setValue}
                  placeholder="Enter a number"
                />
                <SelectInput
                  id={`${baseId}-from`}
                  label="From"
                  value={fromUnit}
                  onChange={setFromUnit}
                  options={units.map((u) => ({ value: u.id, label: u.label }))}
                />
              </div>
              <SelectInput
                id={`${baseId}-to`}
                label="To"
                value={toUnit}
                onChange={setToUnit}
                options={units.map((u) => ({ value: u.id, label: u.label }))}
              />
            </>
          ) : null}

          {config.kind === "number-words" ? (
            <div className="min-w-0">
              <FieldLabel htmlFor={`${baseId}-nwords`}>Number</FieldLabel>
              <input
                id={`${baseId}-nwords`}
                type="text"
                inputMode="decimal"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="e.g. 125.50"
                className="tm-input w-full"
                autoComplete="off"
              />
            </div>
          ) : null}

          {config.kind === "percentage" ? (
            <>
              <SelectInput
                id={`${baseId}-pmode`}
                label="Calculation mode"
                value={percentMode}
                onChange={(v) =>
                  setPercentMode(v as "of" | "is-what" | "change")
                }
                options={[
                  { value: "of", label: "What is X% of Y?" },
                  { value: "is-what", label: "X is what percent of Y?" },
                  { value: "change", label: "Percentage increase / decrease" },
                ]}
              />
              {percentMode === "of" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberInput
                    id={`${baseId}-pct`}
                    label="Percentage (%)"
                    value={percent}
                    onChange={setPercent}
                  />
                  <NumberInput
                    id={`${baseId}-num`}
                    label="Number"
                    value={number}
                    onChange={setNumber}
                  />
                </div>
              ) : null}
              {percentMode === "is-what" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberInput
                    id={`${baseId}-part`}
                    label="Value (X)"
                    value={number}
                    onChange={setNumber}
                  />
                  <NumberInput
                    id={`${baseId}-whole`}
                    label="Total (Y)"
                    value={original}
                    onChange={setOriginal}
                  />
                </div>
              ) : null}
              {percentMode === "change" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberInput
                    id={`${baseId}-orig`}
                    label="Original value"
                    value={original}
                    onChange={setOriginal}
                  />
                  <NumberInput
                    id={`${baseId}-new`}
                    label="New value"
                    value={next}
                    onChange={setNext}
                  />
                </div>
              ) : null}
            </>
          ) : null}

          {config.kind === "fraction" ? (
            <>
              <SelectInput
                id={`${baseId}-fop`}
                label="Operation"
                value={fracOp}
                onChange={(v) =>
                  setFracOp(v as "add" | "sub" | "mul" | "div")
                }
                options={[
                  { value: "add", label: "Addition" },
                  { value: "sub", label: "Subtraction" },
                  { value: "mul", label: "Multiplication" },
                  { value: "div", label: "Division" },
                ]}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                  <NumberInput
                    id={`${baseId}-n1`}
                    label="Numerator 1"
                    value={num1}
                    onChange={setNum1}
                    step="1"
                  />
                  <span className="pb-3 text-xl font-extrabold">/</span>
                  <NumberInput
                    id={`${baseId}-d1`}
                    label="Denominator 1"
                    value={den1}
                    onChange={setDen1}
                    step="1"
                  />
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                  <NumberInput
                    id={`${baseId}-n2`}
                    label="Numerator 2"
                    value={num2}
                    onChange={setNum2}
                    step="1"
                  />
                  <span className="pb-3 text-xl font-extrabold">/</span>
                  <NumberInput
                    id={`${baseId}-d2`}
                    label="Denominator 2"
                    value={den2}
                    onChange={setDen2}
                    step="1"
                  />
                </div>
              </div>
            </>
          ) : null}

          {config.kind === "average" ? (
            <div>
              <FieldLabel htmlFor={`${baseId}-avg`}>
                Numbers (comma or one per line)
              </FieldLabel>
              <textarea
                id={`${baseId}-avg`}
                value={numbersText}
                onChange={(e) => setNumbersText(e.target.value)}
                rows={6}
                className="tm-input w-full resize-y font-mono text-sm"
                placeholder={"10\n20\n30"}
              />
            </div>
          ) : null}

          {config.kind === "ratio" ? (
            <>
              <SelectInput
                id={`${baseId}-rmode`}
                label="Mode"
                value={ratioMode}
                onChange={(v) => setRatioMode(v as "simplify" | "solve")}
                options={[
                  { value: "simplify", label: "Simplify ratio" },
                  { value: "solve", label: "Solve missing value (A:B = C:X)" },
                ]}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  id={`${baseId}-ra`}
                  label={ratioMode === "solve" ? "A" : "First term"}
                  value={ratioA}
                  onChange={setRatioA}
                />
                <NumberInput
                  id={`${baseId}-rb`}
                  label={ratioMode === "solve" ? "B" : "Second term"}
                  value={ratioB}
                  onChange={setRatioB}
                />
              </div>
              {ratioMode === "solve" ? (
                <NumberInput
                  id={`${baseId}-rc`}
                  label="C (known value)"
                  value={ratioC}
                  onChange={setRatioC}
                />
              ) : null}
            </>
          ) : null}

          {config.kind === "discount" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput
                id={`${baseId}-price`}
                label="Original price"
                value={price}
                onChange={setPrice}
                min="0"
              />
              <NumberInput
                id={`${baseId}-rate`}
                label="Discount (%)"
                value={rate}
                onChange={setRate}
              />
            </div>
          ) : null}

          {config.kind === "tax" ? (
            <>
              <SelectInput
                id={`${baseId}-tmode`}
                label="Mode"
                value={taxMode}
                onChange={(v) => setTaxMode(v as "add" | "remove")}
                options={[
                  { value: "add", label: "Add tax to price" },
                  { value: "remove", label: "Remove tax from inclusive price" },
                ]}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  id={`${baseId}-tprice`}
                  label={taxMode === "add" ? "Price (before tax)" : "Price (tax inclusive)"}
                  value={price}
                  onChange={setPrice}
                  min="0"
                />
                <NumberInput
                  id={`${baseId}-trate`}
                  label="Tax / VAT rate (%)"
                  value={rate}
                  onChange={setRate}
                  min="0"
                />
              </div>
            </>
          ) : null}

          {config.kind === "tip" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberInput
                id={`${baseId}-bill`}
                label="Bill amount"
                value={price}
                onChange={setPrice}
                min="0"
              />
              <NumberInput
                id={`${baseId}-tip`}
                label="Tip (%)"
                value={rate}
                onChange={setRate}
                min="0"
              />
              <NumberInput
                id={`${baseId}-people`}
                label="Number of people"
                value={people}
                onChange={setPeople}
                min="1"
                step="1"
              />
            </div>
          ) : null}

          {config.kind === "date-difference" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={`${baseId}-start`}>Start date</FieldLabel>
                  <input
                    id={`${baseId}-start`}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="tm-input w-full"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor={`${baseId}-end`}>End date</FieldLabel>
                  <input
                    id={`${baseId}-end`}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="tm-input w-full"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input
                  type="checkbox"
                  checked={inclusive}
                  onChange={(e) => setInclusive(e.target.checked)}
                  className="size-4 accent-[var(--tm-accent)]"
                />
                Inclusive day count (add one day to total days)
              </label>
            </>
          ) : null}

          {config.kind === "age" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor={`${baseId}-birth`}>Date of birth</FieldLabel>
                <input
                  id={`${baseId}-birth`}
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="tm-input w-full"
                />
              </div>
              <div>
                <FieldLabel htmlFor={`${baseId}-target`}>Target date</FieldLabel>
                <input
                  id={`${baseId}-target`}
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="tm-input w-full"
                />
              </div>
            </div>
          ) : null}

          {config.kind === "timezone" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={`${baseId}-date`}>Date</FieldLabel>
                  <input
                    id={`${baseId}-date`}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="tm-input w-full"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor={`${baseId}-time`}>Time</FieldLabel>
                  <input
                    id={`${baseId}-time`}
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="tm-input w-full"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TimeZoneSelector
                  id={`${baseId}-fromtz`}
                  label="From time zone"
                  value={fromTz}
                  onChange={setFromTz}
                />
                <TimeZoneSelector
                  id={`${baseId}-totz`}
                  label="To time zone"
                  value={toTz}
                  onChange={setToTz}
                />
              </div>
            </>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            {!config.live ? (
              <button type="button" className="tm-btn tm-btn-primary" onClick={compute}>
                {config.actionLabel || "Calculate"}
              </button>
            ) : null}
            {isUnitKind ? (
              <button type="button" className="tm-btn tm-btn-secondary" onClick={swapUnits}>
                Swap
              </button>
            ) : null}
            <button
              type="button"
              className="tm-btn tm-btn-secondary"
              onClick={handleCopy}
              disabled={!result?.copyText}
            >
              {copied ? "Copied" : "Copy Result"}
            </button>
            <button type="button" className="tm-btn tm-btn-ghost" onClick={resetAll}>
              Reset
            </button>
          </div>
        </div>

        <ResultCard result={result} error={error} live={config.live} />
      </div>
    </div>
  );
}
