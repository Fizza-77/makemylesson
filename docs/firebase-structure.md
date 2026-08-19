# Firebase Structure & Project Configuration

## Domain & URL strategy (decided)

| Domain | Role | Next.js |
|--------|------|---------|
| **`https://makemylesson.ai`** (and `www`) | **Everything** — marketing landing, legal, pricing **and** the teacher PWA (auth, stages, library, billing) | Primary production host; app routes at **site root** (no `/app` prefix) |
| **`https://makemylesson.app`**, **`https://makemylesson.com`** | Legacy hosts | **301 redirect** to `makemylesson.ai` |

### URL conventions on `makemylesson.ai`

| Path | Example |
|------|---------|
| Marketing landing | `https://makemylesson.ai/` |
| App workspace | `https://makemylesson.ai/stage1` |
| Subscription / PayPal return | `https://makemylesson.ai/subscription?paypal_sub_done=1&plan=...` |
| Deep links / email links | Same origin, Flutter-equivalent paths (`/library`, `/stage1`, …) |
| Smart link (legacy static) | `https://makemylesson.ai/smartlink` — keep or migrate with hosting |

### Navigation parity (Flutter web)

- **Bottom/top nav “Home”** → `/` on the same host (marketing landing), no cross-domain hop.
- App entry is **`/stage1`**; there is no separate in-app landing screen.

### Legacy Flutter web paths

Historical builds used **`/app/**`** on Firebase Hosting (`firebase.json`). After cutover:

- Prefer **301 redirects** `/app/*` → `/*` for bookmarks and old PayPal return URLs.
- Next.js: **`basePath` unset** (default `/`).

### Firebase Auth authorized domains

Add at minimum: `makemylesson.ai`, `www.makemylesson.ai`, plus staging hosts. Keep the legacy `makemylesson.app` / `makemylesson.com` entries until those hosts stop serving anything but redirects.

### Cloud Storage CORS

Export code fetches slide images and logos from Storage in the browser, so the bucket must allow the **page** origin (not the file host). Allow `https://makemylesson.ai`, `https://www.makemylesson.ai`, and the localhost dev origins on `gs://makemylesson-44088.firebasestorage.app` via `gsutil cors set`.

### PayPal return URLs

Client sends `returnUrl` / `cancelUrl` to `createPayPalAccessOrder`. Use **`https://makemylesson.ai/subscription`** (not `/app/subscription`). `paypal_pay.js` must allow `makemylesson.ai` as a host.

### Shared constants (`nextjs/lib/urls.ts`)

```ts
export const APP_ORIGIN = 'https://makemylesson.ai';
export const MARKETING_ORIGIN = 'https://makemylesson.ai';
```

Mirror `MakeMyLesson/lib/utils/app_urls.dart` for legal, support, and social links on the marketing site.

## Project

| Setting | Value |
|---------|--------|
| Project ID | `makemylesson-44088` |
| Auth domain | `makemylesson-44088.firebaseapp.com` |
| Storage bucket | `makemylesson-44088.firebasestorage.app` |
| Functions region | `us-central1` |
| Analytics | `G-NJBCYRXRKY` (existing web app) |

## Existing Flutter Firebase apps (do not remove)

| Platform | App ID (from `firebase.json` / `firebase_options.dart`) |
|----------|---------------------------------------------------------|
| Android | `1:232688835781:android:3afa01ac425bb2748224ac` |
| iOS | `1:232688835781:ios:22ba043c62a2e6418224ac` |
| Flutter Web (legacy) | `1:232688835781:web:ad7ecd0221c2bac88224ac` |

## Next.js web app setup

1. In Firebase Console → Project settings → **Add app** → Web.
2. Register app name e.g. `Make My Lesson Next.js Web`.
3. Copy config into `nextjs/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=makemylesson-44088.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=makemylesson-44088
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=makemylesson-44088.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=232688835781
NEXT_PUBLIC_FIREBASE_APP_ID=<new web app id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<if enabled>
```

4. Enable **Authorized domains**: `makemylesson.ai`, `www.makemylesson.ai`, staging preview hosts.
5. Configure **Google** and **Apple** sign-in providers (same as mobile).
6. OAuth client for Google popup: use existing Web client ID pattern from Flutter (`kGoogleOAuthWebClientId` in `google_sign_in_service.dart`).

## Security rules (shared — do not fork)

| File | Scope |
|------|--------|
| `MakeMyLesson/firestore.rules` | `users`, `organizations` |
| `MakeMyLesson/storage.rules` | `users/{userId}/**` |

Deploy rules from existing Flutter project pipeline; Next.js must comply, not broaden access.

## Firestore indexes

`MakeMyLesson/firestore.indexes.json`:

- Collection group `members`: `uid` ASC, `status` ASC

Add new indexes only if new queries are introduced (avoid unless required).

## Cloud Functions

- Source: `MakeMyLesson/functions/`
- Entry: `index.js` + `paypal_pay.js`, `paypal_web.js`
- Deploy: `firebase deploy --only functions` from `MakeMyLesson/`

Next.js only **invokes** callables; no duplicate function code in `nextjs/` unless explicitly adding web-only endpoints later.

## Production hosting — Hostinger VPS (decided)

