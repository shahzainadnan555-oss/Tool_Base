import QRCode from "qrcode";

function luminance(hex: string): number {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return 0;
  const r = Number.parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = Number.parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = Number.parseInt(cleaned.slice(4, 6), 16) / 255;
  const toLin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

export function qrContrastWarning(dark: string, light: string): string | undefined {
  const ratio =
    (Math.max(luminance(dark), luminance(light)) + 0.05) /
    (Math.min(luminance(dark), luminance(light)) + 0.05);
  if (ratio < 3) {
    return "Foreground and background colors have low contrast and may be hard to scan.";
  }
  return undefined;
}

export async function generateQr(options: {
  text: string;
  size?: number;
  errorCorrection?: "L" | "M" | "Q" | "H";
  margin?: number;
  dark?: string;
  light?: string;
}): Promise<{ dataUrl: string; svg: string; warning?: string }> {
  const text = options.text;
  if (!text.trim()) throw new Error("Please enter content for the QR code.");
  if (text.length > 2000) {
    throw new Error("QR payload is too long (max 2,000 characters).");
  }
  const dark = options.dark || "#0f172a";
  const light = options.light || "#ffffff";
  const warning = qrContrastWarning(dark, light);
  const size = Math.max(128, Math.min(1024, options.size || 256));
  const margin = Math.max(0, Math.min(8, options.margin ?? 2));
  const errorCorrectionLevel = options.errorCorrection || "M";

  const dataUrl = await QRCode.toDataURL(text, {
    width: size,
    margin,
    errorCorrectionLevel,
    color: { dark, light },
  });
  const svg = await QRCode.toString(text, {
    type: "svg",
    width: size,
    margin,
    errorCorrectionLevel,
    color: { dark, light },
  });
  return { dataUrl, svg, warning };
}
