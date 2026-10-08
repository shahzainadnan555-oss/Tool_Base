"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  applyTheme,
  getResolvedTheme,
  getStoredTheme,
  toggleTheme,
  type Theme,
} from "@/lib/theme/apply";

const THEME_EVENT = "tb-theme-change";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (!getStoredTheme()) {
      applyTheme(getResolvedTheme());
      window.dispatchEvent(new Event(THEME_EVENT));
    }
    onStoreChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== "tb-theme") return;
    applyTheme(getResolvedTheme());
    onStoreChange();
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onStoreChange);

  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function commitTheme(next: Theme) {
  applyTheme(next);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeToggle({
  className,
  variant = "icon",
}: {
  className?: string;
  /** icon = compact header control; switch = labeled Light/Dark control for menus */
  variant?: "icon" | "switch";
}) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  if (variant === "switch") {
    return (
      <div className={className} role="group" aria-label="Color theme">
        <p className="mb-2 text-xs font-bold tracking-wide text-tm-muted uppercase">
          Appearance
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
              !isDark
                ? "border-tm-accent bg-tm-surface-2 text-tm-accent"
                : "border-tm-border bg-tm-soft text-tm-text"
            }`}
            aria-pressed={!isDark}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              commitTheme("light");
            }}
          >
            <Icon name="sun" className="h-4 w-4" />
            Light
          </button>
          <button
            type="button"
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
              isDark
                ? "border-tm-accent bg-tm-surface-2 text-tm-accent"
                : "border-tm-border bg-tm-soft text-tm-text"
            }`}
            aria-pressed={isDark}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              commitTheme("dark");
            }}
          >
            <Icon name="moon" className="h-4 w-4" />
            Dark
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={
        className ??
        "tm-icon-btn tm-icon-btn-show border border-tm-border bg-tm-elevated text-tm-text hover:border-tm-accent hover:text-tm-accent"
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleTheme();
        window.dispatchEvent(new Event(THEME_EVENT));
      }}
    >
      {isDark ? (
        <Icon name="sun" className="h-5 w-5" />
      ) : (
        <Icon name="moon" className="h-5 w-5" />
      )}
    </button>
  );
}
