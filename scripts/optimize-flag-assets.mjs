/**
 * One-off: rasterize oversized flag SVGs (embedded bitmaps) to small WebP files.
 * Run: node scripts/optimize-flag-assets.mjs
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "Flags");

const flags = [
  { input: "Aus-flag.svg", output: "aus-flag.webp" },
  { input: "Canada-flag.svg", output: "canada-flag.webp" },
  { input: "US-flag.svg", output: "us-flag.webp" },
];

await mkdir(outDir, { recursive: true });

for (const { input, output } of flags) {
  const inputPath = join(outDir, input);
  const outputPath = join(outDir, output);
  await sharp(inputPath)
    .resize(96, 64, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(outputPath);
  console.log(`Wrote ${output}`);
}
