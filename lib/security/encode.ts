import { utf8Decode, utf8Encode } from "./utils";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function encodeBase32(text: string): string {
  if (!text) throw new Error("Please enter text to encode.");
  const bytes = utf8Encode(text);
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31];
  }
  while (output.length % 8 !== 0) output += "=";
  return output;
}

export function decodeBase32(input: string): string {
  const cleaned = input.replace(/\s+/g, "").toUpperCase();
  if (!cleaned) throw new Error("Please enter Base32 to decode.");
  if (!/^[A-Z2-7=]+$/.test(cleaned)) {
    throw new Error("Invalid Base32 input.");
  }
  const padded = cleaned.replace(/=+$/, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const ch of padded) {
    const idx = ALPHABET.indexOf(ch);
    if (idx < 0) throw new Error("Invalid Base32 input.");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return utf8Decode(new Uint8Array(bytes));
}

export function fileToBase64(
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function decodeBase64ToBlob(
  input: string,
  mimeType = "application/octet-stream",
): Blob {
  const cleaned = input.replace(/\s+/g, "");
  if (!cleaned) throw new Error("Please enter Base64 to decode.");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned) || cleaned.length % 4 !== 0) {
    throw new Error("Invalid Base64 input.");
  }
  try {
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mimeType || "application/octet-stream" });
  } catch {
    throw new Error("Invalid Base64 input.");
  }
}
