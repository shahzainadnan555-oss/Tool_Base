"use client";

interface FileValidationMessageProps {
  message: string;
}

export function FileValidationMessage({ message }: FileValidationMessageProps) {
  return (
    <p
      role="alert"
      className="tm-notice tm-notice-error"
    >
      {message}
    </p>
  );
}
