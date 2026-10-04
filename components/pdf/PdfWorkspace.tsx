"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ConvertButton } from "@/components/image-converter/ConvertButton";
import { FileValidationMessage } from "@/components/image-converter/FileValidationMessage";
import { PdfUpload } from "@/components/pdf/PdfUpload";
import { ProcessingProgress } from "@/components/ui/ProcessingProgress";
import { useOperationController } from "@/lib/processing/useOperationController";
import { processPdfTool } from "@/lib/pdf/process";
import { getPdfPageCount } from "@/lib/pdf/pdfjs";
import type {
  PdfProcessResult,
  PdfSourceFile,
  PdfToolConfig,
} from "@/lib/pdf/types";
import {
  createFileId,
  downloadBlob,
  formatBytes,
  revokeObjectUrl,
} from "@/lib/pdf/utils";
import { validatePdfUpload } from "@/lib/pdf/validate";
import { filterUserFacingNotices } from "@/lib/ui/notices";

interface PdfWorkspaceProps {
  config: PdfToolConfig;
  convertHeading?: string;
}

export function PdfWorkspace({ config, convertHeading }: PdfWorkspaceProps) {
  const pageSelectId = useId();
  const passwordId = useId();
  const passwordConfirmId = useId();
  const unlockId = useId();
  const watermarkId = useId();

  const controller = useOperationController(config.processingLabel);
  const [sources, setSources] = useState<PdfSourceFile[]>([]);
  const [result, setResult] = useState<PdfProcessResult | null>(null);
  const [pageSelection, setPageSelection] = useState("all");
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [removedPages, setRemovedPages] = useState<number[]>([]);
  const [rotateAll, setRotateAll] = useState<0 | 90 | 180 | 270>(90);
  const [cropLeft, setCropLeft] = useState(5);
  const [cropRight, setCropRight] = useState(5);
  const [cropTop, setCropTop] = useState(5);
  const [cropBottom, setCropBottom] = useState(5);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [unlockPassword, setUnlockPassword] = useState("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(30);
  const [watermarkRotation, setWatermarkRotation] = useState(-45);
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);
  const [watermarkColor, setWatermarkColor] = useState("#2563EB");
  const [watermarkPosition, setWatermarkPosition] = useState<
    "center" | "top" | "bottom" | "diagonal"
  >("diagonal");
  const [pageNumberPosition, setPageNumberPosition] = useState<
    "bottom-center" | "bottom-left" | "bottom-right" | "top-center"
  >("bottom-center");
  const [pageNumberStart, setPageNumberStart] = useState(1);
  const [pageNumberFontSize, setPageNumberFontSize] = useState(12);
  const [pageNumberFormat, setPageNumberFormat] = useState<"number" | "page-n">("number");
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const autoProcess =
    config.kind === "metadata-viewer" ||
    config.kind === "text-extract" ||
    config.kind === "pdf-to-text";
  const needsProcessButton = !autoProcess;

  const uploadTitle = config.kind === "images-to-pdf" ? "Upload Your Images" : "Upload Your PDF";
  const uploadSubtitle =
    config.kind === "images-to-pdf"
      ? "Drag & drop images here, or click to browse"
      : config.allowMultiple
        ? "Drag & drop PDF files here, or click to browse"
        : "Drag & drop your PDF here, or click to browse";
  const uploadButton =
    config.kind === "images-to-pdf"
      ? "Choose Images"
      : config.allowMultiple
        ? "Choose PDFs"
        : "Choose PDF";

  useEffect(() => {
    return () => {
      sources.forEach((s) => revokeObjectUrl(s.previewUrl));
      revokeObjectUrl(result?.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearResult() {
    revokeObjectUrl(result?.previewUrl);
    setResult(null);
  }

  function resetAll() {
    controller.reset();
    sources.forEach((s) => revokeObjectUrl(s.previewUrl));
    clearResult();
    setSources([]);
    setPageSelection("all");
    setPageOrder([]);
    setRemovedPages([]);
    setPassword("");
    setPasswordConfirm("");
    setUnlockPassword("");
    setCopied(false);
    setLocalError(null);
  }

  async function addFiles(files: File[]) {
    setLocalError(null);
    controller.clearError();
    clearResult();
    controller.reset();

    const next: PdfSourceFile[] = config.allowMultiple ? [...sources] : [];
    for (const file of files) {
      if (next.length >= config.maxFiles) {
        setLocalError(`You can upload up to ${config.maxFiles} files.`);
        break;
      }
      const validationError = validatePdfUpload(file, config);
      if (validationError) {
        setLocalError(validationError);
        continue;
      }
      const item: PdfSourceFile = {
        id: createFileId(),
        file,
        name: file.name,
        sizeBytes: file.size,
        type: file.type,
        previewUrl:
          config.kind === "images-to-pdf" ? URL.createObjectURL(file) : undefined,
      };
      if (
        config.kind !== "images-to-pdf" &&
        config.kind !== "merge" &&
        file.type === "application/pdf"
      ) {
        try {
          item.pageCount = await getPdfPageCount(file);
        } catch {
          // Page count is optional until process time.
        }
      }
      next.push(item);
    }

    setSources(next);
    if (next[0]?.pageCount) {
      setPageOrder(Array.from({ length: next[0].pageCount }, (_, i) => i + 1));
      setRemovedPages([]);
    }

    if (next.length === 1 && autoProcess) {
      void runProcess(next);
    }
  }

  function removeSource(id: string) {
    setSources((prev) => {
      const target = prev.find((s) => s.id === id);
      revokeObjectUrl(target?.previewUrl);
      return prev.filter((s) => s.id !== id);
    });
    clearResult();
  }

  function moveSource(id: string, direction: -1 | 1) {
    setSources((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  function movePage(page: number, direction: -1 | 1) {
    setPageOrder((prev) => {
      const index = prev.indexOf(page);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  async function runProcess(overrideSources?: PdfSourceFile[]) {
    const activeSources = overrideSources ?? sources;
    if (!activeSources.length) {
      setLocalError(
        config.kind === "images-to-pdf"
          ? "Please choose at least one image."
          : "Please choose a PDF file.",
      );
      return;
    }

    setLocalError(null);
    clearResult();
    const opId = controller.start(config.processingLabel);

    try {
      const processed = await processPdfTool(activeSources, config, {
        pageSelection,
        pageOrder,
        removedPages,
        rotateAll,
        crop: { left: cropLeft, right: cropRight, top: cropTop, bottom: cropBottom },
        password,
        passwordConfirm,
        unlockPassword,
        watermarkText,
        watermarkOpacity,
        watermarkRotation,
        watermarkFontSize,
        watermarkColor,
        watermarkPosition,
        pageNumberPosition,
        pageNumberStart,
        pageNumberFontSize,
        pageNumberFormat,
        onProgress: (completed, total, label) => {
          controller.setUnitProgress(opId, completed, total, label);
        },
      });

      if (!controller.succeed(opId)) {
        revokeObjectUrl(processed.previewUrl);
        return;
      }
      setResult(processed);
      setPassword("");
      setPasswordConfirm("");
      setUnlockPassword("");
    } catch (error) {
      controller.fail(
        opId,
        error instanceof Error ? error.message : "We couldn't process this file.",
      );
    }
  }

  const error = localError || controller.error;
  const showWorkspace = sources.length > 0 && controller.phase !== "done";
  const showResult = controller.phase === "done" && result;

  const pageCount = sources[0]?.pageCount;
  const visiblePages = useMemo(
    () => pageOrder.filter((p) => !removedPages.includes(p)),
    [pageOrder, removedPages],
  );

  return (
    <div className="space-y-5">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      {filterUserFacingNotices(config.notices).length && !showResult ? (
        <div className="space-y-1 tm-notice tm-notice-info">
          {filterUserFacingNotices(config.notices).map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
        </div>
      ) : null}

      {!sources.length ? (
        <PdfUpload
          accept={config.accept}
          multiple={config.allowMultiple}
          title={uploadTitle}
          subtitle={uploadSubtitle}
          buttonLabel={uploadButton}
          onFilesSelected={(files) => void addFiles(files)}
        />
      ) : null}

      {showWorkspace ? (
        <>
          <div className="rounded-3xl border border-tm-border bg-tm-white p-5">
            <h3 className="text-lg font-extrabold text-tm-text">
              {config.allowMultiple ? "Selected files" : "Selected file"}
            </h3>
            <ul className="mt-4 space-y-3">
              {sources.map((source, index) => (
                <li
                  key={source.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-tm-border bg-tm-soft px-4 py-3"
                >
                  {source.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={source.previewUrl}
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-tm-text">
                      {index + 1}. {source.name}
                    </p>
                    <p className="text-xs font-semibold text-tm-muted">
                      {formatBytes(source.sizeBytes)}
                      {source.pageCount ? ` · ${source.pageCount} pages` : ""}
                    </p>
                  </div>
                  {config.allowMultiple ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="tm-btn tm-btn-ghost"
                        onClick={() => moveSource(source.id, -1)}
                        disabled={index === 0 || controller.isProcessing}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="tm-btn tm-btn-ghost"
                        onClick={() => moveSource(source.id, 1)}
                        disabled={index === sources.length - 1 || controller.isProcessing}
                      >
                        Down
                      </button>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="tm-btn tm-btn-secondary"
                    onClick={() => removeSource(source.id)}
                    disabled={controller.isProcessing}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {config.allowMultiple && sources.length < config.maxFiles ? (
              <div className="mt-4">
                <PdfUpload
                  accept={config.accept}
                  multiple
                  title="Add More Files"
                  subtitle="Add additional files to the list"
                  buttonLabel="Add Files"
                  onFilesSelected={(files) => void addFiles(files)}
                />
              </div>
            ) : null}
          </div>

          {(config.kind === "pdf-to-image" ||
            config.kind === "split" ||
            config.kind === "extract-pages" ||
            config.kind === "crop") && (
            <label htmlFor={pageSelectId} className="block text-sm font-bold text-tm-text">
              {config.kind === "split"
                ? "Pages / ranges to split"
                : config.kind === "extract-pages"
                  ? "Pages to extract"
                  : "Pages"}
              <input
                id={pageSelectId}
                className="tm-input mt-2"
                value={pageSelection}
                onChange={(event) => setPageSelection(event.target.value)}
                placeholder={
                  config.kind === "split" || config.kind === "extract-pages"
                    ? "1-3, 5, 8-10"
                    : "all or 1-3,5"
                }
                disabled={controller.isProcessing}
              />
              {pageCount ? (
                <span className="mt-1 block text-xs font-semibold text-tm-muted">
                  This PDF has {pageCount} pages.
                </span>
              ) : null}
            </label>
          )}

          {config.kind === "reorder" && (
            <div className="rounded-2xl border border-tm-border bg-tm-soft p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-tm-text">Page order</h3>
                <button
                  type="button"
                  className="tm-btn tm-btn-ghost"
                  disabled={controller.isProcessing || !pageCount}
                  onClick={() => {
                    if (!pageCount) return;
                    setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1));
                    setRemovedPages([]);
                  }}
                >
                  Reset order
                </button>
              </div>
              <ul className="space-y-2">
                {visiblePages.map((page, index) => (
                  <li
                    key={page}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-tm-border bg-tm-white px-3 py-2"
                  >
                    <span className="text-sm font-bold text-tm-text">
                      {index + 1}. Page {page}
                    </span>
                    <div className="ml-auto flex gap-2">
                      <button
                        type="button"
                        className="tm-btn tm-btn-ghost"
                        disabled={controller.isProcessing || index === 0}
                        onClick={() => movePage(page, -1)}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="tm-btn tm-btn-ghost"
                        disabled={
                          controller.isProcessing || index === visiblePages.length - 1
                        }
                        onClick={() => movePage(page, 1)}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className="tm-btn tm-btn-secondary"
                        disabled={controller.isProcessing}
                        onClick={() => setRemovedPages((prev) => [...prev, page])}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {config.kind === "rotate" && (
            <div className="flex flex-wrap gap-2">
              {([90, 180, 270] as const).map((angle) => (
                <button
                  key={angle}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    rotateAll === angle ? "bg-tm-accent text-white" : "bg-tm-soft text-tm-text"
                  }`}
                  onClick={() => setRotateAll(angle)}
                  disabled={controller.isProcessing}
                >
                  Rotate {angle}°
                </button>
              ))}
            </div>
          )}

          {config.kind === "crop" && (
            <div className="grid gap-3 rounded-2xl border border-tm-border bg-tm-soft p-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["Left %", cropLeft, setCropLeft],
                  ["Right %", cropRight, setCropRight],
                  ["Top %", cropTop, setCropTop],
                  ["Bottom %", cropBottom, setCropBottom],
                ] as const
              ).map(([label, value, setter]) => (
                <label key={label} className="text-sm font-bold text-tm-text">
                  {label}
                  <input
                    type="number"
                    min={0}
                    max={40}
                    className="tm-input mt-2"
                    value={value}
                    onChange={(event) => setter(Number(event.target.value))}
                    disabled={controller.isProcessing}
                  />
                </label>
              ))}
            </div>
          )}

          {config.kind === "password-protect" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label htmlFor={passwordId} className="text-sm font-bold text-tm-text">
                Password
                <input
                  id={passwordId}
                  type="password"
                  className="tm-input mt-2"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  disabled={controller.isProcessing}
                />
              </label>
              <label htmlFor={passwordConfirmId} className="text-sm font-bold text-tm-text">
                Confirm password
                <input
                  id={passwordConfirmId}
                  type="password"
                  className="tm-input mt-2"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  autoComplete="new-password"
                  disabled={controller.isProcessing}
                />
              </label>
            </div>
          )}

          {config.kind === "unlock" && (
            <label htmlFor={unlockId} className="block max-w-md text-sm font-bold text-tm-text">
              PDF password
              <input
                id={unlockId}
                type="password"
                className="tm-input mt-2"
                value={unlockPassword}
                onChange={(event) => setUnlockPassword(event.target.value)}
                autoComplete="current-password"
                disabled={controller.isProcessing}
              />
            </label>
          )}

          {config.kind === "page-numbering" && (
            <div className="grid gap-3 rounded-2xl border border-tm-border bg-tm-soft p-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm font-bold text-tm-text">
                Position
                <select
                  className="tm-input mt-2"
                  value={pageNumberPosition}
                  onChange={(event) =>
                    setPageNumberPosition(
                      event.target.value as typeof pageNumberPosition,
                    )
                  }
                  disabled={controller.isProcessing}
                >
                  <option value="bottom-center">Bottom center</option>
                  <option value="bottom-left">Bottom left</option>
                  <option value="bottom-right">Bottom right</option>
                  <option value="top-center">Top center</option>
                </select>
              </label>
              <label className="text-sm font-bold text-tm-text">
                Start number
                <input
                  type="number"
                  min={1}
                  className="tm-input mt-2"
                  value={pageNumberStart}
                  onChange={(event) => setPageNumberStart(Number(event.target.value))}
                  disabled={controller.isProcessing}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Font size
                <input
                  type="number"
                  min={8}
                  max={36}
                  className="tm-input mt-2"
                  value={pageNumberFontSize}
                  onChange={(event) => setPageNumberFontSize(Number(event.target.value))}
                  disabled={controller.isProcessing}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Format
                <select
                  className="tm-input mt-2"
                  value={pageNumberFormat}
                  onChange={(event) =>
                    setPageNumberFormat(event.target.value as "number" | "page-n")
                  }
                  disabled={controller.isProcessing}
                >
                  <option value="number">1, 2, 3</option>
                  <option value="page-n">Page 1, Page 2</option>
                </select>
              </label>
            </div>
          )}

          {config.kind === "watermark" && (
            <div className="grid gap-3 rounded-2xl border border-tm-border bg-tm-soft p-4 sm:grid-cols-2 lg:grid-cols-3">
              <label htmlFor={watermarkId} className="text-sm font-bold text-tm-text sm:col-span-2 lg:col-span-3">
                Watermark text
                <input
                  id={watermarkId}
                  className="tm-input mt-2"
                  value={watermarkText}
                  onChange={(event) => setWatermarkText(event.target.value)}
                  disabled={controller.isProcessing}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Opacity
                <input
                  type="range"
                  min={5}
                  max={80}
                  value={watermarkOpacity}
                  onChange={(event) => setWatermarkOpacity(Number(event.target.value))}
                  className="mt-3 w-full"
                  disabled={controller.isProcessing}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Rotation
                <input
                  type="number"
                  className="tm-input mt-2"
                  value={watermarkRotation}
                  onChange={(event) => setWatermarkRotation(Number(event.target.value))}
                  disabled={controller.isProcessing}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Font size
                <input
                  type="number"
                  min={10}
                  max={96}
                  className="tm-input mt-2"
                  value={watermarkFontSize}
                  onChange={(event) => setWatermarkFontSize(Number(event.target.value))}
                  disabled={controller.isProcessing}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Color
                <input
                  type="color"
                  className="tm-input mt-2 h-11 p-1"
                  value={watermarkColor}
                  onChange={(event) => setWatermarkColor(event.target.value)}
                  disabled={controller.isProcessing}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Position
                <select
                  className="tm-input mt-2"
                  value={watermarkPosition}
                  onChange={(event) =>
                    setWatermarkPosition(event.target.value as typeof watermarkPosition)
                  }
                  disabled={controller.isProcessing}
                >
                  <option value="diagonal">Diagonal</option>
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </label>
            </div>
          )}

          {needsProcessButton ? (
            <div className="space-y-3">
              <ConvertButton
                label={config.actionLabel}
                loadingLabel={config.processingLabel}
                loading={false}
                disabled={
                  !sources.length ||
                  controller.isProcessing ||
                  (config.kind === "merge" && sources.length < 2)
                }
                onClick={() => void runProcess()}
              />
              {config.kind === "merge" && sources.length === 1 ? (
                <p className="text-sm font-semibold text-tm-muted">
                  Add at least one more PDF to merge.
                </p>
              ) : null}
              {controller.isProcessing && controller.progress ? (
                <ProcessingProgress progress={controller.progress} />
              ) : null}
            </div>
          ) : null}

          {autoProcess && controller.isProcessing && controller.progress ? (
            <ProcessingProgress progress={controller.progress} />
          ) : null}
        </>
      ) : null}

      {showResult ? (
        <div className="space-y-5 rounded-3xl border border-tm-border bg-tm-white p-5 md:p-6">
          <h3 className="text-xl font-extrabold text-tm-text">
            {config.kind === "metadata-viewer"
              ? "PDF metadata"
              : config.kind === "text-extract" || config.kind === "pdf-to-text"
                ? "Extracted text"
                : "Result ready"}
          </h3>

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

          {config.kind === "metadata-viewer" ? (
            result.metadataRows && result.metadataRows.length > 3 ? (
              <div className="overflow-x-auto rounded-2xl border border-tm-border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-tm-soft">
                    <tr>
                      <th className="px-4 py-3 font-bold">Field</th>
                      <th className="px-4 py-3 font-bold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.metadataRows.map((row) => (
                      <tr key={`${row.label}-${row.value}`} className="border-t border-tm-border">
                        <td className="px-4 py-2 font-semibold text-tm-text">{row.label}</td>
                        <td className="px-4 py-2 font-medium break-all text-tm-muted">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-2xl border border-tm-border bg-tm-soft px-4 py-6 text-sm font-semibold text-tm-muted">
                No metadata available.
              </p>
            )
          ) : null}

          {(config.kind === "text-extract" || config.kind === "pdf-to-text") && (
            <textarea
              className="tm-input min-h-56 font-mono text-sm"
              readOnly
              value={result.textContent || ""}
              aria-label="Extracted text"
            />
          )}

          {result.notice ? (
            <p className="tm-notice tm-notice-warning">
              {result.notice}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {config.kind !== "metadata-viewer" ? (
              <ConvertButton
                label={
                  config.kind === "merge"
                    ? "Download Merged PDF"
                    : config.kind === "pdf-to-text" || config.kind === "text-extract"
                      ? "Download TXT"
                      : "Download"
                }
                onClick={() => downloadBlob(result.blob, result.fileName)}
              />
            ) : null}
            {(config.kind === "text-extract" || config.kind === "pdf-to-text") &&
            result.textContent ? (
              <button
                type="button"
                className="tm-btn tm-btn-secondary"
                onClick={async () => {
                  await navigator.clipboard.writeText(result.textContent || "");
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? "Copied" : "Copy Text"}
              </button>
            ) : null}
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
