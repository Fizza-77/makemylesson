# Next.js Migration TODO

Ordered implementation backlog. Update status in repo-root `docs/progress.md` as features complete.

## Phase 0 — Project scaffold

- [x] Initialize Next.js (App Router, TypeScript, Tailwind, ESLint, Prettier)
- [x] Hosting domain: **`makemylesson.app`** at root (no `basePath`); marketing on **`makemylesson.ai`**
- [x] Hosting provider: **Hostinger VPS** (nginx + PM2 + Next standalone) — deploy later
- [x] `next.config`: `output: 'standalone'`, canonical URL, legacy `/app/*` redirects, next-pwa
- [x] Add `ecosystem.config.cjs` + deploy notes (`docs/deploy-hostinger.md`)
- [x] Add `next-pwa`, manifest, icons (logo placeholder)
- [x] Firebase `firebase/*` client modules
- [x] Zustand + TanStack Query providers in root layout
- [x] Fonts/assets: Poppins via `next/font`; logo + key images under `public/` / `public/images/`
- [x] Strict TS paths (`@/*`)

## Phase 1 — Auth & profile

- [x] Auth layout (`AuthGlassShell`)
- [x] Sign up + OTP + `completeEmailSignup` custom token flow
- [x] Sign in (email/password + Google + Apple popups)
- [x] Forgot password + reset password (`oobCode`)
- [x] Complete profile gate + uploads (school logo)
- [x] Profile route guard (banned + `profileComplete` redirect)
- [x] Post-auth deferred setup (user doc, org ensure, welcome email)
- [x] Account security: email change, delete account, password changed email
- [x] Auth success/failure console logging (`[Auth]` prefix)

## Phase 2 — Shell & home

- [x] `MainAppNavShell` (desktop tabs + mobile bottom nav)
- [x] Landing page (`/`) — initial hero + stage CTAs
- [x] Home tab opens app homepage (`/`), not marketing site
- [x] Route chrome / back behavior (`AppBackButton` + logical parents)
- [x] SEO metadata + sitemap + robots

## Phase 3 — Profile & settings

- [x] Profile screen (guest + authenticated)
- [x] Avatar / school personalization toggles for AI
- [x] Export format preference (`profile_default_export`; sorts download menus)
- [x] Subscription summary + credits display (Firestore hydrate, read-only)
- [x] Default Settings (saved curriculum via localStorage prefs; clear + Stage 1 link)
- [x] Security list (name/password/email/school/logo/delete) + Support & Legal + Sign out
- [x] Sign out

## Phase 4 — Subscription & billing (web)

- [x] Subscription / pricing pages
- [x] PayPal create + finalize + return URL handling
- [x] `getMmlWebPricingQuote`
- [x] Org plan purchase → dashboard redirect
- [x] Upgrade dialogs parity (`upgrade_plan_dialog`) on Stages 1–4

## Phase 5 — Organization dashboard

- [x] List owned organizations
- [x] Dashboard with seat table
- [x] Add/remove teacher seats (callables)
- [x] Billing renewal on load (owner)

## Phase 6 — Library

- [x] Firestore listener for `libraryItems`
- [x] Tabs, search, favourites
- [x] Library item review + complete pack view
- [x] Delete, favourite, export entry points (Stage 1–4 + complete pack ZIP; Share)
- [x] Navigate to stage editors from review (Stage 1–4)
- [x] Review UX: presentation slide canvas, Stage 3/4 student↔key toggle + edit

## Phase 7 — Stage 1 (lesson plan)

- [x] Curriculum catalog port (`CurriculumService` → JSON extract + mapping)
- [x] Lesson plan form + validation
- [x] `generateStage1LessonPlan` + polling
- [x] Edit dialog + markdown preview
- [x] Save to library + `planBundleId` (+ complete-pack sync)
- [x] PDF export / print (jsPDF; light markdown strip)
- [x] Share PDF (Web Share / download fallback)
- [x] Continue → Stage 2 (carries plan bundle + library item in draft store)
- [x] Credit / sign-in gates
- [x] Tips sidebar + embedded Ayla + upgrade card + success overlay

