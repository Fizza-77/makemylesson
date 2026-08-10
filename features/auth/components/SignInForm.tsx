"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

import { AuthGlassShell } from "@/features/auth/components/AuthGlassShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  signInWithApplePopup,
  signInWithEmail,
  signInWithGooglePopup,
} from "@/firebase/auth";
import { getFirebaseAuth } from "@/firebase/config";
import {
  isAuthSignInCancelled,
  isExpectedAuthCredentialError,
  mapFirebaseAuthError,
  mapSocialAuthError,
} from "@/lib/auth-errors";
import { authLog } from "@/lib/auth-logger";
import { resolvePostAuthDestination } from "@/lib/post-auth";
import { signInSchema, type SignInValues } from "@/lib/auth-validation";
import { toastFirstFormError } from "@/lib/toast-form-errors";
import { ROUTES } from "@/lib/urls";
import { toast } from "@/store/toast-store";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const nextPath = searchParams.get("next");
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(
    null,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const socialBusyRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    if (reason) toast.info(decodeURIComponent(reason));
  }, [reason]);

  async function afterSignIn(method: string) {
    const user = getFirebaseAuth().currentUser;
    if (!user) {
      authLog.warn("sign_in.no_user_after_auth", { method });
      router.replace(ROUTES.stage1);
      return;
    }
    authLog.success("sign_in.authenticated", {
      method,
      uid: user.uid,
      email: authLog.email(user.email),
    });
    let dest = await resolvePostAuthDestination(user);
    if (
      nextPath &&
      nextPath.startsWith("/") &&
      !nextPath.startsWith("//") &&
      dest !== ROUTES.completeProfile
    ) {
      dest = nextPath;
    }
    authLog.info("sign_in.redirect", { method, dest });
    toast.success("Signed in successfully.");
    router.replace(dest);
  }

  async function onSubmit(values: SignInValues) {
    setFormError(null);
    authLog.info("sign_in.email.start", { email: authLog.email(values.email) });
    try {
      await signInWithEmail(values.email, values.password);
      await afterSignIn("email");
    } catch (e) {
      const message = mapFirebaseAuthError(e);
      if (isExpectedAuthCredentialError(e)) {
        // Wrong password / unknown email — expected UX, not an app failure.
        authLog.warn("sign_in.email.rejected", {
          email: authLog.email(values.email),
          code:
            e instanceof Error && "code" in e
              ? String((e as { code?: string }).code)
              : undefined,
        });
        setFormError(message);
      } else {
        authLog.error("sign_in.email.failed", e, {
          email: authLog.email(values.email),
        });
        setFormError(message);
        toast.error(message);
      }
    }
  }

  async function onGoogle() {
    if (socialBusyRef.current || socialLoading) return;
    socialBusyRef.current = true;
    setSocialLoading("google");
    setFormError(null);
    authLog.info("sign_in.google.start");
    try {
      await signInWithGooglePopup();
      await afterSignIn("google");
    } catch (e) {
      if (isAuthSignInCancelled(e)) {
        authLog.info("sign_in.google.cancelled");
        return;
      }
      authLog.error("sign_in.google.failed", e);
      const message = mapSocialAuthError(e, "google");
      setFormError(message);
      toast.error(message);
    } finally {
      socialBusyRef.current = false;
      setSocialLoading(null);
    }
  }

  async function onApple() {
    if (socialBusyRef.current || socialLoading) return;
    socialBusyRef.current = true;
    setSocialLoading("apple");
    setFormError(null);
    authLog.info("sign_in.apple.start");
    try {
      await signInWithApplePopup();
      await afterSignIn("apple");
    } catch (e) {
      if (isAuthSignInCancelled(e)) {
        authLog.info("sign_in.apple.cancelled");
        return;
      }
      authLog.error("sign_in.apple.failed", e);
      const message = mapSocialAuthError(e, "apple");
      setFormError(message);
      toast.error(message);
    } finally {
      socialBusyRef.current = false;
      setSocialLoading(null);
    }
  }

  return (
    <AuthGlassShell
      title="Welcome back"
      subtitle="Sign in to your Make My Lesson account"
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, toastFirstFormError)}
        noValidate
      >
        {formError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800"
          >
            <p className="font-semibold">Couldn’t sign in</p>
            <p className="mt-1 leading-snug">{formError}</p>
            <p className="mt-2 text-xs text-red-700/90">
              <Link
                href={ROUTES.forgotPassword}
                className="font-semibold underline underline-offset-2 hover:text-red-900"
              >
                Reset password
              </Link>
              {" · "}
              <Link
                href={ROUTES.signUp}
                className="font-semibold underline underline-offset-2 hover:text-red-900"
              >
                Create an account
              </Link>
            </p>
          </div>
        ) : null}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            onChange: () => {
              if (formError) setFormError(null);
            },
          })}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", {
            onChange: () => {
              if (formError) setFormError(null);
            },
          })}
        />
        <div className="text-right">
          <Link
            href={ROUTES.forgotPassword}
            className="text-sm font-medium text-[#28C2C0] hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-xs text-[#666666]">or</span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onGoogle}
          isLoading={socialLoading === "google"}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onApple}
          isLoading={socialLoading === "apple"}
        >
          Continue with Apple
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-[#666666]">
        New to Make My Lesson?{" "}
        <Link
          href={ROUTES.signUp}
          className="font-semibold text-[#28C2C0] hover:underline"
        >
          Create an account
        </Link>
      </p>
      <p className="mt-3 text-center">
        <Link href={ROUTES.stage1} className="text-sm text-[#666666] hover:underline">
          Continue as Guest
        </Link>
      </p>
    </AuthGlassShell>
  );
}
