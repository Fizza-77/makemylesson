# Components Mapping (Flutter → Next.js)

Reusable Next.js components should live under `components/` with feature-specific pieces under `features/*/components/`.

## Design tokens

| Flutter | Next.js |
|---------|---------|
| `app_colors.dart` | `styles/colors.ts` + Tailwind theme extension |
| `app_text_styles.dart` | `styles/typography.ts` — fonts: **Poppins**, **Merriweather**, **Dancing Script** (self-host from `MakeMyLesson/assets/fonts/`) |
| `app_theme.dart` | `app/globals.css` + Tailwind |
| `responsive_helper.dart` | `hooks/useBreakpoint.ts`, `cn()` + container queries |

## Navigation & chrome

| Flutter widget | Next.js component |
|----------------|-------------------|
| `MainAppNavShell` | `components/navigation/MainAppNavShell.tsx` |
| `_WebTopTabs` / `_SimpleMobileBottomNav` | `WebTopTabs.tsx`, `MobileBottomNav.tsx` |
| `AppRouteChrome` | `components/navigation/RouteChrome.tsx` (back handling) |
| `app_back_navigation.dart` | `useAppBackNavigation.ts` |
| `LessonAppBar` | `components/layout/LessonAppBar.tsx` |
| `ResizableStageSidebar` | `components/layout/ResizableSidebar.tsx` |
| `StageTipsSidebar` | `features/stages/StageTipsSidebar.tsx` |
| `StageProgressStepper` | `features/stages/StageProgressStepper.tsx` |

## Primitives (requested set)

| Category | Flutter reference | Next.js |
|----------|-------------------|---------|
| Button | `custom_button.dart` | `components/ui/Button.tsx` |
| Card | `custom_card.dart`, `animated_hover_card.dart` | `Card.tsx`, `HoverCard.tsx` |
| Input | `animated_focus_field.dart`, auth fields | `Input.tsx`, `FormField.tsx` |
| Badge | `badge_chip.dart` | `Badge.tsx` |
| Modal | `edit_dialog_scaffold.dart`, `upgrade_plan_dialog.dart` | `Modal.tsx`, `Dialog.tsx` |
| Alert | `auth_status_banner.dart` | `Alert.tsx` |
| Loader | generation banners, Lottie | `Spinner.tsx`, `LottieIcon.tsx` (lottie-react) |
| Empty state | library empty views | `EmptyState.tsx` |
| Pagination | if used in org dashboard lists | `Pagination.tsx` |
| Table | org teacher seats | `Table.tsx` |
| Sidebar | library desktop sidebar | `Sidebar.tsx` |

## Auth UI

| Flutter | Next.js |
|---------|---------|
| `auth_glass_shell.dart` | `features/auth/AuthGlassShell.tsx` |
| `auth_status_banner.dart` | `AuthStatusBanner.tsx` |
| Sign-in/up forms | `features/auth/*Form.tsx` + RHF + Zod |

## Stage-specific

| Flutter | Next.js |
|---------|---------|
| `lesson_plan_content_view.dart` | `Stage1PlanView.tsx` |
| `lesson_plan_edit_dialog.dart` | `LessonPlanEditDialog.tsx` |
| `stage2_slide_canvas.dart` | `Stage2SlideCanvas.tsx` (canvas or DOM slides) |
| `stage2_mini_slide.dart` | `Stage2MiniSlide.tsx` |
| `stage2_cover_canvas.dart` | `Stage2CoverCanvas.tsx` |
| `stage2_theme_gallery.dart` | `Stage2ThemeGallery.tsx` |
| `slide_edit_dialog.dart` | `SlideEditDialog.tsx` |
| `stage3_worksheet_content_view.dart` | `Stage3ContentView.tsx` |
| `stage4_assessment_content_view.dart` | `Stage4ContentView.tsx` |
| `assessment_question_count_slider.dart` | `QuestionCountSlider.tsx` |
| `ai_generation_progress_banner.dart` | `GenerationProgressBanner.tsx` |
| `generation_success_overlay.dart` | `GenerationSuccessOverlay.tsx` |
| `stage_download_share_actions.dart` | `ExportShareActions.tsx` |
| `stage_upgrade_card.dart` | `UpgradeCard.tsx` |
| `personalization_banner.dart` | `PersonalizationBanner.tsx` |
| `stage_source_required_dialog.dart` | `SourceRequiredDialog.tsx` |

## Library

| Flutter | Next.js |
|---------|---------|
| `library_screen.dart` tabs/search | `LibraryPage.tsx`, `LibraryTabs.tsx`, `LibrarySearch.tsx` |
| `complete_pack_review_content.dart` | `CompletePackReview.tsx` |
| `hydrated_stage2_slide_canvas.dart` | `HydratedSlideCanvas.tsx` (loads Storage URLs) |

## Ayla

| Flutter | Next.js |
|---------|---------|
| `ayla_chat_panel.dart` | `AylaChatPanel.tsx` |
| `ayla_assistant.dart` | `AylaAssistantFAB.tsx` |
| `animated_ayla_avatar.dart` | `AylaAvatar.tsx` |

## Profile & subscription

| Flutter | Next.js |
|---------|---------|
| `profile_screen.dart` sections | `features/profile/*` |
| `subscription_screen.dart` plan cards | `features/billing/PlanGrid.tsx` |
| `rate_us_dialog.dart` | `RateUsDialog.tsx` (web: link to stores) |

## Organization

| Flutter | Next.js |
|---------|---------|
| `organization_dashboard_screen.dart` | `OrganizationDashboardPage.tsx` |
| Seat list UI | `TeacherSeatTable.tsx` |

## Notifications

| Flutter | Next.js |
|---------|---------|
| `notifications_screen.dart` | `NotificationsList.tsx`, `NotificationRow.tsx` |

## Motion

| Flutter | Next.js |
|---------|---------|
| `animated_list_entrance.dart` | Framer Motion list variants |
| Page transitions (`_fadePage`) | `template.tsx` motion wrappers |

## Assets

Copy or reference from `MakeMyLesson/assets/`:

- `logo.jpeg`, onboarding images, Lottie JSON under `public/lottie/`
- PWA icons from `flutter_launcher_icons` web config (`#1A2138` theme)
