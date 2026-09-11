import treeJson from "@/data/stage1-curriculum-tree.json";
import namesJson from "@/data/stage1-curriculum-names.json";
import { getCurriculumIdFromPathway } from "@/lib/stage1-curriculum-mapping";
import type {
  CurriculumPathway,
  GradeInfo,
  SubjectInfo,
  TopLevelCurriculum,
} from "@/types/stage1";
import { pathwayLabelForTopLevel } from "@/types/stage1";

const tree = treeJson as TopLevelCurriculum[];
const curriculumNames = namesJson as Record<string, string>;

const EARLY_YEARS_STAGES = new Set(["EYFS", "Cambridge Early Years"]);

const EYFS_SUBJECTS: SubjectInfo[] = [
  "Communication and Language",
  "Physical Development",
  "Personal, Social and Emotional Development",
  "Literacy",
  "Mathematics",
  "Understanding the World",
  "Expressive Arts and Design",
].map((name) => ({ name, code: null, displayName: name }));

export function getTopLevelCurriculums(): TopLevelCurriculum[] {
  return tree;
}

export function getTopLevelById(id: string): TopLevelCurriculum | null {
  return tree.find((t) => t.id === id) ?? null;
}

export function getPathway(
  topLevelId: string,
  pathwayId: string,
): CurriculumPathway | null {
  const top = getTopLevelById(topLevelId);
  return top?.pathways.find((p) => p.id === pathwayId) ?? null;
}

export function getGrade(
  pathway: CurriculumPathway | null,
  gradeId: string,
): GradeInfo | null {
  if (!pathway || !gradeId) return null;
  return pathway.grades.find((g) => g.gradeId === gradeId) ?? null;
}

function subjectsFromNextGrade(
  pathway: CurriculumPathway,
  gradeId: string,
): SubjectInfo[] {
  const index = pathway.grades.findIndex((g) => g.gradeId === gradeId);
  if (index < 0) return [];
  for (let i = index + 1; i < pathway.grades.length; i++) {
    const next = pathway.grades[i]?.subjects ?? [];
    if (next.length > 0) return next;
  }
  return [];
}

export function getSubjectsForGrade(
  pathway: CurriculumPathway | null,
  gradeId: string,
): SubjectInfo[] {
  const grade = getGrade(pathway, gradeId);
  if (!grade || !pathway) return [];
  if (grade.subjects.length > 0) return grade.subjects;
  if (EARLY_YEARS_STAGES.has(grade.stage ?? "")) return EYFS_SUBJECTS;
  return subjectsFromNextGrade(pathway, gradeId);
}

function subjectMatchesDisplay(
  subjects: SubjectInfo[],
  displayName: string,
): SubjectInfo | null {
  const needle = normalizeMatchLabel(displayName);
  if (!needle) return null;
  return (
    subjects.find((s) => {
      const label = normalizeMatchLabel(s.displayName);
      return (
        label === needle || label.includes(needle) || needle.includes(label)
      );
    }) ?? null
  );
}

export type NormalizedStage1Selection = {
  topLevelId: string;
  curriculumLabel: string;
  pathwayId: string;
  pathwayDisplayName: string;
  gradeInternalId: string;
  grade: string;
  subject: string;
  subjectName: string;
  subjectCode: string | null;
  mappedCurriculumId: string | null;
  mappedCurriculumName: string | null;
};

/** Drop saved prefs that no longer exist in the curriculum tree. */
export function normalizeStage1SelectionAgainstTree(input: {
  topLevelId?: string;
  pathwayId?: string;
  pathwayDisplayName?: string;
  gradeInternalId?: string;
  grade?: string;
  subject?: string;
  subjectName?: string;
  subjectCode?: string | null;
}): NormalizedStage1Selection {
  const empty: NormalizedStage1Selection = {
    topLevelId: "",
    curriculumLabel: "",
    pathwayId: "",
    pathwayDisplayName: "",
    gradeInternalId: "",
    grade: "",
    subject: "",
    subjectName: "",
    subjectCode: null,
    mappedCurriculumId: null,
    mappedCurriculumName: null,
  };

  const topLevelId = input.topLevelId?.trim() ?? "";
  const top = topLevelId ? getTopLevelById(topLevelId) : null;
  if (!top) return empty;

  const pathwayId = input.pathwayId?.trim() ?? "";
  const pathway = pathwayId ? getPathway(topLevelId, pathwayId) : null;
  if (!pathway) {
    return {
      ...empty,
      topLevelId,
      curriculumLabel: top.name,
    };
  }

  const gradeInternalId = input.gradeInternalId?.trim() ?? "";
  const grade = gradeInternalId ? getGrade(pathway, gradeInternalId) : null;
  if (!grade) {
    return {
      ...empty,
      topLevelId,
      curriculumLabel: top.name,
      pathwayId,
      pathwayDisplayName: pathway.name,
    };
  }

  const subjects = getSubjectsForGrade(pathway, gradeInternalId);
  const matchedSubject = subjectMatchesDisplay(
    subjects,
    input.subject?.trim() ?? "",
  );
  const mapped = resolveMappedCurriculum(pathwayId, gradeInternalId);

  if (!matchedSubject) {
    return {
      topLevelId,
      curriculumLabel: top.name,
      pathwayId,
      pathwayDisplayName: pathway.name,
      gradeInternalId,
      grade: grade.displayName,
      subject: "",
      subjectName: "",
      subjectCode: null,
      mappedCurriculumId: mapped?.id ?? null,
      mappedCurriculumName: mapped?.name ?? null,
    };
  }

  return {
    topLevelId,
    curriculumLabel: top.name,
    pathwayId,
    pathwayDisplayName: pathway.name,
    gradeInternalId,
    grade: grade.displayName,
    subject: matchedSubject.displayName,
    subjectName: matchedSubject.name,
    subjectCode: matchedSubject.code,
    mappedCurriculumId: mapped?.id ?? null,
    mappedCurriculumName: mapped?.name ?? null,
  };
}

