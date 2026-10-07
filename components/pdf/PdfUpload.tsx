"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface PdfUploadProps {
  accept: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  onFilesSelected: (files: File[]) => void;
}

export function PdfUpload({
  accept,
  multiple = false,
  title = "Upload Your PDF",
  subtitle = "Drag & drop your file here, or click to browse",
  buttonLabel = "Choose File",
  onFilesSelected,
}: PdfUploadProps) {
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
      data-active={dragging ? "true" : "false"}
      className={cn("tm-dropzone cursor-pointer outline-none")}
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
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-tm-elevated text-tm-accent shadow-sm">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 16V4m0 0 4 4m-4-4-4 4M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-lg font-extrabold text-tm-text sm:text-xl">{title}</h3>
      <p className="mx-auto max-w-md text-sm font-medium text-tm-muted">
        <span className="tm-dropzone-mobile-hint">Tap to choose a file from your device</span>
        <span className="tm-dropzone-desktop-hint">{subtitle}</span>
      </p>
      <span className="tm-btn tm-btn-primary pointer-events-none min-h-11">{buttonLabel}</span>
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
