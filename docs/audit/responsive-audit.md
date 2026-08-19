# Responsive and accessibility audit

## Scope and evidence standard

This audit covers the current React implementation at 320, 360, 375, 390, 412, 430, 768, 820, 834, 1024, 1280, 1366, 1440, 1536, 1920, and 2560 CSS pixels. Phone widths cover compact and large phones; 768–834 cover portrait tablets; 1024 covers tablet landscape and compact desktop; 1280–1536 cover common desktops; 1920–2560 cover wide displays.

Every viewport conclusion below is **STATIC_ANALYSIS_ONLY**. It is based on source inspection of layout classes, fixed dimensions, positioning, content density, and breakpoint behavior. No claim is presented as browser-verified. A browser/device pass remains required before responsive work is accepted.

Severity definitions:

- **R0**: a core task can become unavailable or the global shell can become structurally unusable.
- **R1**: a major task is blocked, obscured, or materially difficult at a supported viewport.
- **R2**: the task remains possible but layout, readability, or interaction quality is meaningfully degraded.
- **R3**: polish, consistency, or optimization issue with a workable fallback.

## Shell and breakpoint assessment

The implementation is mobile-first in isolated components, but not at the application-shell level. Tailwind responsive classes mostly alter grids and visibility at `sm`, `md`, and `lg`; there is no shared container, safe-area primitive, responsive dialog primitive, or documented breakpoint contract. The desktop header keeps logo, creation, messaging, notification, wallet, and account controls in one non-wrapping row. The bottom navigation is fixed at `h-16`, while `App` compensates with a generic `pb-20`; neither accounts for `env(safe-area-inset-bottom)`.

At 320–430 pixels, the header is the highest-risk region because its persistent controls compete for a single row. At 768–834 pixels, two- and three-column forms begin to activate before their contents have a proven minimum width. At 1024 pixels, creator/admin screens become dense desktop arrangements with limited intermediate-tablet tuning. At 1920–2560 pixels, most screens are capped by `max-w-*`, which protects line length but leaves the shell and full-width backgrounds visually sparse; that is acceptable if deliberate.

## Responsive defect matrix

