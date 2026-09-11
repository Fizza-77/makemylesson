import { create } from "zustand";
import type { User } from "firebase/auth";

import type { UserFirestoreProfile } from "@/types/user-profile";

type AuthStore = {
  user: User | null;
  profile: UserFirestoreProfile | null;
  authReady: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserFirestoreProfile | null) => void;
  setAuthReady: (ready: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  authReady: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setAuthReady: (authReady) => set({ authReady }),
  reset: () => set({ user: null, profile: null, authReady: true }),
}));


