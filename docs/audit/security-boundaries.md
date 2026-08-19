# Security and trust-boundary audit

## Boundary model

The current frontend is a prototype and therefore demonstrates workflows rather than enforcing them. Production requires four explicit trust zones: untrusted browser/mobile clients; authenticated application APIs; restricted worker/provider integrations; and protected data stores/object storage. Authorization and financial decisions occur only in APIs or transactional workers. The frontend may request an action and render the result, but must never manufacture authority.

Classifications:

- **PROTOTYPE_ACCEPTABLE**: acceptable only as clearly marked fixture behavior in a non-production demo.
- **MUST_MOVE_SERVER_SIDE**: the UI may remain, but the authoritative decision and mutation must move behind authenticated APIs.
- **MUST_REMOVE_BEFORE_PRODUCTION**: dangerous demo behavior or sensitive fixture data must not ship in a production build.

## Findings matrix

| ID | Area | Current behavior | Classification | Production boundary |
|---|---|---|---|---|
| SEC-01 | Demo accounts | Hard-coded fan, creator, and admin identities are selectable in the login UI. | MUST_REMOVE_BEFORE_PRODUCTION | Keep fixtures in a separately built demo environment with no production credentials or data connectivity. |
| SEC-02 | Password login | Email login ignores password validity and unmatched users default to fan access. | MUST_REMOVE_BEFORE_PRODUCTION | Authenticate against a password/identity provider, return a server session, and fail closed. |
| SEC-03 | Phone verification | OTP is prefilled/timer-driven and any submitted code is accepted. | MUST_REMOVE_BEFORE_PRODUCTION | Generate, hash/store, expire, throttle, and verify OTP server-side through an approved provider. |
| SEC-04 | Registration roles | Client registration can construct `AuthUser` and select creator/fan role. | MUST_MOVE_SERVER_SIDE | Server creates the principal and permits role transitions only through policy-controlled workflows. |
| SEC-05 | Admin access | Admin UI visibility depends on client role state. | MUST_MOVE_SERVER_SIDE | Every admin read/write requires server RBAC/ABAC, recent authentication for sensitive actions, and audit logging. |
| SEC-06 | Age gate | Confirmation is a local-storage flag; rejection redirects to Google. | PROTOTYPE_ACCEPTABLE | Define jurisdictional policy, server account eligibility, auditable consent where required, and a neutral exit path. |
| SEC-07 | Session/logout | Authentication exists only in React memory; logout clears local state. | MUST_MOVE_SERVER_SIDE | Use secure, revocable sessions with expiry, CSRF strategy, device tracking, rotation, and server logout/revocation. |
| SEC-08 | Creator verification | Verification/KYC state is represented and mutated locally. | MUST_MOVE_SERVER_SIDE | Restrict changes to KYC/provider/admin services with immutable decision history. |
| SEC-09 | KYC fixture data | The KYC form is prefilled with realistic sensitive personal data and uploads start as complete booleans. | MUST_REMOVE_BEFORE_PRODUCTION | Remove sensitive fixtures, use synthetic non-personal data in demos, and require actual restricted uploads. |
| SEC-10 | KYC consent | Submission handler forces consent to true and accepts an `any` payload. | MUST_REMOVE_BEFORE_PRODUCTION | Validate a versioned consent record server-side with actor, text/version, time, and purpose. |
| SEC-11 | KYC documents | Document URL fields and upload completion are client-modeled. | MUST_MOVE_SERVER_SIDE | Store encrypted restricted objects, scan them, issue narrowly scoped upload intents, and never expose stable raw URLs. |
| SEC-12 | Wallet balance | Client initializes and increments balance directly. | MUST_MOVE_SERVER_SIDE | Derive available/pending balance from an immutable double-entry ledger and reconciled provider events. |
| SEC-13 | Deposits | UI success directly increases balance after a simulated callback. | MUST_MOVE_SERVER_SIDE | Credit only after verified, idempotent provider webhook settlement. |
| SEC-14 | Payouts | UI appends a pending payout without reserving/debiting funds or validating destination. | MUST_MOVE_SERVER_SIDE | Check KYC/risk/limits, reserve funds transactionally, execute asynchronously, and reconcile final state. |
| SEC-15 | Tips | Client appends a transaction and increases post totals. | MUST_MOVE_SERVER_SIDE | Price/recipient validation, payment, ledger posting, aggregate update, and idempotency are server transactions. |
| SEC-16 | Subscriptions | Client toggles subscription and unlocks subscriber posts. | MUST_MOVE_SERVER_SIDE | Server creates billing contract and entitlement from confirmed payment/provider lifecycle. |
| SEC-17 | PPV posts | Local `isUnlocked` controls access after a simulated PIN/payment callback. | MUST_MOVE_SERVER_SIDE | Server verifies purchase, creates entitlement, and authorizes every protected media request. |
| SEC-18 | PPV messages | Message unlock is a local boolean and does not create a financial transaction. | MUST_MOVE_SERVER_SIDE | Use the same price, ledger, idempotency, and entitlement service as post PPV. |
| SEC-19 | Payment PIN | Any nonempty PIN succeeds after timers and confetti. | MUST_REMOVE_BEFORE_PRODUCTION | Remove simulated credential collection; use provider-approved confirmation and step-up authentication. |
| SEC-20 | Pricing | Prices and amounts arrive from client-visible objects/forms. | MUST_MOVE_SERVER_SIDE | Resolve immutable offer/version server-side and calculate currency, fees, tax, and total there. |
| SEC-21 | Direct media URLs | Paid and private media use public Unsplash URLs already present in browser data. | MUST_MOVE_SERVER_SIDE | Store private originals, issue short-lived authorized renditions after entitlement checks, and prevent URL enumeration. |
| SEC-22 | Post/report mutation | Client mutates likes, saves, comments, reports, and report decisions without authentication or concurrency controls. | MUST_MOVE_SERVER_SIDE | Authorize each resource action, validate input, rate limit, version conflicts, and record moderation events. |
| SEC-23 | Reporting bug | “Report post” resolves/keeps using a post ID rather than creating a report, then shows success. | MUST_REMOVE_BEFORE_PRODUCTION | Create an authenticated report resource and show success only after durable acceptance. |
| SEC-24 | Messaging | Membership, sender identity, message order, and attachment authority are client state. | MUST_MOVE_SERVER_SIDE | Authorize participants per conversation, assign server sequence/timestamps, scan attachments, and rate limit. |
| SEC-25 | Notifications | Client can append notification records. | MUST_MOVE_SERVER_SIDE | Emit notifications from durable domain events with recipient authorization and deduplication. |
| SEC-26 | Live sessions | Stream state, viewer access, and counts are client-presented. | MUST_MOVE_SERVER_SIDE | Issue separate short-lived publish/playback credentials and enforce paid/private access server-side. |
| SEC-27 | Local storage | Age confirmation is read as trusted local state. | PROTOTYPE_ACCEPTABLE | Treat client storage only as preference/cache; never as authorization, consent, identity, or financial proof. |
| SEC-28 | Dependency surface | Browser package declares apparently unused server/AI/motion dependencies. | PROTOTYPE_ACCEPTABLE | Verify removal, generate SBOM, scan lockfile/build, and keep server-only packages outside the browser artifact. |

