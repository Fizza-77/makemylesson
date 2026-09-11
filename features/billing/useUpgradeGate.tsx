"use client";

import { useCallback, useState } from "react";

import {
  UpgradePlanDialog,
  upgradeReasonForCredits,
  type UpgradeDialogReason,
} from "@/features/billing/UpgradePlanDialog";
import { useAppCredits } from "@/hooks/useAppCredits";
import { isPaidPlan } from "@/services/user-account.service";
import { useAccountStore } from "@/store/account-store";

/**
 * Blocks generation when credits are exhausted.
 * Web trial guests use 5 device-local credits; signed-in users use Firestore balance.
 */
export function useUpgradeGate() {
  const account = useAccountStore((s) => s.account);
  const { remaining, isGuest } = useAppCredits();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<UpgradeDialogReason>("freeExhausted");

  const blockIfNoCredits = useCallback((): boolean => {
    if (isGuest) {
      return false;
    }
    if (remaining === null || remaining > 0) return false;
    const paid = account ? isPaidPlan(account.planTier) : false;
    setReason(upgradeReasonForCredits({ credits: 0, isPaid: paid }));
    setOpen(true);
    return true;
  }, [account, isGuest, remaining]);

  const dialog = (
    <UpgradePlanDialog
      open={open}
      reason={reason}
      creditsRemaining={Math.max(0, remaining ?? 0)}
      onClose={() => setOpen(false)}
    />
  );

  return { blockIfNoCredits, dialog, credits: remaining };
}


