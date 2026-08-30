# Web trial — deploy from this repo

Trial IP enforcement runs in **Cloud Functions** (separate `web-trial` codebase). Mobile functions in Firebase are **not** touched.

### Gen 1 vs Gen 2 (match `generateStage1LessonPlan`)

Mobile callables like `generateStage1LessonPlan` are **Cloud Functions Gen 2** (Security tab → **Allow public access**).

Trial functions must be **Gen 2** too. If you still have Gen 1 trial functions, delete them first:

```powershell
cd c:\dev\nextjs
firebase functions:delete getWebTrialStatus bootstrapWebTrial consumeWebTrial --region us-central1 --force
$env:FUNCTIONS_DISCOVERY_TIMEOUT=60
firebase deploy --only functions:web-trial
```

If deploy errors on IAM, run **`firebase deploy --only functions:web-trial` again** (second run updates code).

Then for each trial function in Cloud Console → **Security** → **Allow public access** (same as `generateStage1LessonPlan`).

### IAM error after deploy (`Failed to set the IAM Policy`)

Callable functions must allow invokers so the web app can call them. If deploy fails on IAM:

**Option A — ask project Owner** to grant your account **Cloud Functions Admin** (`roles/cloudfunctions.admin`), then redeploy:

```powershell
cd c:\dev\nextjs
$env:FUNCTIONS_DISCOVERY_TIMEOUT=60
firebase deploy --only functions:web-trial
```

**Option B — set invoker manually (Google Cloud Console)**

For each of `getWebTrialStatus`, `bootstrapWebTrial`, `consumeWebTrial`:

1. [Google Cloud Console → Cloud Functions](https://console.cloud.google.com/functions/list?project=makemylesson-44088)
2. Click the function → **Permissions** tab
3. **Grant access** → Principal: `allUsers` → Role: **Cloud Functions Invoker** → Save

(Callable functions require this; Firebase Auth is still checked inside each function.)

**Option C — gcloud (if installed)**

```powershell
gcloud functions add-iam-policy-binding getWebTrialStatus --region=us-central1 --member=allUsers --role=roles/cloudfunctions.invoker --project=makemylesson-44088
gcloud functions add-iam-policy-binding bootstrapWebTrial --region=us-central1 --member=allUsers --role=roles/cloudfunctions.invoker --project=makemylesson-44088
gcloud functions add-iam-policy-binding consumeWebTrial --region=us-central1 --member=allUsers --role=roles/cloudfunctions.invoker --project=makemylesson-44088
```

### Discovery timeout (`Cannot determine backend specification`)

If deploy fails during code load, set a longer timeout then redeploy:

```powershell
$env:FUNCTIONS_DISCOVERY_TIMEOUT=60
firebase deploy --only functions:web-trial
```

Functions code uses **Gen 1 callables** (`firebase-functions/v1`) for faster deploy discovery.

## One-time: deploy the 3 new functions

From **`c:\dev\nextjs`** in PowerShell:

```powershell
# 1. Confirm Firebase project (needs firebase.json in this folder — already added)
firebase use makemylesson-44088

# 2. Install function dependencies
cd cloud-functions\web-trial
npm install
cd ..\..

# 3. Deploy ONLY the web-trial codebase (safe for live mobile app)
firebase deploy --only functions:web-trial
```

First deploy takes **3–8 minutes**. You should see:

- `getWebTrialStatus`
- `bootstrapWebTrial`
- `consumeWebTrial`

listed in Firebase Console → Functions.

## Set WEB_TRIAL_IP_SALT on the functions (required)

After deploy:

1. [Firebase Console](https://console.firebase.google.com/) → project **makemylesson-44088**
2. **Build → Functions**
3. Open each new function → **Environment variables** (or use Google Cloud Console → Cloud Functions → Edit → Runtime environment variables)
4. Add: `WEB_TRIAL_IP_SALT` = same value as in your `.env.local` (or generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

Apply to all three functions (or redeploy once env is set — see Firebase docs for Gen 2 env on codebase).

Alternatively from CLI (Google Cloud):

```powershell
# Example for one function after deploy — names may include region suffix in GCF console
gcloud functions describe bootstrapWebTrial --gen2 --region=us-central1
```

Easiest for first time: **Google Cloud Console → Cloud Functions → select function → Edit → Runtime, build, connections and security → Runtime environment variables**.

## Firebase Console checklist

| Item | Status |
|------|--------|
| Firestore rule `webTrialIpUsage` deny-all | You published this |
| **Anonymous Auth** enabled | Authentication → Sign-in method → Anonymous → Enable |
| `WEB_TRIAL_IP_SALT` on functions | You set after deploy |

## Deploy the web app (VPS)

Same as usual: pull, `npm run build`, restart PM2. No `FIREBASE_SERVICE_ACCOUNT_JSON` needed for trial.

## Smoke test

| Test | Expected |
|------|----------|
| Mobile: sign in + generate | Unchanged |
| Web: credit badge on load | Shows server `remaining` |
| Web: 5 trials, new Chrome profile, same Wi‑Fi | 0 credits, sign-in prompt |
| Firestore | `webTrialIpUsage/{hash}` document |

## Rollback

Firebase Console → delete only the three `*WebTrial*` functions. Mobile callables stay.

## Troubleshooting

| Error | Fix |
|-------|-----|
| `firebase use must be run from a Firebase project directory` | Run commands from `c:\dev\nextjs` (this folder has `firebase.json`) |
| `functions/not-found` in browser | Deploy not finished or wrong project |
| Trial always shows 5 | Functions env salt missing, or deploy failed — check Functions logs in Console |
| `500` / `Could not bootstrap web trial credits` | Open the full error in Console — often `PERMISSION_DENIED`. Redeploy after latest `web_trial.js` (uses `@appspot.gserviceaccount.com`). If still failing: Google Cloud → IAM → grant **Cloud Datastore User** to `makemylesson-44088@appspot.gserviceaccount.com` and your `{project-number}-compute@developer.gserviceaccount.com` |
| View function logs | [Google Cloud Logs](https://console.cloud.google.com/logs/query?project=makemylesson-44088) → filter `resource.type="cloud_run_revision"` and `bootstrapWebTrial` |
