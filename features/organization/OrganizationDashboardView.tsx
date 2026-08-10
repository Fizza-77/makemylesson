"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PricingLink } from "@/components/common/PricingLink";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { mapFunctionsError } from "@/lib/auth-errors";
import { ROUTES } from "@/lib/urls";
import {
  addTeacherSeat,
  getMyAdminOrganizations,
  getOrganizationDashboardWithRenewal,
  mapOrgInviteBlockedMessage,
  removeTeacherSeat,
} from "@/services/organization.service";
import { ANNUAL_CREDITS_PER_SEAT } from "@/services/paypal-checkout.service";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import {
  seatsRemaining,
  type OrganizationDashboardData,
  type OrganizationSummary,
} from "@/types/organization";

function planLabel(planKey: string): string {
  switch (planKey) {
    case "department":
      return "Department";
    case "school":
      return "School";
    case "school_plus":
      return "School Plus";
    default:
      return planKey || "Organization";
  }
}

function formatUtcDate(d: Date | null | undefined): string | null {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
}

export function OrganizationDashboardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgIdParam = (searchParams.get("orgId") ?? "").trim();

  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.authReady);

  const [dashboard, setDashboard] = useState<OrganizationDashboardData | null>(
    null,
  );
  const [orgs, setOrgs] = useState<OrganizationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [inviteBlocked, setInviteBlocked] = useState<string | null>(null);

  const load = useCallback(
    async (orgId?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const list = await getMyAdminOrganizations();
        setOrgs(list);
        const data = await getOrganizationDashboardWithRenewal(
          orgId || orgIdParam || null,
        );
        setDashboard(data);
        if (data.lastBillingRenewed) {
          toast.success(
            "Yearly generation credits were renewed for everyone on this plan.",
          );
        }
        // Keep URL in sync when we resolved the first owned org
        if (!orgIdParam && data.orgId) {
          router.replace(
            `${ROUTES.organizationDashboard}?orgId=${encodeURIComponent(data.orgId)}`,
          );
        }
      } catch (e) {
        setDashboard(null);
        setError(mapFunctionsError(e) || "Could not open dashboard.");
      } finally {
        setLoading(false);
      }
    },
    [orgIdParam, router],
  );

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      setLoading(false);
      setDashboard(null);
      return;
    }
    void load(orgIdParam || null);
  }, [authReady, user, orgIdParam, load]);

  async function onAddTeacher() {
    if (!dashboard) return;
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.info("Enter a valid Gmail address.");
      return;
    }
    setAdding(true);
    try {
      const next = await addTeacherSeat({
        orgId: dashboard.orgId,
        email: trimmed,
      });
      setDashboard(next);
      setEmail("");
      toast.success("Teacher seat updated.");
    } catch (e) {
      const blocked = mapOrgInviteBlockedMessage(e);
      if (blocked) {
        setInviteBlocked(blocked);
      } else {
        toast.error(mapFunctionsError(e) || "Could not add teacher.");
      }
    } finally {
      setAdding(false);
    }
  }

  async function onRemoveTeacher(teacherEmail: string) {
    if (!dashboard) return;
    setConfirmRemove(null);
    setRemovingEmail(teacherEmail);
    try {
      const next = await removeTeacherSeat({
        orgId: dashboard.orgId,
        email: teacherEmail,
      });
      setDashboard(next);
      toast.success("Teacher removed from seat.");
    } catch (e) {
      toast.error(mapFunctionsError(e) || "Could not remove teacher.");
    } finally {
      setRemovingEmail(null);
    }
  }

  if (!authReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center text-sm text-[#666666]">
        <p>Sign in to manage your organization seats.</p>
        <Link
          href={`${ROUTES.signIn}?next=${encodeURIComponent(ROUTES.organizationDashboard)}`}
          className="mt-3 inline-block font-semibold text-[#28C2C0]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-10">
      <div>
        <PricingLink
          href={ROUTES.subscription}
          className="text-xs font-semibold text-[#28C2C0] hover:underline"
        >
          ← Plans
        </PricingLink>
        <h1 className="mt-2 text-2xl font-bold text-[#1A1C30]">
          School dashboard
        </h1>
        <p className="mt-1 text-sm text-[#666666]">
          Manage teacher seats for your department or school plan.
        </p>
      </div>

      {orgs.length > 1 ? (
        <Card className="flex flex-col gap-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
            Your organizations
          </p>
          <div className="flex flex-wrap gap-2">
            {orgs.map((o) => (
              <Button
                key={o.orgId}
                type="button"
                variant={
                  dashboard?.orgId === o.orgId ? "primary" : "outline"
                }
                className="text-xs"
                onClick={() =>
                  router.push(
                    `${ROUTES.organizationDashboard}?orgId=${encodeURIComponent(o.orgId)}`,
                  )
                }
              >
                {planLabel(o.planKey)} ({o.seatLimit} seats)
              </Button>
            ))}
          </div>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-[#666666]">
          <Spinner className="size-5" />
          Loading dashboard…
        </div>
      ) : null}

      {error ? (
        <Card className="border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-900">{error}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-3 text-xs"
            onClick={() => void load(orgIdParam || null)}
          >
            Retry
          </Button>
        </Card>
      ) : null}

      {!loading && !error && !dashboard ? (
        <Card>
          <p className="text-sm text-[#1A1C30]">
            No admin dashboard found for this account yet.
          </p>
          <PricingLink href={ROUTES.subscription} className="mt-3 inline-block">
            <Button type="button">View plans</Button>
          </PricingLink>
        </Card>
      ) : null}

      {dashboard && !loading ? (
        <>
          <Card>
            <h2 className="text-base font-semibold text-[#1A1C30]">
              Plan: {planLabel(dashboard.planKey)}
            </h2>
            <p className="mt-2 text-sm text-[#1A1C30]">
              Seats used: {dashboard.seatsUsed}/{dashboard.seatLimit}
            </p>
            <p className="mt-1 text-sm text-[#666666]">
              Seats remaining: {seatsRemaining(dashboard)}
            </p>
            {formatUtcDate(dashboard.billingPeriodEnd) ? (
              <p className="mt-1 text-sm text-[#666666]">
                Yearly period ends (UTC):{" "}
                {formatUtcDate(dashboard.billingPeriodEnd)}
              </p>
            ) : null}
            <p className="mt-1 text-sm text-[#666666]">
              Each seat:{" "}
              {dashboard.annualCreditsPerSeat ?? ANNUAL_CREDITS_PER_SEAT}{" "}
              generation credits for the year (yearly pool).
            </p>
            <p className="mt-3 font-mono text-[10px] break-all text-[#999999]">
              {dashboard.orgId}
            </p>
          </Card>

          <Card className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-[#1A1C30]">
              Add teacher by Gmail
            </h2>
            <Input
              type="email"
              autoComplete="email"
              placeholder="teacher@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void onAddTeacher();
                }
              }}
            />
            <Button
              type="button"
              disabled={adding || seatsRemaining(dashboard) <= 0}
              isLoading={adding}
              onClick={() => void onAddTeacher()}
            >
              Add teacher
            </Button>
            {seatsRemaining(dashboard) <= 0 ? (
              <p className="text-xs text-[#666666]">No seats remaining.</p>
            ) : null}
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-[#1A1C30]">
              Teacher usage
            </h2>
            {dashboard.teachers.length === 0 ? (
              <p className="mt-3 text-sm text-[#666666]">
                No teachers added yet.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-[#F0F1F5]">
                {dashboard.teachers.map((t) => (
                  <li
                    key={t.email}
                    className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1A1C30]">
                        {t.email}
                      </p>
                      <p className="mt-0.5 text-xs text-[#666666]">
                        Status: {t.status || "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-[#666666]">
                        Credits used: {t.creditsUsed} · Remaining:{" "}
                        {t.creditsRemaining}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 text-xs text-red-700"
                      disabled={removingEmail === t.email}
                      isLoading={removingEmail === t.email}
                      onClick={() => setConfirmRemove(t.email)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      ) : null}

      <ConfirmDialog
        open={!!confirmRemove}
        title="Remove teacher seat?"
        message={
          confirmRemove
            ? `Remove ${confirmRemove} from this organization?`
            : ""
        }
        danger
        confirmLabel="Remove"
        onCancel={() => setConfirmRemove(null)}
        onConfirm={() => {
          if (confirmRemove) void onRemoveTeacher(confirmRemove);
        }}
      />

      {inviteBlocked ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setInviteBlocked(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[#1A1C30]">
              Cannot add this email
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#666666]">
              {inviteBlocked}
            </p>
            <div className="mt-5 flex justify-end">
              <Button type="button" onClick={() => setInviteBlocked(null)}>
                OK
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
