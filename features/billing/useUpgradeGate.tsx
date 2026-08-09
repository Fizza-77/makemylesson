"use client";

import { useCallback, useState } from "react";

import {
  UpgradePlanDialog,
  upgradeReasonForCredits,
  type UpgradeDialogReason,
} from "@/features/billing/UpgradePlanDialog";
import { isPaidPlan } from "@/services/user-account.service";
import { useAccountStore } from "@/store/account-store";

/**
 * When generation credits are exhausted, show upgrade dialog instead of a bare toast.
 * Returns true if the caller should abort generation (dialog shown or no credits).
 */
export function useUpgradeGate() {
  const account = useAccountStore((s) => s.account);
  const credits = account?.generationCredits ?? null;
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<UpgradeDialogReason>("freeExhausted");

  const blockIfNoCredits = useCallback((): boolean => {
    if (credits === null || credits > 0) return false;
    const paid = account ? isPaidPlan(account.planTier) : false;
    setReason(upgradeReasonForCredits({ credits: 0, isPaid: paid }));
    setOpen(true);
    return true;
  }, [account, credits]);

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
