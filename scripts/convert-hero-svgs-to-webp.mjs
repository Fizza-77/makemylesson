import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = "public/svgs";
const HERO_WIDTH = 620;

const HERO_SVGS = [
  "classroomactivity.svg",
  "lessonplan.svg",
  "markscheme.svg",
  "answerkey.svg",
  "testpaper.svg",
  "slides.svg",
];

for (const file of HERO_SVGS) {
  const src = path.join(ROOT, file);
  const dest = path.join(ROOT, file.replace(/\.svg$/i, ".webp"));
  if (!fs.existsSync(src)) {
    console.warn("skip missing", src);
    continue;
  }

  await sharp(src)
    .resize({ width: HERO_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(dest);

  const inKb = (fs.statSync(src).size / 1024).toFixed(1);
  const outKb = (fs.statSync(dest).size / 1024).toFixed(1);
  console.log(`${file} → ${path.basename(dest)} (${inKb} KB → ${outKb} KB)`);
}
