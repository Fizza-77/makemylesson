/**
 * Audit Stage 1 curriculum JSON for empty subject lists.
 * Run: node scripts/audit-stage1-curriculum.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tree = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/stage1-curriculum-tree.json"), "utf8"),
);

const empty = [];
let grades = 0;
let subjects = 0;
for (const top of tree) {
  for (const p of top.pathways) {
    for (const g of p.grades) {
      grades += 1;
      subjects += g.subjects?.length ?? 0;
      if (!g.subjects?.length) {
        empty.push(`${top.id}/${p.id}/${g.gradeId} (${g.displayName})`);
      }
    }
  }
}

console.log(`Top-levels: ${tree.length}, grades: ${grades}, subjects: ${subjects}`);
console.log(`Grades with empty subjects: ${empty.length}`);
if (empty.length) console.log(empty.join("\n"));
