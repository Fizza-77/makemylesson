import { FieldValue, Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";

import {
  getAdminAuth,
  getAdminDb,
  isFirebaseAdminConfigured,
} from "@/lib/firebase-admin.server";

const GUEST_WEB_UID_PREFIX = "guest_web_";
const ANNUAL_CREDITS_PER_SEAT = 360;
const PROCESSED_EVENTS = "stripeProcessedEvents";
const APPLIED_CHECKOUTS = "stripeAppliedCheckoutSessions";
const APPLIED_INVOICES = "stripeAppliedInvoices";

export class StripeHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "StripeHttpError";
  }
}

const PLAN_ALIASES: Record<string, string> = {
  individual_month: "individual_monthly",
  monthly: "individual_monthly",
  individual_3mo: "individual_3_month",
  individual_3month: "individual_3_month",
  "3mo": "individual_3_month",
  "3_month": "individual_3_month",
  individual_6mo: "individual_6_month",
  individual_6month: "individual_6_month",
  "6mo": "individual_6_month",
  "6_month": "individual_6_month",
  individual_year: "individual_annual",
  annual: "individual_annual",
  yearly: "individual_annual",
  department_annual: "department",
  school_annual: "school",
  credit_top_up_50: "credit_topup_50",
  topup50: "credit_topup_50",
  top_up_50: "credit_topup_50",
};

type PlanDef = {
  priceEnv: string;
  mode: "subscription" | "payment";
  tier: string;
  subscriptionPlan: string;
  credits: number;
  isTopUp?: boolean;
  org?: { seatLimit: number };
};

const PLANS: Record<string, PlanDef> = {
  individual_monthly: {
    priceEnv: "STRIPE_PRICE_INDIVIDUAL_MONTHLY",
    mode: "subscription",
    tier: "individualMonthly",
    subscriptionPlan: "individual_monthly",
    credits: 30,
  },
  individual_3_month: {
    priceEnv: "STRIPE_PRICE_INDIVIDUAL_3_MONTH",
    mode: "subscription",
    tier: "individual3Month",
    subscriptionPlan: "individual_3_month",
    credits: 90,
  },
  individual_6_month: {
    priceEnv: "STRIPE_PRICE_INDIVIDUAL_6_MONTH",
    mode: "subscription",
    tier: "individual6Month",
    subscriptionPlan: "individual_6_month",
    credits: 180,
  },
  individual_annual: {
    priceEnv: "STRIPE_PRICE_INDIVIDUAL_ANNUAL",
    mode: "subscription",
    tier: "individualAnnual",
    subscriptionPlan: "individual_annual",
    credits: 360,
  },
  credit_topup_50: {
    priceEnv: "STRIPE_PRICE_CREDIT_TOPUP_50",
    mode: "payment",
    tier: "creditTopUp50",
    subscriptionPlan: "credit_topup_50",
    credits: 50,
    isTopUp: true,
  },
  department: {
    priceEnv: "STRIPE_PRICE_DEPARTMENT",
    mode: "subscription",
    tier: "department",
    subscriptionPlan: "department",
    credits: ANNUAL_CREDITS_PER_SEAT,
    org: { seatLimit: 5 },
  },
  school: {
    priceEnv: "STRIPE_PRICE_SCHOOL",
    mode: "subscription",
    tier: "school",
    subscriptionPlan: "school",
    credits: ANNUAL_CREDITS_PER_SEAT,
    org: { seatLimit: 10 },
  },
};

const ALLOWED_CHECKOUT_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "makemylesson.ai",
  "www.makemylesson.ai",
  "makemylesson.app",
  "www.makemylesson.app",
  "makemylesson.com",
  "www.makemylesson.com",
]);

function stripeSecretKey(): string {
  return (process.env.STRIPE_SECRET_KEY ?? "").trim();
}

