# Screen inventory

Status vocabulary:

- `UI_COMPLETE`: substantial static surface exists.
- `UI_PARTIAL`: only part of the expected surface exists.
- `MOCKED`: interactions/data are simulated in client memory.
- `BROKEN`: source contains a confirmed navigation or behavior defect.
- `MISSING`: no corresponding source surface exists.
- `FUTURE_PHASE`: deliberately deferred advanced capability.

Multiple labels are used where a screen is visually substantial but functionally mocked.

## Public

| Screen/view | Source | Status | Evidence |
|---|---|---|---|
| Landing | `LandingView.tsx` | UI_COMPLETE | Marketing hero, value propositions, revenue explanation and CTAs. |
| Age gate | `AgeGateModal.tsx`, App localStorage | UI_COMPLETE, MOCKED | Acknowledgement persists as one localStorage flag; no server evidence. |
| Login: phone | `LoginView.tsx` | UI_COMPLETE, MOCKED | Timer transitions to pre-filled OTP. |
| Login: email | `LoginView.tsx` | UI_COMPLETE, MOCKED | Any unmatched email resolves to default fan; password is not checked. |
| Registration: fan | `LoginView.tsx` | UI_COMPLETE, MOCKED | Creates an in-memory user and grants a client-defined balance. |
| Registration: creator | `LoginView.tsx` | UI_COMPLETE, MOCKED | Collects category/province/pricing but does not persist onboarding data. |
| OTP verification | `LoginView.tsx` | UI_COMPLETE, MOCKED | Any entered digits can complete the flow. |
| Account recovery | `LoginView.tsx` | UI_PARTIAL, MOCKED | Request UI exists; no recovery token or delivery. |
| Demo account picker | `LoginView.tsx` | UI_COMPLETE, MOCKED | Direct fan/creator/admin impersonation. |
| Public creator profile | `CreatorProfileView.tsx` | UI_COMPLETE, MOCKED | Same client view is used regardless of authentication. |

## Fan

| Screen/view | Source | Status | Evidence |
|---|---|---|---|
| Feed | `Feed.tsx` | UI_COMPLETE, MOCKED | Four local filters; posts and mutations are in memory. |
| Explore | `ExplorePage.tsx` | UI_COMPLETE, MOCKED | Creators, lives and posts are filtered locally. |
| Search | Header, Explore | UI_PARTIAL, MOCKED | Header text switches to Explore; no URL, backend or dedicated results model. |
| Creator profile | `CreatorProfileView.tsx` | UI_COMPLETE, MOCKED | Follow, subscribe and review state mutate locally. |
| Post/content viewer | `PostCard.tsx`, Explore preview | UI_PARTIAL, MOCKED | Images render; declared video/gallery behavior is not fully implemented. |
| Subscription checkout | `SubscriptionModal.tsx` | UI_COMPLETE, MOCKED | Plan/provider form calls a simulated payment. |
| PPV unlock | `PostCard.tsx`, PaymentPromptModal | UI_COMPLETE, MOCKED | Client flips `isUnlocked`. |
| Tips | `TipModal.tsx`, PaymentPromptModal | UI_COMPLETE, MOCKED | Client appends a transaction after timer success. |
| Wallet | `WalletView.tsx` | UI_COMPLETE, MOCKED | Balance, filters, details and export feedback are local. |
| Deposit | Wallet modal | UI_COMPLETE, MOCKED | Simulated provider confirmation increments balance. |
| Messages | `MessagesView.tsx` | UI_COMPLETE, MOCKED | Local conversation list and local send. |
| Message PPV | Messages, PaymentPromptModal | UI_COMPLETE, MOCKED | Client unlock flag; no entitlement. |
| Notifications | `NotificationsView.tsx` | UI_COMPLETE, MOCKED | Read state is local; target navigation is partial. |
| Stories | `StoriesReel`, `StoryViewerModal` | UI_COMPLETE, MOCKED | Timer-driven image viewer and local reply toast. |
| Live room | `LiveRoomModal.tsx` | UI_PARTIAL, MOCKED | Static cover image, local chat/viewers/hearts; no stream. |
| Ratings/reviews | `RateCreatorModal`, profile | UI_COMPLETE, MOCKED | Client computes aggregate ratings. |
| Settings/account profile | None | MISSING | User menu links “Meu Perfil” to creator profile selection, not settings. |
| Logout confirmation | `LogoutConfirmModal.tsx` | BROKEN | Component exists but App does not render it; logout is immediate. |

