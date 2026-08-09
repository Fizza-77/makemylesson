/** Mirrors Flutter `StorageKeys.profileDefaultExport` / `DefaultExportFormat`. */

export const EXPORT_FORMAT_STORAGE_KEY = "profile_default_export";

export type DefaultExportFormat = "pdf" | "docx" | "pptx";

const ALLOWED = new Set<DefaultExportFormat>(["pdf", "docx", "pptx"]);

export function loadDefaultExportFormat(): DefaultExportFormat {
  if (typeof window === "undefined") return "pdf";
  try {
    const raw = window.localStorage.getItem(EXPORT_FORMAT_STORAGE_KEY);
    if (raw && ALLOWED.has(raw as DefaultExportFormat)) {
      return raw as DefaultExportFormat;
    }
  } catch {
    /* ignore */
  }
  return "pdf";
}

export function saveDefaultExportFormat(format: DefaultExportFormat): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EXPORT_FORMAT_STORAGE_KEY, format);
  } catch {
    /* ignore */
  }
}

export const DEFAULT_EXPORT_FORMAT_OPTIONS: {
  id: DefaultExportFormat;
  label: string;
  hint: string;
}[] = [
  { id: "pdf", label: "PDF", hint: "Best for print & share on web" },
  { id: "docx", label: "DOCX", hint: "Preferred when Word export is available" },
  { id: "pptx", label: "PPTX", hint: "Preferred for Stage 2 slides" },
];

/**
 * Sort download-menu actions so the preferred format appears first.
 * `formatHint` should be a substring of the action id (e.g. "pdf", "pptx").
 */
export function sortActionsByExportPreference<T extends { id: string }>(
  actions: readonly T[],
  preferred: DefaultExportFormat = loadDefaultExportFormat(),
): T[] {
  const score = (id: string): number => {
    const lower = id.toLowerCase();
    if (preferred === "pptx" && lower.includes("pptx")) return 0;
    if (preferred === "docx" && lower.includes("docx")) return 0;
    if (preferred === "pdf" && lower.includes("pdf")) return 0;
    if (preferred === "pptx" && lower.includes("ppt")) return 0;
    return 1;
  };
  return [...actions].sort((a, b) => score(a.id) - score(b.id));
}
