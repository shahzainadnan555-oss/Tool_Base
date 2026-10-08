"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  applyPreference,
  getResolvedTheme,
  getStoredPreference,
  toggleTheme,
  type ThemePreference,
} from "@/lib/theme/apply";

const THEME_EVENT = "tb-theme-change";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (getStoredPreference() === "system") {
      applyPreference("system");
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== "tb-theme") return;
    applyPreference(getStoredPreference());
    window.dispatchEvent(new Event(THEME_EVENT));
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

function getPreferenceSnapshot(): ThemePreference {
  return getStoredPreference();
}

function getResolvedSnapshot() {
  return getResolvedTheme();
}

function getServerPreference(): ThemePreference {
  return "system";
}

function getServerResolved() {
  return "light" as const;
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
  // Primitive snapshots avoid object-identity infinite loops with useSyncExternalStore.
  const preference = useSyncExternalStore(
    subscribe,
    getPreferenceSnapshot,
    getServerPreference,
  );
  const resolved = useSyncExternalStore(
    subscribe,
    getResolvedSnapshot,
    getServerResolved,
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

  const nextLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className={className ?? "tm-theme-toggle tm-icon-btn tm-icon-btn-show"}
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
