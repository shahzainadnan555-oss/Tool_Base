export const CODE39: Record<string, string> = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  ".": "wwnnnnwnn",
  " ": "nwwnnnwnn",
  $: "nwnwnwnnn",
  "/": "nwnwnnnwn",
  "+": "nwnnnwnwn",
  "%": "nnnwnwnwn",
  "*": "nwnnwnwnn",
};

export function encodeCode39(raw: string): { svg: string; error?: string } {
  const text = raw.toUpperCase();
  if (!text.trim()) return { svg: "", error: "Enter text to encode." };
  for (const ch of text) {
    if (!CODE39[ch]) {
      return { svg: "", error: "Invalid value. Code 39 allows A–Z, 0–9, space, and - . $ / + %." };
    }
  }
  const pattern = `*${text}*`;
  const narrow = 2;
  const wide = 5;
  const gap = 2;
  let x = 8;
  const bars: string[] = [];
  for (const ch of pattern) {
    const seq = CODE39[ch];
    for (let i = 0; i < seq.length; i += 1) {
      const width = seq[i] === "w" ? wide : narrow;
      if (i % 2 === 0) {
        bars.push(`<rect x="${x}" y="8" width="${width}" height="80" fill="#0f172a"/>`);
      }
      x += width;
    }
    x += gap;
  }
  const width = x + 8;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="110" viewBox="0 0 ${width} 110" role="img" aria-label="Code 39 barcode">${bars.join("")}<text x="${width / 2}" y="104" text-anchor="middle" font-size="12" font-family="ui-monospace, monospace">${escapeXml(pattern)}</text></svg>`;
  return { svg };
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const MIME_BY_EXT: Record<string, string> = {
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  xml: "application/xml",
  txt: "text/plain",
  csv: "text/csv",
  md: "text/markdown",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  pdf: "application/pdf",
  zip: "application/zip",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  mp4: "video/mp4",
  webm: "video/webm",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
};

export function mimeFromName(name: string): string | null {
  const ext = name.trim().toLowerCase().replace(/^\./, "").split(".").pop() ?? "";
  return MIME_BY_EXT[ext] ?? null;
}

export const HTTP_STATUS: Array<{ code: number; phrase: string; detail: string }> = [
  { code: 100, phrase: "Continue", detail: "The client may continue the request." },
  { code: 101, phrase: "Switching Protocols", detail: "The server is switching protocols." },
  { code: 200, phrase: "OK", detail: "The request succeeded." },
  { code: 201, phrase: "Created", detail: "A resource was created." },
  { code: 204, phrase: "No Content", detail: "The request succeeded with an empty body." },
  { code: 301, phrase: "Moved Permanently", detail: "The resource has a new permanent URI." },
  { code: 302, phrase: "Found", detail: "The resource is temporarily at another URI." },
  { code: 304, phrase: "Not Modified", detail: "Cached content can be reused." },
  { code: 400, phrase: "Bad Request", detail: "The server cannot process the request as sent." },
  { code: 401, phrase: "Unauthorized", detail: "Authentication is required." },
  { code: 403, phrase: "Forbidden", detail: "The client is not allowed to access the resource." },
  { code: 404, phrase: "Not Found", detail: "The target resource does not exist." },
  { code: 405, phrase: "Method Not Allowed", detail: "The method is not supported for this resource." },
  { code: 409, phrase: "Conflict", detail: "The request conflicts with the current state." },
  { code: 410, phrase: "Gone", detail: "The resource is no longer available." },
  { code: 415, phrase: "Unsupported Media Type", detail: "The payload format is not supported." },
  { code: 422, phrase: "Unprocessable Entity", detail: "The request was understood but cannot be processed." },
  { code: 429, phrase: "Too Many Requests", detail: "The client has sent too many requests." },
  { code: 500, phrase: "Internal Server Error", detail: "The server encountered an unexpected condition." },
  { code: 502, phrase: "Bad Gateway", detail: "An upstream server returned an invalid response." },
  { code: 503, phrase: "Service Unavailable", detail: "The server is temporarily unable to handle the request." },
  { code: 504, phrase: "Gateway Timeout", detail: "An upstream server did not respond in time." },
];

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function relativeLuminance(hex: string): number {
  const n = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(n)) throw new Error("Invalid value. Use a 6-digit hex color.");
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = toLin(parseInt(n.slice(0, 2), 16));
  const g = toLin(parseInt(n.slice(2, 4), 16));
  const b = toLin(parseInt(n.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export function parseUserAgent(ua: string): Record<string, string> {
  const result: Record<string, string> = { raw: ua };
  const os =
    /Windows NT [\d.]+/.exec(ua)?.[0] ??
    /Mac OS X [\d._]+/.exec(ua)?.[0] ??
    /Android [\d.]+/.exec(ua)?.[0] ??
    (/iPhone|iPad/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "Unknown");
  result.os = os.replaceAll("_", ".");
  const browser =
    /Edg\/([\d.]+)/.exec(ua)?.[0].replace("Edg/", "Edge ") ??
    /Chrome\/([\d.]+)/.exec(ua)?.[0].replace("Chrome/", "Chrome ") ??
    /Firefox\/([\d.]+)/.exec(ua)?.[0].replace("Firefox/", "Firefox ") ??
    /Version\/([\d.]+).*Safari/.exec(ua)?.[1]
      ? `Safari ${/Version\/([\d.]+)/.exec(ua)?.[1]}`
      : "Unknown";
  result.browser = browser;
  result.engine = /Gecko\//.test(ua) && !/like Gecko/.test(ua) ? "Gecko" : /AppleWebKit\//.test(ua) ? "WebKit" : "Unknown";
  result.mobile = /Mobile|Android|iPhone/.test(ua) ? "Yes" : "No";
  return result;
}

const SIGNATURES: Array<{ name: string; bytes: number[] }> = [
  { name: "PNG", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { name: "JPEG", bytes: [0xff, 0xd8, 0xff] },
  { name: "GIF87a", bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] },
  { name: "GIF89a", bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] },
  { name: "PDF", bytes: [0x25, 0x50, 0x44, 0x46] },
  { name: "ZIP", bytes: [0x50, 0x4b, 0x03, 0x04] },
  { name: "WEBP", bytes: [0x52, 0x49, 0x46, 0x46] },
];

export function matchSignature(bytes: Uint8Array): string {
  for (const sig of SIGNATURES) {
    if (sig.bytes.every((b, i) => bytes[i] === b)) {
      if (sig.name === "WEBP" && bytes.length >= 12) {
        const tag = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
        if (tag !== "WEBP") continue;
      }
      return sig.name;
    }
  }
  return "Unknown";
}

export function simpleMarkdown(src: string): string {
  const escaped = src
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const lines = escaped.split("\n");
  const html: string[] = [];
  let inList = false;
  for (const line of lines) {
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMd(heading[2])}</h${level}>`);
      continue;
    }
    const item = /^[-*]\s+(.+)$/.exec(line);
    if (item) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMd(item[1])}</li>`);
      continue;
    }
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    if (!line.trim()) html.push("");
    else html.push(`<p>${inlineMd(line)}</p>`);
  }
  if (inList) html.push("</ul>");
  return html.join("\n");
}

function inlineMd(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" rel="nofollow noopener">$1</a>');
}

export const ASCII_FONT: Record<string, string[]> = {
  A: ["  A  ", " A A ", "AAAAA", "A   A", "A   A"],
  B: ["BBBB ", "B   B", "BBBB ", "B   B", "BBBB "],
  C: [" CCC ", "C   C", "C    ", "C   C", " CCC "],
  D: ["DDDD ", "D   D", "D   D", "D   D", "DDDD "],
  E: ["EEEEE", "E    ", "EEE  ", "E    ", "EEEEE"],
  F: ["FFFFF", "F    ", "FFF  ", "F    ", "F    "],
  G: [" GGG ", "G    ", "G  GG", "G   G", " GGG "],
  H: ["H   H", "H   H", "HHHHH", "H   H", "H   H"],
  I: ["IIIII", "  I  ", "  I  ", "  I  ", "IIIII"],
  J: ["JJJJJ", "   J ", "   J ", "J  J ", " JJ  "],
  K: ["K   K", "K  K ", "KKK  ", "K  K ", "K   K"],
  L: ["L    ", "L    ", "L    ", "L    ", "LLLLL"],
  M: ["M   M", "MM MM", "M M M", "M   M", "M   M"],
  N: ["N   N", "NN  N", "N N N", "N  NN", "N   N"],
  O: [" OOO ", "O   O", "O   O", "O   O", " OOO "],
  P: ["PPPP ", "P   P", "PPPP ", "P    ", "P    "],
  Q: [" QQQ ", "Q   Q", "Q Q Q", "Q  Q ", " QQ Q"],
  R: ["RRRR ", "R   R", "RRRR ", "R  R ", "R   R"],
  S: [" SSS ", "S    ", " SSS ", "    S", " SSS "],
  T: ["TTTTT", "  T  ", "  T  ", "  T  ", "  T  "],
  U: ["U   U", "U   U", "U   U", "U   U", " UUU "],
  V: ["V   V", "V   V", "V   V", " V V ", "  V  "],
  W: ["W   W", "W   W", "W W W", "WW WW", "W   W"],
  X: ["X   X", " X X ", "  X  ", " X X ", "X   X"],
  Y: ["Y   Y", " Y Y ", "  Y  ", "  Y  ", "  Y  "],
  Z: ["ZZZZZ", "   Z ", "  Z  ", " Z   ", "ZZZZZ"],
  " ": ["     ", "     ", "     ", "     ", "     "],
  "0": [" 000 ", "0   0", "0   0", "0   0", " 000 "],
  "1": ["  1  ", " 11  ", "  1  ", "  1  ", " 111 "],
  "2": [" 222 ", "2   2", "  2  ", " 2   ", "22222"],
  "3": [" 333 ", "    3", "  33 ", "    3", " 333 "],
  "4": ["4  4 ", "4  4 ", "44444", "   4 ", "   4 "],
  "5": ["55555", "5    ", "5555 ", "    5", "5555 "],
};

export function textToAsciiArt(text: string): string {
  const chars = text.toUpperCase().split("");
  const rows = ["", "", "", "", ""];
  for (const ch of chars) {
    const glyph = ASCII_FONT[ch] ?? ["?????", "?????", "?????", "?????", "?????"];
    for (let i = 0; i < 5; i += 1) rows[i] += `${glyph[i]}  `;
  }
  return rows.join("\n");
}
