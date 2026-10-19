"use client";

import { useState } from "react";
import { FileSizeHint } from "@/components/uploads/FileSizeHint";
import { FILE_TOO_LARGE_MESSAGE, exceedsMaxFileSize } from "@/lib/uploads/limits";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  perFile?: boolean;
  onAcceptedFiles: (files: File[]) => void;
};

export function LimitedFileInput({
  perFile = false,
  onAcceptedFiles,
  className,
  multiple,
  ...rest
}: Props) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <input
        {...rest}
        type="file"
        multiple={multiple}
        className={className}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (!files.length) return;
          const accepted: File[] = [];
          let tooLarge = false;
          for (const file of files) {
            if (exceedsMaxFileSize(file.size)) tooLarge = true;
            else accepted.push(file);
          }
          setError(tooLarge ? FILE_TOO_LARGE_MESSAGE : null);
          if (accepted.length) onAcceptedFiles(accepted);
          else if (tooLarge) onAcceptedFiles([]);
          event.target.value = "";
        }}
      />
      <FileSizeHint perFile={perFile || Boolean(multiple)} />
      {error ? (
        <p role="alert" className="tm-notice tm-notice-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
