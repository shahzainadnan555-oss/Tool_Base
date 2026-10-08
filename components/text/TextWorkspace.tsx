"use client";

import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { CASE_OPTIONS } from "@/lib/text/configs";
import { processTextTool } from "@/lib/text/process";
import type {
  CaseMode,
  TextProcessResult,
  TextStats,
  TextToolConfig,
} from "@/lib/text/types";
import { LARGE_TEXT_THRESHOLD, MAX_LOREM_COUNT, MAX_REPEAT_COUNT } from "@/lib/text/types";
import { copyText, downloadTextFile } from "@/lib/text/utils";
import { computeTextStats } from "@/lib/text/stats";
import { filterUserFacingNotices } from "@/lib/ui/notices";

interface TextWorkspaceProps {
  config: TextToolConfig;
  convertHeading?: string;
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-tm-border bg-tm-soft px-3 py-2">
      <p className="text-[11px] font-bold tracking-wide text-tm-muted uppercase">{label}</p>
      <p className="text-base font-extrabold text-tm-text">{value}</p>
    </div>
  );
}

export function TextWorkspace({ config, convertHeading }: TextWorkspaceProps) {
  const inputId = useId();
  const outputId = useId();
  const secondaryId = useId();
  const [input, setInput] = useState("");
  const [secondary, setSecondary] = useState("");
  const [result, setResult] = useState<TextProcessResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseMode, setCaseMode] = useState<CaseMode>(
    config.lockedCaseMode || config.defaultCaseMode || "upper",
  );
  const [readingSpeed, setReadingSpeed] = useState(200);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [preserveFirst, setPreserveFirst] = useState(true);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortCaseSensitive, setSortCaseSensitive] = useState(false);
  const [sortNumeric, setSortNumeric] = useState(true);
  const [ignoreLeadingWhitespace, setIgnoreLeadingWhitespace] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [normalizeLineEndings, setNormalizeLineEndings] = useState(true);
  const [collapseBlankLines, setCollapseBlankLines] = useState(true);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [replaceAll, setReplaceAll] = useState(true);
  const [wholeWord, setWholeWord] = useState(false);
  const [repeatCount, setRepeatCount] = useState(5);
  const [separator, setSeparator] = useState<"newline" | "space" | "none">("newline");
  const [loremMode, setLoremMode] = useState<"paragraphs" | "sentences" | "words">(
    "paragraphs",
  );
  const [loremCount, setLoremCount] = useState(3);
  const [loremStartClassic, setLoremStartClassic] = useState(true);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<number | null>(null);

  const liveStats: TextStats | null = useMemo(() => {
    if (!config.showStats) return null;
    return computeTextStats(input, readingSpeed);
  }, [config.showStats, input, readingSpeed]);

  const options = useMemo(
    () => ({
      caseMode,
      readingSpeed,
      caseSensitive,
      preserveFirst,
      sortDirection,
      sortCaseSensitive,
      sortNumeric,
      ignoreLeadingWhitespace,
      collapseSpaces,
      trimLines,
      removeEmptyLines,
      normalizeLineEndings,
      collapseBlankLines,
      findText,
      replaceText,
      replaceAll,
      wholeWord,
      repeatCount,
      separator,
      loremMode,
      loremCount,
      loremStartClassic,
    }),
    [
      caseMode,
      readingSpeed,
      caseSensitive,
      preserveFirst,
      sortDirection,
      sortCaseSensitive,
      sortNumeric,
      ignoreLeadingWhitespace,
      collapseSpaces,
      trimLines,
      removeEmptyLines,
      normalizeLineEndings,
      collapseBlankLines,
      findText,
      replaceText,
      replaceAll,
      wholeWord,
      repeatCount,
      separator,
      loremMode,
      loremCount,
      loremStartClassic,
    ],
  );

  useEffect(() => {
    if (!config.live) return;

    const run = () => {
      startTransition(() => {
        try {
          setError(null);
          setResult(processTextTool(config, input, secondary, options));
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      });
    };

    const large =
      input.length + secondary.length >= LARGE_TEXT_THRESHOLD ||
      (config.kind === "diff" && input.length * secondary.length > 250_000);

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (large) {
      debounceRef.current = window.setTimeout(run, 180);
      return () => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
      };
    }

    run();
    return undefined;
  }, [config, input, secondary, options]);

  function runManual() {
    try {
      setError(null);
      setResult(processTextTool(config, input, secondary, options));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function clearAll() {
    setInput("");
    setSecondary("");
    setResult(null);
    setError(null);
    setCopied(false);
    setFindText("");
    setReplaceText("");
  }

  function swapInputs() {
    setInput(secondary);
    setSecondary(input);
  }

  const outputText =
    config.kind === "diff"
      ? (result?.diffParts || [])
          .map((part) => {
            const prefix =
              part.type === "add" ? "+ " : part.type === "remove" ? "- " : "  ";
            return `${prefix}${part.value}`;
          })
          .join("\n")
      : config.kind === "stats" || config.kind === "reading-time"
        ? input
        : (result?.output ?? "");

  const displayStats = result?.stats || liveStats;

  async function handleCopy() {
    const ok = await copyText(outputText);
    if (!ok) {
      setError("Clipboard access was blocked. Please copy the text manually.");
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      {filterUserFacingNotices(config.notices).length ? (
        <div className="tm-notice tm-notice-info">
          {filterUserFacingNotices(config.notices).map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
        </div>
      ) : null}

      {/* Options panels */}
      {config.kind === "case" && !config.lockedCaseMode ? (
        <div className="flex flex-wrap gap-2">
          {CASE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                caseMode === option.value
                  ? "bg-tm-accent text-tm-on-brand"
                  : "bg-tm-soft text-tm-text"
              }`}
              onClick={() => setCaseMode(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {config.kind === "reading-time" ? (
        <label className="block max-w-xs text-sm font-bold text-tm-text">
          Reading Speed (words/minute)
          <input
            type="number"
            min={60}
            max={600}
            className="tm-input mt-2"
            value={readingSpeed}
            onChange={(e) => setReadingSpeed(Number(e.target.value) || 200)}
          />
        </label>
      ) : null}

      {config.slug === "remove-extra-spaces" ? (
        <div className="flex flex-wrap gap-4 text-sm font-bold text-tm-text">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={collapseSpaces}
              onChange={(e) => setCollapseSpaces(e.target.checked)}
            />
            Collapse repeated spaces
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
            />
            Trim line whitespace
          </label>
        </div>
      ) : null}

      {config.kind === "dedupe" ? (
        <div className="flex flex-wrap gap-4 text-sm font-bold text-tm-text">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            Case-sensitive
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preserveFirst}
              onChange={(e) => setPreserveFirst(e.target.checked)}
            />
            Preserve first occurrence
          </label>
        </div>
      ) : null}

      {config.kind === "sort" ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              sortDirection === "asc" ? "bg-tm-accent text-tm-on-brand" : "bg-tm-soft text-tm-text"
            }`}
            onClick={() => setSortDirection("asc")}
          >
            A → Z
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              sortDirection === "desc" ? "bg-tm-accent text-tm-on-brand" : "bg-tm-soft text-tm-text"
            }`}
            onClick={() => setSortDirection("desc")}
          >
            Z → A
          </button>
          <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
            <input
              type="checkbox"
              checked={sortCaseSensitive}
              onChange={(e) => setSortCaseSensitive(e.target.checked)}
            />
            Case-sensitive
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
            <input
              type="checkbox"
              checked={sortNumeric}
              onChange={(e) => setSortNumeric(e.target.checked)}
            />
            Numeric order
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
            <input
              type="checkbox"
              checked={ignoreLeadingWhitespace}
              onChange={(e) => setIgnoreLeadingWhitespace(e.target.checked)}
            />
            Ignore leading whitespace
          </label>
        </div>
      ) : null}

      {config.kind === "cleaner" ? (
        <div className="flex flex-wrap gap-4 text-sm font-bold text-tm-text">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={collapseSpaces}
              onChange={(e) => setCollapseSpaces(e.target.checked)}
            />
            Remove extra spaces
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
            />
            Trim lines
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={normalizeLineEndings}
              onChange={(e) => setNormalizeLineEndings(e.target.checked)}
            />
            Normalize line endings
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={collapseBlankLines}
              onChange={(e) => setCollapseBlankLines(e.target.checked)}
            />
            Collapse duplicate blank lines
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
            />
            Remove empty lines
          </label>
        </div>
      ) : null}

      {config.kind === "find-replace" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-tm-text">
            Find
            <input
              className="tm-input mt-2"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Text to find"
            />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Replace with
            <input
              className="tm-input mt-2"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replacement text"
            />
          </label>
          <div className="flex flex-wrap gap-4 text-sm font-bold text-tm-text sm:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
              />
              Case sensitive
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={(e) => setWholeWord(e.target.checked)}
              />
              Whole word
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={replaceAll}
                onChange={(e) => setReplaceAll(e.target.checked)}
              />
              Replace all
            </label>
          </div>
        </div>
      ) : null}

      {config.kind === "repeater" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-tm-text">
            Repeat count (max {MAX_REPEAT_COUNT})
            <input
              type="number"
              min={1}
              max={MAX_REPEAT_COUNT}
              className="tm-input mt-2"
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number(e.target.value) || 1)}
            />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Separator
            <select
              className="tm-input mt-2"
              value={separator}
              onChange={(e) =>
                setSeparator(e.target.value as "newline" | "space" | "none")
              }
            >
              <option value="newline">New line</option>
              <option value="space">Space</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>
      ) : null}

      {config.kind === "generate" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-bold text-tm-text">
            Generate
            <select
              className="tm-input mt-2"
              value={loremMode}
              onChange={(e) =>
                setLoremMode(e.target.value as "paragraphs" | "sentences" | "words")
              }
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </label>
          <label className="text-sm font-bold text-tm-text">
            Count (max {MAX_LOREM_COUNT})
            <input
              type="number"
              min={1}
              max={MAX_LOREM_COUNT}
              className="tm-input mt-2"
              value={loremCount}
              onChange={(e) => setLoremCount(Number(e.target.value) || 1)}
            />
          </label>
          <label className="flex items-end gap-2 pb-3 text-sm font-bold text-tm-text">
            <input
              type="checkbox"
              checked={loremStartClassic}
              onChange={(e) => setLoremStartClassic(e.target.checked)}
            />
            Start with “Lorem ipsum…”
          </label>
        </div>
      ) : null}

      {/* Editors */}
      {config.kind === "generate" ? null : (
        <div
          className={`grid gap-4 ${
            config.dualInput || config.showOutput ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <div>
            <label htmlFor={inputId} className="mb-2 block text-sm font-bold text-tm-text">
              {config.dualInput ? "Original Text" : "Input"}
            </label>
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={14}
              className="tm-input min-h-64 w-full resize-y font-medium leading-relaxed"
              placeholder="Paste or type your text here…"
              spellCheck
            />
          </div>

          {config.dualInput ? (
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor={secondaryId}
                  className="block text-sm font-bold text-tm-text"
                >
                  Modified Text
                </label>
                <button
                  type="button"
                  className="tm-btn tm-btn-ghost !px-3 !py-1 text-xs"
                  onClick={swapInputs}
                >
                  Swap
                </button>
              </div>
              <textarea
                id={secondaryId}
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
                rows={14}
                className="tm-input min-h-64 w-full resize-y font-medium leading-relaxed"
                placeholder="Paste the modified text here…"
                spellCheck
              />
            </div>
          ) : null}

          {config.showOutput ? (
            <div>
              <label htmlFor={outputId} className="mb-2 block text-sm font-bold text-tm-text">
                Output
              </label>
              <textarea
                id={outputId}
                value={outputText}
                readOnly
                rows={14}
                className="tm-input min-h-64 w-full resize-y bg-tm-soft font-medium leading-relaxed"
                placeholder="Result will appear here…"
              />
            </div>
          ) : null}
        </div>
      )}

      {config.kind === "generate" ? (
        <div>
          <label htmlFor={outputId} className="mb-2 block text-sm font-bold text-tm-text">
            Generated text
          </label>
          <textarea
            id={outputId}
            value={outputText}
            readOnly
            rows={14}
            className="tm-input min-h-64 w-full resize-y bg-tm-soft font-medium leading-relaxed"
            placeholder="Click Generate to create placeholder text…"
          />
        </div>
      ) : null}

      {config.kind === "diff" && result?.diffParts ? (
        <div className="max-h-96 overflow-auto rounded-2xl border border-tm-border bg-tm-elevated p-4 font-mono text-sm leading-relaxed">
          {result.diffParts.length === 0 ? (
            <p className="font-sans font-semibold text-tm-muted">No differences found.</p>
          ) : (
            result.diffParts.map((part, index) => (
              <div
                key={`${part.type}-${index}-${part.value.slice(0, 12)}`}
                className={
                  part.type === "add"
                    ? "tm-diff-add"
                    : part.type === "remove"
                      ? "tm-diff-del"
                      : "px-2 py-0.5 text-tm-text"
                }
              >
                <span className="mr-2 font-bold" aria-hidden="true">
                  {part.type === "add" ? "+" : part.type === "remove" ? "−" : " "}
                </span>
                <span className="sr-only">
                  {part.type === "add"
                    ? "Added: "
                    : part.type === "remove"
                      ? "Removed: "
                      : "Unchanged: "}
                </span>
                {part.value || " "}
              </div>
            ))
          )}
        </div>
      ) : null}

      {displayStats ? (
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <StatPill label="Words" value={displayStats.words.toLocaleString()} />
          <StatPill label="Characters" value={displayStats.characters.toLocaleString()} />
          <StatPill
            label="No spaces"
            value={displayStats.charactersNoSpaces.toLocaleString()}
          />
          <StatPill label="Sentences" value={displayStats.sentences.toLocaleString()} />
          <StatPill label="Paragraphs" value={displayStats.paragraphs.toLocaleString()} />
          <StatPill label="Lines" value={displayStats.lines.toLocaleString()} />
          <StatPill
            label="Reading time"
            value={
              displayStats.words === 0
                ? "0 min"
                : `~${displayStats.readingMinutes} min`
            }
          />
        </div>
      ) : null}

      {typeof result?.matchCount === "number" ? (
        <p className="text-sm font-bold text-tm-text">
          Matches: {result.matchCount.toLocaleString()}
        </p>
      ) : null}

      {result?.notice ? (
        <p className="tm-notice tm-notice-warning">
          {result.notice}
        </p>
      ) : null}

      {error ? (
        <p className="tm-notice tm-notice-error">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {!config.live || config.kind === "generate" || config.kind === "find-replace" || config.kind === "repeater" ? (
          <button type="button" className="tm-btn tm-btn-primary" onClick={runManual}>
            {config.actionLabel || "Process"}
          </button>
        ) : null}
        <button
          type="button"
          className="tm-btn tm-btn-secondary"
          onClick={() => void handleCopy()}
          disabled={!outputText}
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          className="tm-btn tm-btn-secondary"
          onClick={() => downloadTextFile(outputText, config.downloadName)}
          disabled={!outputText}
        >
          Download TXT
        </button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={clearAll}>
          Clear
        </button>
      </div>
    </div>
  );
}
