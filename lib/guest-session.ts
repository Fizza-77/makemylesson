import type { User } from "firebase/auth";

/** Matches Flutter `EffectiveAuthState.isGuest` — no Firebase user session. */
export function isGuestUser(user: User | null | undefined): boolean {
  return !user;
}

/** Signed in with email, Google, Apple, etc. */
export function isRegisteredUser(user: User | null | undefined): boolean {
  return Boolean(user);
}
