import type { SpecializedCalcResult } from "./types";
import { formatMoney } from "./finance";

const HEIGHT_BASE: Record<string, number> = {
  small: 280,
  medium: 620,
  large: 1250,
  "very-large": 2400,
};

const HEIGHT_STUMP: Record<string, number> = {
  small: 90,
  medium: 160,
  large: 280,
  "very-large": 450,
};

const ACCESS: Record<string, number> = {
  easy: 1,
  moderate: 1.35,
  difficult: 1.85,
};

const CONDITION: Record<string, number> = {
  healthy: 1,
  dead: 1.12,
  hazardous: 1.4,
};

export function calculateTreeRemoval(input: {
  height: string;
  trees: string;
  access: string;
  condition: string;
  stump: boolean;
  cleanup: boolean;
  currency: string;
}): SpecializedCalcResult {
  const height = input.height;
  if (!(height in HEIGHT_BASE)) throw new Error("Select a tree height category.");
  const trees = Number(input.trees);
  if (!Number.isFinite(trees) || trees < 1 || trees > 50 || !Number.isInteger(trees)) {
    throw new Error("Enter a whole number of trees between 1 and 50.");
  }
  if (!(input.access in ACCESS)) throw new Error("Select accessibility.");
  if (!(input.condition in CONDITION)) throw new Error("Select tree condition.");

  const perTree =
    HEIGHT_BASE[height] * ACCESS[input.access] * CONDITION[input.condition];
  const removal = perTree * trees;
  const stump = input.stump ? HEIGHT_STUMP[height] * trees : 0;
  const cleanup = input.cleanup ? removal * 0.12 : 0;
  const typical = removal + stump + cleanup;
  const low = typical * 0.75;
  const high = typical * 1.4;
  const money = (n: number) => formatMoney(Math.round(n), input.currency);

  return {
    headline: `${money(low)} – ${money(high)}`,
    subhead: "Estimated range — not a contractor quote",
    primaryLabel: "Estimated range",
    primary: `${money(low)} – ${money(high)}`,
    breakdown: [
      { label: "Estimated low", value: money(low) },
      { label: "Estimated typical", value: money(typical) },
      { label: "Estimated high", value: money(high) },
      { label: "Removal subtotal", value: money(removal) },
      ...(input.stump ? [{ label: "Stump removal", value: money(stump) }] : []),
      ...(input.cleanup ? [{ label: "Debris cleanup", value: money(cleanup) }] : []),
    ],
    formula:
      "Typical estimate = base by height × accessibility factor × condition factor × tree count, plus optional stump and cleanup add-ons. Low = 75% of typical. High = 140% of typical.",
    notes: [
      "Assumptions are illustrative planning figures, not a local bid. Actual contractor pricing varies by region, equipment, and site hazards.",
    ],
    copyText: `Tree removal estimate: low ${money(low)}, typical ${money(typical)}, high ${money(high)}`,
  };
}
