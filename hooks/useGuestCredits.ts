"use client";

import { useSyncExternalStore } from "react";

import {
  GUEST_GENERATION_CREDIT_CAP,
  getGuestCreditsRemaining,
  subscribeGuestCredits,
} from "@/lib/guest-credits";

export function useGuestCreditsRemaining(): number {
  return useSyncExternalStore(
    subscribeGuestCredits,
    getGuestCreditsRemaining,
    () => GUEST_GENERATION_CREDIT_CAP,
  );
}
