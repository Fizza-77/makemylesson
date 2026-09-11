"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthGlassShell } from "@/features/auth/components/AuthGlassShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mapFunctionsError } from "@/lib/auth-errors";
import { authLog } from "@/lib/auth-logger";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/auth-validation";
import { toastFirstFormError } from "@/lib/toast-form-errors";
import { ROUTES } from "@/lib/urls";
import { sendPasswordResetEmail } from "@/services/auth-email.service";
import { toast } from "@/store/toast-store";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [lastEmail, setLastEmail] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = setInterval(() => {
      setCooldownLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldownLeft]);

  async function onSubmit(values: ForgotPasswordValues) {
    authLog.info("password_reset.send.start", {
      email: authLog.email(values.email),
    });
    try {
      await sendPasswordResetEmail(values.email);
      setLastEmail(values.email.trim());
      setSent(true);
      setCooldownLeft(60);
      authLog.success("password_reset.send.ok", {
        email: authLog.email(values.email),
      });
      toast.success("Password reset email sent. Check your inbox.");
    } catch (e) {
      authLog.error("password_reset.send.failed", e, {
        email: authLog.email(values.email),
      });
      toast.error(mapFunctionsError(e));
    }
  }

  async function resend() {
    if (cooldownLeft > 0) return;
    const email = lastEmail || getValues("email");
    if (!email) return;
    try {
      await sendPasswordResetEmail(email);
      setCooldownLeft(60);
      toast.success("Password reset email resent.");
    } catch (e) {
      toast.error(mapFunctionsError(e));
    }
  }

  if (sent) {
    return (
      <AuthGlassShell
        title="Check your email"
        subtitle="We've sent a password reset link."
      >
        <p className="text-sm text-[#1A1C30]">
          If an account exists for{" "}
          <span className="font-semibold">{lastEmail || "[user@email.com]"}</span>
          , we&apos;ve sent a password reset link. It will expire in 30 minutes.
        </p>
        <p className="mt-3 text-sm text-[#666666]">
          Can&apos;t find it? Check your spam or junk folder.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full"
          onClick={resend}
          disabled={cooldownLeft > 0}
        >
          {cooldownLeft > 0 ? `Resend in ${cooldownLeft}s` : "Resend the email"}
        </Button>
        <p className="mt-6 text-center text-sm">
          <Link href={ROUTES.signIn} className="text-[#666666] hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </AuthGlassShell>
    );
  }

  return (
    <AuthGlassShell
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, toastFirstFormError)}
        noValidate
      >
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href={ROUTES.signIn} className="text-[#666666] hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </AuthGlassShell>
  );
}


