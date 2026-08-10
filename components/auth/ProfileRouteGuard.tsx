"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/Spinner";
import { openPricingPage } from "@/lib/open-pricing";
import { isStandaloneDisplay } from "@/lib/pwa-install";
import { isAuthPublicPath, isMarketingPath, ROUTES } from "@/lib/urls";
import { signOutUser } from "@/firebase/auth";
import { useAuthStore } from "@/store/auth-store";

/** Defer until App Router dispatch is ready (avoids Next 16 Turbopack init race). */
function safeReplace(router: ReturnType<typeof useRouter>, href: string) {
  window.setTimeout(() => {
    try {
      router.replace(href);
    } catch {
      window.location.assign(href);
    }
  }, 0);
}

function subscribeStandalone(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function ProfileRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authReady = useAuthStore((s) => s.authReady);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const isAuthRoute = isAuthPublicPath(pathname);
  const isMarketing = isMarketingPath(pathname);
  const isPwaStandalone = useSyncExternalStore(
    subscribeStandalone,
    () => isStandaloneDisplay(),
    () => false,
  );
  const redirectedRef = useRef<string | null>(null);
  const pwaMarketingRedirectRef = useRef<string | null>(null);

  // Installed PWA: never show marketing pages — land on Stage 1.
  // Pricing opens in the system browser, then the app stays on Stage 1.
  useEffect(() => {
    if (!isPwaStandalone || !isMarketingPath(pathname)) {
      pwaMarketingRedirectRef.current = null;
      return;
    }
    const key = `${pathname}${window.location.search}`;
    if (pwaMarketingRedirectRef.current === key) return;
    pwaMarketingRedirectRef.current = key;

    if (
      pathname === ROUTES.pricing ||
      pathname.startsWith(`${ROUTES.pricing}/`)
    ) {
      openPricingPage(undefined, window.location.search);
    }
    safeReplace(router, ROUTES.home);
  }, [isPwaStandalone, pathname, router]);

  useEffect(() => {
    if (!authReady) return;

    if (user && profile?.banned) {
      const href = `${ROUTES.signIn}?reason=${encodeURIComponent(
        "Your account has been suspended. Please contact support.",
      )}`;
      if (redirectedRef.current === href) return;
      redirectedRef.current = href;
      void signOutUser().then(() => {
        useAuthStore.getState().reset();
        safeReplace(router, href);
      });
      return;
    }

    if (
      user &&
      profile?.needsCompletion &&
      pathname !== ROUTES.completeProfile &&
      !isAuthPublicPath(pathname) &&
      !isMarketingPath(pathname)
    ) {
      if (redirectedRef.current === ROUTES.completeProfile) return;
      redirectedRef.current = ROUTES.completeProfile;
      safeReplace(router, ROUTES.completeProfile);
    }
  }, [authReady, pathname, profile, router, user]);

  // Installed PWA must not paint marketing chrome while redirecting to Stage 1.
  if (isPwaStandalone && isMarketing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Marketing + auth screens render immediately; app routes wait for auth.
  if (!authReady && !isAuthRoute && !isMarketing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return children;
}
