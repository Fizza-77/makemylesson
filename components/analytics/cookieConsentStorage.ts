export const COOKIE_CONSENT_STORAGE_KEY = "mml-cookie-consent";
export const COOKIE_CONSENT_VERSION = "1";

export type StoredCookieConsent = {
  version: string;
  choice: "all" | "essential";
  analytics: boolean;
  essential: boolean;
  timestamp: string;
};

export function readStoredCookieConsent(): StoredCookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredCookieConsent;
    if (parsed?.version !== COOKIE_CONSENT_VERSION) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  const stored = readStoredCookieConsent();
  return stored?.analytics === true || stored?.choice === "all";
}


