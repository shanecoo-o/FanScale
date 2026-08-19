# Application flow map

All flows below reflect current source behavior. “Real client functionality” means React behavior genuinely occurs in the browser; it does not imply a real server operation.

## Navigation model

`App.tsx` uses `isLandingPage`, `currentTab`, `userRole`, `selectedCreatorId`, `activeConversationId` and modal-specific state. There is no router. The browser URL remains unchanged, refresh resets all state to source defaults, back/forward does not traverse views, and no screen is deep-linkable. Unknown tab strings render the header/bottom navigation around a blank body.

## Flow matrix

| Flow | Entry point | Navigation/state | Modals | Data source | Mutation behavior | Persistence | Exit state | Classification |
|---|---|---|---|---|---|---|---|---|
| Age confirmation | App mount | `showAgeGate` initialized from localStorage | AgeGateModal | localStorage flag | Confirm writes `fanscale_age_verified_18=true`; reject navigates to Google | localStorage only | Modal closes or browser leaves site | REAL CLIENT FUNCTIONALITY for acknowledgement; no identity proof |
| Login: phone | Header/login tab | LoginView `authMode`, phone, selected role | Login modal or dedicated view | Hard-coded demo accounts | Timer opens OTP; OTP chooses first demo account for role | None | App sets role-specific tab | SIMULATED CLIENT FUNCTIONALITY |
| Login: email | Login form | email/password state | Login modal/view | Demo account array | Matches email or defaults to fan; ignores password | None | App sets user/role/balance | SIMULATED CLIENT FUNCTIONALITY |
| Registration | LoginView register mode | role and form state | Login modal/view | User-entered values plus generated defaults | Builds `AuthUser`; fan receives client-defined 500 MT | None | App treats new object as authenticated | SIMULATED CLIENT FUNCTIONALITY |
| Recovery | LoginView forgot mode | email/phone form state | Login modal/view | User input | Shows timed feedback only | None | Returns to auth UI | PURE UI |
| Fan navigation | Header/BottomNav | `currentTab` string | None | Component props | Replaces conditional body | None/URL unchanged | Selected tab | REAL CLIENT FUNCTIONALITY |
| Role/account switching | Header role menu/demo login | `userRole`, `currentUser`, `currentTab` | Login modal | Hard-coded roles/accounts | Any browser user can select admin/creator role | None | Admin/studio/feed | SIMULATED CLIENT FUNCTIONALITY; MUST_MOVE_SERVER_SIDE |
| Creator selection | Feed/Explore | `selectedCreatorId`, `currentTab='profile'` | Explore preview optional | creators fixture | Selects existing creator ID | None | Creator profile | REAL CLIENT FUNCTIONALITY |
| Follow | Creator profile | creator `isFollowing` | None | creators state | Toggles boolean | None | Same profile and toast | SIMULATED CLIENT FUNCTIONALITY |
| Subscribe | Profile/feed/explore | `subscribingCreator` | SubscriptionModal, PaymentPromptModal | creator prices, wallet balance | Simulated payment; sets `isSubscribed`; unlocks subscriber posts; appends transaction/notification | None | Same view with unlocked state | SIMULATED CLIENT FUNCTIONALITY |
| PPV post unlock | PostCard/Explore | `paymentPrompt` closure | PaymentPromptModal | post state | Timer success flips `post.isUnlocked`; appends transaction | None | Content revealed | SIMULATED CLIENT FUNCTIONALITY |
| Tip | Post/profile/live/message | `tippingCreator`, payment prompt | TipModal, PaymentPromptModal | creator/post state | Timer success appends transaction and increases post tip totals | None | Prior view and toast | SIMULATED CLIENT FUNCTIONALITY |
| Wallet deposit | Wallet fan mode | local deposit form, payment prompt | Deposit and PaymentPrompt modals | balance/transaction state | Timer success increases balance and appends transaction | None | Wallet with new local balance | SIMULATED CLIENT FUNCTIONALITY |
| Wallet payout | Wallet/Studio creator mode | payout form | Payout modal | transactions state | Adds pending payout; does not reserve/decrement balance | None | Wallet/Studio and toast | SIMULATED CLIENT FUNCTIONALITY; financial inconsistency |
| Wallet filtering/export | Wallet | 10 filter/sort/date states | transaction detail modal | transaction fixtures | useMemo filters/sorts; export shows feedback | None | Same wallet | REAL CLIENT FUNCTIONALITY over mock data |
| Message send | Messages | active conversation and input | None | conversation fixtures | Appends outbound message, updates preview/time | None | Active thread | SIMULATED CLIENT FUNCTIONALITY |
| Message PPV | Locked media message | payment prompt | PaymentPromptModal | conversation state | Flips message `isUnlocked` without durable entitlement/transaction | None | Media revealed | SIMULATED CLIENT FUNCTIONALITY |
| Notification read | Notifications | local filter | None | notification fixtures | Mark-all flips `read`; target post only switches to feed | None | Notifications/feed | SIMULATED CLIENT FUNCTIONALITY |
| Creator onboarding | Register as creator | LoginView fields and `selectedRole` | Login modal/view | User input | Creates unverified creator-like AuthUser; does not create CreatorProfile | None | Studio selects fallback creator `c1` | SIMULATED CLIENT FUNCTIONALITY; BROKEN identity mapping |
| KYC submission | Header/Feed creator CTA | `showKycModal` and 15 form states | KycModal | Pre-filled sensitive values | Fake uploads start true; App accepts `any`, forces confirmations true, creates pending request | None | Prior view and toast | SIMULATED CLIENT FUNCTIONALITY |
| Create post | Header/feed/studio | `showCreateModal`; composer state | CreatePostModal | hard-coded sample media | Prepends image post; sets tab to feed | None | Feed | SIMULATED CLIENT FUNCTIONALITY |
| Creator dashboard | Creator login/role switch | `currentTab='studio'`, internal tab | Studio payout modal | creator/posts/reviews and analytics fixture | Local price/payout actions | None | Selected studio tab | SIMULATED CLIENT FUNCTIONALITY |
| Admin report handling | Admin reports tab | `adminTab` | None | report fixtures | Keep/remove changes local status | None | Same tab and toast | SIMULATED CLIENT FUNCTIONALITY |
| Admin KYC handling | Admin KYC tab | `adminTab` | None | KYC fixtures | Approve/reject changes local status | None | Same tab and toast | SIMULATED CLIENT FUNCTIONALITY |
| Live room | Explore/profile | `activeLiveSession` | LiveRoomModal | live fixture | Local chat, viewer/hearts and rating state | None | Close returns to prior view | PURE UI plus simulated local interactions |
| Review submission | Profile/live | `ratingModalCreator`, local review form | RateCreatorModal | creator/live/review state | Prepends review and recalculates aggregates in browser | None | Prior view and toast/confetti | SIMULATED CLIENT FUNCTIONALITY |
| Logout | Header role/user/direct controls | `currentUser=null`, `isLandingPage=true` | Confirmation component is unused | Current user state | Clears only current user; leaves other domain state and role in memory | Age flag persists | Landing page | REAL CLIENT FUNCTIONALITY with incomplete session semantics |
| Account switching | Header menu | opens login modal | LoginView | demo accounts | Replaces user/role/balance | None | Role-specific view | SIMULATED CLIENT FUNCTIONALITY |

## Browser behavior limitations

- URL is always the same document URL; state is not reflected in path or query parameters.
- Refresh returns to a pre-authenticated fan/feed state and reloads all fixtures.
- Back/forward cannot traverse screens, filters, selected creators, conversations or modals.
- Sharing `window.location.href` from PostCard shares the app root, not the post.
- No route-level authorization exists; selecting `admin` or `studio` is a local state mutation.
- Modal state is not restorable or linkable.
- `creator_studio` from Header is an unhandled tab value and produces a blank body.

## Navigation migration constraints

Preserve existing screen names and modal workflows when introducing routes later. Route work must not be used to authorize data; server authorization remains mandatory for admin, KYC, financial and creator operations.
