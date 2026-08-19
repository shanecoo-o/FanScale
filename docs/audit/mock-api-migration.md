# Mock-data and API migration audit

## Current state

`src/data/mockData.ts` is a 1,107-line in-memory database, fixture factory, and demo-state definition. `App.tsx` imports ten mock collections directly and owns most mutations. Categories and creator analytics are consumed by feature components. Refreshing the browser discards nearly every mutation; the age-gate flag is the notable local-storage exception. The migration should first place a typed repository/API boundary in front of the mocks, then replace repositories domain by domain with server calls.

## Dataset migration matrix

| Dataset | Current consumers | Current mutations | Persistence | Future domain/resource | Server-authoritative fields | Priority |
|---|---|---|---|---|---|---|
| `INITIAL_CREATORS` / `MOCK_CREATORS` | App, Feed, Explore, CreatorProfile, subscription/tip/message flows | Subscribe state, follower-like presentation, balances inferred through related actions | Memory | creators, creator profiles, follows, subscriptions | Identity link, verification, subscription state, pricing, follower counts, earnings-derived metrics | P0 |
| `STORIES` | App, StoriesReel, StoryViewer | Viewer progress only; creation is not persisted | Memory | stories, story media, story views | Publication window, visibility, media access, view receipt, moderation state | P1 |
| `POSTS` | App, Feed, PostCard, CreatorProfile, create/report/payment flows | Like, save, comment, PPV unlock, tip aggregate, prepend new post | Memory | posts, post media, comments, reactions, saves, entitlements | Author, visibility, price, publication state, counts, moderation, media access, entitlement | P0 |
| `CONVERSATIONS` | App, Messages | Append text/media messages; local PPV message unlock | Memory | conversations, participants, messages, message media, receipts, entitlements | Membership, sender, sequence, delivery/read state, price, access grant, moderation state | P1 |
| `NOTIFICATIONS` | App, Notifications, subscription flow | Subscription notification appended; read behavior is local/presentational | Memory | notifications, notification preferences | Recipient, type, actor/resource references, read state, delivery state, deduplication | P1 |
| `TRANSACTIONS` / `WALLET_TRANSACTIONS` | App, Wallet, payment/subscription/tip/payout flows | Append deposit, tip, subscription, PPV, pending payout entries | Memory | ledger accounts, ledger entries, payments, payouts, wallet projections | Amount, currency, direction, status, provider reference, idempotency key, balance impact, timestamps | P0 |
| `ADMIN_REPORTS` | App, AdminDashboard, report UI | Resolve/keep updates; post reporting incorrectly targets a post ID rather than creating a report | Memory | reports, moderation cases, decisions, audit log | Reporter/subject, evidence, status, assignee, decision, actor, timestamps | P0 |
| `KYC_REQUESTS` | App, AdminDashboard, KycVerificationModal | Submit/approve/reject state changes; submission coerces consent | Memory | KYC cases, identity records, document assets, review decisions | Applicant, consent evidence, provider result, risk flags, document references, reviewer decision | P0 |
| `REVIEWS` | CreatorProfile, RateCreatorModal | Rating submission is simulated locally | Memory | creator reviews, rating aggregates | Reviewer eligibility, subject, rating, body, moderation, aggregate | P2 |
| `LIVE_SESSIONS` | App, creator/profile/live surfaces | Join/leave and chat-like interaction are presentation state | Memory | live sessions, attendance, live chat, live entitlements | Host, status, schedule, stream token, viewer count, access policy, moderation | P2 |
| `CATEGORIES` | Explore | None | Static source | taxonomy/categories or versioned frontend config | Slug, label, ordering, visibility, localization | P2 |
| `CREATOR_ANALYTICS_DATA` | CreatorStudio | None; charts display fixture values | Static source | analytics aggregates/time series | Metric definitions, aggregation window, currency, cohort filters, privacy threshold | P1 |

## Domain-type classification

Classification meanings:

- **API contract**: validated request/response DTO owned at the client/server boundary.
- **UI model**: presentation-specific derived shape; never sent as authority.
- **Server-owned**: persistence/domain entity or sensitive computed state; the client receives a projection only.
- **Shared primitive**: constrained enum/value object that may be generated from an API specification.

