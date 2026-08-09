import { callFunction } from "@/firebase/functions";

export async function startEmailSignupVerification(email: string) {
  await callFunction<{ email: string }>("startEmailSignupVerification", {
    email: email.trim(),
  });
}

export async function completeEmailSignup(params: {
  email: string;
  otp: string;
  password: string;
  profileDraft: Record<string, unknown>;
}) {
  const data = await callFunction<
    {
      email: string;
      otp: string;
      password: string;
      profileDraft: Record<string, unknown>;
    },
    { customToken?: string }
  >("completeEmailSignup", {
    email: params.email.trim(),
    otp: params.otp.trim(),
    password: params.password,
    profileDraft: params.profileDraft,
  });
  const token = (data.customToken ?? "").toString();
  if (!token) {
    throw new Error("Account was created but sign-in token is missing.");
  }
  return token;
}

export async function sendPasswordResetEmail(email: string) {
  await callFunction<{ email: string }>("sendPasswordReset", {
    email: email.trim(),
  });
}

export async function verifyEmailOtp(otp: string) {
  await callFunction<{ otp: string }>("verifyEmailOTP", { otp: otp.trim() });
}

export async function sendWelcomeEmail() {
  await callFunction<Record<string, never>>("sendWelcomeEmail", {});
}
