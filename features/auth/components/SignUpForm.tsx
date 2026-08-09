"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";

import { AuthGlassShell } from "@/features/auth/components/AuthGlassShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  signInWithApplePopup,
  signInWithGooglePopup,
} from "@/firebase/auth";
import { getFirebaseAuth } from "@/firebase/config";
import {
  isAuthSignInCancelled,
  mapFunctionsError,
  mapSocialAuthError,
} from "@/lib/auth-errors";
import { authLog } from "@/lib/auth-logger";
import { resolvePostAuthDestination } from "@/lib/post-auth";
import { signUpSchema, type SignUpValues } from "@/lib/auth-validation";
import { toastFirstFormError } from "@/lib/toast-form-errors";
import { AppUrls, ROUTES } from "@/lib/urls";
import { startEmailSignupVerification } from "@/services/auth-email.service";
import { useSignupDraftStore } from "@/store/signup-draft-store";
import { toast } from "@/store/toast-store";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function SignUpForm() {
  const router = useRouter();
  const setDraft = useSignupDraftStore((s) => s.setDraft);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(
    null,
  );
  const socialBusyRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      ageConfirmed: false,
      schoolName: "",
      dateOfBirth: "",
    },
  });

  const dateOfBirth = watch("dateOfBirth");

  async function afterSocialSignIn(method: "google" | "apple") {
    const user = getFirebaseAuth().currentUser;
    if (!user) {
      authLog.warn("sign_up.social.no_user", { method });
      router.replace(ROUTES.home);
      return;
    }
    authLog.success("sign_up.social.authenticated", {
      method,
      uid: user.uid,
      email: authLog.email(user.email),
    });
    const dest = await resolvePostAuthDestination(user);
    authLog.info("sign_up.social.redirect", { method, dest });
    router.replace(dest);
  }

  async function onSubmit(values: SignUpValues) {
    const email = values.email.trim();
    authLog.info("sign_up.email.start", { email: authLog.email(email) });
    try {
      await startEmailSignupVerification(email);

      let schoolLogoDataUrl: string | undefined;
      if (logoFile) {
        schoolLogoDataUrl = await fileToDataUrl(logoFile);
      }

      setDraft({
        fullName: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
        email,
        password: values.password,
        dateOfBirthIso: values.dateOfBirth || undefined,
        ageConfirmed: !values.dateOfBirth && values.ageConfirmed,
        schoolName: values.schoolName?.trim() || undefined,
        schoolLogoDataUrl,
        schoolLogoName: logoFile?.name,
        schoolLogoMimeType: logoFile?.type || undefined,
      });

      authLog.success("sign_up.otp_sent", { email: authLog.email(email) });
      toast.success(`Verification email sent to ${email}. Enter the 6-digit code.`);
      router.push(`${ROUTES.verifyOtp}?email=${encodeURIComponent(email)}`);
    } catch (e) {
      authLog.error("sign_up.email.failed", e, { email: authLog.email(email) });
      toast.error(mapFunctionsError(e));
    }
  }

  async function onGoogle() {
    if (socialBusyRef.current || socialLoading) return;
    socialBusyRef.current = true;
    setSocialLoading("google");
    authLog.info("sign_up.google.start");
    try {
      await signInWithGooglePopup();
      await afterSocialSignIn("google");
    } catch (e) {
      if (isAuthSignInCancelled(e)) {
        authLog.info("sign_up.google.cancelled");
        return;
      }
      authLog.error("sign_up.google.failed", e);
      toast.error(mapSocialAuthError(e, "google"));
    } finally {
      socialBusyRef.current = false;
      setSocialLoading(null);
    }
  }

  async function onApple() {
    if (socialBusyRef.current || socialLoading) return;
    socialBusyRef.current = true;
    setSocialLoading("apple");
    authLog.info("sign_up.apple.start");
    try {
      await signInWithApplePopup();
      await afterSocialSignIn("apple");
    } catch (e) {
      if (isAuthSignInCancelled(e)) {
        authLog.info("sign_up.apple.cancelled");
        return;
      }
      authLog.error("sign_up.apple.failed", e);
      toast.error(mapSocialAuthError(e, "apple"));
    } finally {
      socialBusyRef.current = false;
      setSocialLoading(null);
    }
  }

  const busy = isSubmitting || socialLoading !== null;

  return (
    <AuthGlassShell
      className="max-w-lg"
      title="Create your account"
      subtitle="Join thousands of teachers saving hours every week."
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, toastFirstFormError)}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <p className="text-xs text-[#666666]">Use at least 8 characters</p>
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Input
          label="School name (optional)"
          autoComplete="organization"
          error={errors.schoolName?.message}
          {...register("schoolName")}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#1A1C30]">
            School logo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-[#4A4A4A] file:mr-3 file:rounded-lg file:border-0 file:bg-[#E8F8F7] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#1A1C30]"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          />
          {logoFile ? (
            <p className="text-xs text-[#666666]">{logoFile.name}</p>
          ) : null}
        </div>
        <Input
          label="Date of birth (optional)"
          type="date"
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
          onChange={(e) => {
            setValue("dateOfBirth", e.target.value);
            if (e.target.value) setValue("ageConfirmed", false);
          }}
        />
        {!dateOfBirth ? (
          <label className="flex items-start gap-2 text-sm text-[#4A4A4A]">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-[#E5E7EB]"
              {...register("ageConfirmed")}
            />
            <span>
              I confirm I am at least 16 years old
              {errors.ageConfirmed?.message ? (
                <span className="mt-1 block text-xs text-red-600" role="alert">
                  {errors.ageConfirmed.message}
                </span>
              ) : null}
            </span>
          </label>
        ) : null}

        <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={busy}>
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-[#666666]">
        By creating an account, you agree to our{" "}
        <a
          href={AppUrls.termsOfService}
          className="text-[#28C2C0] hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href={AppUrls.privacyPolicy}
          className="text-[#28C2C0] hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        .
      </p>

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
          disabled={busy}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onApple}
          isLoading={socialLoading === "apple"}
          disabled={busy}
        >
          Continue with Apple
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-[#666666]">
        Already have an account?{" "}
        <Link
          href={ROUTES.signIn}
          className="font-semibold text-[#28C2C0] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthGlassShell>
  );
}
