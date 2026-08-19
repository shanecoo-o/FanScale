# Proposed API resource map

## Conventions

This document defines resource boundaries and operations, not endpoint paths or a database schema. Commands that move money, grant access, approve identity, or moderate users are modeled as explicit operations rather than generic client-supplied state updates. Collection reads require pagination, stable ordering, filters, and opaque cursors. Every response carries a request/correlation ID; writes accept idempotency keys where retries can duplicate effects.

| Resource/domain | Current consumers | Core operations | Server-authoritative fields/decisions | Authentication and authorization | Sensitive data | Priority |
|---|---|---|---|---|---|---|
| Auth/session | Login, App, Header, Logout | register, login, OTP challenge/verify, refresh/rotate, logout, list/revoke devices, recover account | Principal, credential result, session expiry, assurance level, account state | Public only for bounded auth entry; session owner for device operations; aggressive throttling | Credentials, OTP metadata, session/device signals | P0 |
| Users/accounts | Header, profile, admin | read/update self, preferences, account closure/export, restricted admin status actions | User ID, role grants, account status, verification links | Self; narrowly scoped support/admin actions with audit | Email, phone, locale, privacy settings | P0 |
| Creator profiles/offers | Explore, Feed, CreatorProfile, CreatorStudio | discover, read public profile, update own profile, configure subscription/PPV offers | Ownership, verification, publishability, aggregate counts, offer versions | Public reads where allowed; creator owns edits; admin policy actions | Private contact, payout/KYC linkage | P0 |
| Creator onboarding/KYC | Login, KycVerificationModal, CreatorStudio, Admin | create/resume case, upload intents, consent, submit, read status, request information, approve/reject | Case state, provider result, risk flags, consent evidence, reviewer decision | Applicant sees minimal own projection; restricted KYC reviewers; step-up auth | Identity data, documents, biometrics, risk signals | P0 |
| Social graph | Feed, Explore, CreatorProfile | follow/unfollow, list follower/following projections, mute/block | Relationship state and counts | Authenticated actor; privacy/block rules | Relationship graph and block state | P1 |
| Feed | Feed, App | list personalized/following/discovery feed, paginate, refresh | Eligibility, ranking result/version, moderation and entitlement projection | Authenticated viewer; account/region/content policy | Ranking signals | P0 |
| Posts/comments/reactions/saves | Feed, PostCard, CreatorProfile, CreatePost | draft/create/edit/publish/archive post; list/read; comment; react; save; report | Author, timestamps, visibility, price offer, counts, moderation, version | Author for edits; viewer policy for reads/actions; moderators for interventions | Drafts, moderation evidence, viewer activity | P0 |
| Stories/views | StoriesReel, StoryViewer | publish/read/list, record view, delete/archive | Publication/expiry, eligibility, ordered media, view receipt | Author writes; authorized audience reads | View history | P1 |
| Media/assets | All image/video/upload surfaces | create upload intent, complete, inspect status, attach, request rendition/access grant, delete | Ownership, scan/processing result, origin, access policy, signed delivery | Purpose/resource authorization; special KYC boundary | Originals, KYC documents, signed URLs, scan output | P0 |
| Entitlements | PostCard, CreatorProfile, Messages, Live | resolve viewer access, list own grants, revoke on policy event | Grant source, resource scope, start/expiry, revocation, access decision | Viewer sees own grants; commerce/media services decide | Purchase/access history | P0 |
| Subscriptions | CreatorProfile, subscription modal, Wallet | quote/start, confirm status, cancel, resume, list own/creator projection, provider lifecycle | Offer/version, charged amount, state, renewal, entitlement | Customer owns purchase; creator sees bounded aggregate/customer relation; webhooks trusted separately | Billing relationship, provider references | P0 |
| PPV purchases | PostCard, Messages, Live, Wallet | quote, purchase, status, list own purchases | Offer/version, amount, settlement, entitlement, refund/chargeback | Buyer; resource owner receives bounded sale projection | Purchase history, payment references | P0 |
| Tips | PostCard, tip modal, Wallet | quote/send, status, list own/received projection | Recipient eligibility, amount, fees, settlement, ledger entries | Authenticated sender; creator sees received projection | Financial activity | P0 |
| Ledger/wallet | Wallet, CreatorStudio, admin finance operations | read balance projection, paginate entries, export statement, internal post/reverse | Immutable entries, currency, available/pending/reserved balances, references | Account owner; finance operations are service-only; restricted support view | Full financial history | P0 |
| Payment adapters | Payment modal, wallet deposit, commerce services | create intent, confirm/redirect state, ingest webhook, refund, reconcile | Provider state, signature result, amount, fees, settlement, idempotency | Browser gets safe intent projection; webhooks authenticated; finance service authority | Provider customer/payment tokens, fraud signals | P0 |
| Payouts/destinations | Wallet, CreatorStudio, admin/risk | create/verify destination, quote/request/cancel where possible, status, reconcile | Eligibility, destination verification, limits, reserve, provider state | KYC-approved owner with step-up; restricted finance/risk review | Bank/mobile-money details, identity linkage | P0 |
| Conversations/messages | Messages, creator/fan entry points | create/get conversation, paginate messages, send, attach, mark read, block/report | Membership, sender, server sequence/time, delivery/read, moderation, entitlement | Participant membership on every read/write | Private communications and attachments | P1 |
| Notifications/preferences | Notifications, Header | paginate, mark read, mark all read, configure channels/preferences | Recipient, event reference, delivery/read state, deduplication | Recipient only; event-producing services write | Activity relationships, delivery addresses | P1 |
| Reports/moderation cases | PostCard, profile/message/live reports, Admin | create report, read own status projection, queue/search, assign, decide, appeal | Evidence, priority, status transitions, assignee, decision, sanctions | Authenticated reporter; restricted moderators by scope; immutable audit | Reports, evidence, reporter identity, private content | P0 |
| Admin/audit | AdminDashboard | queue summaries, safe account/content views, explicit high-impact commands, audit search | Permission, actor, reason, before/after, timestamp, correlation | RBAC/ABAC, step-up, separation of duties, no generic superuser client | Cross-user/KYC/financial/moderation data | P0 |
| Reviews/ratings | CreatorProfile, RateCreatorModal | list, create/update own, report, aggregate | Purchase/interaction eligibility, author, moderation, aggregate | Eligible authenticated reviewer; public reads by policy | Reviewer history | P2 |
| Live sessions | CreatorProfile, CreatorStudio, Live modal | schedule/start/end, join/leave, access grant, chat/moderate, status | Host, lifecycle, stream/playback credentials, access, viewer count | Host publish rights; authorized viewer; moderator controls | Stream keys, viewer/attendance data | P2 |
| Creator analytics | CreatorStudio | metric catalog, summary, time series, export | Aggregation definitions, windows, currency, privacy threshold | Creator owns metrics; restricted support/admin; no cross-creator leakage | Earnings, audience and conversion data | P1 |
| Taxonomy/configuration | Explore, payment/KYC UI | list categories, regions, currencies, provider availability, policy copy/version | Version, ordering, availability, effective dates | Public safe projection; restricted configuration writes | Internal rollout/risk rules remain hidden | P2 |

