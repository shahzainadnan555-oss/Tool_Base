/**
 * Consent foundation for future non-essential services.
 * Do not render a cookie banner until analytics/advertising cookies actually require it.
 */

export type ConsentCategory = "essential" | "analytics" | "advertising";

export interface ConsentState {
  essential: true;
  analytics: boolean;
  advertising: boolean;
  decidedAt?: string;
}

export const CONSENT_STORAGE_KEY = "tb_consent_v1";

export const defaultConsentState: ConsentState = {
  essential: true,
  analytics: false,
  advertising: false,
};

let consentState: ConsentState = { ...defaultConsentState };
let hydrated = false;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function hydrateConsentFromStorage(): ConsentState {
  if (hydrated || !canUseStorage()) return consentState;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return consentState;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    consentState = {
      essential: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : undefined,
    };
  } catch {
    consentState = { ...defaultConsentState };
  }
  return consentState;
}

export function getConsentState(): ConsentState {
  if (!hydrated) hydrateConsentFromStorage();
  return consentState;
}

export function setConsentState(
  next: Partial<Omit<ConsentState, "essential">>,
): ConsentState {
  consentState = {
    ...consentState,
    ...next,
    essential: true,
    decidedAt: new Date().toISOString(),
  };
  if (canUseStorage()) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState));
    } catch {
      // Storage may be unavailable; keep in-memory state only.
    }
  }
  return consentState;
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === "essential") return true;
  const state = getConsentState();
  return Boolean(state[category]);
}

export function hasDecidedConsent(): boolean {
  return Boolean(getConsentState().decidedAt);
}

/**
 * Only enable a public consent UI when a real non-essential service needs it.
 * Controlled by env so the site never pretends a CMP/banner is active by default.
 */
export function shouldShowConsentUi(): boolean {
  return process.env.NEXT_PUBLIC_CONSENT_UI_ENABLED === "true";
}
