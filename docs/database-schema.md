# Firestore & Storage Schema

Schema is **owned by production** (Flutter + Cloud Functions). Next.js must use identical collection paths, field names, and query patterns.

## Top-level collections

### `users/{userId}`

Document ID = Firebase Auth `uid`. Rules: read/write **only self** (`firestore.rules`).

| Field | Type | Notes |
|-------|------|--------|
| `email` | string | Mirrored from Auth |
| `displayName` | string | |
| `dateOfBirth` | timestamp | Sign-up / complete profile |
| `ageConfirmedAt` | timestamp | When age confirmed without DOB |
| `schoolName` | string? | |
| `schoolLogoUrl` | string? | Download URL from Storage |
| `schoolLogoName` | string? | Original filename |
| `profilePhotoUrl` | string? | |
| `ownPicName` | string? | |
| `avatarSource` | string | `none`, `photo`, etc. (also legacy `avatar_source`) |
| `avatarSeed` | string? | Random avatar |
| `useSchoolNameInAi` | bool | |
| `useSchoolLogoInAi` | bool | |
| `useOwnPicInAi` | bool | |
| `profileComplete` | bool | **Gate** for `/auth/complete-profile` |
| `banned` | bool | Forces sign-out |
| `planTier` | string | e.g. `free`, `individualMonthly`, `department`, `school`, `school_plus`, `creditTopUp50` |
| `subscriptionPlan` | string | Alternate key for tier |
| `generationCredits` | number | Remaining credits |
| `generationCreditCap` | number | Cap for period |
| `creditsUsed` | number | Derived usage |
| `creditsResetEpochMs` | number | Reset / renewal |
| `subscriptionStartedAtMs` | number | |
| `subscriptionEndsAtMs` | number | |
| `organizationOwnerOf` | string? | Org ID when user owns org subscription |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

Dart model: `UserFirestoreProfile`, `AccountSettings` (local + hydrated).

#### Subcollections under `users/{userId}`

| Path | Purpose |
|------|---------|
| `libraryItems/{itemId}` | Saved lesson artifacts (all stages) |
| `notifications/{notificationId}` | In-app notification inbox |
| `meta/notificationCounters` | Unread counts |
| `devices/{deviceId}` | FCM tokens (mobile) |
| `stage1GenerationJobs/{jobId}` | Async Stage 1 jobs |
| `stage2GenerationJobs/{jobId}` | Stage 2 + image pipeline |
| `stage3GenerationJobs/{jobId}` | Stage 3 jobs |
| `stage4GenerationJobs/{jobId}` | Stage 4 jobs |

Rules: nested under `users/{userId}` inherit **self-only** access.

**Client-only note:** `lesson_flow_provider.dart` references `collection('_generationJobs')` only for generating IDs — not a persisted top-level collection.

### `organizations/{orgId}`

Rules: read if org admin or `teacher` member; **no client writes** (create/update/delete via Cloud Functions).

| Field | Type | Notes |
|-------|------|--------|
| `ownerUid` | string | |
| `ownerEmail` | string | |
| `planKey` | string | `department`, `school`, `school_plus` |
| `seatLimit` | number | Default 5 / 10 by plan |
| `isActive` | bool | |
| `annualCreditsPerSeat` | number | Default 360 (30×12) |
| `billingPeriodEnd` | timestamp | |
| `createdAt`, `updatedAt` | timestamp | |

#### Subcollections

| Path | Purpose |
|------|---------|
| `members/{memberUid}` | `role`: `owner` \| `admin` \| `teacher`; `status`, `email` |
| `invites/{inviteId}` | Pending invites (admin read only) |
| `teacherUsage/{usageId}` | Per-teacher seat usage (`email`, `linkedUid`, `creditsUsed`, `creditsRemaining`, `status`) |

**Index:** collection group `members` on `uid` + `status` (`firestore.indexes.json`) for membership lookups from functions.

## `libraryItems` document shape

Maps to `LibraryItem` (`lib/models/library_item.dart`).

| Field | Type |
|-------|------|
| `stage` | number (1–4) |
| `kind` | string: `lessonPlan`, `presentation`, `activity`, `assessment`, `completePack` |
| `topic`, `curriculumRoute`, `grade`, `subject` | string |
| `generatedAt` | timestamp |
| `reviewBody` | string (markdown/text) |
| `isFavourite` | bool |
| `completePackStages` | number (bit flags 1–4; value `15` = all stages in UI filter) |
| `presentationStyle` | string? |
| `activityOrAssessmentLabel` | string? |
| `speakerNotes` | string? |
| `presentationSlides` | array of maps (Stage 2 JSON) |
| `teacherReviewBody` | string? |
| `stage3Json`, `stage4Json` | map? |
| `planBundleId` | string? (correlates stages) |
| `stage2JobId` | string? (Storage image resolution) |
| `updatedAt` | timestamp |

## `notifications` document shape

`AppNotification` model:

| Field | Type |
|-------|------|
| `title`, `body` | string |
| `eventName` | string |
| `deepLink` | string (app path) |
| `channel` | string (e.g. `in_app`) |
| `createdAt` | timestamp |
| `readAt` | timestamp? |

## Generation job documents (server-managed)

Updated via Cloud Functions (`updateGenerationJob`). Client polls status callables. Typical fields (from functions usage):

- `status`, `progress`, `phase`, `error`
- `result` / `content` (stage-dependent)
- Credit deduction flags on job doc (`deductGenerationCreditForJobIfNeeded`)

Exact job payload shapes should be copied from `functions/index.js` per stage when implementing TypeScript types.

## Firebase Storage

Rules (`storage.rules`): `users/{userId}/{allPaths=**}` read/write if `auth.uid == userId`.

Known paths:

| Path | Usage |
|------|--------|
| `users/{uid}/school_logo` | School logo (single ref; legacy prefixed files cleaned) |
| `users/{uid}/profile_photo` | Profile photo |
| `users/{uid}/stage2/{jobId}/slide_{n}.png\|jpg` | Generated slide images |

## Credit & plan semantics (server)

From `functions/index.js`:

- Free tier: 5 credits
- `individualMonthly`: 30 / month
- `individualAnnual`, `department`, `school`: annual pool (`ORG_ANNUAL_CREDITS_DEFAULT` = 360 per seat)
- `creditTopUp50`: 50 one-time; exhausted → downgrade payload via `freeTierAfterTopUpExhaustedPayload`

Org teachers sync usage into `teacherUsage` via `syncTeacherUsageFromUserCredits`.

## TypeScript mapping checklist

Create interfaces in `nextjs/types/` for:

- [ ] `UserFirestoreProfile`
- [ ] `LibraryItem` + `LibraryItemKind`
- [ ] `LessonDraft` + enums (`FormativeAssessmentKind`, `Stage2SourceMode`, …)
- [ ] `Stage2Presentation` / `Stage2Slide`
- [ ] `Stage3Assessment`, `Stage4Assessment`
- [ ] `LessonPlanSelection`, curriculum models
- [ ] `AppNotification`
- [ ] `OrganizationDashboardData`, `TeacherSeatUsage`
- [ ] `Stage1GenerationStatus` (+ stage 2–4 status types)
- [ ] `AccountPlanTier`, `AccountSettings`

Preserve **snake_case in Storage slide JSON** where Flutter uses `image_url`, `image_status` (see `Stage2SlideStorageService`).
