"use client";

import { create } from "zustand";

import {
  sendAylaMessage,
  type AylaChatMessage,
} from "@/services/ayla-chat.service";

type AylaStore = {
  messages: AylaChatMessage[];
  isSending: boolean;
  error: string | null;
  send: (text: string, context?: Record<string, string>) => Promise<void>;
  clear: () => void;
};

export const useAylaChatStore = create<AylaStore>((set, get) => ({
  messages: [],
  isSending: false,
  error: null,

  clear: () => set({ messages: [], error: null, isSending: false }),

  send: async (text, context) => {
    const prompt = text.trim();
    if (!prompt || get().isSending) return;

    const userMessage: AylaChatMessage = { role: "user", text: prompt };
    const historyBefore = get().messages;
    set({
      messages: [...historyBefore, userMessage],
      isSending: true,
      error: null,
    });

    try {
      const reply = await sendAylaMessage({
        history: [...historyBefore, userMessage],
        userMessage: prompt,
        context,
      });
      set({
        messages: [
          ...get().messages,
          { role: "model", text: reply },
        ],
        isSending: false,
      });
    } catch (e) {
      set({
        isSending: false,
        error: e instanceof Error ? e.message : "Ayla could not reply.",
      });
    }
  },
}));
