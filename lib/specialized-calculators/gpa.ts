import type { SpecializedCalcResult } from "./types";

export interface GpaCourse {
  name: string;
  grade: string;
  credits: string;
}

export const DEFAULT_GPA_SCALE: Record<string, number> = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  F: 0,
};

function parseScale(raw: string): Record<string, number> {
  const map: Record<string, number> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^([A-Za-z+]+)\s*[=:]\s*(-?\d+(?:\.\d+)?)$/);
    if (!match) throw new Error(`Could not read scale line “${trimmed}”. Use Grade = points, one per line.`);
    map[match[1].toUpperCase()] = Number(match[2]);
  }
  if (Object.keys(map).length === 0) throw new Error("Enter at least one grade in the scale.");
  return map;
}

function parseCredits(raw: string, weighted: boolean): number {
  if (!weighted) return 1;
  const trimmed = raw.trim();
  if (!trimmed) return 1;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) throw new Error("Credits/weight must be a positive number.");
  return n;
}

export function calculateMiddleSchoolGpa(input: {
  courses: GpaCourse[];
  scaleText: string;
  weighted: boolean;
  audienceNote?: string;
}): SpecializedCalcResult {
  const scale = parseScale(input.scaleText);
  const rows: Array<{ name: string; grade: string; points: number; credits: number }> = [];
  for (const course of input.courses) {
    const grade = course.grade.trim().toUpperCase();
    if (!grade && !course.name.trim()) continue;
    if (!grade) throw new Error("Each listed course needs a grade.");
    if (!(grade in scale)) {
      throw new Error(`Grade “${grade}” is not in your selected scale.`);
    }
    rows.push({
      name: course.name.trim() || "Course",
      grade,
      points: scale[grade],
      credits: parseCredits(course.credits, input.weighted),
    });
  }
  if (rows.length === 0) throw new Error("Add at least one course.");

  const totalWeight = rows.reduce((sum, row) => sum + row.credits, 0);
  const totalPoints = rows.reduce((sum, row) => sum + row.points * row.credits, 0);
  const gpa = totalPoints / totalWeight;
  const display = gpa.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return {
    headline: display,
    subhead: "Estimated GPA based on your selected grading scale",
    primaryLabel: "Estimated GPA",
    primary: display,
    breakdown: [
      ...rows.map((row) => ({
        label: `${row.name} (${row.grade})`,
        value: input.weighted
          ? `${row.points} × ${row.credits} = ${(row.points * row.credits).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          : String(row.points),
      })),
      { label: "Total grade points", value: totalPoints.toLocaleString(undefined, { maximumFractionDigits: 2 }) },
      {
        label: input.weighted ? "Total credits / weight" : "Number of courses",
        value: String(totalWeight),
      },
      { label: "Estimated GPA", value: display },
    ],
    formula: input.weighted
      ? "GPA = sum(grade points × credits) ÷ sum(credits)"
      : "GPA = sum of grade points ÷ number of courses",
    notes: [
      input.audienceNote ??
        "Middle-school grading policies vary. This result uses only the scale and courses you entered.",
    ],
    copyText: `Estimated GPA: ${display}`,
  };
}

export interface WeightedComponent {
  name: string;
  score: string;
  weight: string;
}

export function calculateWeightedGrade(components: WeightedComponent[]): SpecializedCalcResult {
  const rows: Array<{ name: string; score: number; weight: number; contrib: number }> = [];
  for (const item of components) {
    if (!item.name.trim() && !item.score.trim()) continue;
    const score = Number(item.score);
    const weight = Number(item.weight);
    if (!Number.isFinite(score) || score < 0) throw new Error("Each score must be a number 0 or greater.");
    if (!Number.isFinite(weight) || weight < 0) throw new Error("Each weight must be a number 0 or greater.");
    rows.push({
      name: item.name.trim() || "Component",
      score,
      weight,
      contrib: score * weight,
    });
  }
  if (!rows.length) throw new Error("Add at least one graded component.");
  const totalWeight = rows.reduce((sum, row) => sum + row.weight, 0);
  if (totalWeight <= 0) throw new Error("Total weight must be greater than zero.");
  const grade = rows.reduce((sum, row) => sum + row.contrib, 0) / totalWeight;
  const display = grade.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return {
    headline: `${display}%`,
    subhead: "Weighted average of the scores and weights you entered",
    primaryLabel: "Weighted grade",
    primary: `${display}%`,
    breakdown: [
      ...rows.map((row) => ({
        label: `${row.name} (${row.score} × ${row.weight})`,
        value: row.contrib.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      })),
      { label: "Total weight", value: String(totalWeight) },
      { label: "Weighted grade", value: `${display}%` },
    ],
    formula: "Weighted grade = sum(score × weight) ÷ sum(weight)",
    notes: ["Weights can be percentages or any proportional numbers as long as they are consistent."],
    copyText: `Weighted grade: ${display}%`,
  };
}

export function calculateFinalGradeNeeded(input: {
  current: string;
  desired: string;
  finalWeight: string;
}): SpecializedCalcResult {
  const current = Number(input.current);
  const desired = Number(input.desired);
  const weight = Number(input.finalWeight);
  if (![current, desired, weight].every(Number.isFinite)) {
    throw new Error("Enter numeric current grade, desired grade, and final-exam weight.");
  }
  if (weight <= 0 || weight >= 100) {
    throw new Error("Final-exam weight must be greater than 0 and less than 100.");
  }
  const remaining = 100 - weight;
  const needed = (desired * 100 - current * remaining) / weight;
  const display = needed.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return {
    headline: `${display}%`,
    subhead: "Score needed on the remaining final to reach your target",
    primaryLabel: "Needed on final",
    primary: `${display}%`,
    breakdown: [
      { label: "Current grade", value: `${current}%` },
      { label: "Desired grade", value: `${desired}%` },
      { label: "Final weight", value: `${weight}%` },
      { label: "Already completed weight", value: `${remaining}%` },
      { label: "Needed on final", value: `${display}%` },
    ],
    formula: "Needed = (desired × 100 − current × (100 − final weight)) ÷ final weight",
    notes: [
      needed > 100
        ? "The needed score is above 100%. The target may not be reachable with this final weight."
        : needed < 0
          ? "The needed score is below 0%. You already exceed the target even with a zero on the final."
          : "This assumes the remaining assessment is a single final worth the stated weight.",
    ],
    copyText: `Needed on final: ${display}%`,
  };
}