| ID | Screen | Component | Viewport/breakpoint | Issue | Severity | Root cause | Recommended fix | Dependencies |
|---|---|---|---|---|---|---|---|---|
| RSP-01 | Global shell | `Header` | 320–430 | Primary controls can exceed the available row width, hiding or compressing navigation. | R0 | Non-wrapping action row with too many persistent controls. | Use a compact header with logo, one primary action, and overflow/account menus; move secondary destinations to bottom navigation or a sheet. | Navigation architecture, icon-button primitive |
| RSP-02 | Messages | `Messages` | 320–767 | Conversation list and thread are stacked inside a fixed viewport-derived height, making the selected thread hard to reach and shrinking the composer. | R1 | Desktop master-detail model collapses without a mobile navigation state. | Render list or thread as mutually exclusive mobile routes/panels with an explicit back action. | Router, message route state |
| RSP-03 | Messages | `Messages` | Short landscape phones | `h-[calc(100vh-140px)] min-h-[550px]` can extend below the visible area and conflict with the software keyboard. | R1 | Fixed minimum height and legacy `100vh`. | Use `100dvh`, flex min-height zero, and a keyboard-aware composer region. | Responsive shell |
| RSP-04 | Global shell | `BottomNav` | 320–834 | Navigation can overlap device home indicators and content. | R1 | Fixed `h-16` without safe-area padding. | Add `padding-bottom: env(safe-area-inset-bottom)` and expose total shell inset as a token. | App shell primitive |
| RSP-05 | Global feedback | App toasts | 320–430 | Wide fixed-position messages can crowd edges or cover header actions. | R2 | Toast width/placement is not centralized or safe-area aware. | Add a responsive toast viewport with 16 px gutters, top safe area, live-region semantics, and stacked limits. | Toast primitive |
| RSP-06 | Feed | `PostCard` | 320–375 | Dense action labels, counts, PPV controls, and metadata compete horizontally. | R2 | Action rows assume label space instead of prioritizing icons and wrapping rules. | Define compact action variants, hide redundant labels accessibly, and reserve stable count widths. | Button/icon primitive |
| RSP-07 | Feed | `PostCard` | 768–1024 | Media and text use the same composition as phone/desktop, leaving no tablet-specific density choice. | R3 | No container-query or tablet composition. | Keep a bounded single column or introduce a tested two-column feed only above a content-width threshold. | Container primitive |
| RSP-08 | Stories | `StoriesReel` | 320–430 | Fixed-width story items consume scarce width and creation uses a non-semantic clickable container. | R2 | `70px` item assumptions and scroll-only discovery. | Retain horizontal scrolling, reduce compact width, add scroll padding/snap, and use buttons. | Accessibility remediation |
| RSP-09 | Story viewer | `StoryViewerModal` | 320–430 and short heights | Full-screen controls can conflict with notches, browser chrome, and captions. | R1 | Fixed inset composition lacks safe areas and a reserved control/caption grid. | Use `100dvh`, four safe-area paddings, explicit media-fit region, and bottom control slot. | Dialog primitive, media primitive |
| RSP-10 | Explore | `Explore` | 320–430 | Search, categories, creator cards, and results have inconsistent compact spacing and touch density. | R2 | Screen-specific spacing rather than shared responsive stacks. | Apply shared page gutters, horizontal category scroller, and card density variants. | Layout tokens |
| RSP-11 | Creator profile | `CreatorProfile` | 320–430 | Hero controls, stats, tabs, and action buttons create several competing horizontal rows. | R1 | Desktop-oriented profile header is compressed rather than recomposed. | Stack identity and actions; make tabs horizontally scrollable with visible selected state. | Profile layout primitive |
| RSP-12 | Creator profile | `CreatorProfile` | 768–1024 | Gallery and information regions can become uneven at intermediate widths. | R2 | Grid changes occur only at broad breakpoints. | Define minimum card widths with `repeat(auto-fit,minmax())` or explicit tablet columns. | Media card primitive |
| RSP-13 | Creator studio | `CreatorStudio` | All widths | Header shortcuts set `activeTab` to `creator_studio`, while rendering expects `studio`, producing an empty body. | R0 | Unvalidated string navigation state. | Replace string state with typed routes and one canonical studio identifier. | Navigation architecture |
| RSP-14 | Creator studio | `CreatorStudio` | 320–834 | KPI cards and Recharts visualizations become dense; chart labels and tooltips have no compact contract. | R1 | Desktop dashboard grid and chart configuration are only partially responsive. | Provide compact KPI carousel/list and chart-specific mobile layouts with reduced ticks. | Chart wrappers, route fix |
| RSP-15 | Wallet | `Wallet` | 320–430 | Balance actions, filters, and transaction metadata crowd narrow rows. | R1 | Large monolithic screen and desktop-like transaction composition. | Split balance actions from history, stack transaction metadata, and use responsive disclosure rows. | Wallet domain/API abstraction |
| RSP-16 | Wallet | `Wallet` | 768–1024 | Cards and transaction views jump between mobile and desktop density without tablet tuning. | R2 | Coarse breakpoint grid. | Add an intermediate two-column summary and full-width history arrangement. | Layout tokens |
| RSP-17 | Admin | `AdminDashboard` | 320–767 | Report and KYC records contain too many fields/actions for compact cards. | R1 | Desktop administration data is merely stacked. | Use summary cards with drill-in detail sheets; keep destructive decisions in a dedicated review view. | Admin routes, dialog primitive |
| RSP-18 | Admin | `AdminDashboard` | 768–1024 | Dense controls and record metadata can wrap unpredictably. | R2 | No tablet table/card design. | Define tablet card grid and action-menu pattern. | Admin information architecture |
| RSP-19 | Live | `LiveStreamModal` | 320–430 portrait | Video, metadata, chat, and monetization controls compete vertically. | R1 | A desktop split-view becomes one long flex column. | Prioritize video and primary controls, then place chat in a collapsible sheet/tab. | Live session route, media player |
| RSP-20 | Live | `LiveStreamModal` | Short landscape phones | Minimum media height and fixed overlay can push chat/actions offscreen. | R1 | `min-h-[320px]` plus full-screen chrome. | Use aspect-ratio bounded by available dynamic height and an overlay control mode. | Dynamic viewport utilities |
| RSP-21 | Login/register | `Login` | 320–430 | Multi-step creator registration fields and choices produce long, dense pages with limited progress context. | R1 | One large component owns all modes and forms. | Split steps into route-backed forms, sticky mobile actions, and an accessible progress indicator. | Router, form primitives |
| RSP-22 | Login/register | `Login` | 768–834 | Multi-column creator fields can activate with insufficient label/input width. | R2 | Breakpoint-only grid without field minimums. | Use a field min-width contract and retain one column until the form container supports two. | Form grid primitive |
| RSP-23 | KYC | `KycVerificationModal` | 320–430 | Identity, document, selfie, payment, and consent content is too long for a single modal workflow. | R1 | Entire process is held in one fixed overlay and local state machine. | Make KYC a resumable full-page route; keep compact confirmations as dialogs. | KYC route/API, secure upload |
| RSP-24 | KYC | `KycVerificationModal` | 768–834 | Three-column upload/payment content risks narrow cards and wrapped controls. | R2 | `md` grid activates before adequate content width. | Use one or two columns until a measured minimum card width is available. | Upload primitive |
| RSP-25 | Create post | `CreatePostModal` | 320–430 and keyboard open | Composer actions and media controls can be obscured by the keyboard. | R1 | Fixed overlay lacks dynamic-height and sticky action design. | Use a full-screen mobile composer with `100dvh`, scrollable body, and sticky footer. | Dialog/composer primitive |
| RSP-26 | Payment, subscription, tip | Payment-related modals | 320–430 | Keypads, amounts, explanatory copy, and confirm actions may overflow short screens. | R1 | Repeated modal shells lack a max-height/scroll/safe-area contract. | Consolidate on responsive bottom-sheet/full-screen variants and keep confirmation action visible. | Dialog primitive, payment adapter |
| RSP-27 | Rating/report | `RateCreatorModal`, report UI | 320–430 | Long forms depend on per-modal overflow handling and inconsistent footer placement. | R2 | Modal behavior is duplicated. | Adopt one form-dialog layout with scrollable body and sticky footer. | Dialog primitive |
| RSP-28 | Notifications | `Notifications` | 320–375 | Avatar, copy, time, and action content can produce cramped rows. | R2 | Single horizontal row composition. | Allow content to stack and cap avatar/action columns. | Notification row primitive |
| RSP-29 | Landing | `Landing` | 320–430 | Large decorative typography and CTA grouping have no explicit compact type scale. | R2 | Page-specific sizes rather than fluid display tokens. | Introduce clamped display sizes and stack CTAs with full-width compact targets. | Typography tokens |
| RSP-30 | Landing | `Landing` | 1920–2560 | Content remains heavily centered with limited use of wide canvas. | R3 | Fixed max-width composition. | Preserve readable content width while extending art/background zones, not text lines. | Optional art direction |
| RSP-31 | Age gate | `AgeGate` | 320–430 and short heights | Centered card can lack safe scrolling if text or system font size grows. | R1 | Full-screen centering without a scroll contract. | Add overflow-y auto, safe-area gutters, and top/bottom breathing room. | Dialog/page primitive |
| RSP-32 | Logout | `LogoutConfirmModal` | All widths | A responsive confirmation component exists but is not connected to the application flow. | R2 | Orphaned component and immediate logout mutation. | Integrate through the shared dialog service and test compact layout. | Navigation/session flow |
| RSP-33 | Media | Images across screens | All widths | Remote images omit intrinsic `width`/`height` and lazy-loading policy, risking layout shift and excess network use. | R2 | Raw `<img>` usage without a media component. | Add a responsive media component with aspect ratio, `srcset`, sizes, dimensions, loading, and fallback. | Media architecture |
| RSP-34 | Global | Animated controls/modals | All widths | Motion is not adapted for `prefers-reduced-motion`. | R2 | Repeated transitions/animation with no central motion policy. | Add reduced-motion tokens/utilities and disable nonessential transforms/confetti. | Design-system foundation |

