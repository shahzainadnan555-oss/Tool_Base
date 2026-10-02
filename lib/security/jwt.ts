import type { JwtDecoded } from "./types";

function base64UrlToJson(segment: string): unknown {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((segment.length + 3) % 4);
  try {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return JSON.parse(text);
  } catch {
    throw new Error("Unable to decode a JWT section as JSON.");
  }
}

export function decodeJwt(token: string): JwtDecoded {
  const trimmed = token.trim();
  if (!trimmed) throw new Error("Please paste a JWT to decode.");
  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid JWT format. A typical JWT has three Base64URL-encoded sections separated by dots.",
    );
  }
  const [rawHeader, rawPayload, signature] = parts;
  if (!rawHeader || !rawPayload || signature == null) {
    throw new Error("Invalid JWT format.");
  }
  return {
    header: base64UrlToJson(rawHeader),
    payload: base64UrlToJson(rawPayload),
    signature,
    rawHeader,
    rawPayload,
  };
}
