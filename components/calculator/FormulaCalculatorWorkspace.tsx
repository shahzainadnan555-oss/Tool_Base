"use client";

import { useId, useMemo, useState } from "react";
import type { FormulaCalculatorSpec, FormulaResult } from "@/lib/formula-calculators";
import { copyText } from "@/lib/calculator/utils";
import { ScientificCalculatorPad } from "@/components/calculator/ScientificCalculatorPad";
import { MatrixCalculatorPad } from "@/components/calculator/MatrixCalculatorPad";

interface Props {
  config: FormulaCalculatorSpec;
  convertHeading?: string;
}

function defaultsFrom(config: FormulaCalculatorSpec): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of config.fields) {
    values[field.id] = field.defaultValue ?? (field.type === "checkbox" ? "false" : "");
  }
  return values;
}

function FormulaForm({ config, convertHeading }: Props) {
  const formId = useId();
  const [values, setValues] = useState(() => defaultsFrom(config));
  const [manualResult, setManualResult] = useState<FormulaResult | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const liveEvaluation = useMemo(() => {
    if (config.live === false) return null;
    try {
      return { result: config.compute(values), error: null as string | null };
    } catch (err) {
      return {
        result: null as FormulaResult | null,
        error: err instanceof Error ? err.message : "Unable to calculate with these inputs.",
      };
    }
  }, [config, values]);

  const result = config.live === false ? manualResult : liveEvaluation?.result ?? null;
  const error = config.live === false ? manualError : liveEvaluation?.error ?? null;
  const notices = config.notices ?? [];

  const runManual = () => {
    try {
      setManualResult(config.compute(values));
      setManualError(null);
    } catch (err) {
      setManualResult(null);
      setManualError(
        err instanceof Error ? err.message : "Unable to calculate with these inputs.",
      );
    }
  };

  return (
    <section className="space-y-5">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      {notices.map((notice) => (
        <p key={notice} className="tm-notice">
          {notice}
        </p>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        {config.fields.map((field) => {
          const id = `${formId}-${field.id}`;
          const spanClass = field.span === 2 ? "sm:col-span-2" : "";
          if (field.type === "select") {
            return (
              <div key={field.id} className={`min-w-0 ${spanClass}`}>
                <label htmlFor={id} className="mb-2 block text-sm font-bold text-tm-text">
                  {field.label}
                </label>
                <select
                  id={id}
                  className="tm-input w-full"
                  value={values[field.id] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                >
                  {(field.options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          if (field.type === "textarea") {
            return (
              <div key={field.id} className={`min-w-0 sm:col-span-2 ${spanClass}`}>
                <label htmlFor={id} className="mb-2 block text-sm font-bold text-tm-text">
                  {field.label}
                </label>
                <textarea
                  id={id}
                  className="tm-input min-h-28 w-full"
                  value={values[field.id] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                />
              </div>
            );
          }
          if (field.type === "checkbox") {
            return (
              <div key={field.id} className={`flex items-center gap-3 ${spanClass}`}>
                <input
                  id={id}
                  type="checkbox"
                  className="h-5 w-5"
                  checked={values[field.id] === "true"}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.id]: e.target.checked ? "true" : "false",
                    }))
                  }
                />
                <label htmlFor={id} className="text-sm font-bold text-tm-text">
                  {field.label}
                </label>
              </div>
            );
          }
          return (
            <div key={field.id} className={`min-w-0 ${spanClass}`}>
              <label htmlFor={id} className="mb-2 block text-sm font-bold text-tm-text">
                {field.label}
              </label>
              <input
                id={id}
                type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                inputMode={
                  field.inputMode ?? (field.type === "number" ? "decimal" : undefined)
                }
                min={field.min}
                max={field.max}
                step={field.step}
                placeholder={field.placeholder}
                className="tm-input w-full"
                value={values[field.id] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
              />
              {field.hint ? (
                <p className="mt-1 text-xs font-medium text-tm-muted">{field.hint}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        {config.live === false ? (
          <button type="button" className="tm-btn tm-btn-primary" onClick={runManual}>
            Calculate
          </button>
        ) : null}
        <button
          type="button"
          className="tm-btn tm-btn-secondary"
          onClick={() => {
            setValues(defaultsFrom(config));
            setManualError(null);
            setManualResult(null);
          }}
        >
          Reset
        </button>
        {result?.copyText ? (
          <button
            type="button"
            className="tm-btn tm-btn-secondary"
            onClick={async () => {
              await copyText(result.copyText);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy result"}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="tm-notice tm-notice-error" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="rounded-2xl border border-tm-border bg-tm-soft p-5" aria-live="polite">
          <p className="text-xs font-extrabold tracking-wide text-tm-accent uppercase">Result</p>
          <p className="mt-2 text-sm font-bold text-tm-muted">{result.primaryLabel}</p>
          <p className="tm-h2 mt-1 break-words">{result.primary}</p>
          {result.subhead ? (
            <p className="mt-2 text-sm font-medium text-tm-muted">{result.subhead}</p>
          ) : null}
          {result.breakdown?.length ? (
            <ul className="mt-4 space-y-2">
              {result.breakdown.map((row) => (
                <li
                  key={`${row.label}-${row.value}`}
                  className="flex flex-wrap justify-between gap-2 border-b border-tm-border pb-2 text-sm last:border-0"
                >
                  <span className="font-semibold text-tm-muted">{row.label}</span>
                  <span className="font-bold text-tm-text">{row.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {result.table ? (
            <div className="mt-4 max-w-full overflow-x-auto">
              {result.table.caption ? (
                <p className="mb-2 text-sm font-bold text-tm-text">{result.table.caption}</p>
              ) : null}
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-tm-border">
                    {result.table.headers.map((header) => (
                      <th key={header} className="px-2 py-2 font-bold text-tm-muted">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.table.rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-tm-border/70">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-2 py-2 font-medium text-tm-text">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {result.formula ? (
            <p className="mt-4 text-sm font-medium text-tm-muted">{result.formula}</p>
          ) : null}
          {result.notes?.map((note) => (
            <p key={note} className="mt-2 text-xs font-medium text-tm-muted">
              {note}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function FormulaCalculatorWorkspace({ config, convertHeading }: Props) {
  if (config.ui === "scientific") {
    return (
      <section className="space-y-4">
        {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}
        <ScientificCalculatorPad />
      </section>
    );
  }

  if (config.ui === "matrix") {
    return (
      <section className="space-y-4">
        {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}
        <MatrixCalculatorPad />
      </section>
    );
  }

  return <FormulaForm key={config.slug} config={config} convertHeading={convertHeading} />;
}
