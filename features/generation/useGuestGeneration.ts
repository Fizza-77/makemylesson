"use client";

import { useCallback } from "react";

import { useSignInGate } from "@/features/auth/useSignInGate";
import { useUpgradeGate } from "@/features/billing/useUpgradeGate";
import { isRegisteredUser } from "@/lib/guest-session";
import { refreshAccountFromServer } from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";

const LIBRARY_SIGN_IN_MESSAGE =
  "Sign in or create a free account to save to your library.";

function generationSignInMessage(stageNumber: number): string {
  return `Please sign in or create an account to generate Stage ${stageNumber} with AI.`;
}

/**
 * Stage generation gates — mirrors Flutter `FirebaseUserGate` +
 * `showStageGenerationSignInRequiredDialog` + account credits.
 */
export function useGuestGeneration(nextPath: string, stageNumber: number) {
  const user = useAuthStore((s) => s.user);
  const isGuest = !isRegisteredUser(user);
  const { blockIfNoCredits, dialog: upgradeDialog, credits } =
    useUpgradeGate();
  const { requireRegisteredSignIn, dialog: signInDialog } =
    useSignInGate(nextPath);

  const prepareGeneration = useCallback(async (): Promise<boolean> => {
    if (requireRegisteredSignIn(generationSignInMessage(stageNumber))) {
      return false;
    }
    if (blockIfNoCredits()) return false;
    return true;
  }, [blockIfNoCredits, requireRegisteredSignIn, stageNumber]);

  const completeGeneration = useCallback(async () => {
    const current = useAuthStore.getState().user;
    if (current?.uid) {
      await refreshAccountFromServer(current.uid).catch(() => null);
    }
  }, []);

  const requireSignInToSaveLibrary = useCallback(
    (message = LIBRARY_SIGN_IN_MESSAGE): boolean =>
      requireRegisteredSignIn(message),
    [requireRegisteredSignIn],
  );

  return {
    isGuest,
    credits,
    prepareGeneration,
    completeGeneration,
    requireSignInToSaveLibrary,
    signInDialog,
    upgradeDialog,
  };
}
