# Frontend architecture audit

Audit basis: static source inspection on baseline `a31afa39d75043804920b9255fe84e90d0265cc3`. No product source was changed.

## Runtime topology

`index.html` loads remote Google Fonts and mounts `src/main.tsx`. `main.tsx` renders a single React root containing `App`. `App.tsx` imports every screen and modal synchronously, owns almost all domain collections and mutations, and selects views with string state. There is no router, context provider, query cache, API layer, backend client, test harness, or error boundary.

```text
index.html
└─ src/main.tsx
   └─ src/App.tsx
      ├─ Header + BottomNav
      ├─ one current view selected by currentTab/isLandingPage
      └─ global modal stack selected by local state
```

## Significant source inventory

| File | Purpose | Responsibility | Approx. size | Parent/consumer | Major children | Important props/contracts | Local state | Mock-data usage | Responsive complexity | Future backend dependency | Launch priority |
|---|---|---|---:|---|---|---|---|---|---|---|---|
| `src/main.tsx` | React entry | Bootstraps root and StrictMode | 9 lines | `index.html` | `App` | None | None | None | Low | Runtime config | P0 |
| `src/App.tsx` | Application orchestrator | Auth, roles, navigation, all domain collections, mutations, modal orchestration, toast | 1,068 | `main.tsx` | All 24 components | None | 32 top-level state values | Directly initializes 10 `MOCK_*` collections | High | Every production domain | P0 |
| `src/types.ts` | Shared domain types | Defines 15 core types/interfaces | 247 | App and components | None | Exported models | None | Shapes all mock data | Low | API contracts and validation | P0 |
| `src/data/mockData.ts` | Prototype fixtures | 10 mutable domain datasets plus categories and analytics | 1,107 | App, Explore, Studio | None | `MOCK_*`, `CATEGORIES`, `CREATOR_ANALYTICS_DATA` | None | Source of all domain data | Low | Replacement by API fixtures/contracts | P0 |
| `src/index.css` | Global styles | Tailwind import, fonts, scrollbar, pulse, glass helper | 38 | `main.tsx` | None | CSS utilities | None | None | Medium | None | P1 |
| `Header.tsx` | Global header | Brand, desktop navigation, role switch, search, wallet/actions, user menu | 500 | App | Menus | 18 navigation/user/action props | 3 menu/search states | Indirect through props | High | Auth, user, wallet, search, authorization | P0 |
| `BottomNav.tsx` | Mobile navigation | Five mobile actions and unread badge | 77 | App | None | tab state, create action, unread count | None | Indirect | Medium | Routing, authorization | P0 |
| `LandingView.tsx` | Public marketing page | Hero, value propositions, pricing/revenue claims, CTAs | 356 | App | None | explore/register/login callbacks | None | None | Medium | Public configuration/content | P1 |
| `LoginView.tsx` | Authentication surface | Login, registration, recovery, OTP, demo account selection, creator registration | 996 | App | None | login success, mode/role, close | 20 auth/form values | Hard-coded demo accounts | High | Auth, users, sessions, OTP, onboarding | P0 |
| `AgeGateModal.tsx` | Age acknowledgement | Blocks UI until accept/reject | 78 | App | None | open/confirm/reject | None | None | Medium | Age policy/session evidence | P0 |
| `Feed.tsx` | Fan feed | Filter bar, stories, composer CTA, post list, creator promotion | 308 | App | `StoriesReel`, `PostCard` | 18 data/action props | feed filter | Indirect App collections | Medium | Feed, posts, follows, entitlements | P0 |
| `StoriesReel.tsx` | Story carousel | Create-story entry and horizontal story list | 69 | Feed | None | stories and callbacks | None | Story fixtures via Feed | Medium | Stories/media | P2 |
| `PostCard.tsx` | Content unit | Creator header, media, lock state, actions, comments, share/report | 390 | Feed, CreatorProfile | None | post plus 8 callbacks | 4 UI states | Post fixture/derived mutations | High | Posts, media, entitlements, comments, tips | P0 |
| `ExplorePage.tsx` | Discovery/search | Search, category/sort filters, live cards, creator cards, content grid, preview modal | 577 | App | Inline preview modal | creators/posts/lives and actions | 4 filter/preview states | Direct categories; indirect domain fixtures | High | Search, discovery, creators, posts, lives | P1 |
| `CreatorProfileView.tsx` | Creator public profile | Header, follow/subscribe/message CTAs, content, reviews, live sessions | 782 | App | `PostCard` | creator/posts/reviews/lives plus 13 actions | 3 view/filter states | Indirect fixtures | High | Profiles, follows, subscriptions, reviews, lives | P0 |
| `SubscriptionModal.tsx` | Subscription checkout | Plan/provider selection and simulated confirmation | 271 | App | None | creator, balance, confirm/close | 5 checkout states | Creator/balance props | High | Products, subscriptions, payments, entitlements | P0 |
| `TipModal.tsx` | Tip checkout | Amount, message, provider selection | 172 | App | None | creator, balance, confirm/close | 4 checkout states | Balance/creator props | Medium | Tips, payments, ledger | P1 |
| `PaymentPromptModal.tsx` | Payment simulator | USSD-style PIN keypad, processing and success callback | 176 | App | None | provider, amount, phone, success/cancel | step, PIN, countdown | None | High | Payment intent/provider callback | P0 |
| `WalletView.tsx` | Wallet and transaction hub | Fan/creator balances, deposits, filters, exports, transaction details, payouts | 1,129 | App | 3 inline modals | role, balance, transactions, deposit/payout | 20 wallet/filter/modal states | Transactions and balance via App | Very high | Ledger, wallet, payments, payouts | P0 |
| `MessagesView.tsx` | Messaging | Conversation list, active thread, text/audio/media/PPV UI | 270 | App | None | conversations, selection, send, unlock, tip | input and audio states | Conversation fixtures | High | Realtime messaging, media, entitlements | P1 |
| `NotificationsView.tsx` | Notifications | Filters, mark-all-read, notification selection | 153 | App | None | notification data/actions | filter | Notification fixtures | Medium | Notifications, read state | P1 |
| `CreatorStudio.tsx` | Creator operations | Overview, analytics, content, pricing, reviews, affiliates, AI demo, payout modal | 814 | App | Recharts and inline payout modal | creator/posts/reviews and 3 mutations | 11 studio states | Direct analytics fixture | Very high | Analytics, catalog, pricing, payouts, AI policy | P1 |
| `CreatePostModal.tsx` | Content composer | Type, sample media, access class, price, caption, tags/location | 278 | App | None | publish/close | 6 composer states | Hard-coded sample media | High | Uploads, posts, media processing | P0 |
| `KycModal.tsx` | Creator KYC form | Identity/tax/payout fields, fake upload states, consents | 348 | App | None | submit/close | 15 sensitive/form states | Pre-filled prototype identity data | Very high | KYC vendor, encrypted storage, review | P0 |
| `AdminDashboard.tsx` | Admin overview | Metrics, KYC decisions, reports/moderation | 334 | App | None | reports/KYC plus decision callbacks | admin tab | Admin/KYC fixtures | High | Admin RBAC, moderation, KYC | P0 |
| `StoryViewerModal.tsx` | Story viewer | Timed progress, previous/next zones, reply and like | 198 | App | None | stories/index/reply/close | 5 playback states | Story fixtures | High | Stories/media/messages | P2 |
| `LiveRoomModal.tsx` | Live-room prototype | Cover image, viewers, chat, hearts, quick rating and tip | 270 | App | None | session/creator plus actions | 6 live states | Live fixtures and local chat | Very high | Realtime live, chat, billing, moderation | P3 |
| `RateCreatorModal.tsx` | Review composer | Profile/live target, category scores, tags and text | 369 | App | None | creator/lives/submit/close | 11 review states | Live fixtures via props | High | Reviews, eligibility, moderation | P2 |
| `LogoutConfirmModal.tsx` | Logout confirmation | Confirmation copy and user summary | 94 | Not rendered by App | None | open/user/confirm/close | None | None | Low | Session revocation | P1 |