function webhookSecret(): string {
  return (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
}

export function getStripe(): Stripe {
  const key = stripeSecretKey();
  if (!key) {
    throw new StripeHttpError(
      503,
      "Stripe is not configured. Please try again later.",
    );
  }
  return new Stripe(key);
}

function normalizePlanKey(raw: unknown): string {
  const value = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
  if (!value) return "";
  return PLAN_ALIASES[value] || value;
}

function getPlan(planKey: string): PlanDef | null {
  return PLANS[planKey] ?? null;
}

function priceIdForPlan(plan: PlanDef): string {
  const priceId = (process.env[plan.priceEnv] ?? "").trim();
  if (!priceId || !priceId.startsWith("price_")) return "";
  return priceId;
}

function defaultAppOrigin(): string {
  return (process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_APP_ORIGIN || "https://makemylesson.ai")
    .replace(/\/$/, "");
}

function checkoutOrigin(rawOrigin: unknown): string {
  const fallback = defaultAppOrigin();
  if (!rawOrigin || typeof rawOrigin !== "string") return fallback;
  try {
    const url = new URL(rawOrigin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;
    const host = url.hostname.toLowerCase();
    if (!ALLOWED_CHECKOUT_HOSTS.has(host)) return fallback;
    if (host === "localhost" || host === "127.0.0.1") {
      return `${url.protocol}//${url.host}`;
    }
    return `https://${host}`;
  } catch {
    return fallback;
  }
}

function toInt(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.trunc(n);
  }
  return 0;
}

function periodEndMsFromUnix(seconds: unknown): number {
  const n = Number(seconds);
  if (!Number.isFinite(n) || n <= 0) return Date.now() + 30 * 24 * 60 * 60 * 1000;
  return Math.trunc(n * 1000);
}

export async function requireRegisteredUser(request: Request): Promise<{
  uid: string;
  email?: string;
}> {
  if (!isFirebaseAdminConfigured()) {
    throw new StripeHttpError(
      503,
      "Billing is not configured on the server.",
    );
  }
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    throw new StripeHttpError(401, "Please sign in to continue.");
  }
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch {
    throw new StripeHttpError(401, "Please sign in to continue.");
  }
  const uid = decoded.uid ?? "";
  const provider = decoded.firebase?.sign_in_provider;
  if (!uid || provider === "anonymous" || uid.startsWith(GUEST_WEB_UID_PREFIX)) {
    throw new StripeHttpError(401, "Please sign in to continue.");
  }
  return { uid, email: decoded.email };
}

async function loadUser(uid: string) {
  const snap = await getAdminDb().collection("users").doc(uid).get();
  return {
    ref: snap.ref,
    exists: snap.exists,
    data: (snap.exists ? snap.data() : {}) as Record<string, unknown>,
  };
}

async function requireActiveUser(uid: string) {
  const user = await loadUser(uid);
  if (user.data.banned === true) {
    throw new StripeHttpError(403, "Your account has been suspended.");
  }
  return user;
}

