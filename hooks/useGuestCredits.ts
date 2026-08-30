"use client";

import { useSyncExternalStore } from "react";

import {
  getGuestCreditsRemaining,
  GUEST_GENERATION_CREDIT_CAP,
  subscribeGuestCredits,
} from "@/lib/guest-credits";

export function useGuestCreditsRemaining(): number {
  return useSyncExternalStore(
    subscribeGuestCredits,
    getGuestCreditsRemaining,
    () => GUEST_GENERATION_CREDIT_CAP,
  );
}
