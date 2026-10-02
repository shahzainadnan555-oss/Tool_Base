"use client";

interface FileValidationMessageProps {
  message: string;
}

export function FileValidationMessage({ message }: FileValidationMessageProps) {
  return (
    <p
      role="alert"
      className="rounded-2xl border border-tm-error/20 bg-red-50 px-4 py-3 text-sm font-semibold text-tm-error"
    >
      {message}
    </p>
  );
}
