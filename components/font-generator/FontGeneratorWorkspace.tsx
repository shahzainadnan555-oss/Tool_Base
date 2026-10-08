"use client";

import { useDeferredValue, useId, useMemo, useState, useSyncExternalStore } from "react";
import {
  FONT_STYLE_CATEGORY_LABELS,
  filterFontStyles,
  fontStyles,
  type FontStyleCategory,
  type FontStyleDefinition,
} from "@/lib/font-generator";
import {
  clearRecent,
  pushRecent,
  readFavorites,
  readRecent,
  writeFavorites,
  type RecentCopy,
} from "@/lib/font-generator/storage";

const STORAGE_EVENT = "tb-font-gen-storage";

function subscribeStorage(onStoreChange: () => void) {
  window.addEventListener(STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function emitStorage() {
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

type PreviewSize = "sm" | "md" | "lg";
type BrowseTab = "all" | "favorites" | "recent";

const CATEGORIES: Array<FontStyleCategory | "all"> = [
  "all",
  "bold",
  "italic",
  "cursive",
  "script",
  "sans",
  "monospace",
  "math",
  "bubble",
  "circle",
  "square",
  "smallcaps",
  "old-english",
  "fraktur",
  "underline",
  "strikethrough",
  "decorative",
  "symbols",
  "aesthetic",
  "upside-down",
  "mirror",
  "minimal",
  "special",
];

const PREVIEW_CLASS: Record<PreviewSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

const SAMPLE = "Hello World";
const MAX_LIVE_CHARS = 400;

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to legacy path.
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

function StyleCard({
  style,
  preview,
  previewSize,
  favorited,
  copied,
  onCopy,
  onToggleFavorite,
}: {
  style: FontStyleDefinition;
  preview: string;
  previewSize: PreviewSize;
  favorited: boolean;
  copied: boolean;
  onCopy: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="flex min-h-[7.5rem] flex-col rounded-2xl border border-tm-border bg-tm-elevated p-3.5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-tm-text">{style.name}</h3>
        <button
          type="button"
          className="tm-icon-btn shrink-0 border border-tm-border bg-tm-soft text-tm-text hover:border-tm-accent hover:text-tm-accent"
          aria-label={favorited ? `Remove ${style.name} from favorites` : `Favorite ${style.name}`}
          aria-pressed={favorited}
          onClick={onToggleFavorite}
        >
          <span aria-hidden="true" className="text-base leading-none">
            {favorited ? "★" : "☆"}
          </span>
        </button>
      </div>
      <button
        type="button"
        className={`mt-3 min-h-12 flex-1 break-words rounded-xl bg-tm-soft px-3 py-2 text-left font-medium text-tm-text ${PREVIEW_CLASS[previewSize]}`}
        onClick={onCopy}
        aria-label={`Copy ${style.name} style`}
      >
        <span className="line-clamp-4 whitespace-pre-wrap">{preview || "—"}</span>
      </button>
      <button
        type="button"
        className="tm-btn tm-btn-secondary mt-3 min-h-11 w-full text-sm"
        onClick={onCopy}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </article>
  );
}

export function FontGeneratorWorkspace({ convertHeading }: { convertHeading?: string }) {
  const inputId = useId();
  const searchId = useId();
  const [text, setText] = useState(SAMPLE);
  const [category, setCategory] = useState<FontStyleCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [previewSize, setPreviewSize] = useState<PreviewSize>("md");
  const [tab, setTab] = useState<BrowseTab>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  const favorites = useSyncExternalStore(
    subscribeStorage,
    readFavorites,
    () => [] as string[],
  );
  const recent = useSyncExternalStore(
    subscribeStorage,
    readRecent,
    () => [] as RecentCopy[],
  );

  const deferredText = useDeferredValue(text);
  const deferredQuery = useDeferredValue(query);
  const liveText =
    deferredText.length > MAX_LIVE_CHARS
      ? deferredText.slice(0, MAX_LIVE_CHARS)
      : deferredText;
  const truncated = deferredText.length > MAX_LIVE_CHARS;

  const filtered = useMemo(
    () => filterFontStyles({ category, query: deferredQuery }),
    [category, deferredQuery],
  );

  const visibleStyles = useMemo(() => {
    if (tab === "favorites") {
      return fontStyles.filter((style) => favorites.includes(style.id));
    }
    if (tab === "recent") {
      const ids = [...new Set(recent.map((item) => item.styleId))];
      return ids
        .map((id) => fontStyles.find((style) => style.id === id))
        .filter((style): style is FontStyleDefinition => Boolean(style));
    }
    return filtered;
  }, [tab, favorites, recent, filtered]);

  const previews = useMemo(() => {
    const map = new Map<string, string>();
    if (!liveText.trim()) return map;
    for (const style of visibleStyles) {
      map.set(style.id, style.transform(liveText));
    }
    return map;
  }, [liveText, visibleStyles]);

  const handleCopy = async (style: FontStyleDefinition, value: string) => {
    if (!value) return;
    setCopyError(null);
    const ok = await copyToClipboard(value);
    if (!ok) {
      setCopyError("Could not copy automatically. Select the preview text and copy manually.");
      return;
    }
    setCopiedId(style.id);
    pushRecent({
      styleId: style.id,
      styleName: style.name,
      text: value.slice(0, 240),
    });
    emitStorage();
    window.setTimeout(() => {
      setCopiedId((current) => (current === style.id ? null : current));
    }, 1400);
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    writeFavorites(next);
    emitStorage();
  };

  const randomStyle = () => {
    const pool = filtered.length ? filtered : fontStyles;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!pick) return;
    const value = pick.transform(text || SAMPLE);
    void handleCopy(pick, value);
    const el = document.getElementById(`font-style-${pick.id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section className="space-y-6">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      <div className="rounded-2xl border border-tm-border bg-tm-elevated p-4 sm:p-5">
        <label htmlFor={inputId} className="mb-2 block text-sm font-bold text-tm-text">
          Your text
        </label>
        <textarea
          id={inputId}
          className="tm-input min-h-28 w-full resize-y text-base"
          placeholder="Enter your text here..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          spellCheck
          autoComplete="off"
          autoCorrect="off"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="tm-btn tm-btn-secondary min-h-11 text-sm"
            onClick={() => setText("")}
          >
            Clear text
          </button>
          <button
            type="button"
            className="tm-btn tm-btn-secondary min-h-11 text-sm"
            onClick={() => setText(SAMPLE)}
          >
            Sample text
          </button>
          <button type="button" className="tm-btn tm-btn-secondary min-h-11 text-sm" onClick={randomStyle}>
            Random style
          </button>
          <button
            type="button"
            className="tm-btn tm-btn-secondary min-h-11 text-sm"
            onClick={() => {
              setText(SAMPLE);
              setCategory("all");
              setQuery("");
              setTab("all");
              setPreviewSize("md");
              setCopyError(null);
            }}
          >
            Reset
          </button>
        </div>
        {truncated ? (
          <p className="mt-3 text-xs font-medium text-tm-muted">
            Previewing the first {MAX_LIVE_CHARS} characters for speed. Copy still uses the full
            transformed text for each style when you tap Copy.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold text-tm-text">Preview size</p>
          <div className="inline-flex rounded-xl border border-tm-border bg-tm-soft p-1" role="group" aria-label="Preview size">
            {(
              [
                ["sm", "Small"],
                ["md", "Medium"],
                ["lg", "Large"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`min-h-10 rounded-lg px-3 text-sm font-bold ${
                  previewSize === value
                    ? "bg-tm-elevated text-tm-accent shadow-sm"
                    : "text-tm-muted hover:text-tm-text"
                }`}
                aria-pressed={previewSize === value}
                onClick={() => setPreviewSize(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1 sm:max-w-xs">
          <label htmlFor={searchId} className="mb-2 block text-sm font-bold text-tm-text">
            Search styles
          </label>
          <input
            id={searchId}
            className="tm-input w-full"
            placeholder="bold, circle, script…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Style collections"
      >
        {(
          [
            ["all", "All styles"],
            ["favorites", `Favorites (${favorites.length})`],
            ["recent", "Recent"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={`shrink-0 rounded-xl border px-3 py-2.5 text-sm font-bold ${
              tab === value
                ? "border-tm-accent bg-tm-surface-2 text-tm-accent"
                : "border-tm-border bg-tm-elevated text-tm-text"
            }`}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
        {tab === "recent" && recent.length ? (
          <button
            type="button"
            className="shrink-0 rounded-xl border border-tm-border bg-tm-soft px-3 py-2.5 text-sm font-bold text-tm-muted"
            onClick={() => {
              clearRecent();
              emitStorage();
            }}
          >
            Clear recent
          </button>
        ) : null}
      </div>

      {tab === "all" ? (
        <div
          className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="toolbar"
          aria-label="Style categories"
        >
          {CATEGORIES.map((key) => (
            <button
              key={key}
              type="button"
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold sm:text-sm ${
                category === key
                  ? "border-tm-accent bg-tm-surface-2 text-tm-accent"
                  : "border-tm-border bg-tm-elevated text-tm-text"
              }`}
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {FONT_STYLE_CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      ) : null}

      {copyError ? (
        <p className="tm-notice tm-notice-error" role="alert">
          {copyError}
        </p>
      ) : null}

      <p className="text-xs font-medium text-tm-muted">
        Accessibility note: some stylized Unicode characters may be announced differently by screen
        readers than ordinary letters. Prefer plain text when clarity matters.
      </p>

      {!text.trim() ? (
        <div className="rounded-2xl border border-dashed border-tm-border bg-tm-soft px-4 py-10 text-center">
          <p className="text-base font-bold text-tm-text">Enter text above to generate stylish text.</p>
          <p className="mt-2 text-sm font-medium text-tm-muted">
            Previews update as you type. Tap any style to copy the Unicode output.
          </p>
        </div>
      ) : visibleStyles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-tm-border bg-tm-soft px-4 py-10 text-center">
          <p className="text-base font-bold text-tm-text">
            {tab === "favorites"
              ? "No favorites yet. Tap the star on a style to save it here."
              : tab === "recent"
                ? "No recently copied styles yet."
                : "No styles match that search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleStyles.map((style) => (
            <div key={style.id} id={`font-style-${style.id}`}>
              <StyleCard
                style={style}
                preview={previews.get(style.id) ?? ""}
                previewSize={previewSize}
                favorited={favorites.includes(style.id)}
                copied={copiedId === style.id}
                onCopy={() => void handleCopy(style, style.transform(text))}
                onToggleFavorite={() => toggleFavorite(style.id)}
              />
            </div>
          ))}
        </div>
      )}

      <p className="text-sm font-medium text-tm-muted">
        Showing {visibleStyles.length} style{visibleStyles.length === 1 ? "" : "s"}
        {tab === "all" ? ` · ${fontStyles.length} total` : ""}. Output is Unicode text you can paste
        into apps — not a downloadable font file.
      </p>
    </section>
  );
}