## Creator

| Screen/view | Source | Status | Evidence |
|---|---|---|---|
| Creator onboarding | creator registration in LoginView | UI_PARTIAL, MOCKED | Basic role/category/province/price fields only. |
| KYC submission | `KycModal.tsx` | UI_COMPLETE, MOCKED | Sensitive fields and fake upload booleans are pre-filled. |
| Creator profile editing | None | MISSING | No editable profile surface. |
| Creator Studio entry | Header/App | BROKEN | Header uses `creator_studio`; App expects `studio`. Role switching/login can still reach `studio`. |
| Studio overview | `CreatorStudio.tsx` | UI_COMPLETE, MOCKED | KPIs and revenue values are static/derived. |
| Analytics | CreatorStudio overview/Recharts | UI_COMPLETE, MOCKED | Seven hard-coded daily rows. |
| Content management | CreatorStudio content tab | UI_PARTIAL, MOCKED | Existing content cards; no server lifecycle or edit flow. |
| Create post | `CreatePostModal.tsx` | UI_COMPLETE, MOCKED | Selects hard-coded remote media; adds local post. |
| Pricing | CreatorStudio pricing tab | UI_COMPLETE, MOCKED | Updates creator prices locally. |
| Earnings | Studio overview and Wallet creator mode | UI_PARTIAL, MOCKED | No ledger-backed reconciliation. |
| Wallet | Wallet creator mode | UI_COMPLETE, MOCKED | Same combined wallet component. |
| Payout request | Studio/Wallet modals | UI_COMPLETE, MOCKED | Adds pending transaction without balance reservation. |
| Reviews | Studio reviews tab | UI_COMPLETE, MOCKED | Uses local review fixtures. |
| Affiliates | Studio affiliates tab | UI_PARTIAL, MOCKED | Code/copy UI and static figures only. |
| AI assistant | Studio AI tab | UI_PARTIAL, MOCKED | Timed canned response; installed GenAI dependency is unused. |
| Live creation/management | None | FUTURE_PHASE, MISSING | Live viewing prototype exists; creator broadcast controls do not. |

## Admin

| Screen/view | Source | Status | Evidence |
|---|---|---|---|
| Dashboard metrics | `AdminDashboard.tsx` | UI_COMPLETE, MOCKED | Static metrics and domain counts. |
| Creator/KYC management | Admin KYC tab | UI_COMPLETE, MOCKED | Approve/reject mutates local status. |
| Reports/moderation | Admin reports tab | UI_COMPLETE, MOCKED | Keep/remove mutates local status. |
| User management | None | MISSING | No user list, suspension or role management. |
| Financial operations | dashboard metrics only | UI_PARTIAL, MOCKED | No transaction investigation or reconciliation. |
| Payout operations | None | MISSING | No payout queue/review. |
| Configuration | None | MISSING | No fees, limits, content policy or provider configuration. |
| Audit/security views | None | MISSING | No audit log, sessions, risk or security event UI. |

## Inventory totals

- 52 distinct screens/subviews/capabilities classified.
- 45 have at least a visible source representation, including the two broken entry/confirmation paths.
- 7 are missing or explicitly future-phase surfaces.
- Every transaction, identity, entitlement, moderation and authentication flow that has UI is currently mocked or partial.
