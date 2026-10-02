"use client";

import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { processSecurityTool } from "@/lib/security/process";
import type {
  SecurityProcessResult,
  SecurityToolConfig,
} from "@/lib/security/types";
import {
  MAX_PASSWORD_LENGTH,
  MAX_RANDOM_QUANTITY,
  MAX_STRING_LENGTH,
  MAX_UUID_QUANTITY,
} from "@/lib/security/types";
import { copyText, downloadBlob, downloadTextFile } from "@/lib/security/utils";

interface SecurityWorkspaceProps {
  config: SecurityToolConfig;
  convertHeading?: string;
}

function OutputBox({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-tm-text">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        readOnly
        rows={10}
        spellCheck={false}
        className="tm-input min-h-48 w-full resize-y overflow-auto bg-tm-soft font-mono text-sm leading-relaxed break-all"
      />
    </div>
  );
}

export function SecurityWorkspace({ config, convertHeading }: SecurityWorkspaceProps) {
  const inputId = useId();
  const outputId = useId();
  const fileId = useId();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [result, setResult] = useState<SecurityProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [hashMode, setHashMode] = useState<"text" | "file">("text");
  const [file, setFile] = useState<File | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [decimalMode, setDecimalMode] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState(4);
  const [baseMode, setBaseMode] = useState<"encode" | "decode">("encode");
  const [decodeMime, setDecodeMime] = useState("application/octet-stream");
  const [decodeName, setDecodeName] = useState("decoded-file.bin");
  const [useNow, setUseNow] = useState(true);
  const [dateValue, setDateValue] = useState("");
  const [timestampUnit, setTimestampUnit] = useState<"seconds" | "milliseconds">(
    "seconds",
  );
  const [qrSize, setQrSize] = useState(256);
  const [qrErrorCorrection, setQrErrorCorrection] = useState<"L" | "M" | "Q" | "H">(
    "M",
  );
  const [qrMargin, setQrMargin] = useState(2);
  const [qrDark, setQrDark] = useState("#0f172a");
  const [qrLight, setQrLight] = useState("#ffffff");
  const abortRef = useRef<AbortController | null>(null);
  const [, startTransition] = useTransition();

  const options = useMemo(
    () => ({
      hashMode,
      file,
      quantity,
      length,
      includeUpper,
      includeLower,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
      min,
      max,
      decimalMode,
      decimalPlaces,
      mode: baseMode,
      mimeType: decodeMime,
      fileName: decodeName,
      useNow,
      dateValue,
      timestampUnit,
      qrSize,
      qrErrorCorrection,
      qrMargin,
      qrDark,
      qrLight,
    }),
    [
      hashMode,
      file,
      quantity,
      length,
      includeUpper,
      includeLower,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
      min,
      max,
      decimalMode,
      decimalPlaces,
      baseMode,
      decodeMime,
      decodeName,
      useNow,
      dateValue,
      timestampUnit,
      qrSize,
      qrErrorCorrection,
      qrMargin,
      qrDark,
      qrLight,
    ],
  );

  async function run(manual = true) {
    if (busy) return;
    try {
      setError(null);
      if (manual) {
        setBusy(true);
        setProgress(null);
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const next = await processSecurityTool(config, input, {
        ...options,
        signal: controller.signal,
        onProgress: (ratio) => setProgress(Math.round(ratio * 100)),
      });
      setResult(next);
      setOutput(next.output);
      setProgress(null);
    } catch (err) {
      setResult(null);
      setOutput("");
      setProgress(null);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      if (manual) setBusy(false);
    }
  }

  useEffect(() => {
    if (!config.live) return;
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
  }, [config, input, timestampUnit, baseMode]);

  function clearAll() {
    abortRef.current?.abort();
    setInput("");
    setOutput("");
    setResult(null);
    setError(null);
    setCopied(false);
    setFile(null);
    setProgress(null);
    setBusy(false);
  }

  async function handleCopy() {
    const ok = await copyText(output);
    if (!ok) {
      setError("Clipboard access was blocked. Please copy the text manually.");
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    if (result?.downloadBlob && result.downloadName) {
      downloadBlob(result.downloadBlob, result.downloadName);
      return;
    }
    if (config.kind === "qr" && result?.qrSvg) {
      downloadBlob(
        new Blob([result.qrSvg], { type: "image/svg+xml;charset=utf-8" }),
        "qr-code.svg",
      );
      return;
    }
    if (output) downloadTextFile(output, config.downloadName);
  }

  const canDownload = Boolean(
    result?.downloadBlob ||
      (config.kind === "qr" && result?.qrSvg) ||
      (output && config.kind !== "qr"),
  );

  const showTextInput =
    config.kind !== "uuid" &&
    config.kind !== "password" &&
    config.kind !== "random-string" &&
    config.kind !== "random-number" &&
    config.kind !== "timestamp-generate" &&
    !(config.kind === "hash" && hashMode === "file") &&
    !(config.kind === "base64-file" && baseMode === "encode");

  return (
    <div className="space-y-5">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      {config.notices.map((notice) => (
        <div
          key={notice}
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
        >
          {notice}
        </div>
      ))}

      {config.kind === "hash" && config.allowFile ? (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Hash input mode">
          {(["text", "file"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={hashMode === mode}
              className={`rounded-full px-3 py-1.5 text-sm font-bold capitalize ${
                hashMode === mode ? "bg-tm-accent text-white" : "bg-tm-soft text-tm-text"
              }`}
              onClick={() => setHashMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      ) : null}

      {config.kind === "base32" || config.kind === "base64-file" ? (
        <div className="flex flex-wrap gap-2">
          {(["encode", "decode"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm font-bold capitalize ${
                baseMode === mode ? "bg-tm-accent text-white" : "bg-tm-soft text-tm-text"
              }`}
              onClick={() => setBaseMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      ) : null}

      {config.kind === "uuid" ? (
        <label className="block max-w-xs text-sm font-bold text-tm-text">
          Quantity (max {MAX_UUID_QUANTITY})
          <input
            type="number"
            min={1}
            max={MAX_UUID_QUANTITY}
            className="tm-input mt-2"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          />
        </label>
      ) : null}

      {config.kind === "password" || config.kind === "random-string" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-tm-text">
            Length (max {config.kind === "password" ? MAX_PASSWORD_LENGTH : MAX_STRING_LENGTH})
            <input
              type="number"
              min={config.kind === "password" ? 4 : 1}
              max={config.kind === "password" ? MAX_PASSWORD_LENGTH : MAX_STRING_LENGTH}
              className="tm-input mt-2"
              value={length}
              onChange={(e) => setLength(Number(e.target.value) || 16)}
            />
          </label>
          {config.kind === "random-string" ? (
            <label className="text-sm font-bold text-tm-text">
              Quantity (max {MAX_RANDOM_QUANTITY})
              <input
                type="number"
                min={1}
                max={MAX_RANDOM_QUANTITY}
                className="tm-input mt-2"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              />
            </label>
          ) : (
            <p className="self-end text-sm font-medium text-tm-muted">
              Length {length} · {[
                includeUpper && "A-Z",
                includeLower && "a-z",
                includeNumbers && "0-9",
                includeSymbols && "symbols",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-sm font-bold text-tm-text sm:col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} />
              Uppercase
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeLower} onChange={(e) => setIncludeLower(e.target.checked)} />
              Lowercase
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />
              Numbers
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />
              Symbols
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} />
              Exclude ambiguous
            </label>
          </div>
        </div>
      ) : null}

      {config.kind === "random-number" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-bold text-tm-text">
            Minimum
            <input type="number" className="tm-input mt-2" value={min} onChange={(e) => setMin(Number(e.target.value))} />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Maximum
            <input type="number" className="tm-input mt-2" value={max} onChange={(e) => setMax(Number(e.target.value))} />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Quantity
            <input
              type="number"
              min={1}
              max={MAX_RANDOM_QUANTITY}
              className="tm-input mt-2"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            />
          </label>
          <label className="flex items-end gap-2 pb-3 text-sm font-bold text-tm-text">
            <input type="checkbox" checked={decimalMode} onChange={(e) => setDecimalMode(e.target.checked)} />
            Decimal mode
          </label>
          {decimalMode ? (
            <label className="text-sm font-bold text-tm-text">
              Decimal places
              <input
                type="number"
                min={0}
                max={10}
                className="tm-input mt-2"
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(Number(e.target.value) || 0)}
              />
            </label>
          ) : null}
        </div>
      ) : null}

      {config.kind === "timestamp-generate" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
            <input type="checkbox" checked={useNow} onChange={(e) => setUseNow(e.target.checked)} />
            Use current time
          </label>
          {!useNow ? (
            <label className="text-sm font-bold text-tm-text">
              Date / time
              <input
                type="datetime-local"
                className="tm-input mt-2"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
              />
            </label>
          ) : null}
        </div>
      ) : null}

      {config.kind === "timestamp-convert" ? (
        <div className="flex flex-wrap gap-2">
          {(["seconds", "milliseconds"] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm font-bold capitalize ${
                timestampUnit === unit ? "bg-tm-accent text-white" : "bg-tm-soft text-tm-text"
              }`}
              onClick={() => setTimestampUnit(unit)}
            >
              {unit}
            </button>
          ))}
        </div>
      ) : null}

      {config.kind === "qr" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm font-bold text-tm-text">
            Size
            <input type="number" min={128} max={1024} className="tm-input mt-2" value={qrSize} onChange={(e) => setQrSize(Number(e.target.value) || 256)} />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Error correction
            <select className="tm-input mt-2" value={qrErrorCorrection} onChange={(e) => setQrErrorCorrection(e.target.value as "L" | "M" | "Q" | "H")}>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="Q">Q</option>
              <option value="H">H</option>
            </select>
          </label>
          <label className="text-sm font-bold text-tm-text">
            Margin
            <input type="number" min={0} max={8} className="tm-input mt-2" value={qrMargin} onChange={(e) => setQrMargin(Number(e.target.value) || 0)} />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Foreground
            <input type="color" className="tm-input mt-2 h-11 p-1" value={qrDark} onChange={(e) => setQrDark(e.target.value)} />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Background
            <input type="color" className="tm-input mt-2 h-11 p-1" value={qrLight} onChange={(e) => setQrLight(e.target.value)} />
          </label>
        </div>
      ) : null}

      {config.kind === "hash" && hashMode === "file" ? (
        <label htmlFor={fileId} className="block text-sm font-bold text-tm-text">
          Upload file
          <input
            id={fileId}
            type="file"
            className="tm-input mt-2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file ? (
            <p className="mt-2 text-sm font-medium text-tm-muted">
              {file.name} · {(file.size / 1024).toFixed(1)} KB
            </p>
          ) : null}
        </label>
      ) : null}

      {config.kind === "base64-file" && baseMode === "encode" ? (
        <label htmlFor={fileId} className="block text-sm font-bold text-tm-text">
          Upload file
          <input
            id={fileId}
            type="file"
            className="tm-input mt-2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file ? (
            <p className="mt-2 text-sm font-medium text-tm-muted">
              {file.name} · {file.type || "unknown type"} · {(file.size / 1024).toFixed(1)} KB
            </p>
          ) : null}
        </label>
      ) : null}

      {config.kind === "base64-file" && baseMode === "decode" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-tm-text">
            MIME type
            <input className="tm-input mt-2" value={decodeMime} onChange={(e) => setDecodeMime(e.target.value)} />
          </label>
          <label className="text-sm font-bold text-tm-text">
            Download filename
            <input className="tm-input mt-2" value={decodeName} onChange={(e) => setDecodeName(e.target.value)} />
          </label>
        </div>
      ) : null}

      {showTextInput ? (
        <div className={`grid gap-4 ${config.showOutput && config.kind !== "qr" ? "lg:grid-cols-2" : ""}`}>
          <div className="min-w-0">
            <label htmlFor={inputId} className="mb-2 block text-sm font-bold text-tm-text">
              {config.inputLabel || "Input"}
            </label>
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={config.kind === "jwt" ? 8 : 12}
              spellCheck={false}
              className="tm-input min-h-48 w-full resize-y overflow-auto font-mono text-sm leading-relaxed"
              placeholder="Paste or type your input…"
            />
          </div>
          {config.showOutput && config.kind !== "qr" ? (
            <OutputBox id={outputId} label={config.outputLabel || "Output"} value={output} />
          ) : null}
        </div>
      ) : null}

      {!showTextInput && config.showOutput && config.kind !== "qr" ? (
        <OutputBox id={outputId} label={config.outputLabel || "Output"} value={output} />
      ) : null}

      {config.kind === "jwt" && result?.jwt ? (
        <div className="rounded-2xl border border-tm-border bg-white p-4">
          <p className="text-sm font-extrabold text-tm-text">Decoded — Not Verified</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <pre className="overflow-auto rounded-xl bg-tm-soft p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
              {JSON.stringify(result.jwt.header, null, 2)}
            </pre>
            <pre className="overflow-auto rounded-xl bg-tm-soft p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
              {JSON.stringify(result.jwt.payload, null, 2)}
            </pre>
          </div>
        </div>
      ) : null}

      {config.kind === "qr" && result?.qrDataUrl ? (
        <div className="rounded-2xl border border-tm-border bg-white p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.qrDataUrl}
            alt="Generated QR code"
            className="mx-auto h-auto max-w-full"
            width={qrSize}
            height={qrSize}
          />
        </div>
      ) : null}

      {result?.meta && (config.kind === "hash" || config.kind === "base64-file") ? (
        <p className="text-sm font-medium text-tm-muted">
          {Object.entries(result.meta)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ")}
        </p>
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
          {progress != null ? `Working… ${progress}%` : "Working…"}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {!config.live ? (
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
          onClick={() => void handleCopy()}
          disabled={!output || config.kind === "qr"}
        >
          {copied ? "Copied" : config.kind === "hash" ? "Copy Hash" : "Copy"}
        </button>
        {config.kind === "qr" ? (
          <>
            <button
              type="button"
              className="tm-btn tm-btn-secondary"
              disabled={!result?.downloadBlob}
              onClick={() => result?.downloadBlob && downloadBlob(result.downloadBlob, "qr-code.png")}
            >
              Download PNG
            </button>
            <button
              type="button"
              className="tm-btn tm-btn-secondary"
              disabled={!result?.qrSvg}
              onClick={() =>
                result?.qrSvg &&
                downloadBlob(
                  new Blob([result.qrSvg], { type: "image/svg+xml;charset=utf-8" }),
                  "qr-code.svg",
                )
              }
            >
              Download SVG
            </button>
          </>
        ) : (
          <button
            type="button"
            className="tm-btn tm-btn-secondary"
            onClick={handleDownload}
            disabled={!canDownload}
          >
            Download
          </button>
        )}
        <button type="button" className="tm-btn tm-btn-ghost" onClick={clearAll}>
          Clear
        </button>
      </div>
    </div>
  );
}
