/** Firebase Auth uid prefix for web guest sessions (custom token fallback). */
export const GUEST_WEB_UID_PREFIX = "guest_web_";

const GUEST_AUTH_UID_KEY = "mml_guest_auth_uid";

const GUEST_UID_PATTERN = /^guest_web_[a-zA-Z0-9_-]{8,64}$/;

export function isGuestWebUid(uid: string | null | undefined): boolean {
  return Boolean(uid?.startsWith(GUEST_WEB_UID_PREFIX));
}

export function isValidGuestWebUid(uid: string | null | undefined): uid is string {
  return Boolean(uid && GUEST_UID_PATTERN.test(uid));
}

export function readStoredGuestAuthUid(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GUEST_AUTH_UID_KEY)?.trim() ?? "";
    return isValidGuestWebUid(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeStoredGuestAuthUid(uid: string): void {
  if (typeof window === "undefined") return;
  if (!isValidGuestWebUid(uid)) return;
  try {
    window.localStorage.setItem(GUEST_AUTH_UID_KEY, uid);
  } catch {
    /* ignore */
  }
}

export function newGuestWebUid(): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `${GUEST_WEB_UID_PREFIX}${id}`;
}


