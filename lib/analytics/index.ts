import { hasConsent, shouldShowConsentUi } from "@/lib/consent";

export type AnalyticsEventName =
  | "tool_opened"
  | "tool_completed"
  | "tool_error"
  | "search_used"
  | "category_opened"
  | "tool_suggestion_submitted"
  | "problem_reported"
  | "cta_clicked"
  | "related_tool_clicked";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export interface AnalyticsProvider {
  track: (event: AnalyticsEventName, payload?: AnalyticsPayload) => void;
  pageView?: (path: string) => void;
}

const providers: AnalyticsProvider[] = [];

function analyticsAllowed(): boolean {
  if (!shouldShowConsentUi()) return true;
  return hasConsent("analytics");
}

export function registerAnalyticsProvider(provider: AnalyticsProvider): void {
  providers.push(provider);
}

export function trackEvent(
  event: AnalyticsEventName,
  payload?: AnalyticsPayload,
): void {
  if (typeof window === "undefined") return;
  if (!analyticsAllowed()) return;

  for (const provider of providers) {
    try {
      provider.track(event, payload);
    } catch {
      // Analytics must never break the product UI.
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload ?? {});
  }
}

export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;
  if (!analyticsAllowed()) return;

  for (const provider of providers) {
    try {
      provider.pageView?.(path);
    } catch {
      // no-op
    }
  }
}
