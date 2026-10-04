"use client";

import { Icon } from "@/components/ui/Icon";
import { THEME_STORAGE_KEY } from "@/lib/theme/script";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-tm-border text-tm-text transition-colors hover:bg-tm-soft hover:text-tm-accent"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() => {
        const isDark = document.documentElement.classList.contains("dark");
        applyTheme(isDark ? "light" : "dark");
      }}
    >
      <Icon name="moon" className="h-5 w-5 dark:hidden" />
      <Icon name="sun" className="hidden h-5 w-5 dark:inline" />
    </button>
  );
}
