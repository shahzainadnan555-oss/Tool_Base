"use client";

import { hasConsent, shouldShowConsentUi } from "@/lib/consent";
import { getAdSenseClientId } from "@/lib/ads/config";

interface AdSlotProps {
  /** Reserved placement label for future layout mapping — never a fake ad. */
  slot?: string;
  className?: string;
}

/**
 * Integration-ready ad placeholder.
 * Renders nothing unless a real AdSense client ID is configured.
 * Never displays fake advertisements or deceptive buttons.
 */
export function AdSlot({ className }: AdSlotProps) {
  const client = getAdSenseClientId();
  if (!client) return null;
  if (shouldShowConsentUi() && !hasConsent("advertising")) return null;

  // Real ad markup should be wired here only after AdSense is actually connected.
  return (
    <aside
      className={className}
      aria-label="Advertisement"
      data-ad-ready="true"
      data-ad-client={client}
    />
  );
}