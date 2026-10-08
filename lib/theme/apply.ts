import { THEME_STORAGE_KEY } from "@/lib/theme/script";

export type Theme = "light" | "dark";

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    // Storage can be unavailable in private browsing.
  }
  return null;
}

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getResolvedTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

function syncColorSchemeMeta(theme: Theme) {
  if (typeof document === "undefined") return;
  let meta = document.querySelector('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "color-scheme");
    document.head.appendChild(meta);
  }
  // A single value (not "light dark") stops iOS from auto-inverting the page.
  meta.setAttribute("content", theme);
}

/**
 * Apply the user's explicit theme.
 * `only light` / `only dark` prevents Safari from re-darkening Light Mode
 * when the device itself is in Dark Mode.
 */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  root.setAttribute("data-theme", theme);
  root.style.setProperty("color-scheme", theme);
  if (document.body) {
    document.body.style.setProperty("color-scheme", theme);
  }
  syncColorSchemeMeta(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";
  applyTheme(next);
  return next;
}
