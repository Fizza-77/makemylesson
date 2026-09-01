"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

import { AuthGlassShell } from "@/features/auth/components/AuthGlassShell";
import { AuthLoadingOverlay } from "@/features/auth/components/AuthLoadingOverlay";
import { SIGN_IN_LOADING_MESSAGES } from "@/features/auth/auth-loading-messages";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
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
import { requestLogoSplashAfterAuth } from "@/lib/logo-splash";
import { signInSchema, type SignInValues } from "@/lib/auth-validation";
import { toastFirstFormError } from "@/lib/toast-form-errors";
import { ROUTES } from "@/lib/urls";
import { toast } from "@/store/toast-store";

const fieldClass =
  "rounded-xl px-3.5 py-3 text-sm sm:text-[15px]";
const labelClass = "text-sm font-medium";
const btnClass = "rounded-xl px-4 py-3 text-sm sm:text-[15px]";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.1 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0 fill-current" aria-hidden>
      <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.2-3.4zM14.5 5.8c.6-.7 1-1.7.9-2.7-1 .1-2.1.7-2.7 1.4-.6.6-1.1 1.7-1 2.6 1.1.1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

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
      requestLogoSplashAfterAuth(ROUTES.stage1);
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
    requestLogoSplashAfterAuth(dest);
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

  const busy = isSubmitting || socialLoading !== null;

  return (
    <AuthGlassShell
      split
      title="Welcome back"
      subtitle="Sign in to continue planning lessons"
    >
      <div className="relative min-h-[22rem] overflow-hidden">
        <AuthLoadingOverlay active={busy} messages={SIGN_IN_LOADING_MESSAGES} />

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
          labelClassName={labelClass}
          className={fieldClass}
          error={errors.email?.message}
          {...register("email", {
            onChange: () => {
              if (formError) setFormError(null);
            },
          })}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          labelClassName={labelClass}
          className={fieldClass}
          error={errors.password?.message}
          {...register("password", {
            onChange: () => {
              if (formError) setFormError(null);
            },
          })}
        />

        <div className="-mt-1 text-right">
          <Link
            href={ROUTES.forgotPassword}
            className="text-sm font-semibold text-[#28C2C0] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className={`w-full ${btnClass}`}
          isLoading={isSubmitting}
          disabled={busy}
        >
          Sign in
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-xs font-medium tracking-wide text-[#94A3B8] uppercase">
          or
        </span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Button
          type="button"
          variant="outline"
          className={`w-full ${btnClass}`}
          onClick={onGoogle}
          isLoading={socialLoading === "google"}
          disabled={busy}
        >
          {socialLoading === "google" ? null : <GoogleIcon />}
          <span className="truncate">Sign in with Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className={`w-full ${btnClass}`}
          onClick={onApple}
          isLoading={socialLoading === "apple"}
          disabled={busy}
        >
          {socialLoading === "apple" ? null : <AppleIcon />}
          <span className="truncate">Sign in with Apple</span>
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-[#666666]">
        Don’t have an account?{" "}
        <Link
          href={ROUTES.signUp}
          className="font-semibold text-[#28C2C0] hover:underline"
        >
          Sign up
        </Link>
      </p>

      <p className="mt-3 text-center">
        <Link
          href={ROUTES.stage1}
          className="text-sm font-medium text-[#94A3B8] transition hover:text-[#1A1C30] hover:underline"
        >
          Continue as guest
        </Link>
      </p>
      </div>
    </AuthGlassShell>
  );
}
