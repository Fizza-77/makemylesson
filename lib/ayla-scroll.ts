/** Shared helpers for scrolling to the in-page Ayla panel (no hash URLs). */

export const AYLA_PANEL_ID = "ayla-chat-panel";
export const SCROLL_TO_AYLA_KEY = "mml.scrollToAyla";

export function scrollToAylaPanel(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(AYLA_PANEL_ID);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function requestScrollToAyla() {
  try {
    sessionStorage.setItem(SCROLL_TO_AYLA_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function consumeScrollToAylaRequest(): boolean {
  try {
    if (sessionStorage.getItem(SCROLL_TO_AYLA_KEY) !== "1") return false;
    sessionStorage.removeItem(SCROLL_TO_AYLA_KEY);
    return true;
  } catch {
    return false;
  }
}
