"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import { ConvertButton } from "@/components/image-converter/ConvertButton";
import { ConversionProgress } from "@/components/image-converter/ConversionProgress";
import { FileValidationMessage } from "@/components/image-converter/FileValidationMessage";
import { ImageUpload } from "@/components/image-converter/ImageUpload";
import { ImageColorPickerPanel } from "@/components/image-editor/ImageColorPickerPanel";
import { ImageCropperControl } from "@/components/image-editor/ImageCropperControl";
import { downloadBlob } from "@/lib/image-converter/convert";
import { processEditorImage } from "@/lib/image-editor/process";
import type {
  EditorImageFile,
  EditorProcessResult,
  ImageEditorConfig,
  OutputMime,
} from "@/lib/image-editor/types";
import {
  formatBytes,
  loadEditorImage,
  revokeObjectUrl,
} from "@/lib/image-editor/utils";
import { validateEditorFile } from "@/lib/image-editor/validate";
import { filterUserFacingNotices, isTechnicalNotice } from "@/lib/ui/notices";

interface ImageEditorWorkspaceProps {
  config: ImageEditorConfig;
  convertHeading?: string;
}

type Stage = "upload" | "ready" | "processing" | "done";

export function ImageEditorWorkspace({
  config,
  convertHeading,
}: ImageEditorWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const opIdRef = useRef(0);
  const widthId = useId();
  const heightId = useId();
  const qualityId = useId();
  const [stage, setStage] = useState<Stage>("upload");
  const [selected, setSelected] = useState<EditorImageFile | null>(null);
  const [result, setResult] = useState<EditorProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState<number | null>(null);

  const [quality, setQuality] = useState(75);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [outputMime, setOutputMime] = useState<OutputMime>("image/jpeg");
  const [rotation, setRotation] = useState<90 | 180 | -90>(90);
  const [flipH, setFlipH] = useState(true);
  const [flipV, setFlipV] = useState(false);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [strength, setStrength] = useState(40);
  const [pixelSize, setPixelSize] = useState(12);
  const [radius, setRadius] = useState(32);
  const [borderWidth, setBorderWidth] = useState(16);
  const [borderColor, setBorderColor] = useState("#2563EB");
  const [padding, setPadding] = useState(0);
  const [dpi, setDpi] = useState(300);

  useEffect(() => {
    return () => {
      revokeObjectUrl(selected?.previewUrl);
      if (result?.previewUrl !== selected?.previewUrl) {
        revokeObjectUrl(result?.previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needsProcessButton =
    config.kind !== "color-picker" && config.kind !== "metadata-viewer";

  function resetAll() {
    opIdRef.current += 1;
    revokeObjectUrl(selected?.previewUrl);
    if (result?.previewUrl !== selected?.previewUrl)
      revokeObjectUrl(result?.previewUrl);
    setSelected(null);
    setResult(null);
    setError(null);
    setCropPixels(null);
    setProgressPercent(null);
    setStage("upload");
  }

  async function handleFileSelected(file: File) {
    if (stage === "processing") return;
    setError(null);
    const validationError = validateEditorFile(file, config);
    if (validationError) {
      setError(validationError);
      return;
    }

    opIdRef.current += 1;
    const loadId = opIdRef.current;
    revokeObjectUrl(selected?.previewUrl);
    if (result?.previewUrl !== selected?.previewUrl)
      revokeObjectUrl(result?.previewUrl);
    setResult(null);
    setProgressPercent(null);

    try {
      const loaded = await loadEditorImage(file);
      if (loadId !== opIdRef.current) return;
      setSelected(loaded);
      setWidth(String(loaded.width));
      setHeight(String(loaded.height));
      setOutputMime(
        (config.forceOutputMime as OutputMime) ||
          (loaded.type === "image/png"
            ? "image/png"
            : loaded.type === "image/webp"
              ? "image/webp"
              : "image/jpeg"),
      );
      setStage("ready");

      if (config.kind === "metadata-viewer") {
        setStage("processing");
        const meta = await processEditorImage(loaded, config);
        if (loadId !== opIdRef.current) return;
        setResult(meta);
        setStage("done");
      }
    } catch {
      if (loadId !== opIdRef.current) return;
      setError("We couldn't read this image. Please try another file.");
    }
  }

  async function handleProcess() {
    if (!selected || stage === "processing") {
      if (!selected) setError("Please choose an image file.");
      return;
    }
    const jobId = ++opIdRef.current;
    setError(null);
    setProgressPercent(null);
    setStage("processing");
    try {
      const processed = await processEditorImage(selected, config, {
        quality,
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
        maintainAspectRatio: maintainAspect,
        outputMime,
        rotation: config.kind === "rotate" ? rotation : undefined,
        flipHorizontal: config.kind === "flip" ? flipH : undefined,
        flipVertical: config.kind === "flip" ? flipV : false,
        crop: cropPixels
          ? {
              x: Math.round(cropPixels.x),
              y: Math.round(cropPixels.y),
              width: Math.round(cropPixels.width),
              height: Math.round(cropPixels.height),
            }
          : undefined,
        dpi,
        strength,
        pixelSize,
        radius,
        borderWidth,
        borderColor,
        padding,
        onProgress: (completed, total) => {
          if (jobId !== opIdRef.current) return;
          if (!Number.isFinite(total) || total <= 0) {
            setProgressPercent(null);
            return;
          }
          setProgressPercent(
            Math.max(0, Math.min(99, Math.round((completed / total) * 100))),
          );
        },
      });
      if (jobId !== opIdRef.current) {
        revokeObjectUrl(processed.previewUrl);
        return;
      }
      if (result?.previewUrl !== selected.previewUrl)
        revokeObjectUrl(result?.previewUrl);
      setProgressPercent(100);
      setResult(processed);
      setStage("done");
    } catch (processError) {
      if (jobId !== opIdRef.current) return;
      setProgressPercent(null);
      setStage("ready");
      setError(
        processError instanceof Error
          ? processError.message
          : "We couldn't process this image. Please try another file.",
      );
    }
  }

  const aspectPresets = useMemo(
    () => [
      { label: "Free", value: undefined },
      { label: "1:1", value: 1 },
      { label: "4:3", value: 4 / 3 },
      { label: "16:9", value: 16 / 9 },
      { label: "3:2", value: 3 / 2 },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      {filterUserFacingNotices(config.notices).length && stage !== "done" ? (
        <div className="space-y-1 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-tm-text">
          {filterUserFacingNotices(config.notices).map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
        </div>
      ) : null}

      {stage === "upload" ? (
        <ImageUpload
          accept={config.accept}
          inputLabel="image"
          onFileSelected={(file) => void handleFileSelected(file)}
        />
      ) : null}

      {(stage === "ready" || stage === "processing") && selected ? (
        <>
          <div className="rounded-3xl border border-tm-border bg-tm-white p-5">
            <div className="grid gap-5 md:grid-cols-[240px_1fr]">
              <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-tm-border bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-size-[16px_16px] bg-position-[0_0,0_8px,8px_-8px,-8px_0] bg-tm-soft p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.previewUrl}
                  alt={`Preview of ${selected.name}`}
                  className="max-h-56 max-w-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-tm-text">
                  Selected image
                </h3>
                <dl className="mt-3 space-y-1 text-sm font-semibold text-tm-muted">
                  <div>
                    File name:{" "}
                    <span className="text-tm-text">{selected.name}</span>
                  </div>
                  <div>
                    Format:{" "}
                    <span className="text-tm-text">
                      {selected.type || "Unknown"}
                    </span>
                  </div>
                  <div>
                    Size:{" "}
                    <span className="text-tm-text">
                      {formatBytes(selected.sizeBytes)}
                    </span>
                  </div>
                  <div>
                    Dimensions:{" "}
                    <span className="text-tm-text">
                      {selected.width} × {selected.height}px
                    </span>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="tm-btn tm-btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change image
                  </button>
                  <button
                    type="button"
                    className="tm-btn tm-btn-ghost"
                    onClick={resetAll}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={config.accept}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFileSelected(file);
              event.target.value = "";
            }}
          />

          {config.kind === "color-picker" ? (
            <ImageColorPickerPanel imageUrl={selected.previewUrl} />
          ) : null}

          {(config.kind === "crop" || config.kind === "circular") && (
            <div className="space-y-3">
              {config.kind === "crop" ? (
                <div className="flex flex-wrap gap-2">
                  {aspectPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                        aspect === preset.value
                          ? "bg-tm-accent text-white"
                          : "bg-tm-soft text-tm-text"
                      }`}
                      onClick={() => setAspect(preset.value)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              ) : null}
              <ImageCropperControl
                imageUrl={selected.previewUrl}
                aspect={config.kind === "circular" ? 1 : aspect}
                circular={config.kind === "circular"}
                onCropComplete={setCropPixels}
              />
            </div>
          )}

          {(config.kind === "compress" || config.kind === "quality") && (
            <label
              htmlFor={qualityId}
              className="block rounded-2xl border border-tm-border bg-tm-soft p-4"
            >
              <span className="text-sm font-bold text-tm-text">
                Quality: {quality}
              </span>
              <input
                id={qualityId}
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>
          )}

          {config.kind === "resize" && (
            <div className="space-y-3 rounded-2xl border border-tm-border bg-tm-soft p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor={widthId}
                    className="mb-2 block text-sm font-bold text-tm-text"
                  >
                    Width (px)
                  </label>
                  <input
                    id={widthId}
                    className="tm-input"
                    value={width}
                    inputMode="numeric"
                    onChange={(event) => {
                      const next = event.target.value.replace(/[^\d]/g, "");
                      setWidth(next);
                      if (maintainAspect && selected.width && next) {
                        setHeight(
                          String(
                            Math.max(
                              1,
                              Math.round(
                                (Number(next) / selected.width) *
                                  selected.height,
                              ),
                            ),
                          ),
                        );
                      }
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor={heightId}
                    className="mb-2 block text-sm font-bold text-tm-text"
                  >
                    Height (px)
                  </label>
                  <input
                    id={heightId}
                    className="tm-input"
                    value={height}
                    inputMode="numeric"
                    onChange={(event) => {
                      const next = event.target.value.replace(/[^\d]/g, "");
                      setHeight(next);
                      if (maintainAspect && selected.height && next) {
                        setWidth(
                          String(
                            Math.max(
                              1,
                              Math.round(
                                (Number(next) / selected.height) *
                                  selected.width,
                              ),
                            ),
                          ),
                        );
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm font-bold text-tm-text">
                    <input
                      type="checkbox"
                      checked={maintainAspect}
                      onChange={(event) =>
                        setMaintainAspect(event.target.checked)
                      }
                    />
                    Maintain aspect ratio
                  </label>
                </div>
              </div>
              {!config.forceOutputMime ? (
                <label className="block max-w-xs text-sm font-bold text-tm-text">
                  Output format
                  <select
                    className="tm-input mt-2"
                    value={outputMime}
                    onChange={(event) =>
                      setOutputMime(event.target.value as OutputMime)
                    }
                  >
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </label>
              ) : null}
            </div>
          )}

          {config.kind === "rotate" && (
            <div className="flex flex-wrap gap-2">
              {(
                [
                  [90, "90° clockwise"],
                  [-90, "90° counterclockwise"],
                  [180, "180°"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    rotation === value
                      ? "bg-tm-accent text-white"
                      : "bg-tm-soft text-tm-text"
                  }`}
                  onClick={() => setRotation(value as 90 | 180 | -90)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {config.kind === "flip" && (
            <div className="flex flex-wrap gap-4 text-sm font-bold text-tm-text">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={flipH}
                  onChange={(e) => setFlipH(e.target.checked)}
                />
                Flip Horizontal
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={flipV}
                  onChange={(e) => setFlipV(e.target.checked)}
                />
                Flip Vertical
              </label>
            </div>
          )}

          {(config.kind === "sharpen" || config.kind === "blur") && (
            <label className="block rounded-2xl border border-tm-border bg-tm-soft p-4 text-sm font-bold text-tm-text">
              {config.kind === "sharpen" ? "Sharpness" : "Blur Amount"}:{" "}
              {strength}
              <input
                type="range"
                min={5}
                max={100}
                value={strength}
                onChange={(event) => setStrength(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>
          )}

          {config.kind === "pixelate" && (
            <label className="block rounded-2xl border border-tm-border bg-tm-soft p-4 text-sm font-bold text-tm-text">
              Pixel Size: {pixelSize}
              <input
                type="range"
                min={2}
                max={60}
                value={pixelSize}
                onChange={(event) => setPixelSize(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>
          )}

          {config.kind === "rounded" && (
            <label className="block rounded-2xl border border-tm-border bg-tm-soft p-4 text-sm font-bold text-tm-text">
              Corner radius: {radius}px
              <input
                type="range"
                min={0}
                max={200}
                value={radius}
                onChange={(event) => setRadius(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>
          )}

          {config.kind === "border" && (
            <div className="grid gap-3 rounded-2xl border border-tm-border bg-tm-soft p-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm font-bold text-tm-text">
                Border width
                <input
                  type="number"
                  min={1}
                  max={200}
                  className="tm-input mt-2"
                  value={borderWidth}
                  onChange={(event) =>
                    setBorderWidth(Number(event.target.value))
                  }
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Border color
                <input
                  type="color"
                  className="tm-input mt-2 h-11 p-1"
                  value={borderColor}
                  onChange={(event) => setBorderColor(event.target.value)}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Padding
                <input
                  type="number"
                  min={0}
                  max={200}
                  className="tm-input mt-2"
                  value={padding}
                  onChange={(event) => setPadding(Number(event.target.value))}
                />
              </label>
              <label className="text-sm font-bold text-tm-text">
                Corner radius
                <input
                  type="number"
                  min={0}
                  max={200}
                  className="tm-input mt-2"
                  value={radius}
                  onChange={(event) => setRadius(Number(event.target.value))}
                />
              </label>
            </div>
          )}

          {config.kind === "dpi-changer" && (
            <label className="block max-w-xs text-sm font-bold text-tm-text">
              DPI / PPI
              <input
                type="number"
                min={1}
                max={1200}
                className="tm-input mt-2"
                value={dpi}
                onChange={(event) => setDpi(Number(event.target.value))}
              />
            </label>
          )}

          {needsProcessButton ? (
            <div className="space-y-3">
              <ConvertButton
                label={config.actionLabel}
                loading={false}
                disabled={
                  !selected ||
                  stage === "processing" ||
                  (config.kind === "flip" && !flipH && !flipV)
                }
                onClick={() => void handleProcess()}
              />
              {stage === "processing" ? (
                <ConversionProgress
                  label={config.processingLabel}
                  percent={progressPercent}
                />
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      {stage === "done" && selected && result ? (
        <div className="space-y-5 rounded-3xl border border-tm-border bg-tm-white p-5 md:p-6">
          <h3 className="text-xl font-extrabold text-tm-text">
            {config.kind === "metadata-viewer"
              ? "Image metadata"
              : "Result ready"}
          </h3>

          {result.stats ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(result.stats).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-tm-border bg-tm-soft p-4"
                >
                  <p className="text-xs font-bold tracking-wide text-tm-muted uppercase">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-tm-text">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {config.kind === "metadata-viewer" ? (
            result.metadataRows && result.metadataRows.length > 5 ? (
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
                      <tr
                        key={`${row.label}-${row.value}`}
                        className="border-t border-tm-border"
                      >
                        <td className="px-4 py-2 font-semibold text-tm-text">
                          {row.label}
                        </td>
                        <td className="px-4 py-2 font-medium break-all text-tm-muted">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="rounded-2xl border border-tm-border bg-tm-soft px-4 py-6 text-sm font-semibold text-tm-muted">
                  No metadata was found in this image.
                </p>
                {result.metadataRows?.length ? (
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
                          <tr
                            key={`${row.label}-${row.value}`}
                            className="border-t border-tm-border"
                          >
                            <td className="px-4 py-2 font-semibold text-tm-text">
                              {row.label}
                            </td>
                            <td className="px-4 py-2 font-medium break-all text-tm-muted">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            )
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-bold text-tm-muted">Original</p>
                <div className="flex min-h-56 items-center justify-center rounded-2xl border border-tm-border bg-tm-soft p-3 md:min-h-72">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.previewUrl}
                    alt="Original upload"
                    className="max-h-72 max-w-full object-contain md:max-h-80"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-tm-muted">Result</p>
                <div className="flex min-h-56 items-center justify-center rounded-2xl border border-tm-border bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:16px_16px] bg-tm-white p-3 md:min-h-72">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.previewUrl}
                    alt="Processed result"
                    className="max-h-72 max-w-full object-contain md:max-h-80"
                  />
                </div>
              </div>
            </div>
          )}

          {result.notice && !isTechnicalNotice(result.notice) ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              {result.notice}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {config.kind !== "metadata-viewer" ? (
              <ConvertButton
                label={
                  config.kind === "background-remover"
                    ? "Download PNG"
                    : "Download"
                }
                onClick={() => downloadBlob(result.blob, result.fileName)}
              />
            ) : null}
            <button
              type="button"
              className="tm-btn tm-btn-secondary"
              onClick={resetAll}
            >
              {config.resetLabel}
            </button>
          </div>
        </div>
      ) : null}

      {error ? <FileValidationMessage message={error} /> : null}
    </div>
  );
}