Defect count: **34 total — R0: 2, R1: 15, R2: 15, R3: 2.**

## Accessibility audit

Static counts found 242 buttons, 53 input/select/textarea elements, 60 label elements, 41 images, 145 `transition-all` usages, no `aria-label`, no `aria-live`, no `focus-visible`, and no reduced-motion handling. Fifteen fixed-inset modal implementations were found without a shared dialog contract. Counts are directional source evidence, not an accessibility conformance result.

| ID | Surface | Finding | Severity | Required remediation |
|---|---|---|---|---|
| A11Y-01 | All modal flows | Fixed overlays do not expose a consistent `role="dialog"`, `aria-modal`, labelled title, initial focus, focus trap, Escape behavior, or focus restoration. | A0 | Implement one accessible dialog/sheet primitive and migrate every modal before feature expansion. |
| A11Y-02 | Header and action rows | Icon-only controls lack accessible names; `title` is not a sufficient primary label. | A1 | Require `aria-label` or visible text in the icon-button API. |
| A11Y-03 | Story viewer | Left/right navigation zones are clickable `div` elements and are not keyboard buttons. | A1 | Replace with semantic buttons and visible/focusable previous/next controls. |
| A11Y-04 | Stories reel | “Create story” uses a clickable `div`. | A1 | Use a button with an accessible name and keyboard focus style. |
| A11Y-05 | Forms | Label-to-control relationships are inconsistent; several labels do not use `htmlFor` or wrapping association. | A1 | Give every control a stable ID, programmatic label, instructions, and error association. |
| A11Y-06 | Form errors | Validation and success messages are primarily visual and not consistently announced. | A1 | Use `aria-describedby`, `aria-invalid`, and polite/assertive live regions according to urgency. |
| A11Y-07 | Toasts | App feedback is not an `aria-live` region. | A1 | Centralize status/error toasts with appropriate live-region roles and deduplication. |
| A11Y-08 | Focus | Interactive elements do not have a consistent `:focus-visible` treatment; some remove outlines. | A1 | Add a high-contrast focus-ring token and forbid outline removal without replacement. |
| A11Y-09 | Authentication/KYC | Multi-step flows do not announce step changes or move focus to the new heading/error. | A1 | Use route/step headings, focus management, and accessible progress semantics. |
| A11Y-10 | Payment PIN | Custom keypad and PIN state do not expose complete instructions, digit status, or error feedback to assistive technology. | A1 | Use a labelled input pattern with secure semantics and announce errors without revealing PIN values. |
| A11Y-11 | Motion | Confetti, animated overlays, and transitions ignore reduced-motion preference. | A1 | Disable nonessential motion and shorten essential feedback under `prefers-reduced-motion`. |
| A11Y-12 | Navigation | Active tabs are visual-only in several places and browser location does not identify the current screen. | A1 | Use routes, landmarks, `aria-current`, and deterministic document titles. |
| A11Y-13 | Images | Alt text exists in many places but decorative/informative policy is inconsistent. | A2 | Define empty alt for decoration and contextual alt for content; avoid duplicating adjacent names. |
| A11Y-14 | Touch targets | Dense icon controls do not share a guaranteed 44 by 44 CSS pixel target. | A2 | Enforce minimum target size in button and icon-button primitives. |
| A11Y-15 | Color | Pink/stone text and disabled states have no recorded contrast verification. | A2 | Test every semantic token against WCAG AA, including hover, disabled, chart, and overlay states. |
| A11Y-16 | Charts | Recharts visuals have no equivalent accessible summary/table. | A2 | Add textual KPI summaries and optional data tables linked to each chart. |
| A11Y-17 | Loading | Timer-driven operations lack consistent busy state semantics. | A2 | Apply `aria-busy`, disable duplicate submission, and provide status text. |
| A11Y-18 | Language/formatting | Dates, currency, and amounts are not governed by a locale-aware formatting layer. | A2 | Use `Intl` with explicit locale/currency and readable full-value labels. |

