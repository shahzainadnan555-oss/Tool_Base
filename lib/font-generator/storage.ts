const FAVORITES_KEY = "tb-font-gen-favorites";
const RECENT_KEY = "tb-font-gen-recent";
const MAX_RECENT = 10;

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeFavorites(ids: string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // Private browsing / quota.
  }
}

export type RecentCopy = {
  styleId: string;
  styleName: string;
  text: string;
  at: number;
};

export function readRecent(): RecentCopy[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is RecentCopy =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as RecentCopy).styleId === "string" &&
          typeof (item as RecentCopy).text === "string",
      )
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function pushRecent(entry: Omit<RecentCopy, "at">): RecentCopy[] {
  const next: RecentCopy[] = [
    { ...entry, at: Date.now() },
    ...readRecent().filter(
      (item) => !(item.styleId === entry.styleId && item.text === entry.text),
    ),
  ].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearRecent() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    // ignore
  }
}
