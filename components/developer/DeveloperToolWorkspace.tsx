"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState, useTransition } from "react";
import { REGEX_TEMPLATES } from "@/lib/developer/regex";
import { processDeveloperTool } from "@/lib/developer/process";
import type {
  DeveloperProcessResult,
  DeveloperToolConfig,
  IndentStyle,
} from "@/lib/developer/types";
import { copyText, downloadTextFile } from "@/lib/developer/utils";
import { filterUserFacingNotices } from "@/lib/ui/notices";

interface DeveloperToolWorkspaceProps {
  config: DeveloperToolConfig;
  convertHeading?: string;
}

const FLAG_OPTIONS = [
  { value: "g", label: "g (global)" },
  { value: "i", label: "i (ignore case)" },
  { value: "m", label: "m (multiline)" },
  { value: "s", label: "s (dotAll)" },
  { value: "u", label: "u (unicode)" },
  { value: "y", label: "y (sticky)" },
] as const;

function ValidationBanner({
  valid,
  message,
  line,
  column,
  position,
}: {
  valid: boolean;
  message: string;
  line?: number;
  column?: number;
  position?: number;
}) {
  const details = [
    line != null ? `Line ${line}` : null,
    column != null ? `Column ${column}` : null,
    position != null ? `Position ${position}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
        valid
          ? "border-green-200 bg-green-50 text-green-900"
          : "border-red-200 bg-red-50 text-red-900"
      }`}
    >
      <p>
        <span aria-hidden="true">{valid ? "✓ " : "✕ "}</span>
        {valid
          ? message
          : message.toLowerCase().startsWith("invalid")
            ? message
            : `Invalid — ${message}`}
      </p>
      {!valid && details ? <p className="mt-1 text-xs font-medium opacity-90">{details}</p> : null}
    </div>
  );
}

function CodeEditor({
  id,
  label,
  value,
  onChange,
  readOnly,
  placeholder,
  rows = 16,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-tm-text">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        rows={rows}
        spellCheck={false}
        placeholder={placeholder}
        className={`tm-input min-h-72 w-full resize-y overflow-auto font-mono text-sm leading-relaxed whitespace-pre ${
          readOnly ? "bg-tm-soft" : ""
        }`}
      />
    </div>
  );
}

