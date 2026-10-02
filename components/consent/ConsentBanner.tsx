/**
 * Optional consent banner scaffold.
 * Do not mount this until non-essential cookies/services actually require consent.
 */
"use client";

import { setConsentState } from "@/lib/consent";

interface ConsentBannerProps {
  onDecision?: () => void;
}

export function ConsentBanner({ onDecision }: ConsentBannerProps) {
  return (
    <div
      role="dialog"
      aria-label="Privacy preferences"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-tm-border bg-white p-4 shadow-[var(--tm-shadow-lg)]"
    >
      <div className="tm-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm font-medium text-tm-muted">
          ToolMyra can store essential preferences required for the site to work. If
          analytics are enabled later, you can choose whether to allow them.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="tm-btn tm-btn-secondary"
            onClick={() => {
              setConsentState({ analytics: false, marketing: false });
              onDecision?.();
            }}
          >
            Essential only
          </button>
          <button
            type="button"
            className="tm-btn tm-btn-primary"
            onClick={() => {
              setConsentState({ analytics: true, marketing: false });
              onDecision?.();
            }}
          >
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  );
}
