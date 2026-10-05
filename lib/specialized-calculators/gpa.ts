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
      "Middle-school grading policies vary. This result uses only the scale and courses you entered.",
    ],
    copyText: `Estimated GPA: ${display}`,
  };
}
