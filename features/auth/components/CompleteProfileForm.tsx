"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthGlassShell } from "@/features/auth/components/AuthGlassShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { fetchUserProfile } from "@/lib/firebase/firestore";
import { signOutAndSealTrial } from "@/lib/sign-out-session";
import { authLog } from "@/lib/auth-logger";
import { AuthUiCopy } from "@/lib/auth-validation";
import { requestLogoSplash } from "@/lib/logo-splash";
import { ROUTES } from "@/lib/urls";
import {
  saveCompletedProfile,
  uploadSchoolLogoFromFile,
} from "@/services/user-profile.service";
import { ageFromDateOfBirth, MINIMUM_PROFILE_AGE } from "@/types/account";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export function CompleteProfileForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);
  const setProfile = useAuthStore((s) => s.setProfile);
  const reset = useAuthStore((s) => s.reset);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady) return;
    const current = getFirebaseAuth().currentUser;
    if (!current) {
      router.replace(ROUTES.signIn);
      return;
    }
    void (async () => {
      try {
        const profile = await fetchUserProfile(current.uid);
        if (profile && !profile.needsCompletion) {
          requestLogoSplash();
          router.replace(ROUTES.stage1);
          return;
        }
        if (profile?.schoolName) setSchoolName(profile.schoolName);
        if (profile?.dateOfBirth) {
          const d = profile.dateOfBirth;
          const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          setDateOfBirth(iso);
        }
        if (profile?.schoolLogoUrl) setExistingLogoUrl(profile.schoolLogoUrl);
      } finally {
        setLoading(false);
      }
    })();
  }, [authReady, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const current = getFirebaseAuth().currentUser;
    if (!current) {
      router.replace(ROUTES.signIn);
      return;
    }

    let dob: Date | null = null;
    if (dateOfBirth) {
      dob = new Date(dateOfBirth);
      if (Number.isNaN(dob.getTime())) {
        toast.error("Please enter a valid date of birth.");
        return;
      }
      if (ageFromDateOfBirth(dob) < MINIMUM_PROFILE_AGE) {
        toast.error(AuthUiCopy.ageTooYoung);
        return;
      }
    } else if (!ageConfirmed) {
      toast.error(AuthUiCopy.ageConfirmationRequired);
      return;
    }

    setSubmitting(true);
    authLog.info("complete_profile.start", { uid: current.uid });
    try {
      let logoUrl = existingLogoUrl;
      if (logoFile) {
        logoUrl = await uploadSchoolLogoFromFile(current.uid, logoFile);
      }
      const profile = await saveCompletedProfile({
        uid: current.uid,
        dateOfBirth: dob,
        ageConfirmed: !dob && ageConfirmed,
        schoolName,
        schoolLogoUrl: logoUrl,
      });
      setProfile(profile);
      authLog.success("complete_profile.ok", { uid: current.uid });
      toast.success("Profile completed.");
      requestLogoSplash();
      router.replace(ROUTES.stage1);
    } catch (err) {
      authLog.error("complete_profile.failed", err);
      toast.error(
        err instanceof Error ? err.message : "Could not save profile. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function signOutAndLeave() {
    await signOutAndSealTrial();
    reset();
    router.replace(ROUTES.signIn);
  }

  if (!authReady || loading) {
    return (
      <AuthGlassShell title="Complete your profile">
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </AuthGlassShell>
    );
  }

  if (!user && !getFirebaseAuth().currentUser) {
    return null;
  }

  return (
    <AuthGlassShell
      className="max-w-lg"
      title="Complete your profile"
      subtitle="A few details help personalise your lesson packs."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="School name (optional)"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          autoComplete="organization"
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
          {existingLogoUrl && !logoFile ? (
            <p className="text-xs text-[#666666]">Current logo on file</p>
          ) : null}
        </div>
        <Input
          label="Date of birth (optional)"
          type="date"
          value={dateOfBirth}
          onChange={(e) => {
            setDateOfBirth(e.target.value);
            if (e.target.value) setAgeConfirmed(false);
          }}
        />
        {!dateOfBirth ? (
          <label className="flex items-start gap-2 text-sm text-[#4A4A4A]">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-[#E5E7EB]"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
            />
            <span>I confirm I am at least 16 years old</span>
          </label>
        ) : null}
        <Button type="submit" className="w-full" isLoading={submitting}>
          Continue
        </Button>
      </form>
      <button
        type="button"
        className="mt-6 w-full text-center text-sm text-[#666666] hover:underline"
        onClick={signOutAndLeave}
      >
        Sign out
      </button>
    </AuthGlassShell>
  );
}


