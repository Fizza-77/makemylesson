import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dartPath = path.resolve(
  __dirname,
  "../../MakeMyLesson-1/lib/services/curriculum_service.dart",
);
const outPath = path.resolve(__dirname, "../lib/stage1-curriculum-mapping.ts");

const src = fs.readFileSync(dartPath, "utf8");
const start = src.indexOf("String? getCurriculumIdFromPathway");
const endMarker = "\n    return null;";
const end = src.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error("mapping method not found");

let body = src.slice(start, end + endMarker.length);
body = body.replace(
  "String? getCurriculumIdFromPathway(String pathwayId, String gradeId)",
  "export function getCurriculumIdFromPathway(pathwayId: string, gradeId: string): string | null",
);
body = body.replaceAll("gradeId == '", "gradeId === '");
body = body.replaceAll("final grade = int.tryParse(gradeId);", "const grade = Number.parseInt(gradeId, 10);");
body = body.replaceAll("final yearStr = gradeId.substring(5);", "const yearStr = gradeId.substring(5);");
body = body.replaceAll("final year = int.tryParse(yearStr);", "const year = Number.parseInt(yearStr, 10);");
body = body.replaceAll("final gradeStr = gradeId.substring(6);", "const gradeStr = gradeId.substring(6);");
body = body.replaceAll("if (grade == null)", "if (!Number.isFinite(grade))");
body = body.replaceAll("if (year == null)", "if (!Number.isFinite(year))");
body = body.replaceAll("if (year != null)", "if (Number.isFinite(year))");
body = body.replaceAll("if (grade != null)", "if (Number.isFinite(grade))");

const header = `/** Port of Flutter CurriculumService.getCurriculumIdFromPathway — do not invent routes. */\n\n`;
fs.writeFileSync(outPath, header + body.trim() + "\n");
console.log("Wrote", outPath, "chars", body.length);
