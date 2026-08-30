# Web trial IP enforcement — your checklist

After deploying the Next.js app, complete these steps once.

## 1. Add environment variable

In `.env.local` (local) and your hosting dashboard (production, e.g. Vercel):

```
WEB_TRIAL_IP_SALT=<paste-a-long-random-string>
```

Generate one with Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep this secret. You already need `FIREBASE_SERVICE_ACCOUNT_JSON` for guest auth — trial enforcement uses the same credential.

## 2. Publish Firestore rules (first time)

1. Open https://console.firebase.google.com/
2. Select your **Make My Lesson** project
3. **Build → Firestore Database → Rules**
4. **Do not delete** existing rules. Add this block inside the outer `match /databases/{database}/documents { ... }` section:

```javascript
    // Web trial IP ledger — Next.js service account only
    match /webTrialIpUsage/{id} {
      allow read, write: if false;
    }
```

5. Click **Publish**

If something goes wrong: **Rules → View history → Rollback**.

## 3. Deploy the web app

Deploy as you normally do (git push to Vercel, etc.). Ensure production has both `FIREBASE_SERVICE_ACCOUNT_JSON` and `WEB_TRIAL_IP_SALT`.

## 4. Smoke test

| Step | Expected |
|------|----------|
| Chrome profile A: use 5 trial generations | Credit badge shows 0 |
| Switch Chrome profile, same Wi‑Fi | Badge shows 0; generate prompts sign-in |
| Mobile: sign in + generate once | Works as before |

## 5. Optional — verify Firestore data

In Firebase Console → Firestore → `webTrialIpUsage` collection should appear after first trial use (document id is a hash, not a raw IP).

---

**Mobile app:** no update required. **Cloud Functions:** no change required for v1.
