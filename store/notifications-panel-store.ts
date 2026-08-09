import { create } from "zustand";

type NotificationsPanelState = {
  open: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
};

export const useNotificationsPanelStore = create<NotificationsPanelState>(
  (set) => ({
    open: false,
    openPanel: () => set({ open: true }),
    closePanel: () => set({ open: false }),
    togglePanel: () => set((s) => ({ open: !s.open })),
  }),
);