## Cross-resource rules

1. Resource IDs are opaque; knowing an ID never grants access.
2. Writes include expected resource version where concurrent review/edit can overwrite another decision.
3. Money uses integer minor units and ISO currency; displayed floats are never submitted as authority.
4. Price-bearing operations reference a server offer/version and return a server quote before confirmation.
5. Media responses carry asset metadata and access handles, never durable private origin URLs.
6. Administrative decisions are verbs with allowed transitions, reasons, and audit events, not unrestricted patches.
7. List endpoints return viewer-specific projections and do not expose private entity fields by default.
8. Bulk/export endpoints have distinct permissions, limits, asynchronous execution, expiry, and audit trails.
9. Deletion semantics distinguish user-visible removal, reversible moderation quarantine, legal hold, and final erasure.
10. OpenAPI-generated transport types must be mapped into domain/UI models so the frontend cannot treat a response shape as local mutable authority.

## Event and asynchronous boundaries

Durable events are required for payment settlement/failure/refund/chargeback, subscription lifecycle, entitlement grant/revoke, ledger posting, payout lifecycle, media processing, KYC provider results, moderation decisions, notification delivery, and live-session lifecycle. Consumers must be idempotent, events versioned, personally sensitive payloads minimized, and failed processing observable and replayable. The transactional outbox pattern or an equivalent guarantee should connect domain commits to event publication.

