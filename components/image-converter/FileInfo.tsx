"use client";

import { formatBytes } from "@/lib/image-converter/utils";
import type { SelectedImageFile } from "@/lib/image-converter/types";

interface ImagePreviewProps {
  file: SelectedImageFile;
  onRemove: () => void;
  onChange: () => void;
}

export function ImagePreview({ file, onRemove, onChange }: ImagePreviewProps) {
  const isSvg = file.type.includes("svg") || file.name.toLowerCase().endsWith(".svg");

  return (
    <div className="rounded-3xl border border-tm-border bg-white p-5 md:p-6">
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-tm-border bg-tm-soft p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.previewUrl}
            alt={`Preview of ${file.name}`}
            className="max-h-56 max-w-full object-contain"
          />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-tm-text">Selected image</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-bold text-tm-muted">File name</dt>
              <dd className="font-semibold text-tm-text break-all">{file.name}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-bold text-tm-muted">File type</dt>
              <dd className="font-semibold text-tm-text">
                {file.type || (isSvg ? "image/svg+xml" : "Unknown")}
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-bold text-tm-muted">File size</dt>
              <dd className="font-semibold text-tm-text">{formatBytes(file.sizeBytes)}</dd>
            </div>
            {file.width && file.height ? (
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-bold text-tm-muted">Dimensions</dt>
                <dd className="font-semibold text-tm-text">
                  {file.width} × {file.height}px
                </dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="tm-btn tm-btn-secondary" onClick={onChange}>
              Change image
            </button>
            <button type="button" className="tm-btn tm-btn-ghost" onClick={onRemove}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
