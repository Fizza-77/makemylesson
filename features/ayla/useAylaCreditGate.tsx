"use client";

import { useCallback, useState } from "react";

import { AylaFairUsageDialog } from "@/features/ayla/AylaFairUsageDialog";
import { AylaUnlockDialog } from "@/features/ayla/AylaUnlockDialog";
import {
  UpgradePlanDialog,
  type UpgradeDialogReason,
} from "@/features/billing/UpgradePlanDialog";
import { loadEngagementPrefs } from "@/lib/engagement-prompt-prefs";
import { isRegisteredUser } from "@/lib/guest-session";
import {
  AYLA_FAIR_USAGE_HOURS,
  isPaidPlan,
} from "@/services/user-account.service";
import { useAccountStore } from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";

/**
 * Mirrors Flutter `AylaCreditGate.ensureCanSend` for web
 * (upgrade dialog instead of rewarded ads when free quota is 0).
 */
export function useAylaCreditGate(nextPath: string) {
  const user = useAuthStore((s) => s.user);

  const [unlockOpen, setUnlockOpen] = useState(false);
  const [fairUsageOpen, setFairUsageOpen] = useState(false);
  const [fairUsageResumeAtMs, setFairUsageResumeAtMs] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason] = useState<UpgradeDialogReason>("freeExhausted");
  const [upgradeCredits, setUpgradeCredits] = useState(0);

  const ensureCanSend = useCallback(async (): Promise<boolean> => {
    if (!isRegisteredUser(user)) {
      setUnlockOpen(true);
      return false;
    }

    const latest = useAccountStore.getState().account;
    if (!latest) {
      // Account still loading — let the callable enforce server-side.
      return true;
    }

    if (isPaidPlan(latest.planTier)) {
      const now = Date.now();
      const resume = latest.aylaFairUsageResumeAtMs;
      if (resume != null && now < resume) {
        setFairUsageResumeAtMs(resume);
        setFairUsageOpen(true);
        return false;
      }
      if (latest.aylaPaidCredits <= 0) {
        const fallback =
          resume ?? now + AYLA_FAIR_USAGE_HOURS * 60 * 60 * 1000;
        setFairUsageResumeAtMs(fallback);
        setFairUsageOpen(true);
        return false;
      }
      return true;
    }

    if (latest.aylaCredits > 0) return true;

    // Free exhausted — web shows upgrade (no ads).
    loadEngagementPrefs();
    setUpgradeCredits(Math.max(0, latest.generationCredits));
    setUpgradeOpen(true);
    return false;
  }, [user]);

  const dialogs = (
    <>
      <AylaUnlockDialog
        open={unlockOpen}
        nextPath={nextPath}
        onClose={() => setUnlockOpen(false)}
      />
      <AylaFairUsageDialog
        open={fairUsageOpen}
        resumeAtMs={fairUsageResumeAtMs}
        onClose={() => setFairUsageOpen(false)}
      />
      <UpgradePlanDialog
        open={upgradeOpen}
        reason={upgradeReason}
        creditsRemaining={upgradeCredits}
        onClose={() => setUpgradeOpen(false)}
        onViewPlans={() => setUpgradeOpen(false)}
      />
    </>
  );

  return { ensureCanSend, dialogs };
}
