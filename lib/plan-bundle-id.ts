/** Matches Flutter `LessonDraft.newPlanBundleId()` — 32 hex chars. */
export function newPlanBundleId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
