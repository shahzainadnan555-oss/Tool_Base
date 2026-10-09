import { THEME_STORAGE_KEY } from "@/lib/theme/script";

/** Matches Navbar / MobileNav: mobile layout below md (768px). */
export const MOBILE_VIEWPORT_MQ = "(max-width: 767px)";

/** User-selected preference (persisted). */
export type ThemePreference = "light" | "dark" | "system";

/** Resolved appearance applied to the DOM. */
export type ResolvedTheme = "light" | "dark";

export type Theme = ResolvedTheme;

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_VIEWPORT_MQ).matches;
}

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

/**
 * Effective appearance for the current viewport.
 * Mobile is always dark; desktop follows the saved preference.
 * Does not mutate localStorage.
 */
export function getEffectiveTheme(): ResolvedTheme {
  if (isMobileViewport()) return "dark";
  return resolveTheme(getStoredPreference());
}

/** Preference-based resolved theme (ignores mobile force). */
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

/** Apply DOM appearance only — never writes localStorage. */
export function applyAppearance(
  resolved: ResolvedTheme,
  preference: ThemePreference = getStoredPreference(),
) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-preference", preference);
  root.setAttribute("data-theme-mobile-forced", isMobileViewport() ? "true" : "false");
  root.style.setProperty("color-scheme", resolved);
  if (document.body) {
    document.body.style.setProperty("color-scheme", resolved);
  }
  syncColorSchemeMeta(resolved);
}

/**
 * Re-apply effective theme from the saved preference + current viewport.
 * Safe on mobile: forces dark without overwriting the stored preference.
 */
export function syncEffectiveTheme() {
  applyAppearance(getEffectiveTheme(), getStoredPreference());
}

/**
 * Persist a user preference, then apply the effective appearance for this viewport.
 * Explicit light/dark always win over prefers-color-scheme on desktop.
 * On mobile, DOM stays dark even if preference is light.
 */
export function applyPreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be unavailable in private browsing.
  }
  applyAppearance(
    isMobileViewport() ? "dark" : resolveTheme(preference),
    preference,
  );
}

/** Apply a resolved theme while keeping an explicit light/dark preference. */
export function applyTheme(theme: ResolvedTheme) {
  applyPreference(theme);
}

/**
 * Explicit Light ↔ Dark toggle based on the saved preference resolution
 * (not the mobile-forced appearance), so desktop preference stays coherent.
 */
export function toggleTheme(): ResolvedTheme {
  const next: ResolvedTheme =
    resolveTheme(getStoredPreference()) === "dark" ? "light" : "dark";
  applyPreference(next);
  return next;
}
