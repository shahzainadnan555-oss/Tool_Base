/**
 * Advertising readiness helpers.
 * Do not invent publisher IDs. Ads render only when a real client ID is configured
 * and advertising consent has been granted (when consent UI is enabled).
 */

export function getAdSenseClientId(): string | undefined {
  const value = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!value) return undefined;
  if (!/^ca-pub-\d+$/.test(value)) return undefined;
  return value;
}

export function isAdvertisingConfigured(): boolean {
  return Boolean(getAdSenseClientId());
}
