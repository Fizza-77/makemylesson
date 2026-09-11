import { create } from "zustand";

import { sanitizeUserMessage } from "@/lib/user-facing-error";

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

function toastMessage(message: string, variant: ToastVariant): string {
  const trimmed = typeof message === "string" ? message.trim() : "";
  if (!trimmed) return "";
  // Success copy is authored by us.
  if (variant === "success") return trimmed;
  // Info may intentionally show a plain URL (e.g. copied link).
  if (variant === "info" && /^https?:\/\/\S+$/i.test(trimmed)) return trimmed;
  return sanitizeUserMessage(
    trimmed,
    variant === "error"
      ? "Something went wrong. Please try again in a moment."
      : "Please try again in a moment.",
  );
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, variant = "info") => {
    const id = `toast-${Date.now()}-${++toastSeq}`;
    const safe = toastMessage(message, variant);
    const item: ToastItem = {
      id,
      message: safe,
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

