"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";

import { AccountExistsDialog } from "@/features/auth/AccountExistsDialog";
import { AuthGlassShell } from "@/features/auth/components/AuthGlassShell";
import { AuthLoadingOverlay } from "@/features/auth/components/AuthLoadingOverlay";
import {
  SIGN_UP_EMAIL_LOADING_MESSAGES,
  SIGN_UP_SOCIAL_LOADING_MESSAGES,
} from "@/features/auth/auth-loading-messages";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import {
  signInWithApplePopup,
  signInWithGooglePopup,
} from "@/firebase/auth";
import { getFirebaseAuth } from "@/firebase/config";
import {
  isAccountAlreadyExistsError,
  isAuthSignInCancelled,
  mapFunctionsError,
  mapSocialAuthError,
} from "@/lib/auth-errors";
import { authLog } from "@/lib/auth-logger";
import { resolvePostAuthDestination } from "@/lib/post-auth";
import { requestLogoSplashAfterAuth } from "@/lib/logo-splash";
import { signUpSchema, type SignUpValues } from "@/lib/auth-validation";
import { toastFirstFormError } from "@/lib/toast-form-errors";
import { AppUrls, ROUTES } from "@/lib/urls";
import { startEmailSignupVerification } from "@/services/auth-email.service";
import { useSignupDraftStore } from "@/store/signup-draft-store";
import { toast } from "@/store/toast-store";

const fieldClass =
  "rounded-lg px-3 py-2 text-sm lg:rounded-lg lg:px-3.5 lg:py-2.5 lg:text-sm";
const labelClass = "text-xs font-medium lg:text-xs";
const btnClass = "rounded-lg px-3 py-2.5 text-sm lg:rounded-lg lg:px-4 lg:py-2.5 lg:text-sm";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.1 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 fill-current" aria-hidden>
      <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.2-3.4zM14.5 5.8c.6-.7 1-1.7.9-2.7-1 .1-2.1.7-2.7 1.4-.6.6-1.1 1.7-1 2.6 1.1.1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

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
  const [existingAccountEmail, setExistingAccountEmail] = useState<string | null>(
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
  const password = watch("password") ?? "";
  const showPasswordLengthHint =
    password.length > 0 && password.length < 8;

  async function afterSocialSignIn(method: "google" | "apple") {
    const user = getFirebaseAuth().currentUser;
    if (!user) {
      authLog.warn("sign_up.social.no_user", { method });
      requestLogoSplashAfterAuth(ROUTES.stage1);
      router.replace(ROUTES.stage1);
      return;
    }
    authLog.success("sign_up.social.authenticated", {
      method,
      uid: user.uid,
      email: authLog.email(user.email),
    });
    const dest = await resolvePostAuthDestination(user);
    authLog.info("sign_up.social.redirect", { method, dest });
    requestLogoSplashAfterAuth(dest);
    router.replace(dest);
  }

  async function onSubmit(values: SignUpValues) {
    const email = values.email.trim();
    authLog.info("sign_up.email.start", { email: authLog.email(email) });
    setExistingAccountEmail(null);
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
      if (isAccountAlreadyExistsError(e)) {
        authLog.info("sign_up.email.already_exists", {
          email: authLog.email(email),
        });
        setExistingAccountEmail(email);
        return;
      }
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
  const loadingMessages = isSubmitting
    ? SIGN_UP_EMAIL_LOADING_MESSAGES
    : SIGN_UP_SOCIAL_LOADING_MESSAGES;

  return (
    <AuthGlassShell
      wide
      title="Create your account"
      subtitle="Join thousands of teachers saving hours every week."
      shellClassName="lg:overflow-hidden"
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <AuthLoadingOverlay active={busy} messages={loadingMessages} />
      <form
        className="flex min-h-0 flex-col space-y-2 lg:space-y-2.5"
        onSubmit={handleSubmit(onSubmit, toastFirstFormError)}
        noValidate
      >
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
          <Input
            label="First name"
            autoComplete="given-name"
            labelClassName={labelClass}
            className={fieldClass}
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last name"
            autoComplete="family-name"
            labelClassName={labelClass}
            className={fieldClass}
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <div className="col-span-2 lg:col-span-1">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              labelClassName={labelClass}
              className={fieldClass}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-[#1A1C30]"
              >
                Password
              </label>
              {showPasswordLengthHint ? (
                <span className="text-[10px] text-red-600">
                  Use at least 8 characters
                </span>
              ) : null}
            </div>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              className={fieldClass}
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
          <PasswordInput
            label="Confirm password"
            autoComplete="new-password"
            labelClassName={labelClass}
            className={fieldClass}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <div className="col-span-2 lg:col-span-1">
            <Input
              label="School name (optional)"
              autoComplete="organization"
              labelClassName={labelClass}
              className={fieldClass}
              error={errors.schoolName?.message}
              {...register("schoolName")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <label className="text-xs font-medium text-[#1A1C30]">
              School logo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#4A4A4A] file:mr-2 file:rounded file:border-0 file:bg-[#E8F8F7] file:px-2 file:py-1 file:text-[11px] file:font-semibold file:text-[#1A1C30]"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Input
            label="Date of birth (optional)"
            type="date"
            labelClassName={labelClass}
            className={fieldClass}
            error={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
            onChange={(e) => {
              setValue("dateOfBirth", e.target.value);
              if (e.target.value) setValue("ageConfirmed", false);
            }}
          />
        </div>

        <Button
          type="submit"
          className={`w-full shrink-0 ${btnClass}`}
          isLoading={isSubmitting}
          disabled={busy}
        >
          Create account
        </Button>

        <div className="flex shrink-0 flex-col items-center gap-1">
          {!dateOfBirth ? (
            <label className="flex w-fit items-start justify-center gap-1.5 text-center text-[11px] leading-snug text-[#4A4A4A]">
              <input
                type="checkbox"
                className="mt-0.5 size-3.5 shrink-0 rounded border-[#E5E7EB]"
                {...register("ageConfirmed")}
              />
              <span>
                I confirm I am at least 16 years old
                {errors.ageConfirmed?.message ? (
                  <span className="mt-0.5 block text-[10px] text-red-600" role="alert">
                    {errors.ageConfirmed.message}
                  </span>
                ) : null}
              </span>
            </label>
          ) : null}

          <p className="max-w-2xl text-center text-[11px] leading-snug text-[#666666]">
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
        </div>
      </form>

      <div className="my-2 flex shrink-0 items-center gap-2 lg:my-2.5">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[11px] text-[#666666]">or</span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 lg:gap-3">
        <Button
          type="button"
          variant="outline"
          className={`w-full ${btnClass}`}
          onClick={onGoogle}
          isLoading={socialLoading === "google"}
          disabled={busy}
        >
          {socialLoading === "google" ? null : <GoogleIcon />}
          <span className="truncate">Google</span>
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
          <span className="truncate">Apple</span>
        </Button>
      </div>

      <p className="mt-2 shrink-0 text-center text-xs text-[#666666] lg:mt-2.5">
        Already have an account?{" "}
        <Link
          href={ROUTES.signIn}
          className="font-semibold text-[#28C2C0] hover:underline"
        >
          Sign in
        </Link>
      </p>
      </div>

      <AccountExistsDialog
        open={existingAccountEmail !== null}
        email={existingAccountEmail ?? ""}
        onClose={() => setExistingAccountEmail(null)}
      />
    </AuthGlassShell>
  );
}
