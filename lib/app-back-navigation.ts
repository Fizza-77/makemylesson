import { ROUTES } from "@/lib/urls";

/** Auth / public flows — no app back chrome. */
export function isAuthRoute(pathname: string): boolean {
  if (pathname.startsWith("/auth/")) return true;
  return (
    pathname === ROUTES.signIn ||
    pathname === ROUTES.signUp ||
    pathname === ROUTES.forgotPassword ||
    pathname === ROUTES.verifyOtp ||
    pathname === ROUTES.resetPassword ||
    pathname === ROUTES.completeProfile
  );
}

/** Workspace root — Stage 1 (no separate in-app home). */
export function isHomeRoute(pathname: string): boolean {
  return (
    pathname === ROUTES.stage1 ||
    pathname.startsWith(`${ROUTES.stage1}/`) ||
    pathname === ""
  );
}

/** Top-left back control (Flutter `showBackButton`). */
export function showAppBackButton(pathname: string): boolean {
  if (isAuthRoute(pathname)) return false;
  if (isHomeRoute(pathname)) return false;
  return true;
}

/**
 * Logical parent when history cannot pop (Flutter `appNavigateBack`).
 * Returns a path to `router.replace`, or `null` to stay put.
 */
export function logicalBackPath(pathname: string): string {
  if (pathname.startsWith(ROUTES.stage2)) return ROUTES.stage1;
  if (pathname.startsWith(ROUTES.stage3)) return ROUTES.stage2;
  if (pathname.startsWith(ROUTES.stage4)) return ROUTES.stage3;
  if (pathname.startsWith(ROUTES.libraryReview)) return ROUTES.library;
  if (pathname.startsWith(ROUTES.organizationDashboard)) return ROUTES.profile;
  if (
    pathname.startsWith(ROUTES.stage1) ||
    pathname.startsWith(ROUTES.library) ||
    pathname.startsWith(ROUTES.profile) ||
    pathname.startsWith(ROUTES.subscription) ||
    pathname.startsWith(ROUTES.notifications)
  ) {
    return ROUTES.stage1;
  }
  return ROUTES.stage1;
}


