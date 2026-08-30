"use client";

import { useCallback, useState } from "react";

import {
  UpgradePlanDialog,
  upgradeReasonForCredits,
  type UpgradeDialogReason,
} from "@/features/billing/UpgradePlanDialog";
import { useGuestCreditsRemaining } from "@/hooks/useGuestCredits";
import { isRegisteredUser } from "@/lib/guest-session";
import { isPaidPlan } from "@/services/user-account.service";
import { useAccountStore } from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";

/**
 * Blocks generation when credits are exhausted.
 * Web trial guests use 5 device-local credits; signed-in users use Firestore balance.
 */
export function useUpgradeGate() {
  const user = useAuthStore((s) => s.user);
  const account = useAccountStore((s) => s.account);
  const guestCredits = useGuestCreditsRemaining();
  const isGuest = !isRegisteredUser(user);
  const accountCredits = account?.generationCredits ?? null;
  const credits = isGuest ? guestCredits : accountCredits;

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<UpgradeDialogReason>("freeExhausted");

  const blockIfNoCredits = useCallback((): boolean => {
    if (isGuest) {
      return false;
    }
    if (accountCredits === null || accountCredits > 0) return false;
    const paid = account ? isPaidPlan(account.planTier) : false;
    setReason(upgradeReasonForCredits({ credits: 0, isPaid: paid }));
    setOpen(true);
    return true;
  }, [account, accountCredits, isGuest]);

  const dialog = (
    <UpgradePlanDialog
      open={open}
      reason={reason}
      creditsRemaining={Math.max(0, credits ?? 0)}
      onClose={() => setOpen(false)}
    />
  );

  return { blockIfNoCredits, dialog, credits };
}
