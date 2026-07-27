# Next.js Migration TODO

Ordered implementation backlog. Update status in repo-root `docs/progress.md` as features complete.

## Phase 0 — Project scaffold

- [ ] Initialize Next.js (App Router, TypeScript, Tailwind, ESLint, Prettier)
- [x] Hosting domain: **`makemylesson.app`** at root (no `basePath`); marketing on **`makemylesson.ai`**
- [x] Hosting provider: **Hostinger VPS** (nginx + PM2 + Next standalone)
- [ ] `next.config`: `output: 'standalone'`, canonical URL, legacy `/app/*` redirects
- [ ] Add `ecosystem.config.cjs` + deploy notes (`nextjs/docs/deploy-hostinger-vps.md` when scaffold exists)
- [ ] Add `next-pwa`, manifest, icons, offline shell
- [ ] Firebase web app + `firebase/*` client modules
- [ ] Zustand + TanStack Query providers in root layout
- [ ] Copy fonts/assets from Flutter `assets/`
- [ ] Strict TS paths (`@/components`, `@/features`, …)

## Phase 1 — Auth & profile

- [ ] Auth layout (`AuthGlassShell`)
- [ ] Sign up + OTP + `completeEmailSignup` custom token flow
- [ ] Sign in (email/password)
- [ ] Google + Apple popup sign-in
- [ ] Forgot password + reset password (`oobCode`)
- [ ] Complete profile gate + uploads (school logo)
- [ ] Middleware: banned + `profileComplete`
- [ ] Post-auth deferred setup (user doc, org ensure)
- [ ] Account security: email change, delete account, password changed email

## Phase 2 — Shell & home

- [ ] `MainAppNavShell` (desktop tabs + mobile bottom nav)
- [ ] Landing page (`/`)
- [ ] Marketing home link from web Home tab
- [ ] Route chrome / back behavior
- [ ] SEO metadata + sitemap + robots

## Phase 3 — Profile & settings

- [ ] Profile screen (guest + authenticated)
- [ ] Avatar / school personalization toggles for AI
- [ ] Export format preference
- [ ] Subscription summary + credits display (Firestore hydrate)
- [ ] Sign out

## Phase 4 — Subscription & billing (web)

- [ ] Subscription / pricing pages
- [ ] PayPal create + finalize + return URL handling
- [ ] `getMmlWebPricingQuote`
- [ ] Org plan purchase → dashboard redirect
- [ ] Upgrade dialogs parity (`upgrade_plan_dialog`)

## Phase 5 — Organization dashboard

- [ ] List owned organizations
- [ ] Dashboard with seat table
- [ ] Add/remove teacher seats (callables)
- [ ] Billing renewal on load (owner)

## Phase 6 — Library

- [ ] Firestore listener for `libraryItems`
- [ ] Tabs, search, favourites
- [ ] Library item review + complete pack view
- [ ] Delete, favourite, export entry points
- [ ] Navigate to stage editors from review

## Phase 7 — Stage 1 (lesson plan)

- [ ] Curriculum catalog port (`CurriculumService`)
- [ ] Lesson plan form + validation
- [ ] `generateStage1LessonPlan` + polling
- [ ] Edit dialog + markdown preview
- [ ] Save to library + `planBundleId`
- [ ] PDF export parity
- [ ] Credit / sign-in gates

## Phase 8 — Stage 2 (presentation)

- [ ] Source modes (library vs upload)
- [ ] Generate + poll + image jobs + retry
- [ ] Slide canvas + theme gallery + edit dialog
- [ ] Storage URL hydration for library review
- [ ] PPTX/PDF export

## Phase 9 — Stage 3 (formative)

- [ ] Source modes + formative kind selection
- [ ] Generate + poll
- [ ] Worksheet content view + edit
- [ ] Export

## Phase 10 — Stage 4 (summative)

- [ ] Duration/marks bounds (mirror `LessonDraft.stage4MarksBoundsForMinutes`)
- [ ] Generate + poll
- [ ] Assessment content view + edit
- [ ] Export

## Phase 11 — Ayla

- [ ] FAQ data bundle
- [ ] Chat UI (`/ayla` + embedded assistant)
- [ ] `callAylaSupport` integration

## Phase 12 — Notifications

- [ ] Inbox list + realtime updates
- [ ] Mark read / delete / clear all callables
- [ ] Unread badge on nav
- [ ] Deep link routing
- [ ] Optional: FCM web + device doc registration
- [ ] Client lifecycle signals (`sendUserNotification` events)

## Phase 13 — Engagement & polish

- [ ] Engagement prompts coordinator (rate us, milestones)
- [ ] Generation success overlays
- [ ] Accessibility audit (WCAG)
- [ ] Performance pass (lazy routes, memoization)
- [ ] E2E smoke tests (critical paths)

## Phase 14 — Hosting cutover (Hostinger VPS)

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
