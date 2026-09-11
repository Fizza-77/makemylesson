"use client";

import { create } from "zustand";
import type { User } from "firebase/auth";
import { getDoc, getDocFromServer } from "firebase/firestore";

import { userDocRef } from "@/firebase/firestore";
import { getFirebaseAuth } from "@/firebase/config";
import { isGuestUser } from "@/lib/guest-session";
import { toUserMessage } from "@/lib/user-facing-error";
import {
  ensureFreeGenerationCreditsForUser,
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

export const useAccountStore = create<AccountStore>((set) => ({
  account: null,
  loading: false,
  error: null,
  subscribedUid: null,
  setAccount: (account) =>
    set({ account, loading: false, error: null }),
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


