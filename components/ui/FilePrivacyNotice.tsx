import type { ProcessingMode } from "@/lib/tools/types";

interface FilePrivacyNoticeProps {
  processingMode?: ProcessingMode;
  className?: string;
}

const copy: Record<ProcessingMode, { title: string; body: string }> = {
  browser: {
    title: "File Processing",
    body: "Upload a file or enter text, then copy or download the result. No account is required.",
  },
  server: {
    title: "File Processing",
    body: "This tool processes files on Tool Base servers. Uploaded files are used only to complete the requested operation. Retention and deletion details are documented for each server-based tool.",
  },
  hybrid: {
    title: "File Processing",
    body: "This tool may use more than one processing step depending on the file and operation. The tool page explains what happens while your result is prepared.",
  },
  unspecified: {
    title: "File Processing",
    body: "Processing details are described on this tool page. When a file must be uploaded, the page explains what happens during processing.",
  },
};

export function FilePrivacyNotice({
  processingMode = "unspecified",
  className,
}: FilePrivacyNoticeProps) {
  const content = copy[processingMode];

  return (
    <aside
      className={`rounded-2xl border border-tm-border bg-tm-soft p-5 ${className ?? ""}`}
      aria-label="File processing information"
    >
      <h3 className="text-base font-bold text-tm-text">{content.title}</h3>
      <p className="mt-2 text-sm font-medium leading-relaxed text-tm-muted">{content.body}</p>
    </aside>
  );
}
