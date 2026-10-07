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

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      className={
        className ??
        "tm-icon-btn border border-tm-border bg-tm-elevated text-tm-text hover:border-tm-accent hover:text-tm-accent"
      }
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
      onClick={() => {
        toggleTheme();
        window.dispatchEvent(new Event(THEME_EVENT));
      }}
    >
      <Icon name="moon" className="h-5 w-5 dark:hidden" />
      <Icon name="sun" className="hidden h-5 w-5 dark:inline" />
    </button>
  );
}
