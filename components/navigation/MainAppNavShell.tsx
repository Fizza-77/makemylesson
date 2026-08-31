"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { NotificationsPanel } from "@/features/notifications/NotificationsPanel";
import { ProfileAvatarDisplay } from "@/features/profile/ProfileAvatarDisplay";
import { MarketingHomeLink } from "@/components/common/MarketingHomeLink";
import { OpenInAppDialog } from "@/components/common/OpenInAppDialog";
import { PricingLink } from "@/components/common/PricingLink";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/urls";
import { upsertCurrentDeviceToken } from "@/services/fcm-web.service";
import { recordAppOpened } from "@/services/notification-lifecycle.service";
import { useAccountStore } from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import { useAppCredits } from "@/hooks/useAppCredits";
import { isRegisteredUser } from "@/lib/guest-session";
import { useNotificationsPanelStore } from "@/store/notifications-panel-store";
import {
  syncNotificationsSubscription,
  useNotificationsStore,
} from "@/store/notifications-store";

type Tab = "home" | "library" | "profile" | "notifications";

const primaryTabs = [
  {
    id: "home" as const,
    label: "Home",
    href: ROUTES.home,
    icon: "home" as const,
  },
  {
    id: "library" as const,
    label: "Library",
    href: ROUTES.library,
    icon: "library" as const,
  },
  {
    id: "profile" as const,
    label: "Profile",
    href: ROUTES.profile,
    icon: "profile" as const,
  },
];

function activeTab(pathname: string): Tab {
  if (pathname.startsWith(ROUTES.library)) return "library";
  if (pathname.startsWith(ROUTES.profile)) return "profile";
  if (pathname.startsWith(ROUTES.notifications)) return "notifications";
  // Home opens Stage 1; keep it active across the stage flow.
  return "home";
}

