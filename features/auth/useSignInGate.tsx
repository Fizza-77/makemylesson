"use client";

import { useCallback, useState } from "react";

import { SignInRequiredDialog } from "@/features/auth/SignInRequiredDialog";
import { isRegisteredUser } from "@/lib/guest-session";
import { useAuthStore } from "@/store/auth-store";

/**
 * Web trial users and signed-out visitors — sign-in gate for library saves
 * and after trial credits are used.
 */
export function useSignInGate(nextPath: string) {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    "Sign in or create a free account to save to your library.",
  );

  const requireRegisteredSignIn = useCallback(
    (msg?: string): boolean => {
      if (isRegisteredUser(user)) return false;
      setMessage(
        msg ??
          "Sign in or create a free account to save to your library.",
      );
      setOpen(true);
      return true;
    },
    [user],
  );

  /** @deprecated Use requireRegisteredSignIn for library saves. */
  const requireSignIn = requireRegisteredSignIn;

  const dialog = (
    <SignInRequiredDialog
      open={open}
      message={message}
      nextPath={nextPath}
      onClose={() => setOpen(false)}
    />
  );

  return { requireSignIn, requireRegisteredSignIn, dialog };
}
