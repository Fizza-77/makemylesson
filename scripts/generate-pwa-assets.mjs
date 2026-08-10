import sharp from "sharp";
import fs from "fs";
import path from "path";

const src = "public/logo.png";
if (!fs.existsSync(src)) throw new Error("public/logo.png not found");

const meta = await sharp(src).metadata();
console.log("source", src, meta.width, meta.height, meta.format);

const outDir = "public/icons";
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync("public/screenshots", { recursive: true });

async function makeIcon(size, name, { maskable = false } = {}) {
  const bg = { r: 26, g: 30, b: 58, alpha: 1 };
  const outPath = path.join(outDir, name);
  if (maskable) {
    const inner = Math.round(size * 0.72);
    const logo = await sharp(src)
      .resize(inner, inner, { fit: "contain", background: bg })
      .png()
      .toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: bg },
    })
      .composite([{ input: logo, gravity: "centre" }])
      .png()
      .toFile(outPath);
  } else {
    await sharp(src)
      .resize(size, size, { fit: "cover" })
      .png()
      .toFile(outPath);
  }
  const m = await sharp(outPath).metadata();
  console.log(name, m.width, m.height);
}

await makeIcon(192, "icon-192.png");
await makeIcon(512, "icon-512.png");
await makeIcon(192, "icon-192-maskable.png", { maskable: true });
await makeIcon(512, "icon-512-maskable.png", { maskable: true });

const wideW = 1280;
const wideH = 720;
const logoWide = await sharp(src)
  .resize(220, 220, {
    fit: "contain",
    background: { r: 26, g: 30, b: 58, alpha: 0 },
  })
  .png()
  .toBuffer();

const svgWide = Buffer.from(`<svg width="${wideW}" height="${wideH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1A1E3A"/>
      <stop offset="100%" stop-color="#242845"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="64" y="80" width="1152" height="560" rx="28" fill="#FFFFFF" opacity="0.06"/>
  <text x="640" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#FFFFFF">Make My Lesson</text>
  <text x="640" y="470" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#35BEBC">AI lesson packs for teachers</text>
</svg>`);

await sharp(svgWide)
  .composite([{ input: logoWide, top: 140, left: Math.round((wideW - 220) / 2) }])
  .png()
  .toFile("public/screenshots/desktop-wide.png");
const dw = await sharp("public/screenshots/desktop-wide.png").metadata();
console.log("desktop-wide", dw.width, dw.height);

const mobW = 1080;
const mobH = 1920;
const logoMob = await sharp(src)
  .resize(280, 280, {
    fit: "contain",
    background: { r: 26, g: 30, b: 58, alpha: 0 },
  })
  .png()
  .toBuffer();

const svgMob = Buffer.from(`<svg width="${mobW}" height="${mobH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1E3A"/>
      <stop offset="55%" stop-color="#242845"/>
      <stop offset="100%" stop-color="#35BEBC"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="72" y="520" width="936" height="880" rx="36" fill="#FFFFFF" opacity="0.08"/>
  <text x="540" y="980" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#FFFFFF">Make My Lesson</text>
  <text x="540" y="1050" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#EAF5F6">Plan · Slides · Activity · Assess</text>
</svg>`);

await sharp(svgMob)
  .composite([{ input: logoMob, top: 560, left: Math.round((mobW - 280) / 2) }])
  .png()
  .toFile("public/screenshots/mobile.png");
const mw = await sharp("public/screenshots/mobile.png").metadata();
console.log("mobile", mw.width, mw.height);
console.log("DONE");