Accessibility count: **18 findings — A0: 1, A1: 11, A2: 6.** Automated axe checks, keyboard-only walkthroughs, screen-reader checks, zoom/reflow at 200% and 400%, contrast tests, and target-size measurement remain required.

## Bundle and runtime performance audit

The baseline production build produced approximately 921.63 kB of JavaScript (245.41 kB gzip), 89.33 kB of CSS (12.98 kB gzip), and a Vite warning for a JavaScript chunk over 500 kB. All screens are statically imported by `App`, so the landing/login path pays for creator studio charts, admin, messaging, wallet, and every modal. Recharts is isolated to Creator Studio in source but not in the shipped chunk. Lucide is imported throughout; tree shaking should be measured rather than assumed. Canvas-confetti is used in the app and payment flows. `motion`, `@google/genai`, `dotenv`, and `express` appear unused by `src` and should be verified and removed from the browser package if truly unnecessary.

Performance work should proceed in this order:

1. Establish route-level lazy imports for public, fan, creator, and admin areas.
2. Lazy-load Creator Studio charts and live/media-heavy experiences.
3. Remove verified-unused browser dependencies and analyze the bundle in CI.
4. Introduce the media component with responsive sizes, intrinsic dimensions, lazy/eager rules, and cancellation.
5. Virtualize or paginate messages, notifications, transactions, feeds, and admin queues after APIs exist.
6. Measure LCP, CLS, INP, route-transition time, and low-end mobile memory against budgets.

