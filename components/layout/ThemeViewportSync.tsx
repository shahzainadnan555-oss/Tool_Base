"use client";

import { useEffect } from "react";
import {
  MOBILE_VIEWPORT_MQ,
  syncEffectiveTheme,
} from "@/lib/theme/apply";

const THEME_EVENT = "tb-theme-change";

/**
 * Keeps DOM appearance in sync with viewport:
 * mobile → forced dark (preference untouched);
 * desktop → saved Light/Dark/System preference.
 */
export function ThemeViewportSync() {
  useEffect(() => {
    syncEffectiveTheme();
    window.dispatchEvent(new Event(THEME_EVENT));

    const mobileMq = window.matchMedia(MOBILE_VIEWPORT_MQ);
    const systemMq = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = () => {
      syncEffectiveTheme();
      window.dispatchEvent(new Event(THEME_EVENT));
    };

    mobileMq.addEventListener("change", onChange);
    systemMq.addEventListener("change", onChange);
    window.addEventListener("storage", onChange);

    return () => {
      mobileMq.removeEventListener("change", onChange);
      systemMq.removeEventListener("change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return null;
}
