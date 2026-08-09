import { FirebaseError } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { getFirebaseAuth, getFirestoreDb } from "@/firebase/config";
import { callFunction } from "@/firebase/functions";
import { ANNUAL_CREDITS_PER_SEAT } from "@/services/paypal-checkout.service";
import {
  organizationDashboardFromJson,
  teacherSeatFromJson,
  type OrganizationDashboardData,
  type OrganizationSummary,
  type TeacherSeatUsage,
} from "@/types/organization";

function requireUid(): string {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) throw new Error("Authentication required");
  return uid;
}

function asRecord(data: unknown): Record<string, unknown> {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return {};
}

/** Mirrors Flutter `OrganizationService.getMyAdminOrganizations`. */
export async function getMyAdminOrganizations(): Promise<OrganizationSummary[]> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return [];
  const q = query(
    collection(getFirestoreDb(), "organizations"),
    where("ownerUid", "==", uid),
    where("isActive", "==", true),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      orgId: d.id,
      planKey: String(data.planKey ?? ""),
      seatLimit: Number(data.seatLimit ?? 0) || 0,
      ownerUid: String(data.ownerUid ?? ""),
      isActive: data.isActive === true,
    };
  });
}

export async function resolveOrganizationId(orgId?: string | null): Promise<string> {
  requireUid();
  const trimmed = orgId?.trim() ?? "";
  if (trimmed) return trimmed;
  const owned = await getMyAdminOrganizations();
  if (!owned.length) throw new Error("No active organization found");
  return owned[0]!.orgId;
}

function billingEndFromOrgDoc(raw: unknown): Date | null {
  if (raw instanceof Timestamp) return raw.toDate();
  if (raw && typeof raw === "object" && "toDate" in raw) {
    try {
      return (raw as Timestamp).toDate();
    } catch {
      return null;
    }
  }
  if (typeof raw === "number") return new Date(raw);
  return null;
}

/** Firestore fallback (non-owner / renew permission-denied). */
export async function getOrganizationDashboard(
  orgId?: string | null,
): Promise<OrganizationDashboardData> {
  requireUid();
  const db = getFirestoreDb();
  let orgRef;
  let orgSnap;

  if (orgId?.trim()) {
    orgRef = doc(db, "organizations", orgId.trim());
    orgSnap = await getDoc(orgRef);
  } else {
    const q = query(
      collection(db, "organizations"),
      where("ownerUid", "==", requireUid()),
      where("isActive", "==", true),
      limit(1),
    );
    const owned = await getDocs(q);
    if (owned.empty) throw new Error("No active organization found");
    orgSnap = owned.docs[0]!;
    orgRef = orgSnap.ref;
  }

  if (!orgSnap.exists()) throw new Error("Organization not found");
  const orgData = orgSnap.data();
  const cap =
    Number(orgData.annualCreditsPerSeat ?? ANNUAL_CREDITS_PER_SEAT) ||
    ANNUAL_CREDITS_PER_SEAT;

  const usageSnap = await getDocs(collection(orgRef, "teacherUsage"));
  const teachers: TeacherSeatUsage[] = usageSnap.docs
    .map((d) => d.data())
    .filter((row) => String(row.status ?? "active") !== "removed")
    .map((row) =>
      teacherSeatFromJson({
        email: row.email,
        status: row.status ?? "invited",
        creditsUsed: row.creditsUsed ?? 0,
        creditsRemaining: row.creditsRemaining ?? cap,
        linkedUid: row.linkedUid,
      }),
    );

  return {
    orgId: orgSnap.id,
    planKey: String(orgData.planKey ?? ""),
    seatLimit: Number(orgData.seatLimit ?? 0) || 0,
    seatsUsed: teachers.length,
    teachers,
    annualCreditsPerSeat: cap,
    billingPeriodEnd: billingEndFromOrgDoc(orgData.billingPeriodEnd),
    lastBillingRenewed: null,
  };
}

/**
 * Owner path: renewOrganizationBillingPeriod then parse dashboard.
 * Falls back to Firestore read on permission-denied.
 */
export async function getOrganizationDashboardWithRenewal(
  orgId?: string | null,
): Promise<OrganizationDashboardData> {
  const resolvedId = await resolveOrganizationId(orgId);
  try {
    const data = await callFunction<
      { orgId: string },
      Record<string, unknown>
    >("renewOrganizationBillingPeriod", { orgId: resolvedId });
    if (String(data.orgId ?? "").trim()) {
      return organizationDashboardFromJson(asRecord(data));
    }
  } catch (e) {
    if (e instanceof FirebaseError && e.code === "functions/permission-denied") {
      return getOrganizationDashboard(resolvedId);
    }
    // Also treat plain permission-denied strings
    if (
      e instanceof FirebaseError &&
      e.code.replace(/^functions\//, "") === "permission-denied"
    ) {
      return getOrganizationDashboard(resolvedId);
    }
    throw e;
  }
  return getOrganizationDashboard(resolvedId);
}

export async function addTeacherSeat(params: {
  orgId: string;
  email: string;
}): Promise<OrganizationDashboardData> {
  const data = await callFunction<
    { action: "add"; orgId: string; email: string },
    Record<string, unknown>
  >("manageOrganizationSeat", {
    action: "add",
    orgId: params.orgId,
    email: params.email,
  });
  return organizationDashboardFromJson(asRecord(data));
}

export async function removeTeacherSeat(params: {
  orgId: string;
  email: string;
}): Promise<OrganizationDashboardData> {
  const data = await callFunction<
    { action: "remove"; orgId: string; email: string },
    Record<string, unknown>
  >("manageOrganizationSeat", {
    action: "remove",
    orgId: params.orgId,
    email: params.email,
  });
  return organizationDashboardFromJson(asRecord(data));
}

export function mapOrgInviteBlockedMessage(error: unknown): string | null {
  if (!(error instanceof FirebaseError)) return null;
  const raw = (error.message ?? "").trim();
  if (!raw.startsWith("ORG_INVITE_BLOCKED:")) return null;
  const detail = raw.includes(":")
    ? raw.slice(raw.indexOf(":") + 1).trim()
    : raw;
  return (
    detail ||
    "This teacher email already has a paid subscription or an active school plan seat. Use a different email."
  );
}
