import { jsPDF } from "jspdf";
import JSZip from "jszip";
import PptxGenJS from "pptxgenjs";

import { stage2ThemeById, type Stage2SlideTheme } from "@/data/stage2-themes";
import type { Stage2Slide } from "@/types/stage2";

export type Stage2ExportInput = {
  topic: string;
  curriculumRoute: string;
  grade: string;
  subject: string;
  slides: Stage2Slide[];
  themeId: string;
  schoolName?: string | null;
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
  const mid = hexToRgb(theme.backgroundGradient[1] ?? theme.accentPrimary);
  // Solid fill — banded gradients previously hit NaN page sizes when format
  // was misconfigured as "landscape" instead of a real paper size.
  doc.setFillColor(mid.r, mid.g, mid.b);
  doc.rect(0, 0, w, h, "F");
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

  doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
  doc.roundedRect(48, 56, 72, 8, 2, 2, "F");

  doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  const title = doc.splitTextToSize(input.topic.trim() || "Presentation", pageW - 96);
  doc.text(title, 48, 100);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  let y = 100 + title.length * 32 + 12;
  for (const line of [
    input.curriculumRoute,
    `${input.grade} · ${input.subject}`,
    input.schoolName?.trim() || null,
  ].filter(Boolean) as string[]) {
    doc.text(line, 48, y);
    y += 18;
  }

  doc.setFontSize(10);
  doc.text(`SLIDE 1 OF ${totalSlides}`, pageW / 2, pageH - 28, {
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

  doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
  doc.roundedRect(40, 40, 56, 6, 2, 2, "F");

  const imageSrc = slideImageSrc(slide);
  const imageData = imageSrc ? await fetchImageAsDataUrl(imageSrc) : null;
  const hasImage = Boolean(imageData);
  const textMaxW = hasImage ? pageW * 0.48 : pageW - 80;

  doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(
    slide.slideTitle.trim() || `Slide ${slide.slideNumber}`,
    textMaxW,
  );
  let y = 70;
  doc.text(titleLines, 40, y);
  y += titleLines.length * 26 + 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(bodyRgb.r, bodyRgb.g, bodyRgb.b);
  const bullets = slide.slideContent
    .map((b) => plainText(b))
    .filter(Boolean)
    .slice(0, 5);
  for (const bullet of bullets) {
    const lines = doc.splitTextToSize(`• ${bullet}`, textMaxW);
    doc.text(lines, 40, y);
    y += lines.length * 18 + 6;
    if (y > pageH - 60) break;
  }

  if (imageData) {
    try {
      const imgW = pageW * 0.38;
      const imgH = pageH * 0.55;
      const imgX = pageW - imgW - 36;
      const imgY = (pageH - imgH) / 2;
      const format = imageData.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(imageData, format, imgX, imgY, imgW, imgH);
    } catch {
      // Skip broken images — text slides still export.
    }
  }

  doc.setFontSize(10);
  doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  doc.text(`SLIDE ${slideNo} OF ${totalSlides}`, pageW / 2, pageH - 24, {
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
  const margin = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensure = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(26, 28, 48);
  const title = doc.splitTextToSize(
    `${input.topic.trim() || "Presentation"} — Speaker notes`,
    maxW,
  );
  doc.text(title, margin, y);
  y += title.length * 22 + 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  for (const line of [
    `Curriculum: ${input.curriculumRoute}`,
    `Grade: ${input.grade}`,
    `Subject: ${input.subject}`,
  ]) {
    ensure(14);
    doc.text(line, margin, y);
    y += 14;
  }
  y += 10;

  for (const slide of input.slides) {
    ensure(40);
    doc.setFillColor(accent.r, accent.g, accent.b);
    doc.rect(margin, y - 10, 4, 18, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(26, 28, 48);
    const heading = doc.splitTextToSize(
      `Slide ${slide.slideNumber}: ${slide.slideTitle || "Untitled"}`,
      maxW - 12,
    );
    doc.text(heading, margin + 12, y);
    y += heading.length * 16 + 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40);
    const notes = plainText(slide.speakerNotes) || "No speaker notes provided.";
    for (const para of notes.split(/\n+/)) {
      if (!para.trim()) {
        y += 6;
        continue;
      }
      const lines = doc.splitTextToSize(para, maxW);
      for (const line of lines) {
        ensure(14);
        doc.text(line, margin, y);
        y += 14;
      }
      y += 4;
    }
    y += 12;
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

export async function downloadStage2Pptx(input: Stage2ExportInput) {
  if (!input.slides.length) throw new Error("Generate slides first.");
  const theme = stage2ThemeById(input.themeId);
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "MML_WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "MML_WIDE";
  pptx.author = "Make My Lesson";
  pptx.title = input.topic.trim() || "Presentation";

  const cover = pptx.addSlide();
  cover.background = { color: theme.backgroundGradient[1]!.replace("#", "") };
  cover.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 0.7,
    w: 0.9,
    h: 0.12,
    fill: { color: theme.accentPrimary.replace("#", "") },
    rectRadius: 0.06,
  });
  cover.addText(input.topic.trim() || "Presentation", {
    x: 0.6,
    y: 1.2,
    w: 12,
    h: 1.4,
    fontSize: 36,
    bold: true,
    color: theme.titleColor.replace("#", ""),
    fontFace: "Arial",
  });
  cover.addText(
    [
      input.curriculumRoute,
      `${input.grade} · ${input.subject}`,
      input.schoolName?.trim() || "",
    ]
      .filter(Boolean)
      .join("\n"),
    {
      x: 0.6,
      y: 2.9,
      w: 10,
      h: 1.5,
      fontSize: 16,
      color: theme.mutedColor.replace("#", ""),
      fontFace: "Arial",
    },
  );

  for (const slide of input.slides) {
    const s = pptx.addSlide();
    s.background = { color: theme.backgroundGradient[1]!.replace("#", "") };
    s.addNotes(plainText(slide.speakerNotes) || "");

    const imageSrc = slideImageSrc(slide);
    const imageData = imageSrc ? await fetchImageAsDataUrl(imageSrc) : null;
    const textW = imageData ? 6.8 : 12;

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55,
      y: 0.45,
      w: 0.75,
      h: 0.1,
      fill: { color: theme.accentPrimary.replace("#", "") },
      rectRadius: 0.05,
    });
    s.addText(slide.slideTitle.trim() || `Slide ${slide.slideNumber}`, {
      x: 0.55,
      y: 0.75,
      w: textW,
      h: 1,
      fontSize: 28,
      bold: true,
      color: theme.titleColor.replace("#", ""),
      fontFace: "Arial",
    });

    const bullets = slide.slideContent
      .map((b) => plainText(b))
      .filter(Boolean)
      .slice(0, 5);
    if (bullets.length) {
      s.addText(
        bullets.map((b) => ({ text: b, options: { bullet: true } })),
        {
          x: 0.55,
          y: 1.9,
          w: textW,
          h: 4.5,
          fontSize: 16,
          color: theme.bodyColor.replace("#", ""),
          fontFace: "Arial",
          valign: "top",
        },
      );
    }

    if (imageData) {
      try {
        s.addImage({
          data: imageData,
          x: 7.7,
          y: 1.4,
          w: 5,
          h: 4.5,
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
