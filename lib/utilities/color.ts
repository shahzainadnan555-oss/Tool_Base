export function hexToRgb(input: string): string {
  let hex = input.trim().replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error("Enter a HEX color such as #155EEF.");
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(input: string): string {
  const match = input.trim().match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/i);
  const parts = match
    ? [match[1], match[2], match[3]]
    : input.split(/[,\s]+/).filter(Boolean);
  if (parts.length < 3) throw new Error("Enter RGB values such as 21, 94, 239 or rgb(21, 94, 239).");
  const nums = parts.slice(0, 3).map((part) => {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) {
      throw new Error("Each RGB channel must be an integer from 0 to 255.");
    }
    return n;
  });
  return `#${nums.map((n) => n.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}
