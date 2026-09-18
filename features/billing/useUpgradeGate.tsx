"use client";

import { useCallback, useRef, useState } from "react";

import {
  UpgradePlanDialog,
  upgradeReasonForCredits,
  type UpgradeDialogReason,
} from "@/features/billing/UpgradePlanDialog";
import { useAppCredits } from "@/hooks/useAppCredits";
import {
  FREE_TIER_MAX_UPGRADE_PROMPTS,
  incrementUpgradeShown,
  loadEngagementPrefs,
} from "@/lib/engagement-prompt-prefs";
import {
  isPaidPlan,
  isSubscriptionExpired,
} from "@/services/user-account.service";
import { useAccountStore } from "@/store/account-store";

const AFTER_SUCCESS_DELAY_MS = 1800;

/**
 * Mirrors Flutter `EngagementPromptCoordinator` for web:
 * - before generate: hard blocks + free soft nudge (max 5)
 * - after Stage 1/3 success: upgrade for free users
 * Auto Rate Us stays mobile-only (not shown on web).
 */
export function useUpgradeGate() {
  const account = useAccountStore((s) => s.account);
  const { remaining, isGuest } = useAppCredits();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<UpgradeDialogReason>("freeExhausted");
  const [dialogCredits, setDialogCredits] = useState(0);

  const resolveRef = useRef<((navigatedToPlans: boolean) => void) | null>(
    null,
  );
  const afterSuccessNonceRef = useRef(0);
  const afterSuccessShowingRef = useRef(false);

  const closeDialog = useCallback((navigatedToPlans: boolean) => {
    setOpen(false);
    const resolve = resolveRef.current;
    resolveRef.current = null;
    resolve?.(navigatedToPlans);
  }, []);

  const showUpgradeDialog = useCallback(
    (params: {
      reason: UpgradeDialogReason;
      creditsRemaining: number;
    }): Promise<boolean> => {
      setReason(params.reason);
      setDialogCredits(Math.max(0, params.creditsRemaining));
      setOpen(true);
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    [],
  );

  /**
   * Returns `false` when generation should not run (hard block, or soft nudge
   * where the user opened pricing).
   */
  const ensureCanGenerate = useCallback(async (): Promise<boolean> => {
    if (isGuest) return true;

    const credits = remaining ?? 0;
    const paid = account ? isPaidPlan(account.planTier) : false;
    const expired = account ? isSubscriptionExpired(account) : false;

    if (paid) {
      if (expired || credits <= 0) {
        await showUpgradeDialog({
          reason: upgradeReasonForCredits({
            credits,
            isPaid: true,
            subscriptionExpired: expired,
          }),
          creditsRemaining: credits,
        });
        return false;
      }
      return true;
    }

    // Free — hard stop at 0 credits (web: upgrade only, no ads).
    if (credits <= 0) {
      incrementUpgradeShown();
      await showUpgradeDialog({
        reason: "freeExhausted",
        creditsRemaining: 0,
      });
      return false;
    }

    const prefs = loadEngagementPrefs();
    if (prefs.hasEverPurchased) return true;
    if (prefs.upgradePromptCount >= FREE_TIER_MAX_UPGRADE_PROMPTS) return true;

    const navigatedToPlans = await showUpgradeDialog({
      reason: "freeExhausted",
      creditsRemaining: credits,
    });
    incrementUpgradeShown();
    return !navigatedToPlans;
  }, [account, isGuest, remaining, showUpgradeDialog]);

  /** Soft upgrade after Stage 1 or 3 success — free signed-in users only. */
  const maybeShowUpgradeAfterSuccess = useCallback(
    (stage: number) => {
      if (stage !== 1 && stage !== 3) return;
      if (isGuest) return;
      if (!account || isPaidPlan(account.planTier)) return;

      const nonce = ++afterSuccessNonceRef.current;
      window.setTimeout(() => {
        void (async () => {
          if (afterSuccessNonceRef.current !== nonce) return;
          if (afterSuccessShowingRef.current) return;
          const latest = useAccountStore.getState().account;
          if (!latest || isPaidPlan(latest.planTier)) return;

          afterSuccessShowingRef.current = true;
          try {
            await showUpgradeDialog({
              reason: "freeExhausted",
              creditsRemaining: latest.generationCredits,
            });
          } finally {
            afterSuccessShowingRef.current = false;
          }
        })();
      }, AFTER_SUCCESS_DELAY_MS);
    },
    [account, isGuest, showUpgradeDialog],
  );

  /** @deprecated Prefer ensureCanGenerate — kept for older call sites. */
  const blockIfNoCredits = useCallback((): boolean => {
    if (isGuest) return false;
    if (remaining === null || remaining > 0) return false;
    const paid = account ? isPaidPlan(account.planTier) : false;
    const expired = account ? isSubscriptionExpired(account) : false;
    void showUpgradeDialog({
      reason: upgradeReasonForCredits({
        credits: 0,
        isPaid: paid,
        subscriptionExpired: expired,
      }),
      creditsRemaining: 0,
    });
    return true;
  }, [account, isGuest, remaining, showUpgradeDialog]);

  const dialog = (
    <UpgradePlanDialog
      open={open}
      reason={reason}
      creditsRemaining={dialogCredits}
      onClose={() => closeDialog(false)}
      onViewPlans={() => closeDialog(true)}
    />
  );

  return {
    ensureCanGenerate,
    maybeShowUpgradeAfterSuccess,
    blockIfNoCredits,
    dialog,
    credits: remaining,
  };
}
