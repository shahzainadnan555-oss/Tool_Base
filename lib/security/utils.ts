export function downloadTextFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, fileName);
}

export function downloadBlob(blob: Blob, fileName: string) {
  const safe = fileName.replace(/(\.[a-z0-9]+)\1$/i, "$1");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safe;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function copyText(content: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(content);
      return true;
    }
  } catch {
    // fall through
  }
  try {
    const area = document.createElement("textarea");
    area.value = content;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export function bytesToHex(bytes: Uint8Array, separator = " "): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(separator);
}

export function hexToBytes(input: string): Uint8Array {
  const cleaned = input.replace(/[^0-9a-fA-F]/g, "");
  if (!cleaned) throw new Error("Please enter hexadecimal data.");
  if (cleaned.length % 2 !== 0) {
    throw new Error("Hex input must contain an even number of digits.");
  }
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
    throw new Error("Invalid hexadecimal characters.");
  }
  const out = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    out[i / 2] = Number.parseInt(cleaned.slice(i, i + 2), 16);
  }
  return out;
}

export function bytesToBinary(bytes: Uint8Array, separator = " "): string {
  return Array.from(bytes)
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(separator);
}

export function binaryToBytes(input: string): Uint8Array {
  const cleaned = input.replace(/[^01]/g, "");
  if (!cleaned) throw new Error("Please enter binary data.");
  if (cleaned.length % 8 !== 0) {
    throw new Error("Binary input must contain complete 8-bit bytes.");
  }
  const out = new Uint8Array(cleaned.length / 8);
  for (let i = 0; i < cleaned.length; i += 8) {
    out[i / 8] = Number.parseInt(cleaned.slice(i, i + 8), 2);
  }
  return out;
}

export function utf8Decode(bytes: Uint8Array): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("The data is not valid UTF-8 text.");
  }
}

export function utf8Encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function requireSecureRandom(): Crypto {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error(
      "Secure random generation is unavailable in this browser. This tool cannot generate secure values here.",
    );
  }
  return globalThis.crypto;
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}
