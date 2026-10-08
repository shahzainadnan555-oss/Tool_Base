export function downloadTextFile(content: string, fileName: string) {
  const safeName = fileName.replace(/(\.[a-z0-9]+)\1$/i, "$1");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
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

export function parseJsonError(err: unknown): {
  message: string;
  position?: number;
  line?: number;
  column?: number;
} {
  const message = err instanceof Error ? err.message : "Invalid JSON";
  const posMatch = message.match(/position\s+(\d+)/i);
  const position = posMatch ? Number(posMatch[1]) : undefined;
  return { message, position };
}

export function locateLineColumn(text: string, position?: number) {
  if (position == null || position < 0) return {};
  const slice = text.slice(0, Math.min(position, text.length));
  const lines = slice.split(/\r\n|\n|\r/);
  return {
    line: lines.length,
    column: (lines[lines.length - 1]?.length ?? 0) + 1,
  };
}

export function indentUnit(style: "2" | "4" | "tab" = "2"): string {
  if (style === "4") return "    ";
  if (style === "tab") return "\t";
  return "  ";
}

export function emptyInputError(label = "input"): string {
  return `Please enter ${label} to continue.`;
}
