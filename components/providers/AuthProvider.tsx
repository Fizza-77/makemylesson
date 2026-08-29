"use client";

import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { getFirebaseAuth } from "@/firebase/config";
import { fetchUserProfile } from "@/firebase/firestore";
import { useAuthStore } from "@/store/auth-store";
import { syncAccountSubscription } from "@/store/account-store";
import { syncLibraryCatalogSubscription } from "@/store/library-catalog-store";
import { useStage3DraftStore } from "@/store/stage3-draft-store";
import { useStage4DraftStore } from "@/store/stage4-draft-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
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
      if (user) {
        syncLibraryCatalogSubscription(user.uid);
      } else {
        syncLibraryCatalogSubscription(null);
      }
      syncAccountSubscription(user?.uid ?? null, {
        isAnonymous: false,
      });
      if (!user) {
        setProfile(null);
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
      syncLibraryCatalogSubscription(null);
      syncAccountSubscription(null);
    };
  }, [setAuthReady, setProfile, setUser]);

  return children;
}
