const crypto = require("node:crypto");

const { onCall, HttpsError } = require("firebase-functions/v2/https");

const WEB_TRIAL_CAP = 5;
const WEB_TRIAL_IP_COLLECTION = "webTrialIpUsage";
const GUEST_WEB_UID_PREFIX = "guest_web_";

function getProjectId() {
  return (
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    "makemylesson-44088"
  );
}

/** Use Firebase Admin SDK SA (has Firestore access). Not @appspot — often missing from IAM. */
function getFunctionsServiceAccount() {
  return `firebase-adminsdk-fbsvc@${getProjectId()}.iam.gserviceaccount.com`;
}

function formatInternalError(error) {
  if (error instanceof HttpsError) return error.message;
  if (error instanceof Error) return error.message;
  return String(error);
}

function ensureAdmin() {
  const admin = require("firebase-admin");
  try {
    admin.app();
  } catch {
    admin.initializeApp({ projectId: getProjectId() });
  }
  return admin;
}

function getDb() {
  return ensureAdmin().firestore();
}

function getAdmin() {
  return ensureAdmin();
}

function getSalt() {
  return (
    process.env.WEB_TRIAL_IP_SALT?.trim() ||
    "makemylesson-web-trial"
  );
}

function clientIpFromRequest(rawRequest) {
  const headers = rawRequest?.headers ?? {};
  const forwarded = headers["x-forwarded-for"] ?? headers["X-Forwarded-For"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers["x-real-ip"] ?? headers["X-Real-Ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }
  const cfIp =
    headers["cf-connecting-ip"] ?? headers["CF-Connecting-IP"];
  if (typeof cfIp === "string" && cfIp.trim()) {
    return cfIp.trim();
  }
  return rawRequest?.ip?.trim() || "unknown";
}

function hashClientIp(ip) {
  return crypto
    .createHash("sha256")
    .update(`${getSalt()}:${ip}`)
    .digest("hex");
}

function remainingFromTotalUsed(totalUsed) {
  return Math.max(0, WEB_TRIAL_CAP - totalUsed);
}

function isGuestAuth(auth) {
  if (!auth?.uid) return false;
  if (auth.uid.startsWith(GUEST_WEB_UID_PREFIX)) return true;
  return auth.token?.firebase?.sign_in_provider === "anonymous";
}

function requireGuestAuth(auth) {
  if (!isGuestAuth(auth)) {
    throw new HttpsError(
      "permission-denied",
      "Web trial is only available for guest sessions.",
    );
  }
}

async function getIpUsage(ipHash) {
  const snap = await getDb().collection(WEB_TRIAL_IP_COLLECTION).doc(ipHash).get();
  if (!snap.exists) return { totalUsed: 0 };
  const totalUsed = Number(snap.get("totalUsed") ?? 0);
  return {
    totalUsed: Math.min(
      WEB_TRIAL_CAP,
      Math.max(0, Number.isFinite(totalUsed) ? totalUsed : 0),
    ),
  };
}

async function incrementIpUsage(ipHash) {
  const admin = getAdmin();
  const ref = getDb().collection(WEB_TRIAL_IP_COLLECTION).doc(ipHash);
  return getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? Number(snap.get("totalUsed") ?? 0) : 0;
    const safeCurrent = Math.min(
      WEB_TRIAL_CAP,
      Math.max(0, Number.isFinite(current) ? current : 0),
    );
    if (safeCurrent >= WEB_TRIAL_CAP) {
      return { totalUsed: safeCurrent };
    }
    const nextUsed = safeCurrent + 1;
    tx.set(
      ref,
      {
        totalUsed: nextUsed,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { totalUsed: nextUsed };
  });
}

async function setGuestCredits(uid, remaining) {
  const admin = getAdmin();
  const clamped = Math.max(0, Math.min(WEB_TRIAL_CAP, Math.trunc(remaining)));
  await getDb()
    .collection("users")
    .doc(uid)
    .set(
      {
        planTier: "free",
        subscriptionPlan: "free",
        generationCredits: clamped,
        generationCreditCap: WEB_TRIAL_CAP,
        creditsUsed: WEB_TRIAL_CAP - clamped,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

function trialPayload(totalUsed) {
  const safeUsed = Math.min(
    WEB_TRIAL_CAP,
    Math.max(0, Number.isFinite(totalUsed) ? totalUsed : 0),
  );
  return {
    remaining: remainingFromTotalUsed(safeUsed),
    totalUsed: safeUsed,
    cap: WEB_TRIAL_CAP,
    configured: true,
  };
}

async function readTrialForRequest(rawRequest) {
  const ipHash = hashClientIp(clientIpFromRequest(rawRequest));
  const { totalUsed } = await getIpUsage(ipHash);
  return trialPayload(totalUsed);
}

const callableOptions = {
  region: "us-central1",
  invoker: "public",
  serviceAccount: getFunctionsServiceAccount(),
};

const getWebTrialStatus = onCall(callableOptions, async (request) => {
  try {
    return await readTrialForRequest(request.rawRequest);
  } catch (error) {
    console.error("[getWebTrialStatus]", error);
    throw new HttpsError(
      "internal",
      `Could not load web trial status: ${formatInternalError(error)}`,
    );
  }
});

const bootstrapWebTrial = onCall(callableOptions, async (request) => {
  requireGuestAuth(request.auth);
  try {
    const ipHash = hashClientIp(clientIpFromRequest(request.rawRequest));
    const { totalUsed } = await getIpUsage(ipHash);
    const remaining = remainingFromTotalUsed(totalUsed);
    try {
      await setGuestCredits(request.auth.uid, remaining);
    } catch (creditError) {
      // IP ledger is authoritative; user doc sync is best-effort for guests.
      console.warn("[bootstrapWebTrial] setGuestCredits skipped", creditError);
    }
    return trialPayload(totalUsed);
  } catch (error) {
    console.error("[bootstrapWebTrial]", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError(
      "internal",
      `Could not bootstrap web trial credits: ${formatInternalError(error)}`,
    );
  }
});

const consumeWebTrial = onCall(callableOptions, async (request) => {
  requireGuestAuth(request.auth);
  try {
    const ipHash = hashClientIp(clientIpFromRequest(request.rawRequest));
    const { totalUsed } = await incrementIpUsage(ipHash);
    const remaining = remainingFromTotalUsed(totalUsed);
    try {
      await setGuestCredits(request.auth.uid, remaining);
    } catch (creditError) {
      console.warn("[consumeWebTrial] setGuestCredits skipped", creditError);
    }
    return {
      ok: true,
      ...trialPayload(totalUsed),
    };
  } catch (error) {
    console.error("[consumeWebTrial]", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError(
      "internal",
      `Could not record web trial usage: ${formatInternalError(error)}`,
    );
  }
});

async function setIpUsageToCap(ipHash) {
  const admin = getAdmin();
  await getDb()
    .collection(WEB_TRIAL_IP_COLLECTION)
    .doc(ipHash)
    .set(
      {
        totalUsed: WEB_TRIAL_CAP,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  return { totalUsed: WEB_TRIAL_CAP };
}

const sealWebTrialIp = onCall(callableOptions, async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "Sign in required.");
  }
  try {
    const ipHash = hashClientIp(clientIpFromRequest(request.rawRequest));
    await setIpUsageToCap(ipHash);
    return trialPayload(WEB_TRIAL_CAP);
  } catch (error) {
    console.error("[sealWebTrialIp]", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError(
      "internal",
      `Could not seal web trial IP usage: ${formatInternalError(error)}`,
    );
  }
});

module.exports = {
  getWebTrialStatus,
  bootstrapWebTrial,
  consumeWebTrial,
  sealWebTrialIp,
};
