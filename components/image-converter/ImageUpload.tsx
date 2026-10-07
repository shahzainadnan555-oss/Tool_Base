"use client";

import { useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

interface ImageUploadProps {
  accept: string;
  inputLabel: string;
  disabled?: boolean;
  onFileSelected: (file: File) => void;
}

export function ImageUpload({
  accept,
  inputLabel,
  disabled = false,
  onFileSelected,
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={`Upload ${inputLabel} image`}
      className={cn(
        "tm-dropzone min-h-[14rem] cursor-pointer outline-none",
        dragging && "border-tm-accent",
        disabled && "pointer-events-none opacity-60",
      )}
      data-active={dragging ? "true" : "false"}
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
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-tm-elevated text-tm-accent shadow-sm">
        <Icon name="image" className="h-6 w-6" />
      </span>
      <h3 className="text-lg font-extrabold text-tm-text sm:text-xl">Upload Your Image</h3>
      <p className="mx-auto max-w-md text-sm font-medium text-tm-muted sm:text-base">
        <span className="tm-dropzone-mobile-hint">Tap to choose an image from your device</span>
        <span className="tm-dropzone-desktop-hint">
          Drag & drop your image here, or click to browse
        </span>
      </p>
      <p className="text-sm font-semibold text-tm-muted">Accepted format: {inputLabel}</p>
      <span className="tm-btn tm-btn-primary pointer-events-none mt-2 min-h-11">
        Choose Image
      </span>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
