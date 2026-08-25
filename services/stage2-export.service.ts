import { jsPDF } from "jspdf";
import JSZip from "jszip";
import PptxGenJS from "pptxgenjs";

import { stage2ThemeById, type Stage2SlideTheme } from "@/data/stage2-themes";
import { structureQuestionAnswerMarkdown } from "@/lib/format-worksheet-markdown";
import type { ExportPersonalization } from "@/services/export-personalization.service";
import { drawLessonPlanStyleCover, drawPersonalizationAvatars } from "@/services/pdf-branding";
import { PDF_INK, PDF_MUTED, PdfWriter } from "@/services/pdf-writer";
import type { Stage2Slide } from "@/types/stage2";

export type Stage2ExportInput = {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  slides: Stage2Slide[];
  themeId: string;
  schoolName?: string | null;
  teacherName?: string | null;
  personalization?: ExportPersonalization | null;
};

function safeTopic(topic: string): string {
  return topic.trim().replace(/[^a-zA-Z0-9]+/g, "_") || "presentation";
}

function fileName(topic: string, kind: string, ext: string): string {
  return `${safeTopic(topic)}_${kind}_${Date.now()}.${ext}`;
}

function plainText(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .trim();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw.padEnd(6, "0").slice(0, 6);
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n)) return { r: 26, g: 33, b: 62 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Blend two RGB colours (t = 0 → a, t = 1 → b). Avoids jsPDF GState opacity bugs. */
function mixRgb(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number,
): { r: number; g: number; b: number } {
  const k = Math.min(1, Math.max(0, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * k),
    g: Math.round(a.g + (b.g - a.g) * k),
    b: Math.round(a.b + (b.b - a.b) * k),
  };
}

function hexColor(color: string): string {
  return color.replace("#", "").trim();
}

/** OOXML <a:t> cannot contain control chars or literal newlines. */
function sanitizePptxText(value: string): string {
  return value
    .replace(/\r\n|\r/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\uFEFF/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isLightHex(color: string): boolean {
  const { r, g, b } = hexToRgb(color);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

function splitBullet(text: string): { label: string; rest: string } {
  const trimmed = text.trim();
  const idx = trimmed.indexOf(":");
  if (idx > 0 && idx <= 42 && idx < trimmed.length - 1) {
    return {
      label: trimmed.slice(0, idx).trim(),
      rest: trimmed.slice(idx + 1).trim(),
    };
  }
  return { label: "", rest: trimmed };
}

function slideBullets(slide: Stage2Slide): string[] {
  return slide.slideContent.map((b) => plainText(b)).filter(Boolean).slice(0, 5);
}

function coverMetaLine(input: Stage2ExportInput): string {
  const bits = [input.grade, input.subject, input.curriculumRoute]
    .map((v) => v.trim())
    .filter((v) => v && v !== "—");
  if (!bits.length) return "";
  return `For ${bits.join(" · ")}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function slideImageSrc(slide: Stage2Slide): string | null {
  const dataUrl = slide.imageDataUrl.trim();
  if (dataUrl.startsWith("data:image")) return dataUrl;
  const url = slide.imageUrl.trim();
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  return null;
}

async function fetchImageAsDataUrl(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith("data:")) return src;

  // 1. Try fetch with no-cors mode — works if Storage bucket has CORS configured.
  try {
    const res = await fetch(src, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
      if (dataUrl && dataUrl.startsWith("data:image")) return dataUrl;
    }
  } catch {
    // Fall through to canvas approach below.
  }

  // 2. Fallback: load via <img crossOrigin="anonymous"> + canvas.
  //    Works when the server sends permissive CORS headers on the image response.
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        resolve(dataUrl.startsWith("data:image") ? dataUrl : null);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    // Bust cache so the browser re-requests with CORS headers.
    img.src = src.includes("?") ? `${src}&_cb=${Date.now()}` : `${src}?_cb=${Date.now()}`;
  });
}

function paintPdfBackground(
  doc: jsPDF,
  theme: Stage2SlideTheme,
  pageW: number,
  pageH: number,
) {
  const w = Number.isFinite(pageW) && pageW > 0 ? pageW : 842;
  const h = Number.isFinite(pageH) && pageH > 0 ? pageH : 595;
  const back = hexToRgb(theme.backgroundGradient[1] ?? theme.accentPrimary);
  const accent = hexToRgb(theme.accentPrimary);
  const accent2 = hexToRgb(theme.accentSecondary);
  doc.setFillColor(back.r, back.g, back.b);
  doc.rect(0, 0, w, h, "F");

  // Decorative orbs — mix into the background instead of GState opacity
  // (opacity can leak and wash out later shapes in some jsPDF builds).
  const orbA = mixRgb(back, accent, 0.22);
  const orbB = mixRgb(back, accent2, 0.18);
  doc.setFillColor(orbA.r, orbA.g, orbA.b);
  doc.circle(w - 48, 36, 110, "F");
  doc.setFillColor(orbB.r, orbB.g, orbB.b);
  doc.circle(70, h + 18, 95, "F");

  doc.setFillColor(accent.r, accent.g, accent.b);
  doc.rect(0, 0, 10, h, "F");
  doc.rect(0, h - 8, w, 8, "F");
}

function resolvedSchoolName(input: Stage2ExportInput): string {
  return (
    input.personalization?.schoolName?.trim() ||
    input.schoolName?.trim() ||
    ""
  );
}

function resolvedTeacherName(input: Stage2ExportInput): string {
  return (
    input.personalization?.teacherName?.trim() ||
    input.teacherName?.trim() ||
    ""
  );
}

function addPdfCover(
  doc: jsPDF,
  input: Stage2ExportInput,
  theme: Stage2SlideTheme,
  totalSlides: number,
) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  paintPdfBackground(doc, theme, pageW, pageH);

  const titleRgb = hexToRgb(theme.titleColor);
  const mutedRgb = hexToRgb(theme.mutedColor);
  const accentRgb = hexToRgb(theme.accentPrimary);
  const accent2Rgb = hexToRgb(theme.accentSecondary);

  doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("COVER SLIDE", 40, 42);

  // Avatars share the COVER SLIDE row, right-aligned.
  drawPersonalizationAvatars(doc, input.personalization, {
    right: pageW - 40,
    y: 24,
    diameter: 36,
  });

  const textTop = 62;

  const school = resolvedSchoolName(input);
  if (school) {
    doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
    doc.setFontSize(13);
    doc.text(school, 40, textTop);
  }
  const teacher = resolvedTeacherName(input);
  if (teacher) {
    doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Prepared by: ${teacher}`, pageW - 40, textTop, {
      align: "right",
    });
  }

  doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
  doc.roundedRect(pageW / 2 - 36, pageH / 2 - 78, 72, 8, 3, 3, "F");
  doc.setFillColor(accent2Rgb.r, accent2Rgb.g, accent2Rgb.b);
  doc.circle(pageW / 2 + 52, pageH / 2 - 74, 5, "F");

  doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  const title = doc.splitTextToSize(
    input.topic.trim() || "Presentation",
    pageW - 160,
  ) as string[];
  let titleY = pageH / 2 - 40;
  for (const line of title.slice(0, 3)) {
    doc.text(line, pageW / 2, titleY, { align: "center" });
    titleY += 38;
  }

  const meta = coverMetaLine(input);
  if (meta) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
    const metaLines = doc.splitTextToSize(meta, pageW - 160) as string[];
    let metaY = titleY + 8;
    for (const line of metaLines.slice(0, 2)) {
      doc.text(line, pageW / 2, metaY, { align: "center" });
      metaY += 16;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  doc.text(`SLIDE 1 OF ${totalSlides}`, pageW / 2, pageH - 22, {
    align: "center",
  });
}

async function addPdfContentSlide(
  doc: jsPDF,
  slide: Stage2Slide,
  theme: Stage2SlideTheme,
  slideNo: number,
  totalSlides: number,
) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  paintPdfBackground(doc, theme, pageW, pageH);

  const titleRgb = hexToRgb(theme.titleColor);
  const bodyRgb = hexToRgb(theme.bodyColor);
  const mutedRgb = hexToRgb(theme.mutedColor);
  const accentRgb = hexToRgb(theme.accentPrimary);
  const accent2Rgb = hexToRgb(theme.accentSecondary);
  const backRgb = hexToRgb(theme.backgroundGradient[1] ?? theme.accentPrimary);
  // Match Flutter `_pdfBullet`: accent-tinted card + border (not overlayPanel,
  // which often equals the slide background and makes boxes invisible).
  const cardFill = mixRgb(backRgb, accentRgb, theme.isLight ? 0.1 : 0.2);
  const cardBorder = mixRgb(backRgb, accentRgb, theme.isLight ? 0.4 : 0.55);

  doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    (slide.slideType || `Slide ${slide.slideNumber}`).toUpperCase(),
    36,
    32,
  );
  doc.setFont("helvetica", "normal");
  doc.text(`${slide.estimatedTimeMinutes} min`, pageW - 36, 32, {
    align: "right",
  });

  const imageSrc = slideImageSrc(slide);
  const imageData = imageSrc ? await fetchImageAsDataUrl(imageSrc) : null;
  const hasImage = Boolean(imageData);
  const textMaxW = hasImage ? pageW * 0.52 : pageW - 72;

  // Accent bar (Flutter `_pdfAccentBar`)
  doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
  doc.roundedRect(36, 44, 64, 5, 2.5, 2.5, "F");
  doc.setFillColor(accent2Rgb.r, accent2Rgb.g, accent2Rgb.b);
  doc.roundedRect(68, 44, 32, 5, 2.5, 2.5, "F");

  doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(
    slide.slideTitle.trim() || `Slide ${slide.slideNumber}`,
    textMaxW,
  ) as string[];
  let y = 68;
  doc.text(titleLines.slice(0, 2), 36, y);
  y += titleLines.slice(0, 2).length * 24 + 12;

  const bullets = slideBullets(slide);
  const bottomLimit = pageH - 40;
  const gap = 9;

  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i]!;
    const { label, rest } = splitBullet(bullet);
    const textX = 56;
    const textW = textMaxW - 40;
    const padY = 10;
    const lineH = 13;

    let contentLines: string[] = [];
    let contentH = padY * 2 + 14;
    if (label) {
      const restLines = (
        doc.splitTextToSize(rest, textW) as string[]
      ).slice(0, 2);
      contentLines = restLines;
      contentH = padY + 14 + (restLines.length ? 4 + restLines.length * lineH : 0) + padY;
    } else {
      contentLines = (doc.splitTextToSize(rest, textW) as string[]).slice(0, 3);
      contentH = padY * 2 + Math.max(1, contentLines.length) * lineH;
    }
    const cardH = Math.max(36, Math.min(72, contentH));
    if (y + cardH > bottomLimit) break;

    // Card fill + stroke so boxes read on every theme
    doc.setFillColor(cardFill.r, cardFill.g, cardFill.b);
    doc.setDrawColor(cardBorder.r, cardBorder.g, cardBorder.b);
    doc.setLineWidth(0.9);
    doc.roundedRect(36, y, textMaxW, cardH, 10, 10, "FD");

    // Dot bullet (Flutter style)
    doc.setFillColor(accent2Rgb.r, accent2Rgb.g, accent2Rgb.b);
    doc.circle(48, y + cardH / 2, 4, "F");

    let textY = y + padY + 11;
    if (label) {
      doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(label, textX, textY);
      textY += 15;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(bodyRgb.r, bodyRgb.g, bodyRgb.b);
      for (const line of contentLines) {
        doc.text(line, textX, textY);
        textY += lineH;
      }
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(bodyRgb.r, bodyRgb.g, bodyRgb.b);
      for (const line of contentLines) {
        doc.text(line, textX, textY);
        textY += lineH;
      }
    }
    y += cardH + gap;
  }

  if (imageData) {
    try {
      const imgW = pageW * 0.36;
      const imgH = pageH * 0.52;
      const imgX = pageW - imgW - 28;
      const imgY = 86;
      const frame = mixRgb(backRgb, accentRgb, 0.25);
      doc.setFillColor(frame.r, frame.g, frame.b);
      doc.setDrawColor(cardBorder.r, cardBorder.g, cardBorder.b);
      doc.setLineWidth(0.8);
      doc.roundedRect(imgX - 8, imgY - 8, imgW + 16, imgH + 16, 12, 12, "FD");
      const format = imageData.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(imageData, format, imgX, imgY, imgW, imgH);
    } catch {
      // Skip broken images — text slides still export.
    }
  } else {
    // Lightweight decor when no image (mirrors Flutter `_pdfSlideDecor`)
    const decor = mixRgb(backRgb, accentRgb, 0.28);
    doc.setFillColor(decor.r, decor.g, decor.b);
    doc.circle(pageW - 56, 72, 28, "F");
    doc.setDrawColor(cardBorder.r, cardBorder.g, cardBorder.b);
    doc.setLineWidth(1.2);
    doc.circle(58, pageH - 70, 22, "S");
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  doc.text(`SLIDE ${slideNo} OF ${totalSlides}`, pageW / 2, pageH - 18, {
    align: "center",
  });
}

