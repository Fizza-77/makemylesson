export const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN?.replace(/\/$/, "") ??
  "https://makemylesson.ai";

/** App and marketing share one host now; kept separate for legacy env overrides. */
export const MARKETING_ORIGIN =
  process.env.NEXT_PUBLIC_MARKETING_ORIGIN?.replace(/\/$/, "") ??
  "https://makemylesson.ai";

/**
 * Canonical Next.js (web) routes.
 * Flutter mobile still uses `/auth/sign-in` etc.; those are redirected here in next.config.
 * Firebase Auth/Functions/Firestore are unchanged — only client URL paths.
 */
export const ROUTES = {
  /**
   * App workspace entry — Stage 1 (no separate in-app home).
   * Marketing landing stays at `/`.
   */
  home: "/stage1",
  signIn: "/login",
  signUp: "/signup",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-email",
  resetPassword: "/reset-password",
  completeProfile: "/complete-profile",
  library: "/library",
  libraryReview: "/library/review",
  /** Review a specific catalog row: `/library/review?id=…` */
  libraryReviewItem: (id: string) =>
    `/library/review?id=${encodeURIComponent(id)}`,
  profile: "/profile",
  /** Marketing pricing + PayPal checkout (canonical purchase surface). */
  pricing: "/pricing",
  /** Legacy alias — redirects to `/pricing`. Prefer `ROUTES.pricing`. */
  subscription: "/pricing",
  organizationDashboard: "/organization-dashboard",
  notifications: "/notifications",
  stage1: "/stage1",
  stage2: "/stage2",
  stage3: "/stage3",
  stage4: "/stage4",
} as const;

/** Flutter / legacy paths → web routes (also configured in next.config redirects). */
export const LEGACY_AUTH_REDIRECTS = [
  { from: "/auth/sign-in", to: ROUTES.signIn },
  { from: "/auth/sign-up", to: ROUTES.signUp },
  { from: "/auth/forgot-password", to: ROUTES.forgotPassword },
  { from: "/auth/verify-otp", to: ROUTES.verifyOtp },
  { from: "/auth/reset-password", to: ROUTES.resetPassword },
  { from: "/auth/complete-profile", to: ROUTES.completeProfile },
] as const;

export const AUTH_PUBLIC_PATHS = new Set<string>([
  ROUTES.signIn,
  ROUTES.signUp,
  ROUTES.forgotPassword,
  ROUTES.verifyOtp,
  ROUTES.resetPassword,
  ROUTES.completeProfile,
]);

export function isAuthPublicPath(pathname: string): boolean {
  if (AUTH_PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/auth/")) return true; // before redirect settles
  return false;
}

export const PUBLIC_PATH_PREFIXES = [
  "/",
  "/blog",
  "/contact",
  "/pricing",
  "/faq",
  "/features",
  "/teaching-methods",
  "/privacy",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/terms-of-service",
  "/acceptable-use-policy",
  "/account-data-deletion",
  "/disclaimer",
  "/refund-payments-policy",
  "/lesson",
  "/smartlink",
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
  "/reset-password",
  "/complete-profile",
  "/auth/",
  "/_next",
  "/api",
  "/logo.jpeg",
  "/logo.png",
  "/manifest.webmanifest",
  "/firebase-messaging-sw.js",
  "/sw.js",
  "/workbox-",
] as const;

export const AUTH_OPTIONAL_PATHS = new Set<string>([
  ROUTES.stage1,
  ROUTES.stage2,
  ROUTES.stage3,
  ROUTES.stage4,
  ROUTES.signIn,
  ROUTES.signUp,
  ROUTES.forgotPassword,
  ROUTES.verifyOtp,
  ROUTES.resetPassword,
  ROUTES.pricing,
]);

/** Marketing site pages — no auth gate / no spinner wait. */
export const MARKETING_PATH_PREFIXES = [
  "/",
  "/blog",
  "/contact",
  "/pricing",
  "/faq",
  "/features",
  "/teaching-methods",
  "/lesson",
  "/smartlink",
  "/privacy-policy",
  "/cookie-policy",
  "/terms-of-service",
  "/acceptable-use-policy",
  "/account-data-deletion",
  "/disclaimer",
  "/refund-payments-policy",
  "/privacy",
  "/terms",
] as const;

export function isMarketingPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return MARKETING_PATH_PREFIXES.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}

export const AppUrls = {
  marketingHome: "/",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
  contactSales: "/contact",
  helpEmail: "hello@makemylesson.ai",
  supportEmail: "support@makemylesson.ai",
  smartLink: "https://makemylesson.ai/smartlink",
} as const;