Classification count: **28 findings — PROTOTYPE_ACCEPTABLE: 3, MUST_MOVE_SERVER_SIDE: 18, MUST_REMOVE_BEFORE_PRODUCTION: 7.**

## Server enforcement requirements

### Identity and authorization

Use secure session cookies or a carefully designed token model; protect state-changing cookie requests against CSRF; rotate/revoke sessions; throttle authentication; record device/session activity; and require step-up authentication for payout, KYC, and high-impact admin actions. Roles are server claims, but resource authorization must also check ownership, conversation membership, creator/customer relationship, entitlement, region, account state, and moderation restrictions.

### Financial integrity

Use integer minor units plus ISO currency, immutable double-entry ledger entries, idempotency keys, transaction isolation, provider event verification, reconciliation jobs, and an explicit available/pending/reserved balance model. Webhook receipt must be authenticated and persisted before asynchronous processing. Never infer settlement from a browser return URL or success animation.

### Content and media

Treat filenames, MIME types, extensions, dimensions, and metadata as untrusted. Upload through scoped intents, quarantine objects, scan malware, normalize metadata, transcode images/video, generate renditions, and publish only processed assets. Paid/private playback requires entitlement authorization and short-lived delivery credentials; the public metadata response must not contain a durable origin key.

### KYC and privacy

Minimize identity collection, separate KYC records from general profiles, encrypt in transit and at rest, restrict staff views by purpose, log access, redact admin lists, define retention/deletion/legal-hold rules, and use provider tokens instead of duplicating raw documents where possible. Never include KYC fixtures or response payloads in analytics, logs, crash reports, support tooling, or client caches.

### Administration and moderation

High-impact decisions require a durable case, allowed state transition, reason, actor, timestamp, and immutable audit event. Approval/rejection and sanctions should use version checks to prevent stale overwrites. Separate queue access from decision permission and protect exports/bulk actions independently.

## Required security verification

Before production, complete threat modeling, SAST/dependency/secret/container scans, API authorization tests for cross-account access, session and CSRF tests, rate-limit/abuse tests, upload and media-access tests, webhook signature/replay tests, ledger invariant and reconciliation tests, KYC privacy review, audit-log integrity tests, backup/restore exercises, incident runbooks, and an independent penetration test focused on IDOR, paid-media bypass, admin escalation, and financial manipulation.
