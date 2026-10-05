import type { APCourseYearConfig } from "./ap-engine";
import type { ApCourseId } from "./types";

const SOURCE = "College Board / AP Central";
const VERIFIED = "2026-10-05";

/**
 * Year-aware exam structure from College Board exam pages.
 * 1–5 cut scores are not stored because they are not published as a stable public table.
 */
export const apCourseConfigs: Record<ApCourseId, APCourseYearConfig[]> = {
  "ap-chem": [
    {
      course: "AP Chemistry",
      courseId: "ap-chem",
      examYear: 2026,
      multipleChoiceQuestions: 60,
      multipleChoiceWeight: 0.5,
      freeResponseQuestions: 7,
      freeResponseWeight: 0.5,
      freeResponseMaximumPoints: 46,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apstudents.collegeboard.org/courses/ap-chemistry/assessment",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "Section I: 60 multiple-choice questions, 50% of score. Section II: 7 free-response questions (three 10-point long, four 4-point short), 50% of score.",
    },
  ],
  "ap-bio": [
    {
      course: "AP Biology",
      courseId: "ap-bio",
      examYear: 2026,
      multipleChoiceQuestions: 60,
      multipleChoiceWeight: 0.5,
      freeResponseQuestions: 6,
      freeResponseWeight: 0.5,
      freeResponseMaximumPoints: 34,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apcentral.collegeboard.org/courses/ap-biology/exam",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "Section I: 60 multiple-choice questions, 50% of score. Section II: 6 free-response questions (two 9-point long, four 4-point short), 50% of score.",
    },
  ],
  "ap-calc-bc": [
    {
      course: "AP Calculus BC",
      courseId: "ap-calc-bc",
      examYear: 2026,
      multipleChoiceQuestions: 45,
      multipleChoiceWeight: 0.5,
      freeResponseQuestions: 6,
      freeResponseWeight: 0.5,
      freeResponseMaximumPoints: 54,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apcentral.collegeboard.org/courses/ap-calculus-bc/exam",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "May 2026 format: Section I 45 multiple-choice questions (50%); Section II 6 free-response questions typically scored 9 points each (50%). College Board announced a 42-question multiple-choice format starting with May 2027 exams.",
    },
    {
      course: "AP Calculus BC",
      courseId: "ap-calc-bc",
      examYear: 2027,
      multipleChoiceQuestions: 42,
      multipleChoiceWeight: 0.5,
      freeResponseQuestions: 6,
      freeResponseWeight: 0.5,
      freeResponseMaximumPoints: 54,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apcentral.collegeboard.org/courses/ap-calculus-bc/exam",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "May 2027 format: Section I 42 multiple-choice questions (Part A 29, Part B 13), 50% of score. Section II 6 free-response questions, 50% of score.",
    },
  ],
  "ap-lit": [
    {
      course: "AP English Literature and Composition",
      courseId: "ap-lit",
      examYear: 2026,
      multipleChoiceQuestions: 55,
      multipleChoiceWeight: 0.45,
      freeResponseQuestions: 3,
      freeResponseWeight: 0.55,
      freeResponseMaximumPoints: 18,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apcentral.collegeboard.org/courses/ap-english-literature-and-composition/exam",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "Section I: 55 multiple-choice questions, 45% of score. Section II: 3 essays, 55% of score, each scored 0–6 on the analytic rubric (thesis, evidence/commentary, sophistication).",
    },
  ],
};

export function listApYears(course: ApCourseId): number[] {
  return apCourseConfigs[course].map((item) => item.examYear).sort((a, b) => b - a);
}

export function getApConfig(
  course: ApCourseId,
  examYear: number,
): APCourseYearConfig | undefined {
  return apCourseConfigs[course].find((item) => item.examYear === examYear);
}

export function getLatestApConfig(course: ApCourseId): APCourseYearConfig {
  const years = listApYears(course);
  const latest = getApConfig(course, years[0]);
  if (!latest) throw new Error("No AP configuration available.");
  return latest;
}