function NavIcon({
  name,
}: {
  name: "home" | "library" | "profile" | "alerts";
}) {
  if (name === "library") {
    return (
      <Image
        src="/icons/lib.svg"
        alt=""
        width={17}
        height={17}
        className="size-[18px] shrink-0"
        unoptimized
      />
    );
  }

  const props = {
    className: "size-[18px] shrink-0",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...props}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
        </svg>
      );
    case "profile":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19.5c1.6-3.2 4-4.8 7-4.8s5.4 1.6 7 4.8" />
        </svg>
      );
    case "alerts":
      return (
        <svg {...props}>
          <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
      );
  }
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "T";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function MainAppNavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = activeTab(pathname);
  const isProfilePage = pathname.startsWith(ROUTES.profile);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const authReady = useAuthStore((s) => s.authReady);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const account = useAccountStore((s) => s.account);
  const panelOpen = useNotificationsPanelStore((s) => s.open);
  const togglePanel = useNotificationsPanelStore((s) => s.togglePanel);
  const openPanel = useNotificationsPanelStore((s) => s.openPanel);

  const displayName =
    account?.displayName ||
    profile?.displayName ||
    user?.displayName ||
    "Teacher";
  const { remaining, loading: creditsLoading, isFree, isGuest } =
    useAppCredits();
  const creditsLabel =
    creditsLoading || remaining === null ? "…" : String(remaining);

  useEffect(() => {
    if (!authReady) return;
    syncNotificationsSubscription(user?.uid ?? null);
    if (user?.uid) {
      void recordAppOpened().catch(() => null);
      void upsertCurrentDeviceToken(user.uid);
    }
  }, [authReady, user?.uid]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("alerts") !== "1") return;
    openPanel();
    params.delete("alerts");
    const qs = params.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
    );
  }, [pathname, openPanel]);

  return (
    <div
      className={cn(
        "relative min-h-screen",
        isProfilePage ? "bg-[#EEF8F7]" : "bg-[#F5F6FA]",
      )}
    >
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-50 -translate-y-[200%] rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#1A1C30] shadow-lg transition focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-[#E8EAED] bg-white">
        <div className="app-shell-inner flex h-[72px] items-center gap-4">
          {/* Left brand → web landing (system browser when installed as PWA) */}
          <div className="flex min-w-0 flex-1 items-center">
            <MarketingHomeLink className="flex min-w-0 items-center gap-3">
              <Image
                src="/logo.png"
                alt="Make My Lesson"
                width={42}
                height={42}
                className="hidden size-[42px] shrink-0 rounded-xl object-cover md:block"
                priority
              />
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-bold leading-tight text-[#0F172A]">
                  Make My Lesson
                </span>
                <span className="mt-0.5 hidden truncate text-[10px] font-medium text-[#94A3B8] sm:block">
                  Professional teacher workspace
                </span>
              </span>
            </MarketingHomeLink>
          </div>

          {/* Center tabs — plain Tailwind flex, no CSS grid */}
          <nav
            className="hidden shrink-0 items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {primaryTabs
              .filter((tab) => isRegisteredUser(user) || tab.id !== "profile")
              .map((tab) => {
                const isActive = tab.id === current;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-[#E7F7F6] text-[#0F172A]"
                        : "text-[#334155] hover:bg-[#F5F6FA] hover:text-[#0F172A]",
                    )}
                  >
                    <NavIcon name={tab.icon} />
                    {tab.label}
                  </Link>
                );
              })}
          </nav>

          {/* Right: auth CTAs (guest) or alerts / credits / profile */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">

            {authReady && !isRegisteredUser(user) ? (
              <>
                <PricingLink
                  href={ROUTES.subscription}
                  className="inline-flex max-w-[11rem] items-center truncate rounded-lg bg-[#0F172A] px-2.5 py-2 text-[10px] font-semibold whitespace-nowrap text-white sm:max-w-[12rem] sm:px-3 sm:text-[11px]"
                >
                  <span className="text-[#2DD4BF]">{creditsLabel}</span>
                  <span className="ml-1 truncate font-medium">
                    free credits left
                  </span>
                </PricingLink>
                <Link
                  href={`${ROUTES.signIn}?next=${encodeURIComponent(pathname || ROUTES.home)}`}
                  className="inline-flex items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold text-[#334155] transition hover:bg-[#F5F6FA] hover:text-[#0F172A] sm:px-4"
                >
                  Sign in
                </Link>
                <Link
                  href={`${ROUTES.signUp}?next=${encodeURIComponent(pathname || ROUTES.home)}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#0F172A] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#1E293B] sm:px-4"
                >
                  Sign up
                </Link>
              </>
            ) : null}

            {isRegisteredUser(user) ? (
              <>
                <button
                  id="nav-alerts-bell"
                  type="button"
                  onClick={togglePanel}
                  className={cn(
                    "relative inline-flex size-10 items-center justify-center rounded-full text-[#334155] hover:bg-[#F5F6FA]",
                    (panelOpen || current === "notifications") &&
                      "bg-[#E7F7F6] text-[#0F172A]",
                  )}
                  aria-label={
                    unreadCount > 0
                      ? `Alerts, ${unreadCount} unread`
                      : "Alerts"
                  }
                  aria-expanded={panelOpen}
                  aria-haspopup="dialog"
                >
                  <NavIcon name="alerts" />
                  {unreadCount > 0 ? (
                    <span className="absolute top-1.5 right-1.5 flex min-w-[1rem] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold leading-4 text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  ) : null}
                </button>

                {authReady ? (
                  <PricingLink
                    href={ROUTES.subscription}
                    className="inline-flex max-w-[11rem] items-center truncate rounded-lg bg-[#0F172A] px-2.5 py-2 text-[10px] font-semibold whitespace-nowrap text-white sm:max-w-[12rem] sm:px-3 sm:text-[11px]"
                  >
                    <span className="text-[#2DD4BF]">{creditsLabel}</span>
                    <span className="ml-1 truncate font-medium">
                      {isFree ? "free credits left" : "credits left"}
                    </span>
                  </PricingLink>
                ) : null}

                <Link
                  href={ROUTES.profile}
                  className="flex max-w-[10.5rem] items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white py-1.5 pr-2.5 pl-1.5 hover:bg-[#F8FAFC]"
                >
                  {account ? (
                    <ProfileAvatarDisplay
                      account={account}
                      sizeClass="size-8"
                      className="bg-[#2DD4BF] text-[11px] font-bold text-[#0F172A]"
                    />
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2DD4BF] text-[11px] font-bold text-[#0F172A]">
                      {initialsFromName(displayName)}
                    </span>
                  )}
                  <span className="hidden min-w-0 sm:block">
                    <span className="block truncate text-xs font-bold leading-tight whitespace-nowrap text-[#0F172A]">
                      {displayName}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] font-medium leading-none whitespace-nowrap text-[#94A3B8]">
                      Teacher account
                    </span>
                  </span>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="app-shell-inner w-full flex-1 py-5 pb-24 outline-none lg:py-6 lg:pb-8"
      >
        {children}
      </main>

      <NotificationsPanel />
      <OpenInAppDialog />

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-white md:hidden"
        aria-label="Mobile"
      >
        <ul className="mx-auto flex max-w-lg justify-between px-1 py-1.5">
          {primaryTabs
            .filter((tab) => isRegisteredUser(user) || tab.id !== "profile")
            .map((tab) => {
              const isActive = tab.id === current;
              return (
                <li key={tab.id} className="flex-1">
                  <Link
                    href={tab.href}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold",
                      isActive ? "text-[#0F172A]" : "text-[#64748B]",
                    )}
                  >
                    <span
                      className={cn(
                        "relative inline-flex rounded-full p-1.5",
                        isActive && "bg-[#E7F7F6]",
                      )}
                    >
                      <NavIcon name={tab.icon} />
                    </span>
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          {authReady && !user ? (
            <>
              <li className="flex-1">
                <Link
                  href={`${ROUTES.signIn}?next=${encodeURIComponent(pathname || ROUTES.home)}`}
                  className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-[#64748B]"
                >
                  <span className="relative inline-flex rounded-full p-1.5">
                    <NavIcon name="profile" />
                  </span>
                  Sign in
                </Link>
              </li>
              <li className="flex-1">
                <Link
                  href={`${ROUTES.signUp}?next=${encodeURIComponent(pathname || ROUTES.home)}`}
                  className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-[#0F172A]"
                >
                  <span className="relative inline-flex rounded-full bg-[#E7F7F6] p-1.5">
                    <NavIcon name="profile" />
                  </span>
                  Sign up
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}
