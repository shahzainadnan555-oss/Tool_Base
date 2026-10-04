"use client";

import { useId, useRef, useState } from "react";

interface AudioUploadProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export function AudioUpload({
  accept,
  multiple = false,
  onFilesSelected,
}: AudioUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(list: FileList | null) {
    if (!list?.length) return;
    onFilesSelected(Array.from(list));
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-controls={inputId}
      className={`rounded-3xl border-2 border-dashed px-6 py-12 text-center transition ${
        dragging
          ? "border-tm-accent bg-tm-info"
          : "border-tm-border bg-tm-soft hover:border-tm-accent/60"
      }`}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-tm-white text-tm-accent shadow-sm">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 18V6l10-2v12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="17" cy="16" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-tm-text">Upload Your Audio</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium text-tm-muted">
        Drag & drop your audio file here, or click to browse
      </p>
      <span className="tm-btn tm-btn-primary mt-6 pointer-events-none">Choose Audio</span>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
