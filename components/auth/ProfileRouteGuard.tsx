"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/Spinner";
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

export function ProfileRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authReady = useAuthStore((s) => s.authReady);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const isAuthRoute = isAuthPublicPath(pathname);
  const isMarketing = isMarketingPath(pathname);
  const redirectedRef = useRef<string | null>(null);

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
