"use client";

import { useId, useState } from "react";
import { ConvertButton } from "@/components/image-converter/ConvertButton";
import { FileValidationMessage } from "@/components/image-converter/FileValidationMessage";
import { PdfUpload } from "@/components/pdf/PdfUpload";
import { ProcessingProgress } from "@/components/ui/ProcessingProgress";
import { processDocumentData } from "@/lib/document-data/process";
import type { DocumentDataConfig, DocumentDataResult } from "@/lib/document-data/types";
import { downloadBlob, formatBytes } from "@/lib/document-data/utils";
import { validateDocumentFile } from "@/lib/document-data/validate";
import { useOperationController } from "@/lib/processing/useOperationController";

interface DocumentDataWorkspaceProps {
  config: DocumentDataConfig;
  convertHeading?: string;
}

export function DocumentDataWorkspace({
  config,
  convertHeading,
}: DocumentDataWorkspaceProps) {
  const inputId = useId();
  const delimiterId = useId();
  const controller = useOperationController(config.processingLabel);
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [result, setResult] = useState<DocumentDataResult | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const supportsPaste = config.inputMode === "text" || config.inputMode === "both";
  const supportsFile = config.inputMode === "file" || config.inputMode === "both";
  const error = localError || controller.error;
  const showResult = controller.phase === "done" && result;

  function resetAll() {
    controller.reset();
    setFile(null);
    setTextInput("");
    setResult(null);
    setLocalError(null);
    setCopied(false);
  }

  function handleFiles(files: File[]) {
    const next = files[0];
    if (!next) return;
    setLocalError(null);
    controller.clearError();
    setResult(null);
    controller.reset();
    const validation = validateDocumentFile(next, config);
    if (validation) {
      setLocalError(validation);
      setFile(null);
      return;
    }
    setFile(next);
    if (supportsPaste) {
      void next.text().then((value) => setTextInput(value)).catch(() => undefined);
    }
  }

  async function runConvert() {
    if (!file && !(supportsPaste && textInput.trim())) {
      setLocalError(
        supportsPaste
          ? "Please upload a file or paste input."
          : "Please upload a file.",
      );
      return;
    }
    setLocalError(null);
    setResult(null);
    const opId = controller.start(config.processingLabel);
    try {
      const processed = await processDocumentData(file, config, {
        textInput: supportsPaste ? textInput : undefined,
        sourceName: file?.name,
        delimiter,
        onProgress: (completed, total, label) => {
          controller.setUnitProgress(opId, completed, total, label);
        },
      });
      if (!controller.succeed(opId)) return;
      setResult(processed);
    } catch (processError) {
      controller.fail(
        opId,
        processError instanceof Error
          ? processError.message
          : "We couldn't convert this file.",
      );
    }
  }

  async function copyOutput() {
    if (!result?.textPreview) return;
    try {
      await navigator.clipboard.writeText(result.textPreview);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setLocalError("Clipboard access is unavailable in this browser.");
    }
  }

  return (
    <div className="space-y-5">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      {config.notices.length && !showResult ? (
        <div className="space-y-1 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-tm-text">
          {config.notices.map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
        </div>
      ) : null}

      {!showResult ? (
        <>
          {supportsFile ? (
            <PdfUpload
              accept={config.accept}
              title="Upload Your File"
              subtitle="Drag & drop your file here, or click to browse"
              buttonLabel="Choose File"
              onFilesSelected={handleFiles}
            />
          ) : null}

          {file ? (
            <div className="rounded-2xl border border-tm-border bg-white px-4 py-3 text-sm font-semibold text-tm-muted">
              Selected: <span className="text-tm-text">{file.name}</span> ·{" "}
              {formatBytes(file.size)}
              <button
                type="button"
                className="tm-btn tm-btn-ghost ml-3"
                onClick={() => setFile(null)}
                disabled={controller.isProcessing}
              >
                Remove
              </button>
            </div>
          ) : null}

          {supportsPaste ? (
            <label htmlFor={inputId} className="block">
              <span className="mb-2 block text-sm font-bold text-tm-text">
                {file ? "Input preview / edit" : "Paste input"}
              </span>
              <textarea
                id={inputId}
                className="tm-input min-h-56 font-mono text-sm"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder={config.pastePlaceholder}
                disabled={controller.isProcessing}
                spellCheck={false}
              />
            </label>
          ) : null}

          {config.kind === "txt-to-csv" ? (
            <label htmlFor={delimiterId} className="block max-w-xs text-sm font-bold text-tm-text">
              Delimiter
              <input
                id={delimiterId}
                className="tm-input mt-2"
                value={delimiter}
                onChange={(event) => setDelimiter(event.target.value || ",")}
                disabled={controller.isProcessing}
              />
            </label>
          ) : null}

          <div className="space-y-3">
            <ConvertButton
              label={config.actionLabel}
              loadingLabel={config.processingLabel}
              loading={false}
              disabled={controller.isProcessing || (!file && !textInput.trim())}
              onClick={() => void runConvert()}
            />
            {controller.isProcessing && controller.progress ? (
              <ProcessingProgress progress={controller.progress} />
            ) : null}
          </div>
        </>
      ) : null}

      {showResult && result ? (
        <div className="space-y-5 rounded-3xl border border-tm-border bg-white p-5 md:p-6">
          <h3 className="text-xl font-extrabold text-tm-text">Result ready</h3>

          {result.stats ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(result.stats).map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-tm-border bg-tm-soft p-4">
                  <p className="text-xs font-bold tracking-wide text-tm-muted uppercase">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-tm-text">{value}</p>
                </div>
              ))}
            </div>
          ) : null}

          {result.textPreview != null ? (
            <div>
              <p className="mb-2 text-sm font-bold text-tm-muted">Output preview</p>
              <pre className="max-h-80 overflow-auto rounded-2xl border border-tm-border bg-tm-soft p-4 font-mono text-xs whitespace-pre-wrap break-words text-tm-text">
                {result.textPreview}
              </pre>
            </div>
          ) : (
            <p className="text-sm font-semibold text-tm-muted">
              Output file: {result.fileName} · {formatBytes(result.sizeBytes)}
            </p>
          )}

          {result.notice ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              {result.notice}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {result.textPreview != null ? (
              <button type="button" className="tm-btn tm-btn-secondary" onClick={() => void copyOutput()}>
                {copied ? "Copied" : config.copyLabel || "Copy"}
              </button>
            ) : null}
            <ConvertButton
              label="Download"
              onClick={() => downloadBlob(result.blob, result.fileName)}
            />
            <button type="button" className="tm-btn tm-btn-secondary" onClick={resetAll}>
              {config.resetLabel}
            </button>
          </div>
        </div>
      ) : null}

      {error ? <FileValidationMessage message={error} /> : null}
    </div>
  );
}
