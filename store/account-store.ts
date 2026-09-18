"use client";

import { create } from "zustand";
import type { User } from "firebase/auth";
import { getDoc, getDocFromServer } from "firebase/firestore";

import { userDocRef } from "@/lib/firebase/firestore";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { isGuestUser } from "@/lib/guest-session";
import { toUserMessage } from "@/lib/user-facing-error";
import {
  bindEngagementPrefsToUser,
  markEverPurchased,
} from "@/lib/engagement-prompt-prefs";
import {
  ensureFreeGenerationCreditsForUser,
  isPaidPlan,
  mapUserDoc,
  subscribeUserAccount,
  type UserAccountView,
} from "@/services/user-account.service";

type AccountStore = {
  account: UserAccountView | null;
  loading: boolean;
  error: string | null;
  subscribedUid: string | null;
  setAccount: (account: UserAccountView | null) => void;
  clear: () => void;
};

let unsubscribe: (() => void) | null = null;

function applyAccountSideEffects(account: UserAccountView | null) {
  if (!account) return;
  bindEngagementPrefsToUser(account.uid);
  if (isPaidPlan(account.planTier)) {
    markEverPurchased();
  }
}

export const useAccountStore = create<AccountStore>((set) => ({
  account: null,
  loading: false,
  error: null,
  subscribedUid: null,
  setAccount: (account) => {
    applyAccountSideEffects(account);
    set({ account, loading: false, error: null });
  },
  clear: () =>
    set({
      account: null,
      loading: false,
      error: null,
      subscribedUid: null,
    }),
}));

/** One live `users/{uid}` listener for credits/profile across the app. */
export function syncAccountSubscription(
  uid: string | null,
  opts?: { isAnonymous?: boolean },
) {
  const state = useAccountStore.getState();
  const anonymous = Boolean(opts?.isAnonymous);
  const key = uid ? (anonymous ? `anon:${uid}` : uid) : null;
  if (state.subscribedUid === key && unsubscribe) return;

  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  if (!uid || anonymous) {
    useAccountStore.getState().clear();
    if (uid && anonymous) {
      useAccountStore.setState({ subscribedUid: key, loading: false });
    }
    return;
  }

  useAccountStore.setState({
    subscribedUid: key,
    loading: true,
    error: null,
  });

  // Backfill free starter credits if signup left the balance fields empty.
  void ensureFreeGenerationCreditsForUser(uid).catch((error) => {
    console.warn("[Account] free credits init failed", error);
  });

  unsubscribe = subscribeUserAccount(
    uid,
    (view) => useAccountStore.getState().setAccount(view),
    (error) => {
      console.error("[Account] snapshot failed", error);
      useAccountStore.setState({
        loading: false,
        error: toUserMessage(error, "Could not load account."),
      });
    },
  );
}

/** Subscribe to account doc for registered users only; guests use IP trial credits. */
export function syncAccountSubscriptionForUser(user: User | null | undefined) {
  syncAccountSubscription(user?.uid ?? null, {
    isAnonymous: isGuestUser(user),
  });
}

/**
 * Force a server read of `users/{uid}` after credit-changing actions.
 * Uses getDocFromServer so we don't show a stale IndexedDB cache balance.
 */
export async function refreshAccountFromServer(
  uid: string,
): Promise<UserAccountView | null> {
  const auth = getFirebaseAuth().currentUser;
  const ref = userDocRef(uid);
  let snap;
  try {
    snap = await getDocFromServer(ref);
  } catch {
    snap = await getDoc(ref);
  }
  if (!snap.exists()) {
    useAccountStore.getState().setAccount(null);
    return null;
  }
  const view = mapUserDoc(
    uid,
    snap.data() as Record<string, unknown>,
    auth?.email,
    auth?.displayName,
  );
  useAccountStore.getState().setAccount(view);
  return view;
}

/** Apply Ayla quota fields returned by `callAylaSupport` (optimistic local sync). */
export function applyAylaQuotaFromReply(fields: {
  aylaCredits?: number | null;
  aylaPaidCredits?: number | null;
  aylaFairUsageResumeAtMs?: number | null;
  aylaPeriodMonth?: string | null;
  clearFairUsageResume?: boolean;
}): void {
  const current = useAccountStore.getState().account;
  if (!current) return;
  const next: UserAccountView = {
    ...current,
    aylaCredits:
      typeof fields.aylaCredits === "number"
        ? Math.max(0, Math.trunc(fields.aylaCredits))
        : current.aylaCredits,
    aylaPaidCredits:
      typeof fields.aylaPaidCredits === "number"
        ? Math.max(0, Math.trunc(fields.aylaPaidCredits))
        : current.aylaPaidCredits,
    aylaPeriodMonth:
      typeof fields.aylaPeriodMonth === "string" && fields.aylaPeriodMonth.trim()
        ? fields.aylaPeriodMonth.trim()
        : current.aylaPeriodMonth,
    aylaFairUsageResumeAtMs: fields.clearFairUsageResume
      ? null
      : typeof fields.aylaFairUsageResumeAtMs === "number"
        ? fields.aylaFairUsageResumeAtMs
        : current.aylaFairUsageResumeAtMs,
  };
  useAccountStore.getState().setAccount(next);
}


