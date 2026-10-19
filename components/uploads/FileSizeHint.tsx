import {
  FILE_SIZE_HELPER,
  LARGE_FILE_SELECTED_MESSAGE,
  shouldWarnLargeFile,
} from "@/lib/uploads/limits";

export function FileSizeHint({
  perFile = false,
  selectedBytes,
}: {
  perFile?: boolean;
  selectedBytes?: number | null;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-tm-muted">
        {FILE_SIZE_HELPER}
        {perFile ? " This limit applies to each file." : null}
      </p>
      {selectedBytes != null && shouldWarnLargeFile(selectedBytes) ? (
        <p className="text-sm font-semibold text-tm-text">{LARGE_FILE_SELECTED_MESSAGE}</p>
      ) : null}
    </div>
  );
}