| Current type | Future classification | Migration notes |
|---|---|---|
| `UserRole` | Shared primitive | Server claims and authorization remain authoritative; the client uses the value only for display and route hints. |
| `AuthUser` | API contract plus UI session model | Split public user/session projection from authentication credentials and server claims. Remove client-selected authority. |
| `PaymentProvider` | Shared primitive | Provider availability must come from server configuration by market/currency. |
| `CreatorProfile` | API contract plus UI model | Split editable profile fields, public projection, subscription offer, statistics, and private dashboard metrics. |
| `CreatorReview` | API contract | Server determines reviewer eligibility, author identity, moderation, and aggregate impact. |
| `LiveSession` | API contract plus UI model | Separate public metadata from short-lived playback/publish credentials and attendance state. |
| `PostVisibility` | Shared primitive | Validate transitions server-side and map each value to an entitlement policy. |
| `Comment` | API contract | Server owns author, timestamps, moderation, and reaction/count projections. |
| `Post` | API contract plus UI model | Separate post metadata, media renditions, viewer-specific entitlements, and derived engagement state. |
| `Story` | API contract plus UI model | Add publication expiry, viewer-specific view state, and access-controlled media references. |
| `NotificationItem` | API contract plus UI model | Prefer typed resource references over copy-only payloads; keep rendered copy presentation-side where practical. |
| `ChatMessage` | API contract plus UI model | Add server sequence, delivery/read receipts, membership authorization, and attachment/entitlement references. |
| `Conversation` | API contract plus UI model | Split participant/member state, latest-message projection, unread count, and paginated messages. |
| `WalletTransaction` | UI projection of server-owned ledger | Never use a client-created transaction as financial truth; project immutable ledger entries and provider operations. |
| `AdminReport` | API contract plus server-owned case | Add evidence, assignment, decision reason, actor, version, and immutable audit entries. |
| `KycRequest` | Restricted API contract plus server-owned record | Do not return raw document URLs or unnecessary identity data to general admin/front-end contexts. |

## Client API boundary

Introduce domain clients behind interfaces while they still return mock-backed promises:

```text
authClient       session, login, registration, logout, verification
creatorClient    public profiles, discovery, follows, offers, reviews
contentClient    feed, posts, comments, reactions, saves, stories
mediaClient      upload intent, processing state, authorized renditions
commerceClient   subscriptions, PPV purchases, tips, entitlements
walletClient     balance projection, ledger history, deposits, payouts
messageClient    conversations, messages, receipts, attachment access
notificationClient notifications, read state, preferences
kycClient        case status, consent, upload intents, submission
adminClient      moderation queues, KYC review, decisions, audit events
analyticsClient  creator metrics and time series
liveClient       sessions, attendance, stream/playback authorization
```

Each method must return a discriminated result or throw a normalized domain error with request ID, safe user message, retryability, and field errors. The UI must represent idle, pending, success, empty, stale, partial, offline, authorization failure, validation failure, conflict, rate limit, and server failure states. Query caching can be introduced after routes and stable resource keys exist; optimistic updates should be limited to reversible social actions, never money, entitlements, KYC, or moderation decisions.

## Fields the frontend must never be trusted to set

- User ID, role, verification flags, account status, session/device claims, or age eligibility.
- Creator ownership, KYC approval, risk score, reviewer identity, moderation state, or audit metadata.
- Wallet balance, transaction status, amount charged/settled, exchange rate, fees, payout availability, or provider references.
- Subscription/PPV entitlement, price charged, discount eligibility, renewal status, or access expiry.
- Post/message author, authoritative timestamps, engagement aggregates, recipient membership, or delivery/read receipts for other users.
- Report resolution, admin identity, evidence retention, sanctions, or appeal state.
- Media ownership, storage key, processing result, access policy, signed URL expiry, or watermark provenance.
- Live host authority, viewer count, stream keys, playback tokens, or paid attendance state.

## Migration sequence

1. Add runtime schema validation and domain errors; preserve current UI behavior behind mock repositories.
2. Replace App-owned authentication and role state with the auth/session client.
3. Move creator discovery and feed reads to paginated clients.
4. Move post/social writes and invalidate canonical queries.
5. Implement media upload/access before migrating paid content.
6. Implement entitlements, ledger, payment adapters, subscriptions, PPV, tips, and payouts as one security-dependent program.
7. Migrate messaging and notifications with server sequence and receipts.
8. Migrate KYC, reports, moderation, and admin last, after RBAC, restricted media, and audit logging exist.

