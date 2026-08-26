/** Session flag so the logo splash can survive auth → app layout remounts. */
const LOGO_SPLASH_KEY = "mml:logo-splash";

/** Queue the MML logo intro for the next app shell mount (sign-in / welcome). */
export function requestLogoSplash(): void {
  try {
    sessionStorage.setItem(LOGO_SPLASH_KEY, "1");
  } catch {
    // Private mode / disabled storage — splash simply won't force-play.
  }
}

/** Returns true once if a splash was requested, and clears the flag. */
export function consumeLogoSplashRequest(): boolean {
  try {
    if (sessionStorage.getItem(LOGO_SPLASH_KEY) !== "1") return false;
    sessionStorage.removeItem(LOGO_SPLASH_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * After auth, play the logo splash when entering the main app
 * (not when staying on complete-profile / sign-in).
 */
export function requestLogoSplashAfterAuth(dest: string): void {
  const path = dest.split("?")[0] ?? dest;
  if (
    path === "/complete-profile" ||
    path === "/login" ||
    path === "/signup" ||
    path.startsWith("/auth/")
  ) {
    return;
  }
  requestLogoSplash();
}
