"use client";

import { useSyncExternalStore } from "react";

import {
  GUEST_GENERATION_CREDIT_CAP,
  getGuestCreditsRemaining,
  getGuestTrialUsedCount,
  isGuestCreditsHydrated,
  subscribeGuestCredits,
} from "@/lib/guest-credits";
import { isRegisteredUser } from "@/lib/guest-session";
import {
  freeCreditsSummaryLine,
  isPaidPlan,
  profileCreditsRemainingLine,
} from "@/services/user-account.service";
import { useAccountStore } from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";

export type AppCreditsView = {
  remaining: number | null;
  used: number;
  cap: number;
  summaryLine: string;
  loading: boolean;
  isGuest: boolean;
  isFree: boolean;
};

type GuestCreditsSnapshot = Pick<
  AppCreditsView,
  "remaining" | "used" | "cap" | "summaryLine" | "loading"
>;

const GUEST_CREDITS_SERVER_SNAPSHOT: GuestCreditsSnapshot = {
  remaining: GUEST_GENERATION_CREDIT_CAP,
  used: 0,
  cap: GUEST_GENERATION_CREDIT_CAP,
  summaryLine: "Loading credits…",
  loading: true,
};

let cachedGuestSnapshot: GuestCreditsSnapshot | null = null;
let cachedGuestSnapshotKey = "";

function buildGuestCreditsSnapshotKey(): string {
  return `${isGuestCreditsHydrated()}:${getGuestCreditsRemaining()}:${getGuestTrialUsedCount()}`;
}

function buildGuestCreditsSnapshot(): GuestCreditsSnapshot {
  const cap = GUEST_GENERATION_CREDIT_CAP;
  const hydrated = isGuestCreditsHydrated();
  const remaining = getGuestCreditsRemaining();
  const used = getGuestTrialUsedCount();
  const summaryLine = hydrated
    ? freeCreditsSummaryLine(remaining, cap).replace(/\s*generation\s+/gi, " ")
    : "Loading credits…";
  return {
    remaining: hydrated ? remaining : null,
    used,
    cap,
    summaryLine,
    loading: !hydrated,
  };
}

function invalidateGuestCreditsSnapshotCache(): void {
  cachedGuestSnapshot = null;
  cachedGuestSnapshotKey = "";
}

function getGuestCreditsSnapshot(): GuestCreditsSnapshot {
  const key = buildGuestCreditsSnapshotKey();
  if (cachedGuestSnapshot && cachedGuestSnapshotKey === key) {
    return cachedGuestSnapshot;
  }
  cachedGuestSnapshotKey = key;
  cachedGuestSnapshot = buildGuestCreditsSnapshot();
  return cachedGuestSnapshot;
}

function getGuestCreditsServerSnapshot(): GuestCreditsSnapshot {
  return GUEST_CREDITS_SERVER_SNAPSHOT;
}

function subscribeGuestCreditsState(onStoreChange: () => void): () => void {
  return subscribeGuestCredits(() => {
    invalidateGuestCreditsSnapshotCache();
    onStoreChange();
  });
}

/** Single credits source for navbar, stage heroes, and upgrade gates. */
export function useAppCredits(): AppCreditsView {
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);
  const account = useAccountStore((s) => s.account);
  const accountLoading = useAccountStore((s) => s.loading);
  const isGuest = !isRegisteredUser(user);

  const guestState = useSyncExternalStore(
    subscribeGuestCreditsState,
    getGuestCreditsSnapshot,
    getGuestCreditsServerSnapshot,
  );

  if (!authReady) {
    return {
      remaining: null,
      used: 0,
      cap: GUEST_GENERATION_CREDIT_CAP,
      summaryLine: "Loading credits…",
      loading: true,
      isGuest: true,
      isFree: true,
    };
  }

  if (isGuest) {
    return {
      ...guestState,
      isGuest: true,
      isFree: true,
    };
  }

  if (!account) {
    return {
      remaining: null,
      used: 0,
      cap: GUEST_GENERATION_CREDIT_CAP,
      summaryLine: "Loading credits…",
      loading: accountLoading,
      isGuest: false,
      isFree: true,
    };
  }

  const remaining = Math.max(0, account.generationCredits);
  const used = Math.max(0, account.creditsUsed);
  const cap = Math.max(remaining, account.generationCreditCap);
  const isFree = account.planTier === "free";
  const summaryLine = profileCreditsRemainingLine(account).replace(
    /\s*generation\s+/gi,
    " ",
  );

  return {
    remaining,
    used,
    cap,
    summaryLine,
    loading: false,
    isGuest: false,
    isFree: isFree && !isPaidPlan(account.planTier),
  };
}
