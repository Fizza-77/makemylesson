/**
 * Backfill empty subject lists in stage1-curriculum-tree.json.
 * EYFS / Cambridge Early Years → statutory early-years areas.
 * US K / Canadian K → copy from the next grade in the same pathway.
 *
 * Run: node scripts/backfill-empty-stage1-subjects.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const treePath = path.join(__dirname, "../data/stage1-curriculum-tree.json");

const EYFS_SUBJECT_NAMES = [
  "Communication and Language",
  "Physical Development",
  "Personal, Social and Emotional Development",
  "Literacy",
  "Mathematics",
  "Understanding the World",
  "Expressive Arts and Design",
];

const EARLY_YEARS_STAGES = new Set(["EYFS", "Cambridge Early Years"]);

function subjectEntry(name) {
  return { name, code: null, displayName: name };
}

function cloneSubjects(subjects) {
  return subjects.map((s) => ({
    name: s.name,
    code: s.code ?? null,
    displayName: s.displayName,
  }));
}

function eyfsSubjects() {
  return EYFS_SUBJECT_NAMES.map(subjectEntry);
}

function nextGradeSubjects(pathway, gradeIndex) {
  for (let i = gradeIndex + 1; i < pathway.grades.length; i++) {
    const subs = pathway.grades[i].subjects;
    if (subs?.length) return cloneSubjects(subs);
  }
  return [];
}

const tree = JSON.parse(fs.readFileSync(treePath, "utf8"));
let patched = 0;

for (const top of tree) {
  for (const pathway of top.pathways) {
    pathway.grades.forEach((grade, index) => {
      if (grade.subjects?.length) return;

      let subjects = [];
      if (EARLY_YEARS_STAGES.has(grade.stage ?? "")) {
        subjects = eyfsSubjects();
      } else {
        subjects = nextGradeSubjects(pathway, index);
      }

      if (subjects.length) {
        grade.subjects = subjects;
        patched += 1;
      }
    });
  }
}

fs.writeFileSync(treePath, `${JSON.stringify(tree, null, 2)}\n`, "utf8");
console.log(`Backfilled subjects for ${patched} grades → ${treePath}`);
