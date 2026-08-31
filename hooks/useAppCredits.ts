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

function subscribeGuestCreditsState(onStoreChange: () => void): () => void {
  return subscribeGuestCredits(onStoreChange);
}

function getGuestCreditsSnapshot(): Pick<
  AppCreditsView,
  "remaining" | "used" | "cap" | "summaryLine" | "loading"
> {
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

function getGuestCreditsServerSnapshot(): Pick<
  AppCreditsView,
  "remaining" | "used" | "cap" | "summaryLine" | "loading"
> {
  return {
    remaining: GUEST_GENERATION_CREDIT_CAP,
    used: 0,
    cap: GUEST_GENERATION_CREDIT_CAP,
    summaryLine: "Loading credits…",
    loading: true,
  };
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
      summaryLine: accountLoading ? "Loading credits…" : "Loading credits…",
      loading: true,
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
