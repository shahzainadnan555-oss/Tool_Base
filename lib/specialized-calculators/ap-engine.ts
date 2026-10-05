export type APCourseConfig = APCourseYearConfig;

export class APScoreCalculatorEngine {
  constructor(private readonly config: APCourseYearConfig) {}

  estimate(input: APScoreInput): APScoreResult {
    return estimateApScore(this.config, input);
  }
}

export interface APCourseYearConfig {
  course: string;
  courseId: string;
  examYear: number;
  multipleChoiceQuestions: number;
  multipleChoiceWeight: number;
  freeResponseQuestions: number;
  freeResponseWeight: number;
  freeResponseMaximumPoints: number;
  estimationMethod: "illustrative-composite-bands";
  officialSource: string;
  officialSourceReference: string;
  lastVerifiedDate: string;
  structureNotes: string;
}

export interface APScoreInput {
  mcCorrect: number;
  frqEarned: number;
}

export interface APScoreResult {
  mcPercent: number;
  frqPercent: number;
  composite: number;
  estimatedRange: string;
  estimatedLabel: string;
  breakdown: Array<{ label: string; value: string }>;
  formula: string;
  notes: string[];
}

/** Illustrative bands only — not College Board cut scores. */
export function illustrativeRangeFromComposite(composite: number): string {
  if (composite >= 70) return "4–5";
  if (composite >= 55) return "3–4";
  if (composite >= 40) return "2–3";
  return "1–2";
}

export function estimateApScore(
  config: APCourseYearConfig,
  input: APScoreInput,
): APScoreResult {
  const mcTotal = config.multipleChoiceQuestions;
  const frqMax = config.freeResponseMaximumPoints;
  if (mcTotal <= 0 || frqMax <= 0) {
    throw new Error("This exam configuration is incomplete.");
  }
  if (!Number.isFinite(input.mcCorrect) || !Number.isFinite(input.frqEarned)) {
    throw new Error("Please enter valid scores.");
  }
  if (input.mcCorrect < 0 || input.frqEarned < 0) {
    throw new Error("Scores cannot be negative.");
  }
  if (input.mcCorrect > mcTotal) {
    throw new Error(`Multiple-choice correct cannot exceed ${mcTotal}.`);
  }
  if (input.frqEarned > frqMax) {
    throw new Error(`Free-response points cannot exceed ${frqMax}.`);
  }

  const mcPercent = input.mcCorrect / mcTotal;
  const frqPercent = input.frqEarned / frqMax;
  const composite =
    mcPercent * config.multipleChoiceWeight * 100 +
    frqPercent * config.freeResponseWeight * 100;
  const range = illustrativeRangeFromComposite(composite);

  return {
    mcPercent,
    frqPercent,
    composite,
    estimatedRange: range,
    estimatedLabel: `Estimated AP score range ${range}`,
    breakdown: [
      {
        label: "Multiple-choice",
        value: `${input.mcCorrect} / ${mcTotal} (${formatPct(mcPercent * 100)})`,
      },
      {
        label: "Free-response",
        value: `${formatNum(input.frqEarned)} / ${frqMax} (${formatPct(frqPercent * 100)})`,
      },
      {
        label: "Weighted composite (0–100)",
        value: formatNum(composite),
      },
      {
        label: "MC weight / FRQ weight",
        value: `${formatPct(config.multipleChoiceWeight * 100)} / ${formatPct(config.freeResponseWeight * 100)}`,
      },
      {
        label: "Estimated AP score range",
        value: range,
      },
    ],
    formula:
      "Composite = (MC correct ÷ MC questions) × MC weight × 100 + (FRQ earned ÷ FRQ max) × FRQ weight × 100",
    notes: [
      "This calculator provides an estimate based on the selected exam configuration and available scoring information. It is not an official College Board score calculator.",
      "Official 1–5 results are determined by College Board through annual equating. These ranges are illustrative only and are not published cut scores.",
      `Structure verified from ${config.officialSource} (${config.lastVerifiedDate}).`,
    ],
  };
}

function formatNum(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatPct(n: number): string {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
}
