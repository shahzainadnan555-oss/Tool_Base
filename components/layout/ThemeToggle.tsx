"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  applyPreference,
  getResolvedTheme,
  getStoredPreference,
  toggleTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme/apply";

const THEME_EVENT = "tb-theme-change";

type ThemeSnapshot = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
};

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (getStoredPreference() === "system") {
      applyPreference("system");
      window.dispatchEvent(new Event(THEME_EVENT));
    }
    onStoreChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== "tb-theme") return;
    applyPreference(getStoredPreference());
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

function getSnapshot(): ThemeSnapshot {
  return {
    preference: getStoredPreference(),
    resolved: getResolvedTheme(),
  };
}

function getServerSnapshot(): ThemeSnapshot {
  return { preference: "system", resolved: "light" };
}

function commitPreference(next: ThemePreference) {
  applyPreference(next);
  window.dispatchEvent(new Event(THEME_EVENT));
}

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  icon: string;
}> = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

export function ThemeToggle({
  className,
  variant = "icon",
}: {
  className?: string;
  /** icon = header Light↔Dark; switch = Light/Dark/System for the mobile menu */
  variant?: "icon" | "switch";
}) {
  const { preference, resolved } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isDark = resolved === "dark";

  if (variant === "switch") {
    return (
      <div className={className} role="group" aria-label="Color theme">
        <p className="mb-2 text-xs font-bold tracking-wide text-tm-muted uppercase">
          Appearance
        </p>
        <div className="grid grid-cols-3 gap-2">
          {OPTIONS.map((option) => {
            const active = preference === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`inline-flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-bold transition-colors sm:text-sm ${
                  active
                    ? "border-tm-accent bg-tm-surface-2 text-tm-accent"
                    : "border-tm-border bg-tm-soft text-tm-text"
                }`}
                aria-pressed={active}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  commitPreference(option.value);
                }}
              >
                <Icon name={option.icon} className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs font-medium text-tm-muted">
          {preference === "system"
            ? `Following device · currently ${resolved}`
            : `Forced ${preference} mode`}
        </p>
      </div>
    );
  }

  // Header control: always Light ↔ Dark from the resolved appearance.
  // Icon shows the destination mode (moon = go dark, sun = go light).
  const nextLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className={
        className ??
        "tm-icon-btn tm-icon-btn-show min-h-11 min-w-11 border border-tm-border bg-tm-elevated text-tm-text hover:border-tm-accent hover:text-tm-accent"
      }
      aria-label={nextLabel}
      title={nextLabel}
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
