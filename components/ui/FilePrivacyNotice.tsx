import type { ProcessingMode } from "@/lib/tools/types";

interface FilePrivacyNoticeProps {
  processingMode?: ProcessingMode;
  className?: string;
}

const copy: Record<ProcessingMode, { title: string; body: string }> = {
  browser: {
    title: "On-device processing",
    body: "This tool is designed to process your input in the browser on your device. Your source file is not uploaded to Tool Base servers to complete the operation. The page may still load Tool Base assets or tool runtimes over the network.",
  },
  server: {
    title: "File Processing",
    body: "This tool processes files on Tool Base servers. Uploaded files are used only to complete the requested operation. Retention and deletion details are documented for each server-based tool.",
  },
  hybrid: {
    title: "File Processing",
    body: "This tool may use a mix of on-device and server steps depending on the file and operation. The tool page explains what happens during processing.",
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