## Phase 8 — Stage 2 (presentation)

- [x] Source modes (library vs upload / paste + file upload)
- [x] Generate + poll + image jobs + retry
- [x] Slide canvas + theme gallery + edit dialog
- [x] Save to library + open from library review
- [x] Storage URL hydration for library review (signed download URLs)
- [x] PPTX / PDF / ZIP / print export (client-side; mirrors Flutter download menu)
- [x] Share ZIP (Web Share / download fallback)
- [x] Tips sidebar + embedded Ayla + upgrade card + success overlay

## Phase 9 — Stage 3 (formative)

- [x] Source modes + formative kind selection
- [x] Generate + poll
- [x] Worksheet content view + edit
- [x] Save to library + open from library review + Stage 4 handoff
- [x] Export (PDF student/key, ZIP, print) + Share + upload-from-device source
- [x] Tips sidebar + embedded Ayla + upgrade card + success overlay

## Phase 10 — Stage 4 (summative)

- [x] Duration/marks bounds (mirror `LessonDraft.stage4MarksBoundsForMinutes`)
- [x] Generate + poll
- [x] Assessment content view + edit
- [x] Save to library + open from library review
- [x] Export (PDF paper/scheme, ZIP, print) + Share + upload-from-device source
- [x] Tips sidebar + embedded Ayla + upgrade card + success overlay

## Phase 11 — Ayla

- [x] FAQ data bundle
- [x] Chat UI (`/ayla` + reusable panel)
- [x] `callAylaSupport` integration (+ FAQ fallback)
- [x] Embedded assistant on stage screens (desktop tips sidebar)

## Phase 12 — Notifications

- [x] Inbox list + realtime updates
- [x] Mark read / delete / clear all callables
- [x] Unread badge on nav
- [x] Deep link routing
- [x] Optional: FCM web + device doc registration (`fcm-web.service` + `/firebase-messaging-sw.js`)
- [x] Client lifecycle signals (`sendUserNotification` events)

## Phase 13 — Engagement & polish

- [x] Engagement prompts coordinator (upgrade gate on stages; Rate Us skipped on web)
- [x] Generation success overlays
- [x] Stage upgrade card + personalization banner
- [x] Accessibility basics (skip link, back aria-label, nav `aria-current`)
- [x] Performance basics (lazy stage routes via `next/dynamic`)
- [ ] E2E smoke tests (critical paths) — deferred

## Phase 14 — Hosting cutover (Hostinger VPS)

Requires server/DNS access (see `docs/deploy-hostinger.md`):

- [ ] Provision VPS; point `makemylesson.app` DNS to VPS IP
- [ ] nginx + Certbot TLS; proxy to `127.0.0.1:3000`
- [ ] `npm run build` (standalone); **PM2** start/reload
- [ ] Production `.env` on server (`NEXT_PUBLIC_*`, origins, `PORT=3000`)
- [ ] 301 legacy `/app/*` → `/*` (`next.config` redirects)
- [ ] Verify PayPal return URLs on `https://makemylesson.app/subscription`
- [ ] Verify Firebase Auth authorized domains include `makemylesson.app`
- [ ] Decommission Flutter web on Firebase Hosting
- [ ] Leave Flutter mobile builds unchanged

## Explicit non-goals (unless product changes)

- Phone authentication (not in Flutter)
- Modifying Firestore schema
- Duplicating Cloud Functions in Next.js
- In-app purchase on web (use PayPal only)
- Changing Flutter mobile code (except shared backend compatibility if ever required)

## Open questions (resolve before Phase 14)

1. ~~Final hosting path~~ → **`makemylesson.app`** (app), **`makemylesson.ai`** (marketing).
2. ~~Hosting provider~~ → **Hostinger VPS** (nginx, PM2, Next standalone).
3. New Firebase Web App ID registered and production `.env` on VPS?
4. Stage 2 canvas: DOM/CSS vs canvas library for pixel parity?
5. Export stack: pure client vs function-assisted for DOCX/PPTX?
