"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

import { AuthGlassShell } from "@/features/auth/components/AuthGlassShell";
import { AuthLoadingOverlay } from "@/features/auth/components/AuthLoadingOverlay";
import { OTP_VERIFY_LOADING_MESSAGES } from "@/features/auth/auth-loading-messages";
import { Button } from "@/components/ui/Button";
import { signInWithCustomAuthToken } from "@/firebase/auth";
import { userDocRef } from "@/firebase/firestore";
import { mapFunctionsError } from "@/lib/auth-errors";
import { authLog } from "@/lib/auth-logger";
import { requestLogoSplashAfterAuth } from "@/lib/logo-splash";
import { resolvePostAuthDestination } from "@/lib/post-auth";
import { ROUTES } from "@/lib/urls";
import {
  completeEmailSignup,
  startEmailSignupVerification,
} from "@/services/auth-email.service";
import { uploadSchoolLogoFromDataUrl } from "@/services/user-profile.service";
import { useSignupDraftStore } from "@/store/signup-draft-store";
import { toast } from "@/store/toast-store";
import { serverTimestamp, setDoc } from "firebase/firestore";

export function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const draft = useSignupDraftStore((s) => s.draft);
  const clearDraft = useSignupDraftStore((s) => s.clearDraft);

  const email = draft?.email || emailParam;
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!draft && !emailParam) {
      router.replace(ROUTES.signUp);
    }
  }, [draft, emailParam, router]);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const t = setInterval(() => {
      setCooldownLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldownLeft]);

  const otp = digits.join("");

  const setDigitAt = useCallback((index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }, []);

  function onKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = Array(6).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  }

  async function verify() {
    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP.");
      return;
    }
    if (!draft) {
      toast.error("Signup session expired. Please sign up again.");
      return;
    }
    setVerifying(true);
    authLog.info("otp.verify.start", { email: authLog.email(draft.email) });
    try {
      const customToken = await completeEmailSignup({
        email: draft.email,
        otp,
        password: draft.password,
        profileDraft: {
          fullName: draft.fullName,
          ...(draft.dateOfBirthIso
            ? { dateOfBirthIso: draft.dateOfBirthIso }
            : {}),
          ageConfirmed: draft.ageConfirmed,
          schoolName: draft.schoolName ?? null,
        },
      });
      const credential = await signInWithCustomAuthToken(customToken);
      const user = credential.user;
      if (!user) throw new Error("Could not sign in after account creation.");

      authLog.success("otp.verify.account_created", {
        uid: user.uid,
        email: authLog.email(user.email),
      });

      if (draft.schoolLogoDataUrl) {
        const url = await uploadSchoolLogoFromDataUrl(
          user.uid,
          draft.schoolLogoDataUrl,
          draft.schoolLogoMimeType,
        );
        await setDoc(
          userDocRef(user.uid),
          {
            schoolLogoUrl: url,
            schoolLogoName: draft.schoolLogoName ?? null,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        authLog.info("otp.verify.logo_uploaded", { uid: user.uid });
      }

      clearDraft();
      const dest = await resolvePostAuthDestination(user);
      authLog.info("otp.verify.redirect", { dest });
      toast.success("Email verified. Welcome to Make My Lesson.");
      requestLogoSplashAfterAuth(dest);
      router.replace(dest);
    } catch (e) {
      authLog.error("otp.verify.failed", e, {
        email: authLog.email(draft.email),
      });
      toast.error(mapFunctionsError(e));
    } finally {
      setVerifying(false);
    }
  }

  async function resend() {
    if (resending || cooldownLeft > 0 || !email) return;
    setResending(true);
    try {
      await startEmailSignupVerification(email);
      setCooldownLeft(60);
      toast.success("Email resent. Please wait 60 seconds before trying again.");
      authLog.success("otp.resend.ok", { email: authLog.email(email) });
    } catch (e) {
      authLog.error("otp.resend.failed", e, { email: authLog.email(email) });
      toast.error(mapFunctionsError(e));
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthGlassShell
      title="Verify your email"
      subtitle="Check your email and enter the 6-digit verification code."
    >
      <div className="relative min-h-[18rem]">
        <AuthLoadingOverlay active={verifying} messages={OTP_VERIFY_LOADING_MESSAGES} />

      {email ? (
        <p className="mb-4 text-center text-sm text-[#666666]">
          Code sent to <span className="font-semibold text-[#1A1C30]">{email}</span>
        </p>
      ) : null}

      <div className="mb-6 flex justify-center gap-2" onPaste={onPaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            aria-label={`Digit ${index + 1}`}
            className="size-11 rounded-xl border border-[#E5E7EB] text-center text-lg font-semibold text-[#1A1C30] focus:border-[#28C2C0] focus:outline-none focus:ring-2 focus:ring-[#28C2C0]/25 sm:size-12"
            onChange={(e) => setDigitAt(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
          />
        ))}
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={verify}
        isLoading={verifying}
        disabled={otp.length !== 6}
      >
        Verify
      </Button>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm font-medium text-[#28C2C0] hover:underline disabled:text-[#666666] disabled:no-underline"
          onClick={resend}
          disabled={resending || cooldownLeft > 0}
        >
          {cooldownLeft > 0
            ? `Resend in ${cooldownLeft}s`
            : resending
              ? "Sending..."
              : "Resend verification email"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm">
        <Link href={ROUTES.signIn} className="text-[#666666] hover:underline">
          ← Back to sign in
        </Link>
      </p>
      </div>
    </AuthGlassShell>
  );
}
