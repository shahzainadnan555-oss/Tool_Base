"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ConvertButton } from "@/components/image-converter/ConvertButton";
import { FileValidationMessage } from "@/components/image-converter/FileValidationMessage";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoUpload } from "@/components/video/VideoUpload";
import { ProcessingProgress } from "@/components/ui/ProcessingProgress";
import { processVideoTool } from "@/lib/video/process";
import type {
  VideoProcessResult,
  VideoSourceFile,
  VideoToolConfig,
} from "@/lib/video/types";
import {
  createVideoId,
  downloadBlob,
  formatBytes,
  formatDuration,
  probeVideoMeta,
  revokeObjectUrl,
} from "@/lib/video/utils";
import { validateVideoFile } from "@/lib/video/validate";
import { useOperationController } from "@/lib/processing/useOperationController";
import { filterUserFacingNotices } from "@/lib/ui/notices";

interface VideoWorkspaceProps {
  config: VideoToolConfig;
  convertHeading?: string;
}

const RESIZE_PRESETS = [
  { label: "1920×1080", width: 1920, height: 1080 },
  { label: "1280×720", width: 1280, height: 720 },
  { label: "854×480", width: 854, height: 480 },
  { label: "640×360", width: 640, height: 360 },
];

export function VideoWorkspace({ config, convertHeading }: VideoWorkspaceProps) {
  const controller = useOperationController(config.processingLabel);
  const qualityId = useId();
  const startId = useId();
  const endId = useId();
  const widthId = useId();
  const heightId = useId();
  const timeId = useId();
  const gifWidthId = useId();
  const gifFpsId = useId();
  const cropXId = useId();
  const cropYId = useId();
  const cropWId = useId();
  const cropHId = useId();

  const [sources, setSources] = useState<VideoSourceFile[]>([]);
  const [result, setResult] = useState<VideoProcessResult | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [quality, setQuality] = useState(5);
  const [startSeconds, setStartSeconds] = useState(0);
  const [endSeconds, setEndSeconds] = useState(5);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [speed, setSpeed] = useState(1.25);
  const [timestampSeconds, setTimestampSeconds] = useState(0);
  const [gifWidth, setGifWidth] = useState(480);
  const [gifFps, setGifFps] = useState(10);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(640);
  const [cropH, setCropH] = useState(360);
  const [cropRatio, setCropRatio] = useState<"free" | "1:1" | "4:3" | "16:9" | "9:16">(
    "free",
  );

  const autoProcess = config.kind === "metadata";
  const needsProcessButton = !autoProcess;
  const error = localError || controller.error;
  const showResult = controller.phase === "done" && result;
  const selectedDuration = Math.max(0, endSeconds - startSeconds);

  const primary = sources[0];
  const fileInfo = useMemo(() => {
    if (!primary) return null;
    return {
      format: primary.type || primary.name.split(".").pop()?.toUpperCase() || "Unknown",
      size: formatBytes(primary.sizeBytes),
      duration: formatDuration(primary.durationSeconds),
      resolution:
        primary.width && primary.height
          ? `${primary.width}×${primary.height}`
          : "Unknown",
    };
  }, [primary]);

  useEffect(() => {
    return () => {
      sources.forEach((s) => revokeObjectUrl(s.objectUrl));
      revokeObjectUrl(result?.previewUrl);
      revokeObjectUrl(result?.imagePreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearResult() {
    revokeObjectUrl(result?.previewUrl);
    revokeObjectUrl(result?.imagePreviewUrl);
    setResult(null);
  }

  function resetAll() {
    controller.reset();
    sources.forEach((s) => revokeObjectUrl(s.objectUrl));
    clearResult();
    setSources([]);
    setLocalError(null);
  }

  async function addFiles(files: File[]) {
    setLocalError(null);
    controller.clearError();
    clearResult();
    controller.reset();

    const next: VideoSourceFile[] = config.allowMultiple ? [...sources] : [];
    for (const file of files) {
      if (next.length >= config.maxFiles) {
        setLocalError(`You can upload up to ${config.maxFiles} files.`);
        break;
      }
      const validation = validateVideoFile(file, config);
      if (validation) {
        setLocalError(validation);
        continue;
      }
      const objectUrl = URL.createObjectURL(file);
      const meta = await probeVideoMeta(file);
      next.push({
        id: createVideoId(),
        file,
        name: file.name,
        sizeBytes: file.size,
        type: file.type,
        objectUrl,
        durationSeconds: meta.durationSeconds,
        width: meta.width,
        height: meta.height,
      });
    }

    setSources(next);
    const first = next[0];
    if (first) {
      if (first.durationSeconds != null) {
        setStartSeconds(0);
        setEndSeconds(Math.max(0.1, Number(first.durationSeconds.toFixed(2))));
        setTimestampSeconds(0);
      }
      if (first.width && first.height) {
        setAspectRatio(first.width / first.height);
        setWidth(first.width);
        setHeight(first.height);
        setCropW(Math.min(first.width, 640));
        setCropH(Math.min(first.height, 360));
      }
      // Warm the shared media engine after the user chooses a file (not on homepage).
      if (!config.lightMode) {
        void import("@/lib/audio/ffmpeg").then(({ getFfmpeg }) =>
          getFfmpeg().catch(() => undefined),
        );
      }
    }

    if (next.length === 1 && autoProcess) {
      void runProcess(next);
    }
  }

  function removeSource(id: string) {
    setSources((prev) => {
      const target = prev.find((item) => item.id === id);
      revokeObjectUrl(target?.objectUrl);
      return prev.filter((item) => item.id !== id);
    });
    clearResult();
  }

  function moveSource(id: string, direction: -1 | 1) {
    setSources((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  function updateWidth(nextWidth: number) {
    setWidth(nextWidth);
    if (maintainAspect && aspectRatio > 0) {
      setHeight(Math.max(16, Math.round(nextWidth / aspectRatio)));
    }
  }

  function updateHeight(nextHeight: number) {
    setHeight(nextHeight);
    if (maintainAspect && aspectRatio > 0) {
      setWidth(Math.max(16, Math.round(nextHeight * aspectRatio)));
    }
  }

  function applyCropRatio(ratio: typeof cropRatio) {
    setCropRatio(ratio);
    if (!primary?.width || !primary.height || ratio === "free") return;
    const [rw, rh] =
      ratio === "1:1"
        ? [1, 1]
        : ratio === "4:3"
          ? [4, 3]
          : ratio === "16:9"
            ? [16, 9]
            : [9, 16];
    const maxW = primary.width;
    const maxH = primary.height;
    let w = maxW;
    let h = Math.round((w * rh) / rw);
    if (h > maxH) {
      h = maxH;
      w = Math.round((h * rw) / rh);
    }
    setCropW(w);
    setCropH(h);
    setCropX(Math.max(0, Math.floor((maxW - w) / 2)));
    setCropY(Math.max(0, Math.floor((maxH - h) / 2)));
  }

  async function runProcess(overrideSources?: VideoSourceFile[]) {
    const active = overrideSources ?? sources;
    if (!active.length) {
      setLocalError("Please choose a video file.");
      return;
    }
    setLocalError(null);
    clearResult();
    const opId = controller.start(config.processingLabel);
    try {
      const processed = await processVideoTool(active, config, {
        quality,
        startSeconds,
        endSeconds,
        width,
        height,
        maintainAspect,
        crop: { x: cropX, y: cropY, width: cropW, height: cropH },
        rotation,
        speed,
        timestampSeconds,
        gifFps,
        gifWidth,
        onProgress: (ratio, label) => {
          if (ratio >= 0 && ratio <= 1) {
            controller.setRatioProgress(opId, ratio, label);
          } else {
            controller.setIndeterminate(opId, label);
          }
        },
      });
      if (!controller.succeed(opId)) {
        revokeObjectUrl(processed.previewUrl);
        revokeObjectUrl(processed.imagePreviewUrl);
        return;
      }
      setResult(processed);
    } catch (processError) {
      controller.fail(
        opId,
        processError instanceof Error
          ? processError.message
          : "We couldn't process this video.",
      );
    }
  }

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
        <VideoUpload
          accept={config.accept}
          multiple={config.allowMultiple}
          onFilesSelected={(files) => void addFiles(files)}
        />
      ) : null}

      {sources.length > 0 && !showResult ? (
        <>
          <div className="rounded-3xl border border-tm-border bg-tm-elevated p-5">
            <h3 className="text-lg font-extrabold text-tm-text">
              {config.allowMultiple ? "Selected videos" : "Selected video"}
            </h3>
            <ul className="mt-4 space-y-3">
              {sources.map((source, index) => (
                <li
                  key={source.id}
                  className="rounded-2xl border border-tm-border bg-tm-soft px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-tm-text">
                        {index + 1}. {source.name}
                      </p>
                      <p className="text-xs font-semibold text-tm-muted">
                        {formatBytes(source.sizeBytes)}
                        {source.durationSeconds != null
                          ? ` · ${formatDuration(source.durationSeconds)}`
                          : ""}
                        {source.width && source.height
                          ? ` · ${source.width}×${source.height}`
                          : ""}
                        {source.type ? ` · ${source.type}` : ""}
                      </p>
                    </div>
                    {config.allowMultiple ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="tm-btn tm-btn-ghost"
                          disabled={index === 0 || controller.isProcessing}
                          onClick={() => moveSource(source.id, -1)}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="tm-btn tm-btn-ghost"
                          disabled={
                            index === sources.length - 1 || controller.isProcessing
                          }
                          onClick={() => moveSource(source.id, 1)}
                        >
                          Down
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="tm-btn tm-btn-secondary"
                      disabled={controller.isProcessing}
                      onClick={() => removeSource(source.id)}
                    >
                      Remove
                    </button>
                  </div>
                  {(!config.allowMultiple || index === 0) &&
                  !source.name.toLowerCase().endsWith(".gif") ? (
                    <div className="mt-3">
                      <VideoPlayer src={source.objectUrl} />
                    </div>
                  ) : null}
                  {source.name.toLowerCase().endsWith(".gif") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={source.objectUrl}
                      alt="GIF preview"
                      className="mt-3 max-h-80 w-full rounded-xl object-contain"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
            {fileInfo && !config.allowMultiple ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                {Object.entries(fileInfo).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-tm-border bg-tm-elevated px-3 py-2"
                  >
                    <p className="text-[11px] font-bold tracking-wide text-tm-muted uppercase">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-tm-text">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {config.allowMultiple && sources.length < config.maxFiles ? (
              <div className="mt-4">
                <VideoUpload
                  accept={config.accept}
                  multiple
                  onFilesSelected={(files) => void addFiles(files)}
                />
              </div>
            ) : null}
          </div>

          {config.kind === "compress" ? (
            <label
              htmlFor={qualityId}
              className="block rounded-2xl border border-tm-border bg-tm-soft p-4"
            >
              <span className="text-sm font-bold text-tm-text">Quality: {quality}/10</span>
              <input
                id={qualityId}
                type="range"
                min={1}
                max={10}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="mt-3 w-full"
                disabled={controller.isProcessing}
              />
            </label>
          ) : null}

          {(config.kind === "trim" ||
            config.kind === "cut" ||
            config.slug === "mp4-to-gif") && (
            <div className="grid gap-3 rounded-2xl border border-tm-border bg-tm-soft p-4 sm:grid-cols-3">
              <label htmlFor={startId} className="text-sm font-bold text-tm-text">
                Start (seconds)
                <input
                  id={startId}
                  type="number"
                  min={0}
                  step={0.01}
                  className="tm-input mt-2"
                  value={startSeconds}
                  onChange={(event) => setStartSeconds(Number(event.target.value))}
                  disabled={controller.isProcessing}
                />
              </label>
              <label htmlFor={endId} className="text-sm font-bold text-tm-text">
                End (seconds)
                <input
                  id={endId}
                  type="number"
                  min={0}
                  step={0.01}
                  className="tm-input mt-2"
                  value={endSeconds}
                  onChange={(event) => setEndSeconds(Number(event.target.value))}
                  disabled={controller.isProcessing}
                />
              </label>
              <div className="flex items-end text-sm font-bold text-tm-text">
                Selected duration: {formatDuration(selectedDuration)}
              </div>
              {config.slug === "mp4-to-gif" ? (
                <>
                  <label htmlFor={gifWidthId} className="text-sm font-bold text-tm-text">
                    GIF width
                    <input
                      id={gifWidthId}
                      type="number"
                      min={120}
                      max={1280}
                      className="tm-input mt-2"
                      value={gifWidth}
                      onChange={(event) => setGifWidth(Number(event.target.value))}
                      disabled={controller.isProcessing}
                    />
                  </label>
                  <label htmlFor={gifFpsId} className="text-sm font-bold text-tm-text">
                    Frame rate
                    <input
                      id={gifFpsId}
                      type="number"
                      min={5}
                      max={24}
                      className="tm-input mt-2"
                      value={gifFps}
                      onChange={(event) => setGifFps(Number(event.target.value))}
                      disabled={controller.isProcessing}
                    />
                  </label>
                </>
              ) : null}
            </div>
          )}

          {config.kind === "resize" ? (
            <div className="space-y-3 rounded-2xl border border-tm-border bg-tm-soft p-4">
              <div className="flex flex-wrap gap-2">
                {RESIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="rounded-full bg-tm-elevated px-3 py-1.5 text-sm font-bold text-tm-text"
                    disabled={controller.isProcessing}
                    onClick={() => {
                      setMaintainAspect(false);
                      setWidth(preset.width);
                      setHeight(preset.height);
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label htmlFor={widthId} className="text-sm font-bold text-tm-text">
                  Width
                  <input
                    id={widthId}
                    type="number"
                    min={16}
                    className="tm-input mt-2"
                    value={width}
                    onChange={(event) => updateWidth(Number(event.target.value))}
                    disabled={controller.isProcessing}
                  />
                </label>
                <label htmlFor={heightId} className="text-sm font-bold text-tm-text">
                  Height
                  <input
                    id={heightId}
                    type="number"
                    min={16}
                    className="tm-input mt-2"
                    value={height}
                    onChange={(event) => updateHeight(Number(event.target.value))}
                    disabled={controller.isProcessing}
                  />
                </label>
                <label className="flex items-end gap-2 text-sm font-bold text-tm-text">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(event) => setMaintainAspect(event.target.checked)}
                    disabled={controller.isProcessing}
                  />
                  Maintain aspect ratio
                </label>
              </div>
            </div>
          ) : null}

          {config.kind === "crop" ? (
            <div className="space-y-3 rounded-2xl border border-tm-border bg-tm-soft p-4">
              <div className="flex flex-wrap gap-2">
                {(["free", "1:1", "4:3", "16:9", "9:16"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                      cropRatio === ratio
                        ? "bg-tm-accent text-tm-on-brand"
                        : "bg-tm-elevated text-tm-text"
                    }`}
                    onClick={() => applyCropRatio(ratio)}
                    disabled={controller.isProcessing}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <label htmlFor={cropXId} className="text-sm font-bold text-tm-text">
                  X
                  <input
                    id={cropXId}
                    type="number"
                    min={0}
                    className="tm-input mt-2"
                    value={cropX}
                    onChange={(e) => setCropX(Number(e.target.value))}
                    disabled={controller.isProcessing}
                  />
                </label>
                <label htmlFor={cropYId} className="text-sm font-bold text-tm-text">
                  Y
                  <input
                    id={cropYId}
                    type="number"
                    min={0}
                    className="tm-input mt-2"
                    value={cropY}
                    onChange={(e) => setCropY(Number(e.target.value))}
                    disabled={controller.isProcessing}
                  />
                </label>
                <label htmlFor={cropWId} className="text-sm font-bold text-tm-text">
                  Width
                  <input
                    id={cropWId}
                    type="number"
                    min={2}
                    className="tm-input mt-2"
                    value={cropW}
                    onChange={(e) => setCropW(Number(e.target.value))}
                    disabled={controller.isProcessing}
                  />
                </label>
                <label htmlFor={cropHId} className="text-sm font-bold text-tm-text">
                  Height
                  <input
                    id={cropHId}
                    type="number"
                    min={2}
                    className="tm-input mt-2"
                    value={cropH}
                    onChange={(e) => setCropH(Number(e.target.value))}
                    disabled={controller.isProcessing}
                  />
                </label>
              </div>
            </div>
          ) : null}

          {config.kind === "rotate" ? (
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { label: "90° clockwise", value: 90 as const },
                  { label: "90° counterclockwise", value: 270 as const },
                  { label: "180°", value: 180 as const },
                ] as const
              ).map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    rotation === item.value
                      ? "bg-tm-accent text-tm-on-brand"
                      : "bg-tm-soft text-tm-text"
                  }`}
                  onClick={() => setRotation(item.value)}
                  disabled={controller.isProcessing}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}

          {config.kind === "speed" ? (
            <div className="flex flex-wrap gap-2">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    speed === value ? "bg-tm-accent text-tm-on-brand" : "bg-tm-soft text-tm-text"
                  }`}
                  onClick={() => setSpeed(value)}
                  disabled={controller.isProcessing}
                >
                  {value}x
                </button>
              ))}
            </div>
          ) : null}

          {(config.kind === "thumbnail" || config.kind === "frame") && (
            <label
              htmlFor={timeId}
              className="block rounded-2xl border border-tm-border bg-tm-soft p-4"
            >
              <span className="text-sm font-bold text-tm-text">
                Timestamp: {formatDuration(timestampSeconds)}
              </span>
              <input
                id={timeId}
                type="range"
                min={0}
                max={Math.max(primary?.durationSeconds ?? 1, 0.1)}
                step={0.01}
                value={timestampSeconds}
                onChange={(event) => setTimestampSeconds(Number(event.target.value))}
                className="mt-3 w-full"
                disabled={controller.isProcessing}
              />
            </label>
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
                  Add at least one more video to merge.
                </p>
              ) : null}
              {controller.showProgress && controller.progress ? (
                <ProcessingProgress progress={controller.progress} />
              ) : null}
            </div>
          ) : null}

          {autoProcess && controller.showProgress && controller.progress ? (
            <ProcessingProgress progress={controller.progress} />
          ) : null}
        </>
      ) : null}

      {showResult && result ? (
        <div className="space-y-5 rounded-3xl border border-tm-border bg-tm-elevated p-5 md:p-6">
          <h3 className="text-xl font-extrabold text-tm-text">
            {config.kind === "metadata" ? "Video metadata" : "Result ready"}
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
                  <p className="mt-1 text-lg font-extrabold text-tm-text">{value}</p>
                </div>
              ))}
            </div>
          ) : null}

          {config.kind === "metadata" && result.metadataRows?.length ? (
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
          ) : null}

          {result.imagePreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.imagePreviewUrl}
              alt="Extracted frame"
              className="max-h-96 w-full rounded-2xl border border-tm-border object-contain"
            />
          ) : null}

          {result.previewUrl && result.mimeType === "image/gif" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.previewUrl}
              alt="Animated GIF result"
              className="max-h-96 w-full rounded-2xl border border-tm-border object-contain"
            />
          ) : null}

          {result.previewUrl && result.mimeType.startsWith("video/") ? (
            <VideoPlayer src={result.previewUrl} label="Processed video" />
          ) : null}

          {result.previewUrl && result.mimeType.startsWith("audio/") ? (
            <audio controls src={result.previewUrl} className="w-full" />
          ) : null}

          {result.notice ? (
            <p className="tm-notice tm-notice-warning">
              {result.notice}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {config.kind !== "metadata" ? (
              <ConvertButton
                label="Download"
                onClick={() => downloadBlob(result.blob, result.fileName)}
              />
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
