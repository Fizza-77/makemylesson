"use client";

import { useCallback, useState } from "react";

import { SignInRequiredDialog } from "@/features/auth/SignInRequiredDialog";
import { useAuthStore } from "@/store/auth-store";

/**
 * When a guest tries to generate (or unlock) content, show a dismissible
 * Log in / Sign up dialog instead of navigating away immediately.
 */
export function useSignInGate(nextPath: string) {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    "You need to sign in first before you can generate anything.",
  );

  const requireSignIn = useCallback(
    (msg?: string): boolean => {
      if (user) return false;
      setMessage(
        msg ?? "You need to sign in first before you can generate anything.",
      );
      setOpen(true);
      return true;
    },
    [user],
  );

  const dialog = (
    <SignInRequiredDialog
      open={open}
      message={message}
      nextPath={nextPath}
      onClose={() => setOpen(false)}
    />
  );

  return { requireSignIn, dialog };
}
