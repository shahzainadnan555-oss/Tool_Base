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
  "ap-lang": [
    {
      course: "AP English Language and Composition",
      courseId: "ap-lang",
      examYear: 2026,
      multipleChoiceQuestions: 45,
      multipleChoiceWeight: 0.45,
      freeResponseQuestions: 3,
      freeResponseWeight: 0.55,
      freeResponseMaximumPoints: 18,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apcentral.collegeboard.org/courses/ap-english-language-and-composition/exam",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "Section I: 45 multiple-choice questions, 45% of score. Section II: 3 free-response questions, 55% of score, each scored 0–6 (18-point combined maximum).",
    },
  ],
  "ap-ush": [
    {
      course: "AP United States History",
      courseId: "ap-ush",
      examYear: 2026,
      multipleChoiceQuestions: 55,
      multipleChoiceWeight: 0.4,
      freeResponseQuestions: 5,
      freeResponseWeight: 0.6,
      freeResponseMaximumPoints: 22,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apcentral.collegeboard.org/courses/ap-united-states-history/exam",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "Section I: 55 multiple-choice (40%) plus 3 short-answer questions (20%). Section II: DBQ (25%) and LEQ (15%). Written work is entered here as a combined 22-point total (SAQ 9, DBQ 7, LEQ 6).",
    },
  ],
  "ap-world": [
    {
      course: "AP World History: Modern",
      courseId: "ap-world",
      examYear: 2026,
      multipleChoiceQuestions: 55,
      multipleChoiceWeight: 0.4,
      freeResponseQuestions: 5,
      freeResponseWeight: 0.6,
      freeResponseMaximumPoints: 22,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apcentral.collegeboard.org/courses/ap-world-history-modern/exam",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "Same published section weights as other AP History exams: 55 multiple-choice (40%), short-answer (20%), DBQ (25%), LEQ (15%). Combined written maximum used here is 22 points.",
    },
  ],
  "ap-psych": [
    {
      course: "AP Psychology",
      courseId: "ap-psych",
      examYear: 2026,
      multipleChoiceQuestions: 75,
      multipleChoiceWeight: 2 / 3,
      freeResponseQuestions: 2,
      freeResponseWeight: 1 / 3,
      freeResponseMaximumPoints: 25,
      estimationMethod: "illustrative-composite-bands",
      officialSource: SOURCE,
      officialSourceReference:
        "https://apcentral.collegeboard.org/courses/ap-psychology/exam",
      lastVerifiedDate: VERIFIED,
      structureNotes:
        "Section I: 75 multiple-choice questions, two-thirds of the score. Section II: 2 free-response questions, one-third of the score. Enter FRQ points out of 25 as a combined earned total.",
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