| Layer | Provider |
|-------|----------|
| **Next.js PWA + marketing** (`makemylesson.ai`) | **Hostinger VPS** (Node + reverse proxy) |
| **Backend** (Auth, Firestore, Storage, Functions) | **Firebase** (`makemylesson-44088`) — unchanged |

Firebase **Hosting** in `MakeMyLesson/firebase.json` is **legacy Flutter web only**. Point **`makemylesson.ai`** DNS (A record) to the VPS public IP.

### VPS stack (target)

```text
Internet → nginx (443, Let's Encrypt) → Node :3000 → Next.js standalone
              PM2 keeps process alive, restarts on deploy
```

| Component | Choice |
|-----------|--------|
| Next.js build | `output: 'standalone'` in `next.config.ts` |
| Process manager | **PM2** (`ecosystem.config.cjs` in `nextjs/`) |
| Reverse proxy | **nginx** (TLS termination, gzip, optional rate limits) |
| Node version | LTS (20 or 22) via `nvm` or Hostinger OS packages |
| Env | `/var/www/makemylesson/.env` (or app dir) — never commit |

### VPS deployment checklist

1. **DNS** — `makemylesson.ai` and `www` → VPS IPv4 (and AAAA if using IPv6); point the legacy `.app` / `.com` hosts here too so their redirects resolve.
2. **Server** — Ubuntu/Debian on Hostinger VPS; open **80/443**; SSH hardening as per Hostinger docs.
3. **Install** — Node LTS, nginx, certbot (`certbot --nginx -d makemylesson.ai -d www.makemylesson.ai`).
4. **App directory** — e.g. `/var/www/makemylesson` — clone repo or rsync `nextjs/` artifact; `npm ci`, `npm run build`.
5. **Standalone run** — After build, copy `public` and `.next/static` into standalone per Next docs; start:
   - `node .next/standalone/server.js` (or PM2 `cwd` to standalone folder)
   - Bind **127.0.0.1:3000** only (not public); nginx proxies to it.
6. **PM2** — `pm2 start ecosystem.config.cjs --env production`; `pm2 save`; enable startup on boot (`pm2 startup`).
7. **Environment** — `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_APP_ORIGIN=https://makemylesson.ai`, `NEXT_PUBLIC_MARKETING_ORIGIN=https://makemylesson.ai`, `NEXT_PUBLIC_SITE_URL=https://makemylesson.ai`, `PORT=3000`, `HOSTNAME=127.0.0.1`.
8. **nginx** — `proxy_pass http://127.0.0.1:3000`; WebSocket headers if needed; long timeouts for large uploads; serve no stale cache on `sw.js` / `workbox` (short `Cache-Control` or `no-cache` for service worker paths).
9. **Redirects** — Prefer `next.config` `redirects` for `/app/:path*` → `/:path*` (301); nginx can mirror if needed.
10. **Deploy flow** — Document in repo: pull → `npm ci` → `npm run build` → copy static assets to standalone → `pm2 reload makemylesson-web`.

### PWA on VPS

- Service worker must be same-origin `https://makemylesson.ai`.
- Ensure nginx does not cache HTML aggressively for authenticated routes (optional `location` rules for `/` vs static `/_next/static`).

### Legacy Firebase Hosting (Flutter web)

**Today** (`firebase.json`): Flutter web at `/app/**` on Firebase default sites.

| Concern | Action on VPS |
|---------|----------------|
| App routes | Next.js at `https://makemylesson.ai/` |
| `/smartlink` | Next.js route or `public/smartlink/` |
| Legacy `/app/*` | 301 → `/*` |
| `makemylesson.app`, `makemylesson.com` | 301 → `https://makemylesson.ai` (same nginx) |

## Storage layout diagram

```
gs://makemylesson-44088.firebasestorage.app/
  users/
    {uid}/
      school_logo
      profile_photo
      stage2/
        {jobId}/
          slide_1.png
          slide_2.jpg
          ...
```

## Auth persistence

Flutter web uses Firebase Auth default persistence. Next.js:

```ts
// firebase/auth.ts — browserLocalPersistence
```

Mirror “keep signed in” UX from `AuthSessionStorage` using long-lived Firebase sessions; optional `localStorage` flag for UI only.

## FCM / PWA

| Concern | Mobile (Flutter) | Next.js PWA |
|---------|------------------|-------------|
| `firebase_messaging` | Background handler in `main.dart` | Service worker via `next-pwa` + FCM web SDK |
| Device tokens | `users/{uid}/devices/{deviceId}` | Same path for web FCM token |
| Local notifications | `flutter_local_notifications` | Web notifications API |

## Analytics

Use Firebase Analytics JS SDK with same `measurementId` or new web app ID per console setup.

## Shared backend invariant

```
Flutter Mobile  ──┐
                  ├──► Firestore / Auth / Storage / Functions (single project)
Next.js Web    ──┘
```

No second database, no ETL, no collection renames.

## Related URLs

| Resource | URL |
|----------|-----|
| Product web app | `https://makemylesson.ai` |
| Marketing site | `https://makemylesson.ai` (same host) |
| Privacy / Terms | `https://makemylesson.ai/privacy-policy`, `https://makemylesson.ai/terms-of-service` |
| Support | `hello@makemylesson.ai`, `support@makemylesson.ai` |
