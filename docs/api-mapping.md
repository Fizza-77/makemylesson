# API Mapping (Cloud Functions & Client Services)

All callable functions use region **`us-central1`** unless noted.

## Authentication & account

| Callable | Flutter client | Purpose |
|----------|----------------|---------|
| `startEmailSignupVerification` | `AuthEmailFunctionsService` | Send signup OTP |
| `completeEmailSignup` | `AuthEmailFunctionsService` | Create user + `customToken` |
| `sendVerificationOTP` | `AuthEmailFunctionsService` | Verify email for signed-in user |
| `verifyEmailOTP` | `AuthEmailFunctionsService` | Confirm OTP |
| `sendPasswordReset` | `AuthEmailFunctionsService` | Password reset email |
| `sendPasswordChangedEmail` | `account_security_service.dart` | After password change |
| `startEmailChangeVerification` | `account_security_service.dart` | Email change OTP |
| `completeEmailChangeVerification` | `account_security_service.dart` | Apply new email |
| `sendWelcomeEmail` | `AuthEmailFunctionsService` / post-auth | Welcome |
| `deleteMyAccount` | `account_security_service.dart` | Account deletion |

## AI generation — Stage 1

| Callable | Flutter | Key request fields |
|----------|---------|-------------------|
| `generateStage1LessonPlan` | `Stage1AiFunctionsService` | `topLevelId`, `pathwayId`, `gradeId`, `gradeDisplayName`, `subjectDisplayName`, `subjectName`, `subjectCode`, `curriculumId`, `curriculumName`, `topic`, `method`, `durationMinutes`, `jobId` |
| `getStage1GenerationStatus` | `Stage1AiFunctionsService` | `jobId` |

## AI generation — Stage 2

| Callable | Flutter | Notes |
|----------|---------|-------|
| `generateStage2Presentation` | `Stage2AiFunctionsService` | Presentation JSON |
| `startStage2ImageJobs` | `Stage2AiFunctionsService` | Batch image generation |
| `getStage2GenerationStatus` | `Stage2AiFunctionsService` | Poll status + slides |
| `retryStage2Image` | `Stage2AiFunctionsService` | Per-slide retry |

## AI generation — Stage 3

| Callable | Flutter |
|----------|---------|
| `generateStage3Assessment` | `Stage3AiFunctionsService` |
| `getStage3GenerationStatus` | `Stage3AiFunctionsService` |

## AI generation — Stage 4

| Callable | Flutter |
|----------|---------|
| `generateStage4Assessment` | `Stage4AiFunctionsService` |
| `getStage4GenerationStatus` | `Stage4AiFunctionsService` |

## Support chat

| Callable | Flutter | Request |
|----------|---------|---------|
| `callAylaSupport` | `AylaChatService` | FAQ text, history, user message, optional context map |

## Billing — PayPal (web)

| Callable | Flutter | Request |
|----------|---------|---------|
| `getMmlWebPricingQuote` | (pricing UI) | Plan quote |
| `createPayPalAccessOrder` | `PayPalWebCheckoutService` | `planKey`, `returnUrl`, `cancelUrl` |
| `finalizePayPalAccessOrder` | `PayPalWebCheckoutService` | `orderId` |

**HTTP (server):**

| Function | Module | Purpose |
|----------|--------|---------|
| `paypalWebhook` | `paypal_pay.js` | PayPal IPN/webhook |

Plan keys (web/mobile catalog): `individual_monthly`, `individual_annual`, `credit_topup_50`, `department_annual` / `department`, `school_annual` / `school`, `school_plus` (normalize in functions).

## Organization

| Callable | Flutter | Request |
|----------|---------|---------|
| `createOrganizationSubscription` | `OrganizationService` | `planKey`, optional `seatLimit` |
| `ensureOrganizationMembershipForCurrentUser` | `OrganizationService` | — |
| `manageOrganizationSeat` | `OrganizationService` | `action`: `add` \| `remove`, `orgId`, `email` |
| `renewOrganizationBillingPeriod` | `OrganizationService` | `orgId` |

## Notifications

| Callable | Flutter | Request |
|----------|---------|---------|
| `sendUserNotification` | `notification_lifecycle_service.dart`, bootstrap | `eventName`, metadata |
| `markNotificationRead` | `notification_inbox_service.dart` | `notificationId` |
| `markAllNotificationsRead` | `notification_inbox_service.dart` | — |
| `deleteNotification` | `notification_inbox_service.dart` | `notificationId` |
| `clearAllNotifications` | `notification_inbox_service.dart` | — |

**Scheduled:**

| Function | Schedule | Purpose |
|----------|----------|---------|
| `evaluateNotificationLifecycle` | every 12 hours | Engagement notifications |

## Transactional email stubs (authenticated callables)

From `emailStubConfig` in `functions/index.js` (examples):

- `sendTeacherSeatInvitationEmail`
- `sendGettingStartedReminderEmail`
- `sendReengagementEmail`
- `sendReferralRewardEarnedEmail`

## Firestore direct (client SDK)

| Operation | Service | Collection path |
|-----------|---------|-----------------|
| CRUD library items | `LibraryCatalogService` | `users/{uid}/libraryItems` |
| Watch notifications | `notification_inbox_service.dart` | `users/{uid}/notifications` |
| Profile read/write | `UserProfileRepository` | `users/{uid}` |
| List owned orgs | `OrganizationService` | `organizations` query `ownerUid` |
| Dashboard read | `OrganizationService` | `organizations/{id}`, `teacherUsage` |

## Firebase Storage (client SDK)

| Operation | Service | Path |
|-----------|---------|------|
| Upload school logo | `UserProfileRepository` | `users/{uid}/school_logo` |
| Upload profile photo | `UserProfileRepository` | `users/{uid}/profile_photo` |
| Resolve slide image | `Stage2SlideStorageService` | `users/{uid}/stage2/{jobId}/slide_{n}.*` |

## Local / non-Firebase APIs

| Flutter | Next.js approach |
|---------|------------------|
| `CurriculumService` / `stage1_curriculum_catalog.dart` | Static TS module (same JSON/catalog) |
| `Stage1PromptEnvService` / `.env.prompts` | Server env or public config for prompt keys (do not expose secrets) |
| `http` downloads for export | `fetch` + blob download |
| `url_launcher` | `window.open` / `<a target="_blank">` |
| `share_plus` | Web Share API with fallback |

## Next.js service layer files

Mirror Dart structure:

```
firebase/config.ts
firebase/auth.ts
firebase/firestore.ts
firebase/storage.ts
firebase/functions.ts   # httpsCallable wrappers

services/library-catalog.service.ts
services/user-profile.service.ts
services/organization.service.ts
services/stage1-ai.service.ts
… stage2–4, paypal, ayla, notifications
```

Each wrapper should:

1. Enforce auth where Dart assumes `FirebaseAuth.instance.currentUser`
2. Map errors to user-facing strings (`auth_error_mapper.dart` parity)
3. Use shared timeout values (e.g. Stage 1 generate: 5 minutes)

## IAP (mobile only)

Store validation callables exist in functions for mobile receipts (grep `exports[` near Play/App Store in `index.js` during implementation). **Web does not call IAP.**
