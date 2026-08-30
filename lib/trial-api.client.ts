"use client";

import type { User } from "firebase/auth";

import {
  GUEST_GENERATION_CREDIT_CAP,
  setGuestCreditsFromServer,
} from "@/lib/guest-credits";

type TrialApiPayload = {
  remaining?: number;
  totalUsed?: number;
  cap?: number;
  configured?: boolean;
  error?: string;
};

export async function fetchWebTrialStatusFromServer(): Promise<{
  remaining: number;
  totalUsed: number;
  configured: boolean;
}> {
  try {
    const response = await fetch("/api/trial/bootstrap", {
      method: "GET",
      cache: "no-store",
    });
    const payload = (await response.json()) as TrialApiPayload;
    if (!response.ok) {
      return {
        remaining: GUEST_GENERATION_CREDIT_CAP,
        totalUsed: 0,
        configured: false,
      };
    }
    const remaining =
      typeof payload.remaining === "number"
        ? payload.remaining
        : GUEST_GENERATION_CREDIT_CAP;
    const totalUsed =
      typeof payload.totalUsed === "number" ? payload.totalUsed : 0;
    setGuestCreditsFromServer(remaining, totalUsed);
    return {
      remaining,
      totalUsed,
      configured: payload.configured !== false,
    };
  } catch {
    return {
      remaining: GUEST_GENERATION_CREDIT_CAP,
      totalUsed: 0,
      configured: false,
    };
  }
}

export async function bootstrapWebTrialCredits(user: User): Promise<{
  remaining: number;
  totalUsed: number;
  configured: boolean;
}> {
  try {
    const token = await user.getIdToken();
    const response = await fetch("/api/trial/bootstrap", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = (await response.json()) as TrialApiPayload;
    if (!response.ok) {
      if (response.status === 503) {
        return fetchWebTrialStatusFromServer();
      }
      throw new Error(payload.error ?? "Could not load trial credits.");
    }
    const remaining =
      typeof payload.remaining === "number"
        ? payload.remaining
        : GUEST_GENERATION_CREDIT_CAP;
    const totalUsed =
      typeof payload.totalUsed === "number" ? payload.totalUsed : 0;
    setGuestCreditsFromServer(remaining, totalUsed);
    return {
      remaining,
      totalUsed,
      configured: true,
    };
  } catch (error) {
    console.warn("[Trial] bootstrap failed", error);
    return fetchWebTrialStatusFromServer();
  }
}

export async function consumeWebTrialCreditOnServer(user: User): Promise<void> {
  try {
    const token = await user.getIdToken();
    const response = await fetch("/api/trial/consume", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = (await response.json()) as TrialApiPayload;
    if (!response.ok) {
      if (response.status === 503) return;
      throw new Error(payload.error ?? "Could not record trial usage.");
    }
    const remaining =
      typeof payload.remaining === "number"
        ? payload.remaining
        : getGuestCreditsRemainingFallback(payload);
    const totalUsed =
      typeof payload.totalUsed === "number" ? payload.totalUsed : 0;
    setGuestCreditsFromServer(remaining, totalUsed);
  } catch (error) {
    console.warn("[Trial] consume failed", error);
  }
}

function getGuestCreditsRemainingFallback(payload: TrialApiPayload): number {
  if (typeof payload.remaining === "number") return payload.remaining;
  return GUEST_GENERATION_CREDIT_CAP;
}
