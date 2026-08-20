/**
 * Next.js `output: "standalone"` does not bundle `public/` or `.next/static`.
 * Without this copy step, favicons / icons / images 404 in production.
 *
 * Runs automatically after `next build` via the `postbuild` npm script.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.log("[copy-standalone-assets] No .next/standalone — skipping (non-standalone build).");
  process.exit(0);
}

const publicSrc = join(root, "public");
const publicDest = join(standalone, "public");
const staticSrc = join(root, ".next", "static");
const staticDest = join(standalone, ".next", "static");

if (existsSync(publicSrc)) {
  cpSync(publicSrc, publicDest, { recursive: true });
  console.log("[copy-standalone-assets] Copied public/ → .next/standalone/public/");
} else {
  console.warn("[copy-standalone-assets] public/ missing — skipped.");
}

if (existsSync(staticSrc)) {
  mkdirSync(dirname(staticDest), { recursive: true });
  cpSync(staticSrc, staticDest, { recursive: true });
  console.log("[copy-standalone-assets] Copied .next/static → .next/standalone/.next/static/");
} else {
  console.warn("[copy-standalone-assets] .next/static missing — skipped.");
}

/* Browsers request /favicon.ico; ensure it exists under public for standalone. */
const appFavicon = join(root, "app", "favicon.ico");
const publicFavicon = join(publicDest, "favicon.ico");
if (existsSync(appFavicon)) {
  cpSync(appFavicon, publicFavicon);
  console.log("[copy-standalone-assets] Ensured standalone/public/favicon.ico");
}