export async function buildStage2SlidesPdf(
  input: Stage2ExportInput,
): Promise<jsPDF> {
  if (!input.slides.length) throw new Error("Generate slides first.");
  const theme = stage2ThemeById(input.themeId);
  // Landscape A4 in points (not format: "landscape" — that is invalid and yields NaN sizes).
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
    orientation: "landscape",
  });
  const totalSlides = input.slides.length + 1;
  addPdfCover(doc, input, theme, totalSlides);
  for (let i = 0; i < input.slides.length; i++) {
    doc.addPage("a4", "landscape");
    await addPdfContentSlide(doc, input.slides[i]!, theme, i + 2, totalSlides);
  }
  return doc;
}

export async function buildStage2SpeakerNotesPdf(
  input: Stage2ExportInput,
): Promise<jsPDF> {
  if (!input.slides.length) throw new Error("Generate slides first.");
  const theme = stage2ThemeById(input.themeId);
  const accent = hexToRgb(theme.accentPrimary);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = new PdfWriter(doc, { margin: 48, contentTop: 48 });

  drawLessonPlanStyleCover(w, {
    eyebrow: "Speaker Notes",
    title: input.topic.trim() || "Presentation",
    personalization: input.personalization,
    schoolName: resolvedSchoolName(input) || input.schoolName,
    preparedBy: resolvedTeacherName(input) || input.teacherName,
    subject: input.subject,
    grade: input.grade,
    curriculumRoute: input.curriculumRoute,
  });

  for (const slide of input.slides) {
    w.ensure(46);
    doc.setFillColor(accent.r, accent.g, accent.b);
    doc.rect(w.margin, w.y - 10, 4, 18, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(PDF_INK);
    const heading = doc.splitTextToSize(
      `Slide ${slide.slideNumber}: ${slide.slideTitle || "Untitled"}`,
      w.maxWidth - 12,
    ) as string[];
    for (const line of heading) {
      doc.text(line, w.margin + 12, w.y);
      w.gap(16);
    }
    w.gap(4);

    const notes = slide.speakerNotes?.trim();
    if (notes) {
      w.markdown(structureQuestionAnswerMarkdown(notes));
    } else {
      w.paragraph("No speaker notes provided.", {
        color: PDF_MUTED,
        italic: true,
      });
    }
    w.gap(10);
  }

  return doc;
}

export async function downloadStage2SlidesPdf(input: Stage2ExportInput) {
  const doc = await buildStage2SlidesPdf(input);
  doc.save(fileName(input.topic, "slides", "pdf"));
}

export async function downloadStage2SpeakerNotesPdf(input: Stage2ExportInput) {
  const doc = await buildStage2SpeakerNotesPdf(input);
  doc.save(fileName(input.topic, "speaker_notes", "pdf"));
}

export async function printStage2SlidesPdf(input: Stage2ExportInput) {
  const doc = await buildStage2SlidesPdf(input);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}

export async function printStage2SpeakerNotesPdf(input: Stage2ExportInput) {
  const doc = await buildStage2SpeakerNotesPdf(input);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}

function decoratePptxSlide(
  s: ReturnType<PptxGenJS["addSlide"]>,
  pptx: PptxGenJS,
  theme: Stage2SlideTheme,
) {
  s.background = { color: hexColor(theme.backgroundGradient[1]!) };
  s.addShape(pptx.ShapeType.ellipse, {
    x: 10.55,
    y: -0.35,
    w: 3.2,
    h: 3.2,
    fill: { color: hexColor(theme.accentPrimary), transparency: 82 },
  });
  s.addShape(pptx.ShapeType.ellipse, {
    x: -0.45,
    y: 5.35,
    w: 2.6,
    h: 2.6,
    fill: { color: hexColor(theme.accentSecondary), transparency: 84 },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.16,
    h: 7.5,
    fill: { color: hexColor(theme.accentPrimary) },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.28,
    w: 13.333,
    h: 0.22,
    fill: { color: hexColor(theme.accentPrimary) },
  });
}

function pptxTextOpts(extra: Record<string, unknown> = {}) {
  return {
    fontFace: "Arial",
    margin: 0,
    wrap: true,
    isTextBox: true,
    ...extra,
  };
}

export async function downloadStage2Pptx(input: Stage2ExportInput) {
  if (!input.slides.length) throw new Error("Generate slides first.");
  const theme = stage2ThemeById(input.themeId);
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Make My Lesson";
  pptx.title = sanitizePptxText(input.topic) || "Presentation";
  pptx.revision = "1";

  const accent = hexColor(theme.accentPrimary);
  const accent2 = hexColor(theme.accentSecondary);
  const titleC = hexColor(theme.titleColor);
  const bodyC = hexColor(theme.bodyColor);
  const mutedC = hexColor(theme.mutedColor);
  const panelC = hexColor(theme.overlayPanelColor);

  const cover = pptx.addSlide();
  decoratePptxSlide(cover, pptx, theme);
  cover.addText("COVER SLIDE", pptxTextOpts({
    x: 0.5,
    y: 0.32,
    w: 4,
    h: 0.32,
    fontSize: 11,
    bold: true,
    color: mutedC,
  }));

  // Same row as COVER SLIDE — logo/photo on the right.
  const p = input.personalization;
  const logo = p?.schoolLogoDataUrl;
  const photo = p?.ownPictureDataUrl;
  const imgSize = 0.5;
  const imgY = 0.22;
  let rightX = 12.5;
  if (photo) {
    rightX -= imgSize;
    try {
      cover.addImage({
        data: photo,
        x: rightX,
        y: imgY,
        w: imgSize,
        h: imgSize,
      });
    } catch {
      /* ignore bad image */
    }
    rightX -= 0.12;
  }
  if (logo) {
    rightX -= imgSize;
    try {
      cover.addImage({
        data: logo,
        x: rightX,
        y: imgY,
        w: imgSize,
        h: imgSize,
      });
    } catch {
      /* ignore bad image */
    }
  }

  const coverTextY = 0.64;
  const school = sanitizePptxText(resolvedSchoolName(input));
  if (school) {
    cover.addText(school, pptxTextOpts({
      x: 0.5,
      y: coverTextY,
      w: 7.2,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: titleC,
    }));
  }
  const teacher = sanitizePptxText(resolvedTeacherName(input));
  if (teacher) {
    cover.addText(`Prepared by: ${teacher}`, pptxTextOpts({
      x: 7.6,
      y: coverTextY,
      w: 5.2,
      h: 0.4,
      fontSize: 14,
      color: mutedC,
      align: "right",
    }));
  }

  cover.addShape(pptx.ShapeType.roundRect, {
    x: 6.05,
    y: 2.15,
    w: 1.05,
    h: 0.14,
    fill: { color: accent },
    rectRadius: 0.07,
  });
  cover.addShape(pptx.ShapeType.ellipse, {
    x: 7.2,
    y: 2.1,
    w: 0.24,
    h: 0.24,
    fill: { color: accent2 },
  });
  cover.addShape(pptx.ShapeType.ellipse, {
    x: 5.72,
    y: 2.08,
    w: 0.28,
    h: 0.28,
    fill: { color: accent2 },
  });

  cover.addText(sanitizePptxText(input.topic) || "Presentation", pptxTextOpts({
    x: 0.8,
    y: 2.5,
    w: 11.7,
    h: 1.7,
    fontSize: 40,
    bold: true,
    color: titleC,
    align: "center",
    valign: "middle",
  }));
  const meta = sanitizePptxText(coverMetaLine(input));
  if (meta) {
    cover.addText(meta, pptxTextOpts({
      x: 1.4,
      y: 4.3,
      w: 10.5,
      h: 0.7,
      fontSize: 16,
      color: mutedC,
      align: "center",
    }));
  }
  cover.addText(`SLIDE 1 OF ${input.slides.length + 1}`, pptxTextOpts({
    x: 0.5,
    y: 6.82,
    w: 12.3,
    h: 0.32,
    fontSize: 11,
    bold: true,
    color: mutedC,
    align: "center",
  }));

  for (const slide of input.slides) {
    const s = pptx.addSlide();
    decoratePptxSlide(s, pptx, theme);
    const notes = sanitizePptxText(plainText(slide.speakerNotes));
    if (notes) s.addNotes(notes);

    const imageSrc = slideImageSrc(slide);
    const imageData = imageSrc ? await fetchImageAsDataUrl(imageSrc) : null;
    const textW = imageData ? 7.05 : 12.15;

    s.addText(
      sanitizePptxText((slide.slideType || `Slide ${slide.slideNumber}`).toUpperCase()),
      pptxTextOpts({
        x: 0.5,
        y: 0.28,
        w: 8,
        h: 0.28,
        fontSize: 11,
        bold: true,
        color: mutedC,
      }),
    );
    s.addText(`${slide.estimatedTimeMinutes} min`, pptxTextOpts({
      x: 10.4,
      y: 0.28,
      w: 2.4,
      h: 0.28,
      fontSize: 12,
      color: mutedC,
      align: "right",
    }));

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: 0.62,
      w: 0.72,
      h: 0.11,
      fill: { color: accent },
      rectRadius: 0.05,
    });
    s.addText(
      sanitizePptxText(slide.slideTitle) || `Slide ${slide.slideNumber}`,
      pptxTextOpts({
        x: 0.5,
        y: 0.78,
        w: textW,
        h: 0.78,
        fontSize: 26,
        bold: true,
        color: titleC,
        valign: "middle",
      }),
    );

    const bullets = slideBullets(slide)
      .map((b) => {
        const split = splitBullet(b);
        return {
          label: sanitizePptxText(split.label),
          rest: sanitizePptxText(split.rest),
        };
      })
      .filter((b) => b.label || b.rest);

    const startY = 1.68;
    const gap = 0.1;
    const avail = 6.95 - startY;
    const cardH = Math.min(
      1.18,
      Math.max(
        0.92,
        (avail - gap * Math.max(bullets.length - 1, 0)) /
          Math.max(bullets.length, 1),
      ),
    );

    bullets.forEach((bullet, i) => {
      const y = startY + i * (cardH + gap);
      const iconFill = i % 2 === 0 ? theme.accentPrimary : theme.accentSecondary;
      const iconColor = hexColor(iconFill);

      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.5,
        y,
        w: textW,
        h: cardH,
        fill: { color: panelC, transparency: theme.isLight ? 8 : 18 },
        line: { color: iconColor, width: 1 },
        rectRadius: 0.1,
      });
      s.addShape(pptx.ShapeType.ellipse, {
        x: 0.68,
        y: y + (cardH - 0.42) / 2,
        w: 0.42,
        h: 0.42,
        fill: { color: iconColor },
      });
      s.addText(String(i + 1), pptxTextOpts({
        x: 0.68,
        y: y + (cardH - 0.42) / 2,
        w: 0.42,
        h: 0.42,
        fontSize: 13,
        bold: true,
        color: isLightHex(iconFill) ? "0F172A" : "FFFFFF",
        align: "center",
        valign: "middle",
      }));

      const textX = 1.28;
      const textBoxW = textW - 0.92;
      if (bullet.label) {
        s.addText(bullet.label, pptxTextOpts({
          x: textX,
          y: y + 0.08,
          w: textBoxW,
          h: 0.28,
          fontSize: 14,
          bold: true,
          color: titleC,
          valign: "middle",
        }));
        if (bullet.rest) {
          s.addText(bullet.rest, pptxTextOpts({
            x: textX,
            y: y + 0.36,
            w: textBoxW,
            h: Math.max(0.4, cardH - 0.44),
            fontSize: 13,
            color: bodyC,
            valign: "top",
          }));
        }
      } else if (bullet.rest) {
        s.addText(bullet.rest, pptxTextOpts({
          x: textX,
          y: y + 0.1,
          w: textBoxW,
          h: cardH - 0.2,
          fontSize: 15,
          color: bodyC,
          valign: "middle",
        }));
      }
    });

    if (imageData) {
      try {
        s.addShape(pptx.ShapeType.roundRect, {
          x: 7.85,
          y: 1.7,
          w: 5.05,
          h: 4.55,
          fill: { color: panelC, transparency: 10 },
          rectRadius: 0.12,
        });
        s.addImage({
          data: imageData,
          x: 8.0,
          y: 1.85,
          w: 4.75,
          h: 4.25,
        });
      } catch {
        // Ignore image embed failures.
      }
    }
  }

  const blob = (await pptx.write({ outputType: "blob" })) as Blob;
  downloadBlob(blob, fileName(input.topic, "slides", "pptx"));
}