Proposed initial budgets: landing/login entry JavaScript under 200 kB gzip, authenticated shell under 250 kB gzip before route chunks, route chunks under 150 kB gzip unless justified, CLS below 0.1, p75 LCP below 2.5 seconds, and p75 INP below 200 ms on representative mobile hardware.

## Responsive implementation order

1. Fix the `creator_studio`/`studio` navigation defect and replace free-form tab strings with typed destinations.
2. Introduce tokens for page gutters, readable widths, safe-area insets, touch targets, dynamic viewport heights, and focus/motion behavior.
3. Build and validate `AppShell`, `PageContainer`, `ResponsiveStack`, `ResponsiveGrid`, `ScrollableTabs`, and responsive dialog/sheet primitives.
4. Recompose the phone header and bottom navigation at 320–430 pixels.
5. Convert Messages to route-backed mobile master/detail behavior and keyboard-safe height handling.
6. Migrate create-post, story viewer, payment, subscription, tip, rating, report, logout, and KYC overlays to the dialog/sheet primitive; make KYC a full-page resumable route.
7. Recompose Creator Profile, Creator Studio, Wallet, Admin, and Live at phone and tablet widths.
8. Normalize feed, explore, notification, landing, and age-gate spacing and density.
9. Adopt responsive media, chart, table/card, toast, and empty/error/loading primitives.
10. Run browser verification at every scoped width, then keyboard, screen-reader, zoom/reflow, reduced-motion, touch-target, and performance checks before acceptance.