export function DeveloperToolWorkspace({
  config,
  convertHeading,
}: DeveloperToolWorkspaceProps) {
  const inputId = useId();
  const outputId = useId();
  const patternId = useId();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [result, setResult] = useState<DeveloperProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<IndentStyle>("2");
  const [urlMode, setUrlMode] = useState<"component" | "uri">("component");
  const [regexPattern, setRegexPattern] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("pattern") || "";
  });
  const [regexFlags, setRegexFlags] = useState(() => {
    if (typeof window === "undefined") return "g";
    return new URLSearchParams(window.location.search).get("flags") || "g";
  });
  const [regexTemplate, setRegexTemplate] = useState("email");
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [contains, setContains] = useState("");
  const [customSet, setCustomSet] = useState("A-Za-z0-9");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  const options = useMemo(
    () => ({
      indent,
      urlMode,
      regexPattern,
      regexFlags,
      regexTestText: input,
      regexTemplate,
      regexOptions: {
        template: regexTemplate,
        startsWith: startsWith || undefined,
        endsWith: endsWith || undefined,
        contains: contains || undefined,
        customSet,
      },
    }),
    [
      indent,
      urlMode,
      regexPattern,
      regexFlags,
      input,
      regexTemplate,
      startsWith,
      endsWith,
      contains,
      customSet,
    ],
  );

  const supportsIndent = [
    "json-format",
    "html-format",
    "css-format",
    "js-format",
    "xml-format",
    "sql-format",
  ].includes(config.kind);

  async function run(manual = true) {
    try {
      setError(null);
      if (manual) setBusy(true);
      const next = await processDeveloperTool(config, input, options);
      setResult(next);
      if (config.kind === "regex-generate") {
        setOutput(next.output);
        if (next.output) setRegexPattern(next.output);
      } else if (config.showOutput) {
        setOutput(next.output);
      } else if (config.kind === "regex-test") {
        setOutput(next.output);
      }
    } catch (err) {
      setResult(null);
      setOutput("");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      if (manual) setBusy(false);
    }
  }

  useEffect(() => {
    if (!config.live) return;
    if (config.kind === "regex-generate") return;
    startTransition(() => {
      if (!input.trim()) {
        setResult(null);
        setOutput("");
        setError(null);
        return;
      }
      void run(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, input, indent, urlMode]);

  function clearAll() {
    setInput("");
    setOutput("");
    setResult(null);
    setError(null);
    setCopied(false);
    if (config.kind === "regex-test" || config.kind === "regex-generate") {
      setRegexPattern("");
      setRegexFlags("g");
    }
  }

  function toggleFlag(flag: string) {
    setRegexFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : `${prev}${flag}`,
    );
  }

  async function handleCopy(value: string) {
    const ok = await copyText(value);
    if (!ok) {
      setError("Clipboard access was blocked. Please copy the text manually.");
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const copyTarget =
    config.kind === "regex-test"
      ? output || (result?.regex ? `Matches: ${result.regex.matchCount}` : "")
      : output;

  return (
    <div className="space-y-5">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      {filterUserFacingNotices(config.notices).map((notice) => (
        <div
          key={notice}
          className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-tm-text"
        >
          {notice}
        </div>
      ))}

      {supportsIndent ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Indentation">
          {(
            [
              { value: "2", label: "2 spaces" },
              { value: "4", label: "4 spaces" },
              { value: "tab", label: "Tabs" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                indent === option.value
                  ? "bg-tm-accent text-white"
                  : "bg-tm-soft text-tm-text"
              }`}
              onClick={() => setIndent(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {config.kind === "url-encode" ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="URL encoding mode">
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              urlMode === "component" ? "bg-tm-accent text-white" : "bg-tm-soft text-tm-text"
            }`}
            onClick={() => setUrlMode("component")}
          >
            URI component
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              urlMode === "uri" ? "bg-tm-accent text-white" : "bg-tm-soft text-tm-text"
            }`}
            onClick={() => setUrlMode("uri")}
          >
            Full URI
          </button>
        </div>
      ) : null}

      {config.kind === "regex-generate" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-tm-text">
            Template
            <select
              className="tm-input mt-2"
              value={regexTemplate}
              onChange={(e) => setRegexTemplate(e.target.value)}
            >
              {REGEX_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
              <option value="custom">Custom character set</option>
            </select>
          </label>
          {regexTemplate === "custom" ? (
            <label className="text-sm font-bold text-tm-text">
              Character set
              <input
                className="tm-input mt-2 font-mono"
                value={customSet}
                onChange={(e) => setCustomSet(e.target.value)}
                placeholder="A-Za-z0-9"
              />
            </label>
          ) : (
            <p className="self-end text-sm font-medium text-tm-muted">
              {REGEX_TEMPLATES.find((t) => t.id === regexTemplate)?.description}
            </p>
          )}
          <label className="text-sm font-bold text-tm-text">
            Starts with
            <input
              className="tm-input mt-2"
              value={startsWith}
              onChange={(e) => setStartsWith(e.target.value)}
            />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Ends with
            <input
              className="tm-input mt-2"
              value={endsWith}
              onChange={(e) => setEndsWith(e.target.value)}
            />
          </label>
          <label className="text-sm font-bold text-tm-text sm:col-span-2">
            Contains
            <input
              className="tm-input mt-2"
              value={contains}
              onChange={(e) => setContains(e.target.value)}
            />
          </label>
        </div>
      ) : null}

      {config.kind === "regex-test" ? (
        <div className="space-y-4">
          <label htmlFor={patternId} className="block text-sm font-bold text-tm-text">
            Pattern
            <input
              id={patternId}
              className="tm-input mt-2 font-mono"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder="^[A-Za-z0-9]+$"
              spellCheck={false}
            />
          </label>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Regex flags">
            {FLAG_OPTIONS.map((flag) => (
              <label key={flag.value} className="flex items-center gap-2 text-sm font-bold text-tm-text">
                <input
                  type="checkbox"
                  checked={regexFlags.includes(flag.value)}
                  onChange={() => toggleFlag(flag.value)}
                />
                {flag.label}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {config.kind === "regex-generate" ? null : (
        <div
          className={`grid gap-4 ${
            config.showOutput && config.kind !== "regex-test" ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <CodeEditor
            id={inputId}
            label={config.inputLabel}
            value={input}
            onChange={setInput}
            placeholder="Paste your input here…"
          />
          {config.showOutput ? (
            <CodeEditor
              id={outputId}
              label={config.outputLabel || "Output"}
              value={output}
              readOnly
              placeholder="Result will appear here…"
            />
          ) : null}
        </div>
      )}

      {config.kind === "regex-generate" ? (
        <CodeEditor
          id={outputId}
          label="Generated regex"
          value={output}
          readOnly
          placeholder="Click Generate Regex to create a pattern…"
          rows={6}
        />
      ) : null}

      {result?.validation ? (
        <ValidationBanner
          valid={result.validation.valid}
          message={
            result.validation.valid
              ? result.validation.message
              : result.validation.message
          }
          line={result.validation.line}
          column={result.validation.column}
          position={result.validation.position}
        />
      ) : null}

      {result?.regex ? (
        <div className="space-y-3 rounded-2xl border border-tm-border bg-tm-white p-4">
          {result.regex.error ? (
            <p className="text-sm font-semibold text-red-800" role="alert">
              {result.regex.timedOut ? "✕ " : ""}
              {result.regex.error}
            </p>
          ) : (
            <>
              <p className="text-sm font-extrabold text-tm-text">
                Matches: {result.regex.matchCount.toLocaleString()}
              </p>
              <div className="max-h-64 overflow-auto rounded-xl border border-tm-border bg-tm-soft p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {result.regex.matchCount === 0
                  ? "No matches found."
                  : output || "No match details."}
              </div>
              {input && result.regex.matches.length ? (
                <div className="rounded-xl border border-tm-border p-3 text-sm leading-relaxed">
                  <p className="mb-2 text-xs font-bold tracking-wide text-tm-muted uppercase">
                    Highlighted test text
                  </p>
                  <HighlightedText text={input} matches={result.regex.matches} />
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}

      {result?.notice ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          {result.notice}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      {busy ? (
        <p className="text-sm font-bold text-tm-muted" aria-live="polite">
          Working…
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {!config.live ||
        config.kind === "regex-test" ||
        config.kind === "regex-generate" ? (
          <button
            type="button"
            className="tm-btn tm-btn-primary"
            onClick={() => void run(true)}
            disabled={busy}
          >
            {config.actionLabel}
          </button>
        ) : null}

        <button
          type="button"
          className="tm-btn tm-btn-secondary"
          onClick={() => void handleCopy(copyTarget)}
          disabled={!copyTarget}
        >
          {copied ? "Copied" : "Copy"}
        </button>

        {config.showOutput || config.kind === "regex-test" || config.kind === "regex-generate" ? (
          <button
            type="button"
            className="tm-btn tm-btn-secondary"
            onClick={() => downloadTextFile(copyTarget, config.downloadName)}
            disabled={!copyTarget}
          >
            Download
          </button>
        ) : null}

        {config.kind === "regex-generate" && output ? (
          <Link
            href={`/tools/regex-tester?pattern=${encodeURIComponent(output)}&flags=${encodeURIComponent(regexFlags || "g")}`}
            className="tm-btn tm-btn-secondary"
          >
            Test This Regex
          </Link>
        ) : null}

        <button type="button" className="tm-btn tm-btn-ghost" onClick={clearAll}>
          Clear
        </button>
      </div>
    </div>
  );
}

function HighlightedText({
  text,
  matches,
}: {
  text: string;
  matches: Array<{ index: number; end: number; match: string }>;
}) {
  const parts: Array<{ text: string; hit: boolean }> = [];
  let cursor = 0;
  const sorted = [...matches].sort((a, b) => a.index - b.index);
  for (const match of sorted) {
    if (match.index < cursor) continue;
    if (match.index > cursor) {
      parts.push({ text: text.slice(cursor, match.index), hit: false });
    }
    parts.push({ text: text.slice(match.index, match.end), hit: true });
    cursor = match.end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });

  return (
    <p className="whitespace-pre-wrap break-words font-mono text-sm text-tm-text">
      {parts.map((part, index) =>
        part.hit ? (
          <mark
            key={`${index}-${part.text.slice(0, 8)}`}
            className="rounded bg-amber-200 px-0.5 text-tm-text"
          >
            {part.text}
          </mark>
        ) : (
          <span key={`${index}-${part.text.slice(0, 8)}`}>{part.text}</span>
        ),
      )}
    </p>
  );
}
