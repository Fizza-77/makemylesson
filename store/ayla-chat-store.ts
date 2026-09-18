"use client";

import { create } from "zustand";

import { toUserMessage } from "@/lib/user-facing-error";
import {
  isAylaResourceExhaustedError,
  isAylaUnauthenticatedError,
  sendAylaMessage,
  type AylaChatMessage,
  type AylaChatReply,
} from "@/services/ayla-chat.service";
import { applyAylaQuotaFromReply } from "@/store/account-store";

type AylaStore = {
  messages: AylaChatMessage[];
  isSending: boolean;
  error: string | null;
  lastQuotaError: "resource-exhausted" | "unauthenticated" | null;
  send: (text: string, context?: Record<string, string>) => Promise<AylaChatReply | null>;
  clear: () => void;
  clearQuotaError: () => void;
};

export const useAylaChatStore = create<AylaStore>((set, get) => ({
  messages: [],
  isSending: false,
  error: null,
  lastQuotaError: null,

  clear: () =>
    set({
      messages: [],
      error: null,
      isSending: false,
      lastQuotaError: null,
    }),

  clearQuotaError: () => set({ lastQuotaError: null }),

  send: async (text, context) => {
    const prompt = text.trim();
    if (!prompt || get().isSending) return null;

    const userMessage: AylaChatMessage = { role: "user", text: prompt };
    const historyBefore = get().messages;
    set({
      messages: [...historyBefore, userMessage],
      isSending: true,
      error: null,
      lastQuotaError: null,
    });

    try {
      const reply = await sendAylaMessage({
        history: [...historyBefore, userMessage],
        userMessage: prompt,
        context,
      });
      applyAylaQuotaFromReply({
        aylaCredits: reply.aylaCredits,
        aylaPaidCredits: reply.aylaPaidCredits,
        aylaFairUsageResumeAtMs: reply.aylaFairUsageResumeAtMs,
        aylaPeriodMonth: reply.aylaPeriodMonth,
        clearFairUsageResume:
          reply.aylaFairUsageResumeAtMs == null &&
          reply.aylaPaidCredits != null,
      });
      set({
        messages: [
          ...get().messages,
          { role: "model", text: reply.text },
        ],
        isSending: false,
      });
      return reply;
    } catch (e) {
      // Remove optimistic user bubble on quota/auth failures (match Flutter).
      if (
        isAylaResourceExhaustedError(e) ||
        isAylaUnauthenticatedError(e)
      ) {
        set({
          messages: historyBefore,
          isSending: false,
          lastQuotaError: isAylaResourceExhaustedError(e)
            ? "resource-exhausted"
            : "unauthenticated",
          error: null,
        });
        throw e;
      }
      set({
        isSending: false,
        error: toUserMessage(e, "Ayla could not reply."),
      });
      return null;
    }
  },
}));
