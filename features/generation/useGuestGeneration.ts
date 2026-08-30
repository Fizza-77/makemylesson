"use client";

import { useCallback } from "react";

import { useSignInGate } from "@/features/auth/useSignInGate";
import { useUpgradeGate } from "@/features/billing/useUpgradeGate";
import { mapFirebaseAuthError } from "@/lib/auth-errors";
import { getGuestCreditsRemaining } from "@/lib/guest-credits";
import {
  afterGuestGenerationSuccess,
  ensureGuestAuth,
  isGuestSignInUnavailableError,
  isRegisteredUser,
} from "@/lib/guest-session";
import { refreshAccountFromServer } from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

const LIBRARY_SIGN_IN_MESSAGE =
  "Sign in or create a free account to save to your library.";

const TRIAL_EXHAUSTED_MESSAGE =
  "You've used your 5 free trial generations. Sign in or create a free account to continue.";

/**
 * Web-only trial: 5 device-local credits, silent Firebase session for Cloud Functions,
 * no library auto-save. Mobile app still requires sign-in before generating.
 */
export function useGuestGeneration(nextPath: string, _stageNumber?: number) {
  const user = useAuthStore((s) => s.user);
  const isGuest = !isRegisteredUser(user);
  const { blockIfNoCredits, dialog: upgradeDialog, credits } =
    useUpgradeGate();
  const { requireRegisteredSignIn, dialog: signInDialog } =
    useSignInGate(nextPath);

  const prepareGeneration = useCallback(async (): Promise<boolean> => {
    if (isGuest && getGuestCreditsRemaining() <= 0) {
      requireRegisteredSignIn(TRIAL_EXHAUSTED_MESSAGE);
      return false;
    }

    try {
      await ensureGuestAuth();
    } catch (e) {
      console.error("[Guest] ensureGuestAuth failed", e);
      if (isGuestSignInUnavailableError(e)) {
        requireRegisteredSignIn(
          "Trial generation isn't available right now. Sign in or create a free account to continue.",
        );
        return false;
      }
      toast.error(mapFirebaseAuthError(e));
      return false;
    }

    if (blockIfNoCredits()) return false;
    return true;
  }, [blockIfNoCredits, isGuest, requireRegisteredSignIn]);

  const completeGeneration = useCallback(async () => {
    afterGuestGenerationSuccess();
    const current = useAuthStore.getState().user;
    if (isRegisteredUser(current) && current?.uid) {
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
