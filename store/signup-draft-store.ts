import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PendingSignupDraft = {
  fullName: string;
  email: string;
  password: string;
  dateOfBirthIso?: string;
  ageConfirmed: boolean;
  schoolName?: string;
  /** Base64 data URL for school logo (session-only). */
  schoolLogoDataUrl?: string;
  schoolLogoName?: string;
  schoolLogoMimeType?: string;
};

type SignupDraftStore = {
  draft: PendingSignupDraft | null;
  setDraft: (draft: PendingSignupDraft) => void;
  clearDraft: () => void;
};

export const useSignupDraftStore = create<SignupDraftStore>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: "mml-signup-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
