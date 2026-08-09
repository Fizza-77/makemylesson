"use client";

import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { getFirebaseAuth } from "@/firebase/config";
import { fetchUserProfile } from "@/firebase/firestore";
import { useAuthStore } from "@/store/auth-store";
import { syncAccountSubscription } from "@/store/account-store";
import { syncLibraryCatalogSubscription } from "@/store/library-catalog-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      syncLibraryCatalogSubscription(user?.uid ?? null);
      syncAccountSubscription(user?.uid ?? null);
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
