import { signOutUser } from "@/firebase/auth";
import { getFirebaseAuth } from "@/firebase/config";
import { authLog } from "@/lib/auth-logger";
import { getGuestCreditsRemaining } from "@/lib/guest-credits";
import { isGuestUser } from "@/lib/guest-session";
import { sealWebTrialIpOnServer } from "@/lib/trial-api.client";
import { sealWebTrialWhenFreeAccountExhausted } from "@/services/user-account.service";

/**
 * Seal shared IP trial usage while the user is still authenticated, then sign out.
 * Ensures other browsers on the same network see 0 guest credits after sign-out.
 */
export async function signOutAndSealTrial(): Promise<void> {
  const user = getFirebaseAuth().currentUser;
  if (user) {
    try {
      if (isGuestUser(user)) {
        if (getGuestCreditsRemaining() <= 0) {
          await sealWebTrialIpOnServer(user);
          authLog.info("sign_out.ip_trial_sealed", { uid: user.uid, guest: true });
        }
      } else {
        await sealWebTrialWhenFreeAccountExhausted(user.uid);
      }
    } catch (error) {
      authLog.warn("sign_out.ip_trial_seal_failed", {
        uid: user.uid,
        message: String(error),
      });
    }
  }
  await signOutUser();
}


