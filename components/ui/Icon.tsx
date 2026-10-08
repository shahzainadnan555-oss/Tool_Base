import { cn } from "@/lib/utils/cn";

interface IconProps {
  name: string;
  className?: string;
  title?: string;
}

const paths: Record<string, React.ReactNode> = {
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m21 15-4.5-4.5L9 18" />
    </>
  ),
  "image-convert": (
    <>
      <rect x="3" y="4" width="8" height="8" rx="1.5" />
      <rect x="13" y="12" width="8" height="8" rx="1.5" />
      <path d="M14 7h3v3M10 17H7v-3" />
    </>
  ),
  pdf: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  audio: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3z" />
    </>
  ),
  text: (
    <>
      <path d="M4 7V5h16v2M9 19h6M12 5v14" />
    </>
  ),
  code: (
    <>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.5 3.1 7.7 7 9 3.9-1.3 7-4.5 7-9V6z" />
      <path d="m9.5 12 1.8 1.8 3.7-3.8" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0" />
    </>
  ),
  compress: (
    <>
      <path d="M8 4H5v3M16 4h3v3M8 20H5v-3M16 20h3v-3M9 12h6M12 9v6" />
    </>
  ),
  resize: (
    <>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-8 8M3 21l8-8" />
    </>
  ),
  qr: (
    <>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <path d="M14 14h2v2h-2zm4 0h2v6h-6v-2h4z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4.5 4.5L19 7" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  chevron: (
    <>
      <path d="m8 10 4 4 4-4" />
    </>
  ),
  home: (
    <>
      <path d="m4 11 8-7 8 7" />
      <path d="M6 10v9h12v-9" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  moon: (
    <>
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
};

export const ICON_CATALOG: Array<{ name: string; category: string; label: string }> = [
  { name: "image", category: "Media", label: "Image" },
  { name: "image-convert", category: "Media", label: "Convert" },
  { name: "pdf", category: "Documents", label: "PDF" },
  { name: "audio", category: "Media", label: "Audio" },
  { name: "video", category: "Media", label: "Video" },
  { name: "text", category: "Text", label: "Text" },
  { name: "code", category: "Developer", label: "Code" },
  { name: "shield", category: "Security", label: "Shield" },
  { name: "calculator", category: "Math", label: "Calculator" },
  { name: "compress", category: "Media", label: "Compress" },
  { name: "resize", category: "Media", label: "Resize" },
  { name: "qr", category: "Utilities", label: "QR" },
  { name: "search", category: "Interface", label: "Search" },
  { name: "check", category: "Interface", label: "Check" },
  { name: "arrow", category: "Interface", label: "Arrow" },
  { name: "close", category: "Interface", label: "Close" },
  { name: "menu", category: "Interface", label: "Menu" },
  { name: "chevron", category: "Interface", label: "Chevron" },
  { name: "home", category: "Interface", label: "Home" },
  { name: "sun", category: "Interface", label: "Sun" },
  { name: "moon", category: "Interface", label: "Moon" },
  { name: "monitor", category: "Interface", label: "System" },
];

export function iconSvgMarkup(name: string): string {
  const node = paths[name] ?? paths.image;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${flattenSvg(node)}</svg>`;
}

function flattenSvg(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenSvg).join("");
  if (typeof node === "object" && "props" in node) {
    const el = node as { type: unknown; props: Record<string, unknown> };
    const { children, ...rest } = el.props;
    const attrs = Object.entries(rest)
      .map(([key, value]) => {
        const attr = key === "strokeWidth" ? "stroke-width" : key;
        return `${attr}="${String(value)}"`;
      })
      .join(" ");
    const tag = typeof el.type === "string" ? el.type : "g";
    const child = flattenSvg(children as React.ReactNode);
    return child ? `<${tag} ${attrs}>${child}</${tag}>` : `<${tag} ${attrs} />`;
  }
  return "";
}

export function Icon({ name, className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {paths[name] ?? paths.image}
    </svg>
  );
}
