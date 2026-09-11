"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ProfileCardShell, ProfileDialogShell } from "@/features/profile/ProfileMenuPrimitives";
import {
  clearLessonPlanCurriculumPrefs,
  curriculumLabelForPrefs,
  formatSavedTopicLine,
  loadLessonPlanCurriculumPrefs,
  type LessonPlanPrefsSnapshot,
} from "@/lib/lesson-plan-curriculum-prefs";
import { ROUTES } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { toast } from "@/store/toast-store";

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M4 7h10M18 7h2M14 5v4M4 17h6M14 17h6M10 15v4M4 12h4M12 12h8M8 10v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="hidden size-5 shrink-0 text-[#20AAA7] sm:block"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileDefaultSettingsCard() {
  const [snap, setSnap] = useState<LessonPlanPrefsSnapshot | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const refresh = useCallback(() => {
    setSnap(loadLessonPlanCurriculumPrefs());
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("lesson_plan_")) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  function clearDefaults() {
    clearLessonPlanCurriculumPrefs();
    setSnap(null);
    setConfirmOpen(false);
    toast.success("Saved defaults cleared.");
  }

  const curriculum = curriculumLabelForPrefs(snap) ?? "Not selected";
  const subject =
    snap?.subjectDisplayName?.trim() ||
    snap?.subjectName?.trim() ||
    "Not selected";
  const topic = formatSavedTopicLine(snap);
  const topicEmpty = topic === "Not set";
  const subjectEmpty = subject === "Not selected";
  const curriculumEmpty = !snap || curriculum === "Not selected";

  return (
    <ProfileCardShell
      icon={<SlidersIcon />}
      title="Curriculum Route"
      description="Your saved Default Settings for the next generation."
      badge="Saved"
      className="border-[#D5DCE3] shadow-[0_10px_28px_-16px_rgba(13,20,48,0.12)]"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-[#CFE6E4] p-5 sm:p-6"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 50% 0%, rgba(53, 190, 188, 0.10) 0%, rgba(53, 190, 188, 0) 34%)",
            "linear-gradient(180deg, #FFFFFF 0%, #F3FBFA 100%)",
          ].join(", "),
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#128C89] uppercase">
            Saved Curriculum Route
          </p>
          <span className="rounded-full border border-[#20AAA7]/45 bg-white px-3 py-1 text-[11px] font-semibold text-[#128C89]">
            Active Default
          </span>
        </div>

        <h3 className="mt-3 text-xl font-bold tracking-tight text-[#0D1430] sm:text-2xl">
          {curriculumEmpty ? "No route saved" : curriculum}
        </h3>
        <p className="mt-1.5 text-sm text-[#8A93A3]">
          Saved selections are pre-filled on your next generation.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <RouteField
            label="Curriculum"
            value={curriculumEmpty ? "Not selected" : curriculum}
            empty={curriculumEmpty}
          />
          <ArrowIcon />
          <RouteField label="Subject" value={subject} empty={subjectEmpty} />
          <ArrowIcon />
          <RouteField
            label="Topic"
            value={topicEmpty ? "Not selected" : topic}
            empty={topicEmpty}
          />
        </div>

        <div className="mt-6 flex flex-nowrap items-center gap-2 sm:justify-end sm:gap-3">
          <Link
            href={ROUTES.stage1}
            className="inline-flex min-w-0 flex-1 items-center justify-center rounded-xl bg-[#20AAA7] px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#1a9592] sm:flex-none sm:px-4"
          >
            Edit in Stage 1
          </Link>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex min-w-0 flex-1 items-center justify-center rounded-xl border border-[#F0C8C8] bg-[#FFF5F5] px-3 py-2.5 text-center text-sm font-semibold text-[#C84747] transition hover:bg-[#FFE8E8] sm:flex-none sm:px-4"
          >
            Clear defaults
          </button>
        </div>
      </div>

      {confirmOpen ? (
        <ProfileDialogShell
          title="Clear saved defaults?"
          onClose={() => setConfirmOpen(false)}
        >
          <p className="text-sm text-[#78848D]">
            Your curriculum selections on the next generation will start empty
            until you choose again.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0D1430] hover:bg-[#F5F6FA]"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#20AAA7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#35BEBC]"
              onClick={clearDefaults}
            >
              Clear
            </button>
          </div>
        </ProfileDialogShell>
      ) : null}
    </ProfileCardShell>
  );
}

function RouteField({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-xl border border-[#CFE6E4] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(13,20,48,0.04)]">
      <p className="text-[10px] font-semibold tracking-[0.12em] text-[#128C89] uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 truncate text-sm font-semibold",
          empty ? "font-medium text-[#9AA2A8]" : "text-[#0D1430]",
        )}
      >
        {value}
      </p>
    </div>
  );
}


