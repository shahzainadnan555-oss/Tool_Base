import type { HashAlgorithm, SecurityToolConfig, SecurityToolKind } from "./types";

function make(
  slug: string,
  kind: SecurityToolKind,
  extras: Partial<SecurityToolConfig> & {
    actionLabel: string;
    downloadName: string;
  },
): SecurityToolConfig {
  return {
    slug,
    kind,
    live: extras.live ?? false,
    showOutput: extras.showOutput ?? true,
    notices: extras.notices ?? [],
    inputLabel: extras.inputLabel,
    outputLabel: extras.outputLabel,
    hashAlgorithm: extras.hashAlgorithm,
    allowFile: extras.allowFile,
    actionLabel: extras.actionLabel,
    downloadName: extras.downloadName,
  };
}

export const securityToolConfigs: Record<string, SecurityToolConfig> = {
  "sha256-hash-generator": make("sha256-hash-generator", "hash", {
    actionLabel: "Generate Hash",
    downloadName: "sha256.txt",
    hashAlgorithm: "SHA-256",
    allowFile: true,
    inputLabel: "Text to hash",
    outputLabel: "SHA-256",
  }),
  "sha512-hash-generator": make("sha512-hash-generator", "hash", {
    actionLabel: "Generate Hash",
    downloadName: "sha512.txt",
    hashAlgorithm: "SHA-512",
    allowFile: true,
    inputLabel: "Text to hash",
    outputLabel: "SHA-512",
  }),
  "md5-hash-generator": make("md5-hash-generator", "hash", {
    actionLabel: "Generate Hash",
    downloadName: "md5.txt",
    hashAlgorithm: "MD5",
    allowFile: true,
    inputLabel: "Text to hash",
    outputLabel: "MD5",
    notices: [
      "MD5 is a legacy hashing algorithm and should not be used for modern security-sensitive applications.",
    ],
  }),
  "sha1-hash-generator": make("sha1-hash-generator", "hash", {
    actionLabel: "Generate Hash",
    downloadName: "sha1.txt",
    hashAlgorithm: "SHA-1",
    allowFile: true,
    inputLabel: "Text to hash",
    outputLabel: "SHA-1",
    notices: [
      "SHA-1 is considered obsolete for modern cryptographic security applications.",
    ],
  }),
  "uuid-generator": make("uuid-generator", "uuid", {
    actionLabel: "Generate UUIDs",
    downloadName: "generated-uuid.txt",
    outputLabel: "UUIDs",
  }),
  "password-generator": make("password-generator", "password", {
    actionLabel: "Generate Password",
    downloadName: "password.txt",
    outputLabel: "Password",
    notices: [
      "Generated passwords stay in temporary browser state only and are not sent to a server.",
    ],
  }),
  "random-string-generator": make("random-string-generator", "random-string", {
    actionLabel: "Generate",
    downloadName: "random-string.txt",
    outputLabel: "Random strings",
  }),
  "random-number-generator": make("random-number-generator", "random-number", {
    actionLabel: "Generate",
    downloadName: "random-numbers.txt",
    outputLabel: "Random numbers",
  }),
  "hex-to-text": make("hex-to-text", "hex-to-text", {
    actionLabel: "Convert",
    downloadName: "decoded-text.txt",
    live: true,
    inputLabel: "Hexadecimal input",
    outputLabel: "Text",
  }),
  "text-to-hex": make("text-to-hex", "text-to-hex", {
    actionLabel: "Convert",
    downloadName: "encoded-hex.txt",
    live: true,
    inputLabel: "Text input",
    outputLabel: "Hex",
  }),
  "binary-to-text": make("binary-to-text", "binary-to-text", {
    actionLabel: "Convert",
    downloadName: "decoded-text.txt",
    live: true,
    inputLabel: "Binary input",
    outputLabel: "Text",
  }),
  "text-to-binary": make("text-to-binary", "text-to-binary", {
    actionLabel: "Convert",
    downloadName: "encoded-binary.txt",
    live: true,
    inputLabel: "Text input",
    outputLabel: "Binary",
  }),
  "decimal-to-binary": make("decimal-to-binary", "decimal-to-binary", {
    actionLabel: "Convert",
    downloadName: "binary.txt",
    live: true,
    inputLabel: "Decimal integer",
    outputLabel: "Binary",
  }),
  "binary-to-decimal": make("binary-to-decimal", "binary-to-decimal", {
    actionLabel: "Convert",
    downloadName: "decimal.txt",
    live: true,
    inputLabel: "Binary integer",
    outputLabel: "Decimal",
  }),
  "base32-encoder-decoder": make("base32-encoder-decoder", "base32", {
    actionLabel: "Convert",
    downloadName: "base32.txt",
    inputLabel: "Input",
    outputLabel: "Output",
  }),
  "base64-file-converter": make("base64-file-converter", "base64-file", {
    actionLabel: "Convert",
    downloadName: "encoded-base64.txt",
    inputLabel: "Base64 input",
    outputLabel: "Result",
  }),
  "jwt-decoder": make("jwt-decoder", "jwt", {
    actionLabel: "Decode JWT",
    downloadName: "jwt-decoded.txt",
    inputLabel: "JWT",
    outputLabel: "Decoded sections",
    notices: [
      "Decoding does not verify the token’s authenticity. Treat decoded contents as untrusted data.",
    ],
  }),
  "unix-timestamp-generator": make("unix-timestamp-generator", "timestamp-generate", {
    actionLabel: "Generate Timestamp",
    downloadName: "unix-timestamp.txt",
    outputLabel: "Timestamp",
  }),
  "unix-timestamp-converter": make("unix-timestamp-converter", "timestamp-convert", {
    actionLabel: "Convert Timestamp",
    downloadName: "converted-timestamp.txt",
    live: true,
    inputLabel: "Unix timestamp",
    outputLabel: "Date/time",
  }),
  "qr-code-generator": make("qr-code-generator", "qr", {
    actionLabel: "Generate QR Code",
    downloadName: "qr-code.png",
    inputLabel: "Text or URL",
    outputLabel: "QR preview",
  }),
};

export function getSecurityToolConfig(slug: string): SecurityToolConfig | undefined {
  return securityToolConfigs[slug];
}

export function isSecurityToolSlug(slug: string): boolean {
  return Boolean(securityToolConfigs[slug]);
}

export const securityToolSlugs = Object.keys(securityToolConfigs);

export const HASH_ALGORITHMS: HashAlgorithm[] = [
  "SHA-256",
  "SHA-512",
  "MD5",
  "SHA-1",
];
