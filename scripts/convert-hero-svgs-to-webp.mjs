import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = "public/svgs";

const HERO_HEAVY_WEBP = [
  { svg: "classroomactivity.svg", width: 1000, quality: 92 },
];

const AYLA_WIDTHS = [
  { suffix: "-sm", width: 200 },
  { suffix: "", width: 420 },
];

const STRUCTURE_WEBPS = ["UK", "US", "IB", "Australia", "Canada"];
const STRUCTURE_SM_WIDTH = 340;

async function writeWebp(input, output, width, quality = 82) {
  await sharp(input)
    .resize({ width, withoutEnlargement: false })
    .webp({ quality, effort: 6 })
    .toFile(output);
}

function logSize(label, beforePath, afterPath) {
  const beforeKb = beforePath && fs.existsSync(beforePath)
    ? (fs.statSync(beforePath).size / 1024).toFixed(1)
    : "—";
  const afterKb = (fs.statSync(afterPath).size / 1024).toFixed(1);
  console.log(`${label} (${beforeKb} KB → ${afterKb} KB)`);
}

for (const heavy of HERO_HEAVY_WEBP) {
  const src = path.join(ROOT, heavy.svg);
  if (!fs.existsSync(src)) {
    console.warn("skip missing", src);
    continue;
  }

  const base = heavy.svg.replace(/\.svg$/i, "");
  const dest = path.join(ROOT, `${base}.webp`);
  await writeWebp(src, dest, heavy.width, heavy.quality);
  logSize(`${base}.webp`, src, dest);
}

const aylaSvg = path.join(ROOT, "ayla.svg");
if (fs.existsSync(aylaSvg)) {
  for (const { suffix, width } of AYLA_WIDTHS) {
    const dest = path.join(ROOT, `ayla${suffix}.webp`);
    await writeWebp(aylaSvg, dest, width);
    logSize(`ayla${suffix}.webp`, aylaSvg, dest);
  }
}

for (const name of STRUCTURE_WEBPS) {
  const src = path.join(ROOT, `${name}.webp`);
  if (!fs.existsSync(src)) {
    console.warn("skip missing", src);
    continue;
  }

  const dest = path.join(ROOT, `${name}-sm.webp`);
  await writeWebp(src, dest, STRUCTURE_SM_WIDTH);
  logSize(`${name}-sm.webp`, src, dest);
}