export async function buildStage2ZipBytes(
  input: Stage2ExportInput,
): Promise<Blob | null> {
  if (!input.slides.length) return null;
  const slidesDoc = await buildStage2SlidesPdf(input);
  const notesDoc = await buildStage2SpeakerNotesPdf(input);
  const zip = new JSZip();
  zip.file("slides.pdf", slidesDoc.output("arraybuffer"));
  zip.file("speaker_notes.pdf", notesDoc.output("arraybuffer"));
  return zip.generateAsync({ type: "blob" });
}

export async function downloadStage2Zip(input: Stage2ExportInput) {
  if (!input.slides.length) throw new Error("Generate slides first.");
  const blob = await buildStage2ZipBytes(input);
  if (!blob) throw new Error("Generate slides first.");
  downloadBlob(blob, fileName(input.topic, "slides_and_notes", "zip"));
}

export async function shareStage2Zip(input: Stage2ExportInput) {
  if (!input.slides.length) throw new Error("Generate slides first.");
  const blob = await buildStage2ZipBytes(input);
  if (!blob) throw new Error("Generate slides first.");
  const { shareBlobFile } = await import("@/services/document-export-core");
  return shareBlobFile({
    blob,
    filename: fileName(input.topic, "slides_and_notes", "zip"),
    title: `Stage 2 — ${input.topic}`,
    text: `Stage 2 presentation for ${input.topic}`,
  });
}

export const STAGE2_DOWNLOAD_ACTIONS = [
  { id: "pdf_slides", label: "PDF slides" },
  { id: "pdf_notes", label: "PDF speaker notes" },
  { id: "pptx", label: "PPT slides" },
  { id: "zip", label: "ZIP (slides + speaker notes)" },
  { id: "print_slides", label: "Print slides" },
  { id: "print_notes", label: "Print speaker notes" },
] as const;

export type Stage2DownloadActionId =
  (typeof STAGE2_DOWNLOAD_ACTIONS)[number]["id"];

export async function runStage2DownloadAction(
  action: Stage2DownloadActionId,
  input: Stage2ExportInput,
) {
  switch (action) {
    case "pdf_slides":
      await downloadStage2SlidesPdf(input);
      break;
    case "pdf_notes":
      await downloadStage2SpeakerNotesPdf(input);
      break;
    case "pptx":
      await downloadStage2Pptx(input);
      break;
    case "zip":
      await downloadStage2Zip(input);
      break;
    case "print_slides":
      await printStage2SlidesPdf(input);
      break;
    case "print_notes":
      await printStage2SpeakerNotesPdf(input);
      break;
    default:
      throw new Error("Unsupported export action.");
  }
}
