export type SecurityToolKind =
  | "hash"
  | "uuid"
  | "password"
  | "random-string"
  | "random-number"
  | "hex-to-text"
  | "text-to-hex"
  | "binary-to-text"
  | "text-to-binary"
  | "decimal-to-binary"
  | "binary-to-decimal"
  | "base32"
  | "base64-file"
  | "jwt"
  | "timestamp-generate"
  | "timestamp-convert"
  | "qr";

export type HashAlgorithm = "SHA-256" | "SHA-512" | "MD5" | "SHA-1";

export interface SecurityToolConfig {
  slug: string;
  kind: SecurityToolKind;
  actionLabel: string;
  live: boolean;
  showOutput: boolean;
  downloadName: string;
  inputLabel?: string;
  outputLabel?: string;
  notices: string[];
  hashAlgorithm?: HashAlgorithm;
  allowFile?: boolean;
}

export interface SecurityProcessOptions {
  // hash
  hashMode?: "text" | "file";
  file?: File | null;
  onProgress?: (ratio: number) => void;
  signal?: AbortSignal;
  // generators
  quantity?: number;
  length?: number;
  includeUpper?: boolean;
  includeLower?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeAmbiguous?: boolean;
  charset?: string;
  min?: number;
  max?: number;
  decimalMode?: boolean;
  decimalPlaces?: number;
  // base32 / base64
  mode?: "encode" | "decode";
  mimeType?: string;
  fileName?: string;
  // timestamp
  timestampUnit?: "seconds" | "milliseconds";
  dateValue?: string;
  useNow?: boolean;
  // qr
  qrSize?: number;
  qrErrorCorrection?: "L" | "M" | "Q" | "H";
  qrMargin?: number;
  qrDark?: string;
  qrLight?: string;
}

export interface JwtDecoded {
  header: unknown;
  payload: unknown;
  signature: string;
  rawHeader: string;
  rawPayload: string;
}

export interface SecurityProcessResult {
  output: string;
  notice?: string;
  downloadBlob?: Blob;
  downloadName?: string;
  jwt?: JwtDecoded;
  qrDataUrl?: string;
  qrSvg?: string;
  meta?: Record<string, string | number | boolean>;
}

export const MAX_TEXT_CHARS = 2_000_000;
export const MAX_RANDOM_QUANTITY = 500;
export const MAX_UUID_QUANTITY = 500;
export const MAX_PASSWORD_LENGTH = 256;
export const MAX_STRING_LENGTH = 10_000;
export const MAX_FILE_BYTES = 200 * 1024 * 1024;
export const HASH_CHUNK_SIZE = 2 * 1024 * 1024;