async function getOrCreateStripeCustomer(
  stripe: Stripe,
  uid: string,
  userData: Record<string, unknown>,
): Promise<string> {
  const existingId = String(userData.stripeCustomerId ?? "").trim();
  if (existingId) {
    try {
      const customer = await stripe.customers.retrieve(existingId);
      if (customer && !("deleted" in customer && customer.deleted)) {
        return customer.id;
      }
    } catch (error) {
      console.warn("[stripe] stored customer missing, creating a new one", {
        uid,
        existingId,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const email = String(userData.email ?? "").trim() || undefined;
  const name = String(userData.displayName ?? "").trim() || undefined;
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { firebaseUid: uid },
  });

  await getAdminDb()
    .collection("users")
    .doc(uid)
    .set(
      {
        stripeCustomerId: customer.id,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  return customer.id;
}

async function claimNewDoc(
  collectionName: string,
  docId: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  const ref = getAdminDb().collection(collectionName).doc(docId);
  try {
    await ref.create({
      ...payload,
      createdAt: FieldValue.serverTimestamp(),
    });
    return true;
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error
      ? (error as { code?: unknown }).code
      : "";
    if (
      code === 6 ||
      code === "already-exists" ||
      String(error).includes("ALREADY_EXISTS")
    ) {
      return false;
    }
    throw error;
  }
}

async function releaseClaim(collectionName: string, docId: string) {
  try {
    await getAdminDb().collection(collectionName).doc(docId).delete();
  } catch (error) {
    console.warn("[stripe] failed to release claim", collectionName, docId, error);
  }
}

async function findOwnedOrg(uid: string, planKey: string) {
  try {
    const snap = await getAdminDb()
      .collection("organizations")
      .where("ownerUid", "==", uid)
      .where("planKey", "==", planKey)
      .where("isActive", "==", true)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0];
  } catch (error) {
    console.warn("[stripe] findOwnedOrg query failed", error);
    return null;
  }
}

async function upsertOrganization(
  uid: string,
  userData: Record<string, unknown>,
  plan: PlanDef,
  periodEndMs: number,
  stripeIds: { customerId: string; subscriptionId: string },
): Promise<string> {
  if (!plan.org) throw new Error("ORG_PLAN_REQUIRED");
  const existing = await findOwnedOrg(uid, plan.subscriptionPlan);
  const email = String(userData.email ?? "").trim();
  const orgPayload = {
    ownerUid: uid,
    ownerEmail: email || null,
    planKey: plan.subscriptionPlan,
    seatLimit: plan.org.seatLimit,
    isActive: true,
    annualCreditsPerSeat: ANNUAL_CREDITS_PER_SEAT,
    billingPeriodEnd: Timestamp.fromMillis(periodEndMs),
    stripeCustomerId: stripeIds.customerId || null,
    stripeSubscriptionId: stripeIds.subscriptionId || null,
    updatedAt: FieldValue.serverTimestamp(),
  };

  const orgRef = existing
    ? existing.ref
    : getAdminDb().collection("organizations").doc();
  if (existing) {
    await orgRef.set(orgPayload, { merge: true });
  } else {
    await orgRef.set({
      ...orgPayload,
      seatsUsed: 1,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  await orgRef.collection("teacherUsage").doc(uid).set(
    {
      email,
      status: "active",
      creditsUsed: 0,
      creditsRemaining: ANNUAL_CREDITS_PER_SEAT,
      linkedUid: uid,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  await orgRef.collection("members").doc(uid).set(
    {
      uid,
      email,
      status: "active",
      role: "owner",
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  return orgRef.id;
}

async function resetOrgSeats(orgId: string, periodEndMs: number) {
  const orgRef = getAdminDb().collection("organizations").doc(orgId);
  await orgRef.set(
    {
      isActive: true,
      billingPeriodEnd: Timestamp.fromMillis(periodEndMs),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  const usageSnap = await orgRef.collection("teacherUsage").get();
  const batch = getAdminDb().batch();
  usageSnap.forEach((doc) => {
    const status = String(doc.get("status") ?? "active");
    if (status === "removed") return;
    batch.set(
      doc.ref,
      {
        creditsUsed: 0,
        creditsRemaining: ANNUAL_CREDITS_PER_SEAT,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
  await batch.commit();
}

function paidUserPayload(
  plan: PlanDef,
  credits: number,
  periodEndMs: number,
  stripeIds: { customerId: string; subscriptionId: string },
  extra: Record<string, unknown>,
) {
  return {
    planTier: plan.tier,
    subscriptionPlan: plan.subscriptionPlan,
    generationCredits: credits,
    generationCreditCap: credits,
    creditsUsed: 0,
    subscriptionEndsAtMs: periodEndMs,
    creditsResetEpochMs: periodEndMs,
    stripeCustomerId: stripeIds.customerId || null,
    stripeSubscriptionId: stripeIds.subscriptionId || null,
    stripeSubscriptionStatus: "active",
    updatedAt: FieldValue.serverTimestamp(),
    ...extra,
  };
}

async function applyTopUp(
  uid: string,
  userData: Record<string, unknown>,
  plan: PlanDef,
  stripeIds: { customerId: string; subscriptionId: string },
) {
  const currentCredits = Math.max(0, toInt(userData.generationCredits));
  const currentCap = Math.max(0, toInt(userData.generationCreditCap));
  const currentPlan = String(userData.subscriptionPlan ?? userData.planTier ?? "free");
  const parsed = normalizePlanKey(currentPlan);
  const keepPlan = Boolean(getPlan(parsed) && parsed !== "credit_topup_50");
  const nextCredits = currentCredits + plan.credits;
  const nextCap = Math.max(currentCap, currentCredits) + plan.credits;
  const payload: Record<string, unknown> = {
    generationCredits: nextCredits,
    generationCreditCap: nextCap,
    creditsUsed: Math.max(0, nextCap - nextCredits),
    stripeCustomerId: stripeIds.customerId || userData.stripeCustomerId || null,
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (!keepPlan) {
    payload.planTier = plan.tier;
    payload.subscriptionPlan = plan.subscriptionPlan;
  }
  await getAdminDb().collection("users").doc(uid).set(payload, { merge: true });
}

async function grantPlanToUser(
  uid: string,
  plan: PlanDef,
  periodEndMs: number,
  stripeIds: { customerId: string; subscriptionId: string },
): Promise<string | null> {
  const user = await loadUser(uid);
  const extra: Record<string, unknown> = {};
  if (plan.org) {
    extra.organizationId = await upsertOrganization(
      uid,
      user.data,
      plan,
      periodEndMs,
      stripeIds,
    );
  }
  if (plan.isTopUp) {
    await applyTopUp(uid, user.data, plan, stripeIds);
    return (extra.organizationId as string | undefined) || null;
  }
  await getAdminDb()
    .collection("users")
    .doc(uid)
    .set(paidUserPayload(plan, plan.credits, periodEndMs, stripeIds, extra), {
      merge: true,
    });
  return (extra.organizationId as string | undefined) || null;
}

async function subscriptionPeriodEndMs(
  stripe: Stripe,
  subscriptionId: string,
  session: Stripe.Checkout.Session,
): Promise<number> {
  const fromSession = (session as { current_period_end?: number }).current_period_end;
  if (fromSession) return periodEndMsFromUnix(fromSession);
  if (!subscriptionId) return Date.now() + 30 * 24 * 60 * 60 * 1000;
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    return periodEndMsFromUnix(subscriptionCurrentPeriodEnd(sub));
  } catch (error) {
    console.warn("[stripe] subscription retrieve failed", error);
    return Date.now() + 30 * 24 * 60 * 60 * 1000;
  }
}

function subscriptionCurrentPeriodEnd(
  sub: Stripe.Subscription | Stripe.Response<Stripe.Subscription>,
): number | undefined {
  const record = sub as unknown as {
    current_period_end?: number;
    items?: { data?: Array<{ current_period_end?: number }> };
  };
  return record.current_period_end ?? record.items?.data?.[0]?.current_period_end;
}

function idsFromSession(session: Stripe.Checkout.Session) {
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || "";
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id || "";
  return { customerId, subscriptionId };
}

function uidFromStripeObject(obj: {
  metadata?: Stripe.Metadata | null;
  subscription_details?: { metadata?: Stripe.Metadata | null } | null;
  parent?: {
    subscription_details?: { metadata?: Stripe.Metadata | null } | null;
  } | null;
}): string {
  return String(
    obj?.metadata?.firebaseUid ||
      obj?.subscription_details?.metadata?.firebaseUid ||
      obj?.parent?.subscription_details?.metadata?.firebaseUid ||
      "",
  ).trim();
}

function planKeyFromStripeObject(obj: {
  metadata?: Stripe.Metadata | null;
  subscription_details?: { metadata?: Stripe.Metadata | null } | null;
  parent?: {
    subscription_details?: { metadata?: Stripe.Metadata | null } | null;
  } | null;
}): string {
  return normalizePlanKey(
    obj?.metadata?.planKey ||
      obj?.subscription_details?.metadata?.planKey ||
      obj?.parent?.subscription_details?.metadata?.planKey ||
      "",
  );
}

async function applyCheckoutSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  if (session.payment_status && session.payment_status !== "paid") {
    return { skipped: true, reason: "unpaid" };
  }
  const uid = String(
    session.metadata?.firebaseUid || session.client_reference_id || "",
  ).trim();
  const planKey = normalizePlanKey(session.metadata?.planKey);
  const plan = getPlan(planKey);
  if (!uid || !plan) {
    console.warn("[stripe] checkout missing uid/plan", session.id);
    return { skipped: true, reason: "invalid_metadata" };
  }

  const claimed = await claimNewDoc(APPLIED_CHECKOUTS, session.id, {
    uid,
    planKey,
    status: "processing",
  });
  if (!claimed) return { duplicate: true };

  try {
    const stripeIds = idsFromSession(session);
    const periodEndMs = plan.isTopUp
      ? Date.now()
      : await subscriptionPeriodEndMs(stripe, stripeIds.subscriptionId, session);
    const orgId = await grantPlanToUser(uid, plan, periodEndMs, stripeIds);
    await getAdminDb().collection(APPLIED_CHECKOUTS).doc(session.id).set(
      {
        status: "applied",
        orgId: orgId || null,
        appliedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { applied: true, uid, planKey, orgId: orgId || null };
  } catch (error) {
    await releaseClaim(APPLIED_CHECKOUTS, session.id);
    throw error;
  }
}

async function applyPaidInvoice(stripe: Stripe, invoice: Stripe.Invoice) {
  const billingReason = String(invoice.billing_reason || "");
  if (
    billingReason &&
    billingReason !== "subscription_cycle" &&
    billingReason !== "subscription_update" &&
    billingReason !== "subscription_create"
  ) {
    return { skipped: true, reason: billingReason };
  }

  const claimed = await claimNewDoc(APPLIED_INVOICES, invoice.id, {
    billingReason,
    status: "processing",
  });
  if (!claimed) return { duplicate: true };

  try {
    const invoiceRecord = invoice as Stripe.Invoice & {
      subscription?: string | { id?: string } | null;
      parent?: { subscription_details?: { subscription?: string } | null };
    };
    const subscriptionId =
      typeof invoiceRecord.subscription === "string"
        ? invoiceRecord.subscription
        : invoiceRecord.subscription?.id ||
          invoiceRecord.parent?.subscription_details?.subscription ||
          "";
    let uid = uidFromStripeObject(invoice);
    let planKey = planKeyFromStripeObject(invoice);
    let currentPeriodEnd: number | undefined =
      invoice.lines?.data?.[0]?.period?.end;

    if (subscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        uid = uid || uidFromStripeObject(sub);
        planKey = planKey || planKeyFromStripeObject(sub);
        currentPeriodEnd =
          currentPeriodEnd ?? subscriptionCurrentPeriodEnd(sub);
      } catch (error) {
        console.warn("[stripe] invoice subscription retrieve failed", error);
      }
    }

    const plan = getPlan(planKey);
    if (!uid || !plan || plan.isTopUp) {
      await getAdminDb().collection(APPLIED_INVOICES).doc(invoice.id).set(
        { status: "skipped", uid, planKey },
        { merge: true },
      );
      return { skipped: true, reason: "missing_plan_or_uid" };
    }

    const customerId =
      typeof invoice.customer === "string"
        ? invoice.customer
        : invoice.customer?.id || "";
    const periodEndMs = periodEndMsFromUnix(currentPeriodEnd);
    const orgId = await grantPlanToUser(uid, plan, periodEndMs, {
      customerId,
      subscriptionId,
    });
    if (plan.org && orgId) {
      await resetOrgSeats(orgId, periodEndMs);
    }
    await getAdminDb().collection(APPLIED_INVOICES).doc(invoice.id).set(
      { status: "applied", uid, planKey, orgId: orgId || null },
      { merge: true },
    );
    return { applied: true, uid, planKey };
  } catch (error) {
    await releaseClaim(APPLIED_INVOICES, invoice.id);
    throw error;
  }
}

async function applySubscriptionUpdated(subscription: Stripe.Subscription) {
  const uid = uidFromStripeObject(subscription);
  if (!uid) return { skipped: true };
  const status = String(subscription.status || "");
  const periodEndMs = periodEndMsFromUnix(
    subscriptionCurrentPeriodEnd(subscription),
  );
  const payload: Record<string, unknown> = {
    stripeSubscriptionId: subscription.id,
    stripeSubscriptionStatus: status,
    subscriptionEndsAtMs: periodEndMs,
    creditsResetEpochMs: periodEndMs,
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (status === "active" || status === "trialing") {
    payload.stripePaymentFailed = false;
  }
  await getAdminDb().collection("users").doc(uid).set(payload, { merge: true });
  return { applied: true, uid };
}

async function applySubscriptionDeleted(subscription: Stripe.Subscription) {
  const uid = uidFromStripeObject(subscription);
  if (!uid) return { skipped: true };
  const periodEndMs = periodEndMsFromUnix(
    subscriptionCurrentPeriodEnd(subscription),
  );
  await getAdminDb()
    .collection("users")
    .doc(uid)
    .set(
      {
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionStatus: "canceled",
        subscriptionEndsAtMs: periodEndMs,
        creditsResetEpochMs: periodEndMs,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  const planKey = planKeyFromStripeObject(subscription);
  const plan = getPlan(planKey);
  if (plan?.org) {
    const org = await findOwnedOrg(uid, plan.subscriptionPlan);
    if (org) {
      await org.ref.set(
        {
          isActive: false,
          stripeSubscriptionStatus: "canceled",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }
  }
  return { applied: true, uid };
}

async function applyInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const uid = uidFromStripeObject(invoice);
  if (!uid) return { skipped: true };
  await getAdminDb()
    .collection("users")
    .doc(uid)
    .set(
      {
        stripePaymentFailed: true,
        stripeSubscriptionStatus: "past_due",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  return { applied: true, uid };
}

async function handleStripeEvent(stripe: Stripe, event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      return applyCheckoutSession(
        stripe,
        event.data.object as Stripe.Checkout.Session,
      );
    case "invoice.paid":
    case "invoice.payment_succeeded":
      return applyPaidInvoice(stripe, event.data.object as Stripe.Invoice);
    case "invoice.payment_failed":
      return applyInvoicePaymentFailed(event.data.object as Stripe.Invoice);
    case "customer.subscription.updated":
      return applySubscriptionUpdated(
        event.data.object as Stripe.Subscription,
      );
    case "customer.subscription.deleted":
      return applySubscriptionDeleted(
        event.data.object as Stripe.Subscription,
      );
    default:
      return { skipped: true, reason: "unhandled_event" };
  }
}

export async function createCheckoutSessionForUser(params: {
  uid: string;
  planKey: unknown;
  origin?: unknown;
}) {
  const planKey = normalizePlanKey(params.planKey);
  const plan = getPlan(planKey);
  if (!plan) {
    throw new StripeHttpError(400, "That plan is not available.");
  }
  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    throw new StripeHttpError(
      503,
      "This plan is not available for checkout yet.",
    );
  }
  const origin = checkoutOrigin(params.origin);
  const user = await requireActiveUser(params.uid);
  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(stripe, params.uid, user.data);
  const metadata = { firebaseUid: params.uid, planKey };

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: plan.mode,
    client_reference_id: params.uid,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/pricing?stripe_checkout=success&plan=${encodeURIComponent(planKey)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?stripe_checkout=cancel`,
    metadata,
    allow_promotion_codes: false,
    ...(plan.mode === "subscription"
      ? { subscription_data: { metadata } }
      : { payment_intent_data: { metadata } }),
  });

  if (!session.url) {
    throw new StripeHttpError(500, "Stripe did not return a checkout URL.");
  }
  return {
    url: session.url,
    sessionId: session.id,
    planKey,
  };
}

export async function getCheckoutStatusForUser(params: {
  uid: string;
  sessionId: string;
}) {
  const sessionId = params.sessionId.trim();
  if (!sessionId.startsWith("cs_")) {
    throw new StripeHttpError(400, "Missing checkout session.");
  }
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const sessionUid = String(
    session.metadata?.firebaseUid || session.client_reference_id || "",
  ).trim();
  if (sessionUid !== params.uid) {
    throw new StripeHttpError(
      403,
      "This checkout does not belong to your account.",
    );
  }
  const appliedSnap = await getAdminDb()
    .collection(APPLIED_CHECKOUTS)
    .doc(sessionId)
    .get();
  const applied = appliedSnap.exists ? appliedSnap.data() ?? {} : {};
  const user = await loadUser(params.uid);
  const orgId = String(applied.orgId ?? "").trim();
  return {
    sessionId,
    planKey: String(session.metadata?.planKey || applied.planKey || ""),
    status: session.status,
    paymentStatus: session.payment_status,
    paid: session.payment_status === "paid",
    entitlementApplied: appliedSnap.exists,
    orgId: orgId || null,
    subscriptionPlan: user.data.subscriptionPlan ?? null,
    generationCredits: toInt(user.data.generationCredits),
  };
}

export async function handleStripeWebhook(request: Request): Promise<{
  status: number;
  body: string | Record<string, unknown>;
}> {
  const secret = webhookSecret();
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return { status: 400, body: "Webhook signature missing." };
  }
  if (!isFirebaseAdminConfigured()) {
    return { status: 503, body: "Billing is not configured on the server." };
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    console.error("[stripeWebhook] signature verification failed", error);
    return { status: 400, body: "Invalid webhook signature." };
  }

  const claimed = await claimNewDoc(PROCESSED_EVENTS, event.id, {
    type: event.type,
    status: "processing",
  });
  if (!claimed) {
    return { status: 200, body: { received: true, duplicate: true } };
  }

  try {
    const result = await handleStripeEvent(getStripe(), event);
    await getAdminDb().collection(PROCESSED_EVENTS).doc(event.id).set(
      {
        type: event.type,
        status: "processed",
        result: result || null,
        processedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { status: 200, body: { received: true, ...result } };
  } catch (error) {
    await releaseClaim(PROCESSED_EVENTS, event.id);
    console.error("[stripeWebhook] processing failed", event.type, error);
    return { status: 500, body: "Webhook handler failed." };
  }
}

export function jsonError(error: unknown) {
  if (error instanceof StripeHttpError) {
    return { status: error.status, error: error.message };
  }
  console.error("[stripe]", error);
  return {
    status: 500,
    error: "Something went wrong. Please try again in a moment.",
  };
}
