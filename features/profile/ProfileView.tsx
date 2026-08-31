"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { ProfileAvatarDisplay } from "@/features/profile/ProfileAvatarDisplay";
import { ProfileDefaultSettingsCard } from "@/features/profile/ProfileDefaultSettingsCard";
import {
  ProfileCardShell,
  ProfileToggleSwitch,
} from "@/features/profile/ProfileMenuPrimitives";
import { ProfilePhotoControls } from "@/features/profile/ProfilePhotoControls";
import { ProfileSecuritySection } from "@/features/profile/ProfileSecuritySection";
import { ProfileSubscriptionCard } from "@/features/profile/ProfileSubscriptionCard";
import {
  ProfileSignOutButton,
  ProfileSupportLegalSection,
} from "@/features/profile/ProfileSupportLegalSection";
import { signOutAndSealTrial } from "@/lib/sign-out-session";
import { authLog } from "@/lib/auth-logger";
import {
  curriculumLabelForPrefs,
  loadLessonPlanCurriculumPrefs,
} from "@/lib/lesson-plan-curriculum-prefs";
import { ROUTES } from "@/lib/urls";
import {
  PLAN_LABELS,
  updateUserProfileFields,
  type UserAccountView,
} from "@/services/user-account.service";
import {
  syncAccountSubscription,
  useAccountStore,
} from "@/store/account-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

function KitHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.5v-5.5h-3V21H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SchoolMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.5v-5.5h-3V21H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8.5" cy="10" r="1.4" fill="currentColor" />
      <path
        d="m7 16 3.2-3.2a1 1 0 0 1 1.3 0L14 15l1.4-1.4a1 1 0 0 1 1.3 0L19 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 18.5c1.4-2.4 3.6-3.6 6.5-3.6s5.1 1.2 6.5 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExportToggleCard({
  icon,
  title,
  description,
  lockedLabel,
  locked,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  lockedLabel: string;
  locked: boolean;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#D5DCE3] bg-white">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#E7F6F5] text-[#128C89]">
            {icon}
          </span>
          <ProfileToggleSwitch
            checked={checked && !locked}
            disabled={locked}
            onChange={onChange}
            label={title}
          />
        </div>
        <p className="mt-3 text-sm font-semibold text-[#0D1430]">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-[#8A93A3]">
          {description}
        </p>
      </div>
      {locked ? (
        <div className="bg-[#EAF7F6] px-4 py-3 text-xs font-medium text-[#128C89]">
          {lockedLabel}
        </div>
      ) : (
        <div className="bg-[#F4F7F9] px-4 py-3 text-xs font-medium text-[#8A93A3]">
          Ready for exports
        </div>
      )}
    </div>
  );
}

