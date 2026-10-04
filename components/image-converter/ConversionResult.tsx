"use client";

import { formatBytes } from "@/lib/image-converter/utils";
import type { ConversionResult, SelectedImageFile } from "@/lib/image-converter/types";
import { ConvertButton } from "./ConvertButton";

interface ConversionResultProps {
  original: SelectedImageFile;
  result: ConversionResult;
  onDownload: () => void;
  onReset: () => void;
}

export function ConversionResultView({
  original,
  result,
  onDownload,
  onReset,
}: ConversionResultProps) {
  const canPreviewImage =
    result.outputMimeType.startsWith("image/") && result.outputExtension !== "ico";

  return (
    <div className="rounded-3xl border border-tm-border bg-tm-white p-5 md:p-6">
      <h3 className="text-xl font-extrabold text-tm-text">Conversion complete</h3>
      <p className="mt-2 text-sm font-medium text-tm-muted">
        Your file is ready. Download the converted image below.
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-tm-border bg-tm-soft p-4">
          <p className="text-xs font-bold tracking-wide text-tm-muted uppercase">Original</p>
          <p className="mt-2 font-bold text-tm-text break-all">{original.name}</p>
          <p className="mt-1 text-sm font-semibold text-tm-muted">
            {formatBytes(original.sizeBytes)}
          </p>
        </div>
        <div className="rounded-2xl border border-tm-border bg-tm-soft p-4">
          <p className="text-xs font-bold tracking-wide text-tm-muted uppercase">Converted</p>
          <p className="mt-2 font-bold text-tm-text break-all">{result.fileName}</p>
          <p className="mt-1 text-sm font-semibold text-tm-muted">
            {result.outputExtension.toUpperCase()} · {formatBytes(result.sizeBytes)}
            {result.width && result.height ? ` · ${result.width}×${result.height}px` : ""}
          </p>
        </div>
      </div>

      {canPreviewImage ? (
        <div className="mt-5 flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-tm-border bg-tm-soft p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.previewUrl}
            alt={`Converted preview for ${result.fileName}`}
            className="max-h-64 max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-tm-border bg-tm-soft px-4 py-6 text-sm font-medium text-tm-muted">
          Preview is limited for .{result.outputExtension} files. The download contains the converted
          file.
        </div>
      )}

      {result.notice ? (
        <p className="mt-4 tm-notice tm-notice-warning">
          {result.notice}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <ConvertButton onClick={onDownload} label="Download" />
        <button type="button" className="tm-btn tm-btn-secondary" onClick={onReset}>
          Convert Another Image
        </button>
      </div>
    </div>
  );
}
