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
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-tm-white text-tm-accent shadow-sm">
        <Icon name="image" className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-xl font-extrabold text-tm-text">Upload Your Image</h3>
      <p className="mx-auto mt-2 max-w-md text-base font-medium text-tm-muted">
        Drag & drop your image here, or click to browse
      </p>
      <p className="mt-2 text-sm font-semibold text-tm-muted">
        Accepted format: {inputLabel}
      </p>
      <span className="tm-btn tm-btn-primary mt-6 pointer-events-none">Choose Image</span>
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