function ProfileHero({
  account,
  displayName,
  curriculumLabel,
}: {
  account: UserAccountView | null;
  displayName: string;
  curriculumLabel: string;
}) {
  const planLabel = account ? PLAN_LABELS[account.planTier] : "Free";
  const credits = account ? Math.max(0, account.generationCredits) : 5;
  const isGuest = !account;
  const cardName = isGuest ? "Guest" : displayName;
  const cardSubline = isGuest
    ? "Sign in to personalise your teacher profile."
    : (account?.schoolName ?? curriculumLabel);

  return (
    <section
      className="relative overflow-hidden rounded-[28px] shadow-[0_24px_48px_-20px_rgba(13,20,48,0.35)]"
      style={{
        backgroundImage: [
          "radial-gradient(ellipse 65% 90% at 88% 42%, rgba(104, 211, 208, 0.32) 0%, rgba(104, 211, 208, 0) 62%)",
          "linear-gradient(90deg, #0D1430 0%, #202B52 48%, #30416F 100%)",
        ].join(", "),
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10 lg:py-9">
        <div className="relative z-10 w-full min-w-0 max-w-xl flex-1">
          <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] text-[#9BB0C4] uppercase">
            <span className="inline-block h-0.5 w-7 rounded-full bg-[#35BEBC]" />
            Teacher Identity &amp; Account Studio
          </p>

          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Profile <span className="text-[#68D3D0]">·</span>{" "}
            <span className="text-[#68D3D0]">{displayName}</span>
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-[15px]">
            Manage your teacher identity, AI export kit, curriculum defaults,
            subscription, security, and support resources.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white">
              {isGuest ? "Guest Account" : "Signed in"}
            </span>
            <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white">
              {planLabel} Plan
            </span>
            <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white">
              {curriculumLabel}
            </span>
            <span className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white">
              {credits} Credit{credits === 1 ? "" : "s"} Available
            </span>
          </div>
        </div>

        <div className="pointer-events-none relative z-0 hidden h-[200px] w-full max-w-[320px] shrink-0 sm:h-[220px] sm:max-w-[360px] md:block lg:h-[240px] lg:max-w-[400px]">
          <div
            className="absolute left-1/2 top-1/2 w-[118%] max-w-none -translate-x-1/2 -translate-y-[46%]"
            style={{ containerType: "inline-size" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile-hero.svg"
              alt="Teacher identity card illustration"
              width={451}
              height={447}
              className="h-auto w-full select-none"
            />
            {/* The card art leaves the name block empty; sizes are in cqw so the
                text tracks the artwork at every breakpoint. */}
            <div
              className="absolute"
              style={{
                left: "33.8%",
                top: "53.5%",
                width: "44%",
                transform: "rotate(-2.3deg)",
                transformOrigin: "left top",
              }}
            >
              <p
                className="truncate font-extrabold text-[#0D1430]"
                style={{ fontSize: "4.9cqw", lineHeight: 1 }}
              >
                {cardName}
              </p>
              <p
                className="truncate text-[#5D6B84]"
                style={{
                  fontSize: "2.2cqw",
                  lineHeight: 1,
                  marginTop: "1.9cqw",
                }}
              >
                {cardSubline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeacherPassport({
  account,
  onSignOut,
}: {
  account: UserAccountView | null;
  onSignOut: () => void | Promise<void>;
}) {
  if (!account) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-[#202B52] to-[#0D1430] p-7 shadow-[0_24px_48px_-20px_rgba(13,20,48,0.25)]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#68D3D0] uppercase">
            Teacher Passport
          </p>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
            Guest
          </span>
        </div>
        <div className="mt-6 flex size-16 items-center justify-center rounded-full bg-white/90 text-[#20AAA7]">
          <UserMiniIcon />
        </div>
        <h3 className="mt-4 text-xl font-bold text-white">Guest</h3>
        <p className="mt-1 text-sm text-white/60">
          Sign in to add a profile photo and personalise your account.
        </p>
        <div className="mt-5 space-y-3">
          <PassportField label="Name" value="Teacher" />
          <PassportField label="Email" value="teacher@example.com" />
          <PassportField label="School name" value="Springfield High School" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={ROUTES.signIn}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2.5 text-center text-sm font-semibold text-white"
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.signUp}
            className="rounded-full bg-gradient-to-r from-[#35BEBC] to-[#68D3D0] px-3 py-2.5 text-center text-sm font-semibold text-[#0D1430]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#202B52] to-[#0D1430] p-7 shadow-[0_24px_48px_-20px_rgba(13,20,48,0.25)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#68D3D0] uppercase">
          Teacher Passport
        </p>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
          {PLAN_LABELS[account.planTier]}
        </span>
      </div>
      <div className="mt-6">
        <ProfileAvatarDisplay account={account} sizeClass="size-16" />
      </div>
      <h3 className="mt-4 truncate text-xl font-bold text-white">
        {account.displayName}
      </h3>
      <p className="mt-1 text-sm text-white/60">
        Update your photo and personal details anytime.
      </p>
      <div className="mt-4">
        <ProfilePhotoControls account={account} />
      </div>
      <div className="mt-5 space-y-3">
        <PassportField label="Name" value={account.displayName} />
        <PassportField
          label="Email"
          value={account.email || "Not available"}
        />
        <PassportField
          label="School name"
          value={account.schoolName?.trim() || "Not added"}
        />
      </div>
      <div className="mt-5">
        <ProfileSignOutButton onSignOut={onSignOut} />
      </div>
    </div>
  );
}

function PassportField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
      <p className="text-[10px] font-semibold tracking-wide text-white/40 uppercase">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function AiExportIdentityKit({
  account,
  onToggle,
}: {
  account: UserAccountView;
  onToggle: (
    field: "useSchoolNameInAi" | "useSchoolLogoInAi" | "useOwnPicInAi",
    value: boolean,
  ) => void;
}) {
  const schoolLocked = !account.schoolName?.trim();
  const logoLocked = !account.schoolLogoUrl?.trim();
  const photoLocked =
    !account.profilePhotoUrl?.trim() || account.avatarSource !== "photo";

  return (
    <ProfileCardShell
      icon={<KitHeaderIcon />}
      title="AI Export Identity Kit"
      description="Choose which teacher and school details appear in generated exports."
      badge="Account"
      className="border-[#D5DCE3] shadow-[0_10px_28px_-16px_rgba(13,20,48,0.12)]"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ExportToggleCard
          icon={<SchoolMiniIcon />}
          title="Use School Name"
          description={
            schoolLocked
              ? "Add School Name first to enable this option."
              : "Include your school name on exported materials."
          }
          lockedLabel="Locked until school name is added"
          locked={schoolLocked}
          checked={account.useSchoolNameInAi}
          onChange={(v) => onToggle("useSchoolNameInAi", v)}
        />
        <ExportToggleCard
          icon={<ImageMiniIcon />}
          title="Use School Logo"
          description={
            logoLocked
              ? "Add School Logo first to enable this option."
              : "Include your school logo on exported materials."
          }
          lockedLabel="Locked until a logo is uploaded"
          locked={logoLocked}
          checked={account.useSchoolLogoInAi}
          onChange={(v) => onToggle("useSchoolLogoInAi", v)}
        />
        <ExportToggleCard
          icon={<UserMiniIcon />}
          title="Use OwnPic"
          description={
            photoLocked
              ? "Add your profile pic first to enable this option."
              : "Include your profile photo on exported materials."
          }
          lockedLabel="Locked until profile photo is added"
          locked={photoLocked}
          checked={account.useOwnPicInAi}
          onChange={(v) => onToggle("useOwnPicInAi", v)}
        />
      </div>
    </ProfileCardShell>
  );
}

export function ProfileView() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const authReady = useAuthStore((s) => s.authReady);
  const resetAuth = useAuthStore((s) => s.reset);
  const setProfile = useAuthStore((s) => s.setProfile);

  const account = useAccountStore((s) => s.account);
  const accountLoading = useAccountStore((s) => s.loading);

  const [curriculumLabel, setCurriculumLabel] = useState("British Curriculum");

  useEffect(() => {
    if (!authReady) return;
    syncAccountSubscription(user?.uid ?? null);
  }, [authReady, user?.uid]);

  useEffect(() => {
    setCurriculumLabel(
      curriculumLabelForPrefs(loadLessonPlanCurriculumPrefs()) ||
        "British Curriculum",
    );
  }, [account?.uid]);

  async function leaveSignedOut() {
    authLog.info("sign_out.start", { uid: user?.uid });
    try {
      await signOutAndSealTrial();
    } catch (e) {
      authLog.warn("sign_out.after_delete", { message: String(e) });
    }
    resetAuth();
    setProfile(null);
    authLog.success("sign_out.ok");
    router.replace(ROUTES.stage1);
  }

  async function setAiToggle(
    field: "useSchoolNameInAi" | "useSchoolLogoInAi" | "useOwnPicInAi",
    value: boolean,
  ) {
    if (!user) return;
    try {
      await updateUserProfileFields(user.uid, { [field]: value });
    } catch (e) {
      authLog.error("profile.toggle_failed", e, { field });
      toast.error("Could not update preference.");
    }
  }

  if (!authReady || (user && accountLoading && !account)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const signedInAccount = user && account ? account : null;
  const displayName =
    signedInAccount?.displayName ||
    profile?.displayName ||
    user?.displayName ||
    "Teacher";

  return (
    <div
      className="flex w-full min-w-0 flex-col gap-6 bg-[#EEF8F7] pb-8"
    >
      <ProfileHero
        account={signedInAccount}
        displayName={displayName}
        curriculumLabel={curriculumLabel}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <TeacherPassport
            account={signedInAccount}
            onSignOut={leaveSignedOut}
          />
          {signedInAccount ? (
            <ProfileSubscriptionCard account={signedInAccount} />
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          {signedInAccount ? (
            <AiExportIdentityKit
              account={signedInAccount}
              onToggle={(field, value) => void setAiToggle(field, value)}
            />
          ) : (
            <ProfileCardShell
              icon={<KitHeaderIcon />}
              title="AI Export Identity Kit"
              description="Choose which teacher and school details appear in generated exports."
              badge="Account"
              className="border-[#D5DCE3] shadow-[0_10px_28px_-16px_rgba(13,20,48,0.12)]"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <ExportToggleCard
                  icon={<SchoolMiniIcon />}
                  title="Use School Name"
                  description="Add School Name first to enable this option."
                  lockedLabel="Locked until school name is added"
                  locked
                  checked={false}
                  onChange={() => undefined}
                />
                <ExportToggleCard
                  icon={<ImageMiniIcon />}
                  title="Use School Logo"
                  description="Add School Logo first to enable this option."
                  lockedLabel="Locked until a logo is uploaded"
                  locked
                  checked={false}
                  onChange={() => undefined}
                />
                <ExportToggleCard
                  icon={<UserMiniIcon />}
                  title="Use OwnPic"
                  description="Add your profile pic first to enable this option."
                  lockedLabel="Locked until profile photo is added"
                  locked
                  checked={false}
                  onChange={() => undefined}
                />
              </div>
            </ProfileCardShell>
          )}
          <ProfileDefaultSettingsCard />
          {signedInAccount ? (
            <ProfileSecuritySection
              account={signedInAccount}
              onSignedOutAfterDelete={leaveSignedOut}
            />
          ) : null}
          <ProfileSupportLegalSection />
        </div>
      </div>
    </div>
  );
}