## Large and multi-responsibility files

| File | Evidence | Risk |
|---|---|---|
| `WalletView.tsx` | 1,129 lines, 20 local states, filters, exports, fan and creator variants, three modals | Financial UI behavior and responsive changes are tightly coupled. |
| `src/data/mockData.ts` | 1,107 lines spanning ten domains | Fixture updates create broad merge conflicts and obscure domain ownership. |
| `src/App.tsx` | 1,068 lines, 32 state values, 24 imported components, 24 handlers | A single render boundary owns authorization-like decisions and every mutation. |
| `LoginView.tsx` | 996 lines and 20 states covering four auth modes and two roles | Authentication, onboarding, OTP and demo accounts cannot evolve independently. |
| `CreatorStudio.tsx` | 814 lines and six internal tabs | Analytics, pricing, content, payouts, affiliates and AI are shipped together. |
| `CreatorProfileView.tsx` | 782 lines and five content tabs | Public profile, entitlements, reviews and lives are coupled. |
| `ExplorePage.tsx` | 577 lines with search, sorting, four surface types and modal | Discovery concerns and media preview share one bundle/render boundary. |

## Current App Responsibility Map

| Domain | Current responsibility in `App.tsx` |
|---|---|
| Authentication | Hard-coded current user, accepts any `AuthUser` from LoginView, logout clears only memory. |
| Navigation | `currentTab`, `isLandingPage`, selected creator/conversation IDs, direct conditional rendering. |
| Role management | User can switch `fan`, `creator`, `admin` directly in Header; role selects tab. |
| Creators | Holds creator collection; follow, subscription and pricing mutate objects locally. |
| Posts | Holds post collection; like, save, comments, unlock and create mutate locally. |
| Stories | Holds stories and selected story index; replies only create a toast. |
| Subscriptions | Opens modal, simulates payment, marks creator subscribed and unlocks posts. |
| PPV | Opens payment simulator and flips `isUnlocked` on post/message. |
| Payments | Stores a callback closure in `paymentPrompt`; success is timer-driven. |
| Wallet | Holds balance and transactions; deposits increment balance, wallet subscription may decrement it, payout does not reserve/decrement funds. |
| Messaging | Holds conversations and appends outbound messages locally. |
| Notifications | Holds collection; creates subscription notification and marks items read. |
| KYC | Builds KYC records from `any`, trusts declarations, and allows local admin status changes. |
| Reviews | Creates reviews, recalculates ratings and live averages in the browser. |
| Lives | Holds sessions; quick ratings and modal selection are local. |
| Admin/reports | Resolves reports and KYC by direct collection mutation. |
| Modals | Owns story, subscription, tip, create, KYC, payment, login, rating, live and age-gate state. |
| Feedback | Owns timer-based global toast and confetti triggers. |

