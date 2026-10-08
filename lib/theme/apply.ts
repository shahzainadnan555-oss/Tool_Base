import { THEME_STORAGE_KEY } from "@/lib/theme/script";

/** User-selected preference (persisted). */
export type ThemePreference = "light" | "dark" | "system";

/** Resolved appearance applied to the DOM. */
export type ResolvedTheme = "light" | "dark";

export type Theme = ResolvedTheme;

export function getStoredPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system") return value;
    // Legacy: missing key means follow system.
    if (value == null) return "system";
  } catch {
    // Storage can be unavailable in private browsing.
  }
  return "system";
}

/** @deprecated Use getStoredPreference — kept for callers that treated null as system. */
export function getStoredTheme(): ThemePreference | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system") return value;
  } catch {
    // ignore
  }
  return null;
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") return getSystemTheme();
  return preference;
}

export function getResolvedTheme(): ResolvedTheme {
  return resolveTheme(getStoredPreference());
}

function syncColorSchemeMeta(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  let meta = document.querySelector('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "color-scheme");
    document.head.appendChild(meta);
  }
  // Single value prevents iOS from auto-inverting when preference is forced.
  meta.setAttribute("content", resolved);
}

/**
 * Apply a user preference and the resulting appearance.
 * Explicit light/dark always win over prefers-color-scheme.
 */
export function applyPreference(preference: ThemePreference) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(preference);
  const root = document.documentElement;

  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-preference", preference);
  root.style.setProperty("color-scheme", resolved);
  if (document.body) {
    document.body.style.setProperty("color-scheme", resolved);
  }
  syncColorSchemeMeta(resolved);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

/** Apply a resolved theme while keeping an explicit light/dark preference. */
export function applyTheme(theme: ResolvedTheme) {
  applyPreference(theme);
}

/**
 * Explicit Light ↔ Dark toggle based on the currently resolved appearance.
 * Always persists an explicit preference (never "system"), so a tap always
 * wins over prefers-color-scheme.
 */
export function toggleTheme(): ResolvedTheme {
  const next: ResolvedTheme =
    resolveTheme(getStoredPreference()) === "dark" ? "light" : "dark";
  applyPreference(next);
  return next;
}
