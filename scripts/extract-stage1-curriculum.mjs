/**
 * One-shot extractor: Flutter curriculum_service.dart → JSON for Next.js Stage 1.
 * Run: node scripts/extract-stage1-curriculum.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dartPath = path.resolve(
  __dirname,
  "../../MakeMyLesson/lib/services/curriculum_service.dart",
);
const outDir = path.resolve(__dirname, "../data");

const src = fs.readFileSync(dartPath, "utf8");

function parseSubjectInfos(block) {
  const subjects = [];
  const re =
    /SubjectInfo\(\s*name:\s*'((?:\\'|[^'])*)'(?:\s*,\s*code:\s*'((?:\\'|[^'])*)')?/g;
  let m;
  while ((m = re.exec(block))) {
    const name = m[1].replace(/\\'/g, "'");
    const code = m[2] ? m[2].replace(/\\'/g, "'") : undefined;
    subjects.push({
      name,
      code: code || null,
      displayName: code ? `${name} (${code})` : name,
    });
  }
  return subjects;
}

/** Extract List<SubjectInfo> _getXxx() { return [ ... ]; } helpers */
const subjectHelpers = {};
{
  const helperRe =
    /List<SubjectInfo>\s+(_get\w+)\s*\(\s*\)\s*\{[\s\S]*?return\s*\[([\s\S]*?)\];/g;
  let m;
  while ((m = helperRe.exec(src))) {
    subjectHelpers[m[1]] = parseSubjectInfos(m[2]);
  }
}

function resolveSubjects(expr, localVars) {
  const trimmed = expr.trim();
  if (trimmed === "[]" || trimmed === "const []") return [];
  if (localVars[trimmed]) return localVars[trimmed];
  const call = trimmed.match(/^(_get\w+)\(\s*\)$/);
  if (call && subjectHelpers[call[1]]) return subjectHelpers[call[1]];
  if (trimmed.startsWith("[")) return parseSubjectInfos(trimmed);
  return [];
}

function parseGradeInfos(gradesBlock, localVars) {
  const grades = [];
  const parts = gradesBlock.split(/GradeInfo\s*\(/).slice(1);
  for (const part of parts) {
    // Drop Dart line comments so stale // displayName: values are ignored.
    const cleaned = part
      .split("\n")
      .map((line) => line.replace(/\/\/.*$/, ""))
      .join("\n");
    const gradeId = /gradeId:\s*'((?:\\'|[^'])*)'/.exec(cleaned)?.[1]?.replace(
      /\\'/g,
      "'",
    );
    const displayName = /displayName:\s*'((?:\\'|[^'])*)'/.exec(
      cleaned,
    )?.[1]?.replace(/\\'/g, "'");
    const ageRange = /ageRange:\s*'((?:\\'|[^'])*)'/.exec(cleaned)?.[1]?.replace(
      /\\'/g,
      "'",
    );
    const stage = /stage:\s*'((?:\\'|[^'])*)'/.exec(cleaned)?.[1]?.replace(
      /\\'/g,
      "'",
    );
    const subjectsMatch = /subjects:\s*([^,\n]+)/.exec(cleaned);
    if (!gradeId || !displayName) continue;
    const subjects = subjectsMatch
      ? resolveSubjects(subjectsMatch[1], localVars)
      : [];
    grades.push({
      gradeId,
      displayName,
      ageRange: ageRange || null,
      stage: stage || null,
      subjects,
    });
  }
  return grades;
}

function parsePathwayMethod(methodBody) {
  const localVars = {};
  const assignRe = /(?:final|var)\s+(\w+)\s*=\s*(_get\w+)\(\s*\);/g;
  let am;
  while ((am = assignRe.exec(methodBody))) {
    localVars[am[1]] = subjectHelpers[am[2]] || [];
  }

  const id = /id:\s*'((?:\\'|[^'])*)'/.exec(methodBody)?.[1];
  const name = /name:\s*'((?:\\'|[^'])*)'/.exec(methodBody)?.[1];
  const curriculumId = /curriculumId:\s*'((?:\\'|[^'])*)'/.exec(methodBody)?.[1];
  const gradesMatch = /grades:\s*\[([\s\S]*)\]\s*,?\s*\)\s*;/.exec(methodBody);
  if (!id || !name || !curriculumId || !gradesMatch) return null;
  return {
    id: id.replace(/\\'/g, "'"),
    name: name.replace(/\\'/g, "'"),
    curriculumId: curriculumId.replace(/\\'/g, "'"),
    grades: parseGradeInfos(gradesMatch[1], localVars),
  };
}

/** Find CurriculumPathway _getXxxPathway() { ... return CurriculumPathway( ... ); } */
const pathwaysByMethod = {};
{
  const pathwayMethodRe =
    /CurriculumPathway\s+(_get\w+)\s*\(\s*\)\s*\{([\s\S]*?)(?=\n  (?:CurriculumPathway|TopLevelCurriculum|String\?|List<|\/\/\/ Get |\/\/\/ Helper|\/\/\/ UK|\/\/\/ Cambridge|\/\/\/ Pearson|\/\/\/ Get British|\/\/\/ Get US|\/\/\/ Get IB|\/\/\/ Get Australian|\/\/\/ Get Canadian|class ))/g;
  let m;
  while ((m = pathwayMethodRe.exec(src))) {
    const parsed = parsePathwayMethod(m[2]);
    if (parsed) pathwaysByMethod[m[1]] = parsed;
  }
}

// Fallback: also try matching return CurriculumPathway( blocks with preceding method names
{
  const altRe =
    /CurriculumPathway\s+(_get\w+)\s*\(\s*\)\s*\{([\s\S]*?return\s+CurriculumPathway\([\s\S]*?\n    \);\n  \})/g;
  let m;
  while ((m = altRe.exec(src))) {
    if (pathwaysByMethod[m[1]]) continue;
    const parsed = parsePathwayMethod(m[2]);
    if (parsed) pathwaysByMethod[m[1]] = parsed;
  }
}

function extractTopLevel(methodName) {
  const re = new RegExp(
    `TopLevelCurriculum\\s+${methodName}\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)\\n  \\}`,
  );
  const m = re.exec(src);
  if (!m) return null;
  const body = m[1];
  const id = /id:\s*'((?:\\'|[^'])*)'/.exec(body)?.[1]?.replace(/\\'/g, "'");
  const name = /name:\s*'((?:\\'|[^'])*)'/.exec(body)?.[1]?.replace(/\\'/g, "'");
  const pathwayCalls = [...body.matchAll(/(_get\w+)\(\s*\)/g)].map((x) => x[1]);
  const pathways = pathwayCalls
    .map((fn) => pathwaysByMethod[fn])
    .filter(Boolean);
  if (!id || !name) return null;
  return { id, name, pathways };
}

const topLevelMethods = [
  "_getBritishCurriculum",
  "_getUSCurriculum",
  "_getIBCurriculum",
  "_getAustralianCurriculum",
  "_getCanadianCurriculum",
];

const tree = topLevelMethods.map(extractTopLevel).filter(Boolean);

/** Curriculum id → display name from Curriculum( id/name pairs */
const curriculumNames = {};
{
  const re =
    /return\s+Curriculum\(\s*id:\s*'((?:\\'|[^'])*)'\s*,\s*name:\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = re.exec(src))) {
    curriculumNames[m[1].replace(/\\'/g, "'")] = m[2].replace(/\\'/g, "'");
  }
}

fs.mkdirSync(outDir, { recursive: true });
const treePath = path.join(outDir, "stage1-curriculum-tree.json");
const namesPath = path.join(outDir, "stage1-curriculum-names.json");
fs.writeFileSync(treePath, JSON.stringify(tree, null, 2));
fs.writeFileSync(namesPath, JSON.stringify(curriculumNames, null, 2));

const pathwayCount = tree.reduce((n, t) => n + t.pathways.length, 0);
const gradeCount = tree.reduce(
  (n, t) => n + t.pathways.reduce((m, p) => m + p.grades.length, 0),
  0,
);
console.log(
  `Extracted ${tree.length} top-levels, ${pathwayCount} pathways, ${gradeCount} grades, ${Object.keys(curriculumNames).length} curriculum names`,
);
console.log(
  `Subject helpers: ${Object.keys(subjectHelpers).length}, pathway methods: ${Object.keys(pathwaysByMethod).length}`,
);
console.log(`Wrote ${treePath}`);
console.log(`Wrote ${namesPath}`);
