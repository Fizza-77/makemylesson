import JSZip from "jszip";

/** Client-side source file parsing for Stages 2–4 (mirrors Flutter Stage2SourceParserService). */

export const STAGE_SOURCE_MAX_BYTES = 5 * 1024 * 1024;
export const STAGE_SOURCE_MIN_CHARS = 50;

export type StageSourcePickKind = "lessonDocument" | "presentation";

export type ParsedStageSource = {
  fileName: string;
  text: string;
};

const LESSON_EXTS = [".txt", ".pdf", ".docx"] as const;
const PRESENTATION_EXTS = [".txt", ".pdf", ".docx", ".pptx"] as const;

function extensionsFor(kind: StageSourcePickKind): readonly string[] {
  return kind === "presentation" ? PRESENTATION_EXTS : LESSON_EXTS;
}

function acceptAttr(kind: StageSourcePickKind): string {
  return extensionsFor(kind).join(",");
}

function decodeUtf8(bytes: ArrayBuffer): string {
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

async function extractDocxText(bytes: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(bytes);
  const docXml = zip.file("word/document.xml");
  if (!docXml) throw new Error("DOCX text payload not found.");
  const xml = await docXml.async("string");
  return xml
    .replace(/<w:tab[^/]*\/>/g, "\t")
    .replace(/<w:br[^/]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ");
}

async function extractPptxText(bytes: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(bytes);
  const slideFiles = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/i.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!slideFiles.length) throw new Error("PPTX slides not found.");
  const chunks: string[] = [];
  for (const name of slideFiles) {
    const file = zip.file(name);
    if (!file) continue;
    const xml = await file.async("string");
    const text = xml
      .replace(/<\/a:p>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
    if (text) chunks.push(text);
  }
  return chunks.join("\n\n");
}

async function extractPdfText(bytes: ArrayBuffer): Promise<string> {
  // Lightweight PDF text scrape: extract printable strings between BT/ET and
  // parentheses. Good enough for many teacher-authored PDFs without adding
  // pdf.js. Complex/scanned PDFs should be pasted instead.
  const raw = decodeUtf8(bytes);
  const chunks: string[] = [];
  const streamRe = /BT([\s\S]*?)ET/g;
  let m: RegExpExecArray | null;
  while ((m = streamRe.exec(raw)) !== null) {
    const block = m[1];
    const strRe = /\((?:\\.|[^\\)])*\)/g;
    let s: RegExpExecArray | null;
    while ((s = strRe.exec(block)) !== null) {
      const inner = s[0].slice(1, -1)
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .replace(/\\t/g, "\t")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\\/g, "\\");
      if (inner.trim()) chunks.push(inner);
    }
  }
  const joined = chunks.join(" ").replace(/\s+/g, " ").trim();
  if (joined.length >= STAGE_SOURCE_MIN_CHARS) return joined;
  throw new Error(
    "Could not extract enough text from this PDF. Paste the content instead, or upload a TXT/DOCX.",
  );
}

export async function parseStageSourceFile(
  file: File,
  kind: StageSourcePickKind = "lessonDocument",
): Promise<ParsedStageSource> {
  if (file.size > STAGE_SOURCE_MAX_BYTES) {
    throw new Error("File size exceeds 5 MB limit.");
  }
  const fileName = file.name.trim() || "lesson_source";
  const lower = fileName.toLowerCase();
  const allowed = extensionsFor(kind);
  if (!allowed.some((ext) => lower.endsWith(ext))) {
    throw new Error(
      `Unsupported file type. Use ${allowed.join(", ").replace(/\./g, "")}.`,
    );
  }
  if (lower.endsWith(".ppt") && !lower.endsWith(".pptx")) {
    throw new Error(
      "Legacy .ppt is not supported. Save as .pptx and upload again.",
    );
  }

  const bytes = await file.arrayBuffer();
  let text: string;
  if (lower.endsWith(".txt")) {
    text = decodeUtf8(bytes);
  } else if (lower.endsWith(".pdf")) {
    text = await extractPdfText(bytes);
  } else if (lower.endsWith(".docx")) {
    text = await extractDocxText(bytes);
  } else if (lower.endsWith(".pptx")) {
    text = await extractPptxText(bytes);
  } else {
    throw new Error("Unsupported file type.");
  }

  const normalized = text.trim();
  if (normalized.length < STAGE_SOURCE_MIN_CHARS) {
    throw new Error(
      `Lesson source text is too short. Please provide at least ${STAGE_SOURCE_MIN_CHARS} characters.`,
    );
  }
  return { fileName, text: normalized };
}

/** Opens a hidden file input and returns the parsed source (or null if cancelled). */
export function pickAndParseStageSource(
  kind: StageSourcePickKind = "lessonDocument",
): Promise<ParsedStageSource | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptAttr(kind);
    input.style.display = "none";
    document.body.appendChild(input);
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      input.remove();
      if (!file) {
        resolve(null);
        return;
      }
      void parseStageSourceFile(file, kind).then(resolve).catch(reject);
    });
    input.addEventListener("cancel", () => {
      input.remove();
      resolve(null);
    });
    input.click();
  });
}


