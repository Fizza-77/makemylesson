# Screen Mapping (Flutter → Next.js)

Next.js routes mirror Flutter **logical** paths on **`https://makemylesson.app`** at the **site root** (no `/app` prefix). Legacy `/app/*` URLs should redirect to the equivalent path (see `firebase-structure.md`).

| Flutter screen | Route | Next.js `app/` route | Auth | Notes |
|----------------|-------|----------------------|------|-------|
| `SplashScreen` | `/splash` | Optional redirect to `/` on web | — | Mobile-only entry |
| `OnboardingScreen` | `/onboarding` | `onboarding/page.tsx` → redirect `/` | — | Web redirect in router |
| `LandingScreen` | `/` | `page.tsx` (home) | Optional | Wrapped in main nav shell |
| `SignUpScreen` | `/auth/sign-up` | `auth/sign-up/page.tsx` | Public | OTP continuation |
| `SignInScreen` | `/auth/sign-in` | `auth/sign-in/page.tsx` | Public | `?reason=` banner |
| `ForgotPasswordScreen` | `/auth/forgot-password` | `auth/forgot-password/page.tsx` | Public | |
| `OtpVerificationScreen` | `/auth/verify-otp` | `auth/verify-otp/page.tsx` | Public | State: email, flow, draft |
| `ResetPasswordScreen` | `/auth/reset-password` | `auth/reset-password/page.tsx` | Public | `?oobCode=` |
| `CompleteProfileScreen` | `/auth/complete-profile` | `auth/complete-profile/page.tsx` | Protected | Gate after auth |
| `Stage1PlanScreen` | `/stage1` | `stage1/page.tsx` | Soft/hard gate | Lesson plan wizard |
| `Stage2PresentScreen` | `/stage2` | `stage2/page.tsx` | Soft/hard gate | Slide editor |
| `Stage3AssessmentScreen` | `/stage3` | `stage3/page.tsx` | Soft/hard gate | Formative |
| `Stage4QuizScreen` | `/stage4` | `stage4/page.tsx` | Soft/hard gate | Summative |
| `LibraryScreen` | `/library` | `library/page.tsx` | Signed-in for data | Tabs + search |
| `LibraryItemReviewScreen` | `/library/review` | `library/review/page.tsx` or `[id]` | Signed-in | Prefer `/library/[id]` for SEO/share |
| `ProfileScreen` | `/profile` | `profile/page.tsx` | Mixed | Guest UI + signed-in settings |
| `SubscriptionScreen` | `/subscription`, `/pricing` | `subscription/page.tsx`, `pricing/page.tsx` | Mixed | PayPal return handling |
| `OrganizationDashboardScreen` | `/organization-dashboard` | `organization-dashboard/page.tsx` | Owner/admin | `?orgId=` |
| `NotificationsScreen` | `/notifications` | `notifications/page.tsx` | Signed-in | |
| `AylaChatbotScreen` | `/ayla` | `ayla/page.tsx` | Optional | Alias `/ayla-chat` → redirect |

## Layout groups

| Layout | Routes |
|--------|--------|
| **Auth glass shell** | All `/auth/*` except reset (uses same shell in Flutter) |
| **MainAppNavShell** | `/`, `/library`, `/library/*`, `/profile`, `/subscription`, `/pricing`, `/notifications`, `/ayla`, `/stage1`–`/stage4`, `/organization-dashboard` |
| **Bare** | None critical on web; splash/onboarding minimal |

## Protected route policy (Next.js middleware)

Implement middleware matching Flutter `quickAuthRoutingCheck` + stage gates:

1. If authenticated and `banned` → sign out → `/auth/sign-in?reason=...`
2. If authenticated and `!profileComplete` → `/auth/complete-profile` (except complete-profile route)
3. Stage routes: allow guest UI shell but block generation without auth (match dialogs)

## Query parameters

| Param | Screen | Behavior |
|-------|--------|----------|
| `reason` | Sign-in | URL-encoded banner message |
| `oobCode` | Reset password | Firebase password reset |
| `paypal_sub_done`, `paypal_cancel`, `plan` | Subscription | PayPal return (router redirect) |
| `orgId` | Organization dashboard | Org selection |

## Deep links

- Smart link: `https://makemylesson.app/smartlink` — Next.js route or `public/` on the **VPS**.
- Notification `deepLink` values — map 1:1 to Next routes.

## SEO pages (new for Next.js)

Not in Flutter app shell but required by task:

- `app/sitemap.ts`, `app/robots.ts`
- Per-route `metadata` / Open Graph on public routes (`/`, auth, subscription marketing)
- Stage/library routes: `noindex` if user-specific
