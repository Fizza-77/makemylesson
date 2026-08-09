import { create } from "zustand";

export type ToastVariant = "info" | "success" | "error";

export type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
  createdAt: number;
};

type ToastStore = {
  toasts: ToastItem[];
  show: (message: string, variant?: ToastVariant) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

let toastSeq = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, variant = "info") => {
    const id = `toast-${Date.now()}-${++toastSeq}`;
    const item: ToastItem = {
      id,
      message: message.trim(),
      variant,
      createdAt: Date.now(),
    };
    if (!item.message) return id;
    set((state) => ({
      toasts: [...state.toasts.slice(-4), item],
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clear: () => set({ toasts: [] }),
}));

export const toast = {
  info: (message: string) => useToastStore.getState().show(message, "info"),
  success: (message: string) => useToastStore.getState().show(message, "success"),
  error: (message: string) => useToastStore.getState().show(message, "error"),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
};