## Future Extraction Map

This is a target map, not an implementation instruction for this audit branch.

| Current App responsibility | Future location |
|---|---|
| Route and selected-resource state | Router configuration plus typed route loaders/params |
| Auth/session bootstrap | `features/auth` session provider backed by server session endpoints |
| Role and access decisions | Server-issued claims plus route/feature authorization guards |
| Creator/profile queries | `features/creators` API/query hooks |
| Feed/posts/comments | `features/posts` and `features/feed` query/mutation layer |
| Story state | `features/stories` controller and media player |
| Subscription/PPV entitlement state | `features/entitlements` using server-authoritative grants |
| Payment prompt callback | Payment-intent state machine using verified provider status |
| Wallet balance and transactions | `features/wallet` read model backed by immutable ledger |
| Messaging | `features/messages` query cache and realtime transport |
| Notifications | `features/notifications` query and read-state mutations |
| KYC form and decisions | Separate creator-onboarding and privileged admin-KYC modules |
| Reviews/live ratings | `features/reviews` with eligibility and aggregate APIs |
| Admin report actions | `features/admin/moderation` with audit logging |
| Modal booleans | Route overlays where deep-linkable; local feature state for transient dialogs |
| Toast/confetti | Shared accessible notification service respecting reduced motion |

## Confirmed architecture defects

- `Header.tsx:379` and `Header.tsx:454` emit `creator_studio`; `App.tsx:941` renders only `studio`. Both Studio shortcuts therefore select a blank application body.
- `App.tsx:56` initializes an authenticated fan by default, so the public landing and login are not the default entry state.
- `LogoutConfirmModal` is implemented but never imported or rendered by `App`; logout occurs immediately.
- `onReportPost` calls `handleResolveReport(post.id, 'keep')`, but post IDs do not match report IDs; it then shows a success toast without creating a report.
- `handleSubmitKyc(data: any)` removes compile-time validation at the most sensitive frontend boundary.
- `PaymentProvider` maps the UI wallet path to `bank_transfer`, mixing a funding source with a provider type.

## Proposed route map from existing screens

No router should be installed during this audit. A later routing phase can map only confirmed surfaces:

```text
/
/login
/register
/recover
/verify-otp
/feed
/explore
/creator/:username
/messages
/messages/:conversationId
/notifications
/wallet
/creator/onboarding
/creator/kyc
/creator/studio
/creator/studio/content
/creator/studio/pricing
/creator/studio/reviews
/creator/studio/affiliates
/admin
/admin/kyc
/admin/reports
```

Post, story, live, subscribe, tip, payment and create-post surfaces can initially be route overlays or nested resource routes when deep linking and browser-history semantics are designed.
