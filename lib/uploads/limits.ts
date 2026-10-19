/** 1 GiB. Shown to visitors as 1 GB. */
export const MAX_FILE_SIZE = 1_073_741_824;

export const FILE_SIZE_HELPER =
  "Maximum file size: 1 GB. Larger files may take longer to process.";

export const FILE_TOO_LARGE_MESSAGE =
  "This file is larger than 1 GB. Please choose a file that is 1 GB or smaller.";

export const LARGE_FILE_SELECTED_MESSAGE =
  "Large file selected. Processing may take longer.";

const LARGE_FILE_NOTICE_BYTES = 100 * 1024 * 1024;

export function exceedsMaxFileSize(size: number): boolean {
  return size > MAX_FILE_SIZE;
}

export function shouldWarnLargeFile(size: number): boolean {
  return size > LARGE_FILE_NOTICE_BYTES && size <= MAX_FILE_SIZE;
}
