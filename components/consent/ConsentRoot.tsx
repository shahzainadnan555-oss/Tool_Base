"use client";

import { useState } from "react";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import {
  hasDecidedConsent,
  hydrateConsentFromStorage,
  shouldShowConsentUi,
} from "@/lib/consent";

function initialConsentVisible(): boolean {
  if (typeof window === "undefined") return false;
  if (!shouldShowConsentUi()) return false;
  hydrateConsentFromStorage();
  return !hasDecidedConsent();
}

/**
 * Mounts the consent banner only when explicitly enabled and the user has not decided yet.
 * Default production behavior: renders nothing.
 */
export function ConsentRoot() {
  const [visible, setVisible] = useState(initialConsentVisible);

  if (!visible) return null;
  return <ConsentBanner onDecision={() => setVisible(false)} />;
}
