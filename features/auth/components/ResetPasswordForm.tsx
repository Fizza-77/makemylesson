"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthGlassShell } from "@/features/auth/components/AuthGlassShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { resetPasswordWithCode, verifyResetCode } from "@/lib/firebase/auth";
import { mapFirebaseAuthError } from "@/lib/auth-errors";
import { authLog } from "@/lib/auth-logger";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/auth-validation";
import { toastFirstFormError } from "@/lib/toast-form-errors";
import { ROUTES } from "@/lib/urls";
import { toast } from "@/store/toast-store";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode") ?? "";

  const [validating, setValidating] = useState(true);
  const [codeValid, setCodeValid] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!oobCode.trim()) {
        if (!cancelled) {
          setValidating(false);
          setCodeValid(false);
          toast.error(
            "This verification link isn't valid. Please sign in and request a new one.",
          );
        }
        return;
      }
      try {
        const email = await verifyResetCode(oobCode);
        if (!cancelled) {
          setVerifiedEmail(email);
          setCodeValid(true);
          setValidating(false);
          authLog.success("password_reset.code_valid", {
            email: authLog.email(email),
          });
        }
      } catch (e) {
        authLog.error("password_reset.code_invalid", e);
        if (!cancelled) {
          setValidating(false);
          setCodeValid(false);
          toast.error(
            "Password reset links are valid for 30 minutes. Request a new one below.",
          );
        }
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [oobCode]);

  async function onSubmit(values: ResetPasswordValues) {
    try {
      await resetPasswordWithCode(oobCode, values.password);
      authLog.success("password_reset.confirm.ok", {
        email: authLog.email(verifiedEmail),
      });
      toast.success("Password updated.");
      setSuccess(true);
    } catch (e) {
      authLog.error("password_reset.confirm.failed", e);
      toast.error(
        mapFirebaseAuthError(e).includes("Something went wrong")
          ? "Password reset links are valid for 30 minutes. Request a new one below."
          : mapFirebaseAuthError(e),
      );
      setCodeValid(false);
    }
  }

  if (validating) {
    return (
      <AuthGlassShell title="Set a new password">
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </AuthGlassShell>
    );
  }

  if (success) {
    return (
      <AuthGlassShell
        title="Password updated"
        subtitle="Your password has been changed. You can now sign in with your new password."
      >
        <p className="mb-6 text-center text-sm text-[#666666]">
          For your security, you&apos;ve been signed out of all other devices.
        </p>
        <Link href={ROUTES.signIn}>
          <Button className="w-full">Sign in</Button>
        </Link>
      </AuthGlassShell>
    );
  }

  if (!codeValid) {
    return (
      <AuthGlassShell
        title="This link has expired"
        subtitle="Password reset links are valid for 30 minutes. Request a new one below."
      >
        <Link href={ROUTES.forgotPassword}>
          <Button className="w-full">Request a new reset link</Button>
        </Link>
        <p className="mt-4 text-center text-sm">
          <Link href={ROUTES.signIn} className="text-[#666666] hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </AuthGlassShell>
    );
  }

  return (
    <AuthGlassShell
      title="Set a new password"
      subtitle="Your new password must be different from your previous one."
    >
      {verifiedEmail ? (
        <p className="mb-4 text-center text-sm text-[#666666]">{verifiedEmail}</p>
      ) : null}
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, toastFirstFormError)}
        noValidate
      >
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Save new password
        </Button>
      </form>
    </AuthGlassShell>
  );
}


