/** Encoding utilities — never execute user content. */

export function encodeBase64(text: string): string {
  if (!text) throw new Error("Please enter text to encode.");
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function decodeBase64(input: string): string {
  const cleaned = input.replace(/\s+/g, "");
  if (!cleaned) throw new Error("Please enter Base64 to decode.");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned) || cleaned.length % 4 !== 0) {
    throw new Error("Invalid Base64 input.");
  }
  try {
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("Invalid Base64 input or the decoded bytes are not valid UTF-8 text.");
  }
}

export function encodeUrl(input: string, mode: "component" | "uri" = "component"): string {
  if (!input) throw new Error("Please enter text to encode.");
  return mode === "uri" ? encodeURI(input) : encodeURIComponent(input);
}

export function decodeUrl(input: string): string {
  if (!input) throw new Error("Please enter text to decode.");
  try {
    return decodeURIComponent(input.replace(/\+/g, "%20"));
  } catch {
    throw new Error("Invalid percent-encoded text.");
  }
}

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function encodeHtmlEntities(input: string): string {
  if (!input) throw new Error("Please enter text to encode.");
  return input.replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch] ?? ch);
}

export function decodeHtmlEntities(input: string): string {
  if (!input) throw new Error("Please enter HTML entities to decode.");
  const named: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
  };
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (entity, body: string) => {
    if (named[entity]) return named[entity];
    if (body.startsWith("#x") || body.startsWith("#X")) {
      const n = parseInt(body.slice(2), 16);
      return Number.isFinite(n) ? String.fromCodePoint(n) : entity;
    }
    if (body.startsWith("#")) {
      const n = Number(body.slice(1));
      return Number.isFinite(n) ? String.fromCodePoint(n) : entity;
    }
    return entity;
  });
}
