/**
 * Consent foundation for future non-essential services.
 * Do not render a cookie banner until analytics/marketing cookies actually require it.
 */

export type ConsentCategory = "essential" | "analytics" | "marketing";

export interface ConsentState {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt?: string;
}

export const defaultConsentState: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
};

let consentState: ConsentState = { ...defaultConsentState };

export function getConsentState(): ConsentState {
  return consentState;
}

export function setConsentState(next: Partial<Omit<ConsentState, "essential">>): ConsentState {
  consentState = {
    ...consentState,
    ...next,
    essential: true,
    decidedAt: new Date().toISOString(),
  };
  return consentState;
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === "essential") return true;
  return Boolean(consentState[category]);
}