export function resolveMappedCurriculum(
  pathwayId: string,
  gradeId: string,
): { id: string; name: string } | null {
  const id = getCurriculumIdFromPathway(pathwayId, gradeId);
  if (!id) return null;
  const name = curriculumNames[id] ?? id;
  return { id, name };
}

export function getPathwayPickerLabel(topLevelId: string): string {
  return pathwayLabelForTopLevel(topLevelId);
}

function normalizeCurriculumName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Mirrors Flutter `_findCurriculumIdFromName` for Stage 2 library sources. */
export function findCurriculumIdFromName(
  rawName: string | null | undefined,
): string | null {
  const name = rawName?.trim() ?? "";
  if (!name) return null;
  const normalized = normalizeCurriculumName(name);
  for (const [id, label] of Object.entries(curriculumNames)) {
    if (normalizeCurriculumName(label) === normalized) return id;
  }
  return null;
}

function normalizeMatchLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export type ResolvedStage1LibrarySelection = {
  topLevelId: string;
  curriculumLabel: string;
  pathwayId: string;
  pathwayDisplayName: string;
  gradeInternalId: string;
  grade: string;
  subject: string;
  mappedCurriculumId: string | null;
  mappedCurriculumName: string | null;
};

/**
 * Best-effort restore of Stage 1 cascade fields from a saved library row
 * (curriculumRoute + grade + subject display strings).
 */
export function resolveStage1SelectionFromLibrary(params: {
  curriculumRoute: string;
  grade: string;
  subject: string;
}): ResolvedStage1LibrarySelection | null {
  const gradeNeedle = normalizeMatchLabel(params.grade);
  const subjectNeedle = normalizeMatchLabel(params.subject);
  const mappedId = findCurriculumIdFromName(params.curriculumRoute);
  const routeNeedle = normalizeMatchLabel(params.curriculumRoute);

  type Candidate = ResolvedStage1LibrarySelection & { score: number };
  let best: Candidate | null = null;

  for (const top of tree) {
    for (const pathway of top.pathways) {
      for (const grade of pathway.grades) {
        const gradeNorm = normalizeMatchLabel(grade.displayName);
        const gradeMatch =
          Boolean(gradeNeedle) &&
          (gradeNorm === gradeNeedle ||
            gradeNorm.includes(gradeNeedle) ||
            gradeNeedle.includes(gradeNorm));
        if (!gradeMatch && gradeNeedle) continue;

        const mapped = resolveMappedCurriculum(pathway.id, grade.gradeId);
        const mappedNorm = mapped
          ? normalizeMatchLabel(mapped.name)
          : "";
        const mappedMatch = mappedId
          ? mapped?.id === mappedId
          : Boolean(routeNeedle) &&
            (mappedNorm === routeNeedle ||
              mappedNorm.includes(routeNeedle) ||
              routeNeedle.includes(mappedNorm) ||
              normalizeMatchLabel(top.name).includes(routeNeedle) ||
              normalizeMatchLabel(pathway.name).includes(routeNeedle));

        let subjectDisplay = params.subject.trim();
        let subjectMatch = !subjectNeedle;
        if (subjectNeedle) {
          const availableSubjects = getSubjectsForGrade(pathway, grade.gradeId);
          const found = availableSubjects.find((s) => {
            const n = normalizeMatchLabel(s.displayName);
            return (
              n === subjectNeedle ||
              n.includes(subjectNeedle) ||
              subjectNeedle.includes(n)
            );
          });
          if (found) {
            subjectDisplay = found.displayName;
            subjectMatch = true;
          }
        }

        if (!gradeMatch && !mappedMatch) continue;

        let score = 0;
        if (gradeMatch) score += 4;
        if (mappedMatch) score += 5;
        if (subjectMatch && subjectNeedle) score += 3;
        if (mappedId && mapped?.id === mappedId) score += 2;

        const candidate: Candidate = {
          score,
          topLevelId: top.id,
          curriculumLabel: top.name,
          pathwayId: pathway.id,
          pathwayDisplayName: pathway.name,
          gradeInternalId: grade.gradeId,
          grade: grade.displayName,
          subject: subjectDisplay,
          mappedCurriculumId: mapped?.id ?? null,
          mappedCurriculumName: mapped?.name ?? null,
        };
        if (!best || candidate.score > best.score) best = candidate;
      }
    }
  }

  if (!best || best.score < 4) return null;
  return {
    topLevelId: best.topLevelId,
    curriculumLabel: best.curriculumLabel,
    pathwayId: best.pathwayId,
    pathwayDisplayName: best.pathwayDisplayName,
    gradeInternalId: best.gradeInternalId,
    grade: best.grade,
    subject: best.subject,
    mappedCurriculumId: best.mappedCurriculumId,
    mappedCurriculumName: best.mappedCurriculumName,
  };
}

export function curriculumNameById(id: string): string {
  return curriculumNames[id] ?? id;
}

export { getCurriculumIdFromPathway };


