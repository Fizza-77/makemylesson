"use client";

import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { getFirebaseAuth } from "@/firebase/config";
import { fetchUserProfile } from "@/firebase/firestore";
import { isGuestUser, syncGuestTrialCredits } from "@/lib/guest-session";
import { fetchWebTrialStatusFromServer } from "@/lib/trial-api.client";
import { useAuthStore } from "@/store/auth-store";
import { syncAccountSubscriptionForUser } from "@/store/account-store";
import { syncLibraryCatalogSubscription } from "@/store/library-catalog-store";
import { useStage3DraftStore } from "@/store/stage3-draft-store";
import { useStage4DraftStore } from "@/store/stage4-draft-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
    async function refreshGuestTrialFromServer() {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      try {
        if (isGuestUser(user) && user) {
          await syncGuestTrialCredits(user);
        } else if (!user) {
          await fetchWebTrialStatusFromServer();
        }
      } catch {
        /* non-blocking */
      }
    }

    function onVisible() {
      if (document.visibilityState !== "visible") return;
      void refreshGuestTrialFromServer();
    }

    window.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    const auth = getFirebaseAuth();
    let prevUid: string | null = null;
    const unsub = onAuthStateChanged(auth, async (user) => {
      // Clear all per-user draft state when the account changes so that a
      // newly signed-in user never sees a previous user's session data.
      if (prevUid !== null && prevUid !== (user?.uid ?? null)) {
        useStage3DraftStore.getState().resetAll();
        useStage4DraftStore.getState().resetAll();
      }
      prevUid = user?.uid ?? null;

      setUser(user);
      const guest = isGuestUser(user);
      if (!guest && user) {
        syncLibraryCatalogSubscription(user.uid);
      } else {
        syncLibraryCatalogSubscription(null);
      }
      syncAccountSubscriptionForUser(user);
      if (!user) {
        setProfile(null);
        try {
          await fetchWebTrialStatusFromServer();
        } catch {
          /* non-blocking */
        }
        setAuthReady(true);
        return;
      }
      if (guest) {
        setProfile(null);
        try {
          await syncGuestTrialCredits(user);
        } catch {
          /* non-blocking */
        }
        setAuthReady(true);
        return;
      }
      try {
        const profile = await fetchUserProfile(user.uid);
        setProfile(profile);
      } catch (error) {
        console.error("Failed to load user profile", error);
        setProfile(null);
      } finally {
        setAuthReady(true);
      }
    });
    return () => {
      unsub();
      window.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      syncLibraryCatalogSubscription(null);
      syncAccountSubscriptionForUser(null);
    };
  }, [setAuthReady, setProfile, setUser]);

  return children;
}
