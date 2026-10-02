"use client";

import { useEffect, useId, useState } from "react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { AudioUpload } from "@/components/audio/AudioUpload";
import { ConvertButton } from "@/components/image-converter/ConvertButton";
import { FileValidationMessage } from "@/components/image-converter/FileValidationMessage";
import { ProcessingProgress } from "@/components/ui/ProcessingProgress";
import { processAudioTool } from "@/lib/audio/process";
import type {
  AudioProcessResult,
  AudioSourceFile,
  AudioToolConfig,
} from "@/lib/audio/types";
import {
  createAudioId,
  downloadBlob,
  formatBytes,
  formatDuration,
  probeAudioDuration,
  revokeObjectUrl,
} from "@/lib/audio/utils";
import { validateAudioFile } from "@/lib/audio/validate";
import { useOperationController } from "@/lib/processing/useOperationController";

interface AudioWorkspaceProps {
  config: AudioToolConfig;
  convertHeading?: string;
}

export function AudioWorkspace({ config, convertHeading }: AudioWorkspaceProps) {
  const controller = useOperationController(config.processingLabel);
  const qualityId = useId();
  const startId = useId();
  const endId = useId();
  const gainId = useId();
  const pitchId = useId();
  const silenceDbId = useId();
  const silenceDurId = useId();

  const [sources, setSources] = useState<AudioSourceFile[]>([]);
  const [result, setResult] = useState<AudioProcessResult | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [quality, setQuality] = useState(5);
  const [startSeconds, setStartSeconds] = useState(0);
  const [endSeconds, setEndSeconds] = useState(10);
  const [volumeGainDb, setVolumeGainDb] = useState(6);
  const [speed, setSpeed] = useState(1.25);
  const [pitchSemitones, setPitchSemitones] = useState(2);
  const [silenceThresholdDb, setSilenceThresholdDb] = useState(-40);
  const [silenceMinDuration, setSilenceMinDuration] = useState(0.5);

  const autoProcess = config.kind === "metadata";
  const needsProcessButton = !autoProcess;
  const error = localError || controller.error;
  const showResult = controller.phase === "done" && result;

  useEffect(() => {
    return () => {
      sources.forEach((s) => revokeObjectUrl(s.objectUrl));
      revokeObjectUrl(result?.previewUrl);
      revokeObjectUrl(result?.waveformDataUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearResult() {
    revokeObjectUrl(result?.previewUrl);
    revokeObjectUrl(result?.waveformDataUrl);
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

    const next: AudioSourceFile[] = config.allowMultiple ? [...sources] : [];
    for (const file of files) {
      if (next.length >= config.maxFiles) {
        setLocalError(`You can upload up to ${config.maxFiles} files.`);
        break;
      }
      const validation = validateAudioFile(file, config);
      if (validation) {
        setLocalError(validation);
        continue;
      }
      const objectUrl = URL.createObjectURL(file);
      const durationSeconds = await probeAudioDuration(file);
      next.push({
        id: createAudioId(),
        file,
        name: file.name,
        sizeBytes: file.size,
        type: file.type,
        objectUrl,
        durationSeconds,
      });
    }

    setSources(next);
    if (next[0]?.durationSeconds != null) {
      setStartSeconds(0);
      setEndSeconds(Math.max(0.1, Number(next[0].durationSeconds.toFixed(2))));
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

  async function runProcess(overrideSources?: AudioSourceFile[]) {
    const active = overrideSources ?? sources;
    if (!active.length) {
      setLocalError("Please choose an audio file.");
      return;
    }
    setLocalError(null);
    clearResult();
    const opId = controller.start(config.processingLabel);
    try {
      const processed = await processAudioTool(active, config, {
        quality,
        startSeconds,
        endSeconds,
        volumeGainDb,
        speed,
        pitchSemitones,
        silenceThresholdDb,
        silenceMinDuration,
        onProgress: (ratio, label) => {
          if (ratio >= 0 && ratio <= 1) {
            controller.setUnitProgress(
              opId,
              Math.round(ratio * 100),
              100,
              label,
            );
          } else {
            controller.setIndeterminate(opId, label);
          }
        },
      });
      if (!controller.succeed(opId)) {
        revokeObjectUrl(processed.previewUrl);
        revokeObjectUrl(processed.waveformDataUrl);
        return;
      }
      setResult(processed);
    } catch (processError) {
      controller.fail(
        opId,
        processError instanceof Error
          ? processError.message
          : "We couldn't process this audio file.",
      );
    }
  }

  const selectedDuration = Math.max(0, endSeconds - startSeconds);

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

      {!sources.length ? (
        <AudioUpload
          accept={config.accept}
          multiple={config.allowMultiple}
          onFilesSelected={(files) => void addFiles(files)}
        />
      ) : null}

      {sources.length > 0 && !showResult ? (
        <>
          <div className="rounded-3xl border border-tm-border bg-white p-5">
            <h3 className="text-lg font-extrabold text-tm-text">
              {config.allowMultiple ? "Selected files" : "Selected audio"}
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
                  {!config.allowMultiple || index === 0 ? (
                    <div className="mt-3">
                      <AudioPlayer
                        src={source.objectUrl}
                        regionStart={
                          config.kind === "cut" || config.kind === "trim"
                            ? startSeconds
                            : undefined
                        }
                        regionEnd={
                          config.kind === "cut" || config.kind === "trim"
                            ? endSeconds
                            : undefined
                        }
                        showRegionPlay={config.kind === "cut"}
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
            {config.allowMultiple && sources.length < config.maxFiles ? (
              <div className="mt-4">
                <AudioUpload
                  accept={config.accept}
                  multiple
                  onFilesSelected={(files) => void addFiles(files)}
                />
              </div>
            ) : null}
          </div>

          {(config.kind === "compress" ||
            (config.kind === "convert" &&
              ["mp3", "adts", "ipod"].includes(config.ffmpegFormat || ""))) && (
            <label htmlFor={qualityId} className="block rounded-2xl border border-tm-border bg-tm-soft p-4">
              <span className="text-sm font-bold text-tm-text">
                Quality: {quality}/10
              </span>
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
          )}

          {(config.kind === "trim" || config.kind === "cut") && (
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
            </div>
          )}

          {config.kind === "volume" && (
            <label htmlFor={gainId} className="block rounded-2xl border border-tm-border bg-tm-soft p-4">
              <span className="text-sm font-bold text-tm-text">
                Gain: {volumeGainDb} dB
              </span>
              <input
                id={gainId}
                type="range"
                min={-12}
                max={12}
                step={1}
                value={volumeGainDb}
                onChange={(event) => setVolumeGainDb(Number(event.target.value))}
                className="mt-3 w-full"
                disabled={controller.isProcessing}
              />
            </label>
          )}

          {config.kind === "speed" && (
            <div className="flex flex-wrap gap-2">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    speed === value ? "bg-tm-accent text-white" : "bg-tm-soft text-tm-text"
                  }`}
                  onClick={() => setSpeed(value)}
                  disabled={controller.isProcessing}
                >
                  {value}x
                </button>
              ))}
            </div>
          )}

          {config.kind === "pitch" && (
            <label htmlFor={pitchId} className="block rounded-2xl border border-tm-border bg-tm-soft p-4">
              <span className="text-sm font-bold text-tm-text">
                Pitch: {pitchSemitones > 0 ? "+" : ""}
                {pitchSemitones} semitones
              </span>
              <input
                id={pitchId}
                type="range"
                min={-12}
                max={12}
                step={1}
                value={pitchSemitones}
                onChange={(event) => setPitchSemitones(Number(event.target.value))}
                className="mt-3 w-full"
                disabled={controller.isProcessing}
              />
            </label>
          )}

          {config.kind === "silence-remove" && (
            <div className="grid gap-3 rounded-2xl border border-tm-border bg-tm-soft p-4 sm:grid-cols-2">
              <label htmlFor={silenceDbId} className="text-sm font-bold text-tm-text">
                Silence threshold (dB)
                <input
                  id={silenceDbId}
                  type="number"
                  min={-60}
                  max={-20}
                  className="tm-input mt-2"
                  value={silenceThresholdDb}
                  onChange={(event) => setSilenceThresholdDb(Number(event.target.value))}
                  disabled={controller.isProcessing}
                />
              </label>
              <label htmlFor={silenceDurId} className="text-sm font-bold text-tm-text">
                Minimum silence (seconds)
                <input
                  id={silenceDurId}
                  type="number"
                  min={0.2}
                  max={5}
                  step={0.1}
                  className="tm-input mt-2"
                  value={silenceMinDuration}
                  onChange={(event) => setSilenceMinDuration(Number(event.target.value))}
                  disabled={controller.isProcessing}
                />
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
                  (config.kind === "join" && sources.length < 2)
                }
                onClick={() => void runProcess()}
              />
              {config.kind === "join" && sources.length === 1 ? (
                <p className="text-sm font-semibold text-tm-muted">
                  Add at least one more audio file to join.
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

      {showResult && result ? (
        <div className="space-y-5 rounded-3xl border border-tm-border bg-white p-5 md:p-6">
          <h3 className="text-xl font-extrabold text-tm-text">
            {config.kind === "metadata" ? "Audio metadata" : "Result ready"}
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

          {config.kind === "metadata" ? (
            result.metadataRows && result.metadataRows.length > 0 ? (
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
                No metadata could be read from this audio file.
              </p>
            )
          ) : null}

          {result.waveformDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.waveformDataUrl}
              alt="Generated audio waveform"
              className="max-h-80 w-full rounded-2xl border border-tm-border object-contain"
            />
          ) : null}

          {result.previewUrl && result.mimeType.startsWith("audio/") ? (
            <AudioPlayer src={result.previewUrl} label="Processed audio" />
          ) : null}

          {result.notice ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
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
