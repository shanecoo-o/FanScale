# Dependency-ordered execution roadmap

## Operating principles

This roadmap preserves the existing visual identity while replacing prototype authority with production boundaries. A phase may overlap with its immediate predecessor after contracts stabilize, but its definition of done cannot be accepted before listed dependencies. Every phase includes threat modeling, accessibility, observability, tests, migration/rollback, and documentation appropriate to its risk rather than postponing quality to the end.

## Phase plan

| Phase | Objective | Dependencies | Primary files/modules to create or change | Definition of done | Principal risk |
|---:|---|---|---|---|---|
| 1 | Responsive and accessibility foundation | Audit approval | Frontend tokens/theme; `AppShell`; layout, button, field, focus, toast, dialog/sheet primitives; component stories/tests | Shared primitives pass keyboard, focus, reduced-motion, safe-area, 320–1440 visual checks; no feature behavior changes | A broad visual rewrite can obscure functional regressions |
| 2 | Typed navigation architecture | Phase 1 | Route definitions; public/authenticated/fan/creator/admin layouts; route guards; error/not-found routes; migrated Header/BottomNav | URLs, refresh, back/forward, deep links, titles, `aria-current`, and role-aware navigation work; studio mismatch is eliminated | Client guards may be mistaken for server authorization |
| 3 | Frontend domain/API abstraction | Phase 2 | Domain clients, transport adapters, runtime schemas, query keys, normalized errors, mock repositories, async state primitives | All feature reads/writes call interfaces; mocks remain deterministic behind adapters; loading/error/empty/conflict states are testable | Over-generalized client architecture before APIs stabilize |
| 4 | Spring Boot service foundation | Approved platform decisions | Backend modules, OpenAPI, configuration validation, health/readiness, error envelope, correlation, local compose/dev setup | Service starts reproducibly; contracts generated; secrets excluded; health and request correlation verified | Premature microservice fragmentation |
| 5 | PostgreSQL and migrations | Phase 4 | Database module, migration tool, core identity/audit tables, transaction helpers, local/test database, backup/restore scripts | Versioned forward migrations run in CI/staging; constraints and transaction tests pass; restore drill is documented and executed | Irreversible migrations or missing tenant/ownership constraints |
| 6 | Authentication and verification | Phases 4–5 | Auth endpoints/services; password/identity provider; OTP adapter; registration/recovery; login UI migration | Real credentials/OTP fail closed; throttling, enumeration resistance, verification and recovery tests pass; demo identities excluded from production | Account takeover and provider abuse |
| 7 | Sessions and device security | Phase 6 | Session store, secure cookies/token rotation, CSRF controls, device/revocation endpoints, logout UI | Expiry, rotation, revocation, fixation, CSRF, concurrent device, and logout tests pass; step-up hook exists | Session leakage or inconsistent browser/mobile strategy |
| 8 | RBAC/ABAC and audit foundation | Phases 5–7 | Policy layer, ownership/membership checks, permission catalog, privileged audit events, authorization test harness | APIs deny by default; cross-account matrix and admin privilege tests pass; privileged actions capture immutable actor/reason/context | IDOR or broad admin privileges |
| 9 | Creator profiles, onboarding, and KYC | Phases 1–3, 8; media design | Creator/profile APIs; onboarding state machine; restricted KYC module/provider; consent; KYC full-page route/admin projection | Resumable onboarding, synthetic test uploads, provider result, redacted reviewer flow, retention/access logs and decision audit pass | Sensitive-data exposure and jurisdictional noncompliance |
| 10 | Social graph and discovery | Phases 3, 5, 8–9 | Follow/mute/block resources; creator discovery; Explore/Profile adapters; pagination | Relationship operations are authorized/idempotent; counts and block/privacy behavior are consistent; discovery paginates | Graph privacy leakage and count contention |
| 11 | Posts, feed, and social interactions | Phases 3, 5, 8, 10; media attachments interface | Post/draft/comment/reaction/save resources; feed queries; CreatePost/Feed/PostCard migration | Authorized durable CRUD, stable cursor pagination, moderation states, concurrency/idempotency, empty/error/offline UX and tests pass | Ranking scope creep and hot aggregate writes |
| 12 | Secure media pipeline | Phases 4–5, 8; storage/CDN/workers | Media resources, quarantine buckets, upload intents, scanner/transcoder, rendition delivery, frontend Media/Video primitives | Type/size spoofing and malware cases fail safely; processing is observable/idempotent; responsive renditions work; private origins are unreachable | Malicious upload, data leakage, high processing/egress cost |
| 13 | Entitlement service | Phases 5, 8, 11–12 | Offer/access policy model, grants/revocations, authorization endpoint/library, locked preview UI | Subscriber/PPV/message/live policies have deny-by-default tests; grants expire/revoke; media access checks use the service | Split-brain access decisions and stale grants |
| 14 | Subscription commerce | Phases 13, 16–18 | Versioned offers, subscription lifecycle, provider event consumers, subscription UI | Start/renew/cancel/fail/refund/chargeback transitions are idempotent; entitlements match settled state | Provider lifecycle races |
| 15 | PPV and tips | Phases 13, 16–18 | Quote/purchase/tip commands, PostCard/message UI, receipts and aggregate projections | Server price quote, atomic ledger/entitlement, retry/duplicate/refund/chargeback tests pass; client cannot forge price/unlock | Duplicate charge or access without settlement |
| 16 | Financial ledger | Phases 5, 8 | Account/entry/posting engine, immutable audit references, invariant tests, projection rebuild tools | Every posting balances by currency; mutation/reversal rules and concurrency tests pass; projection can be rebuilt | Financial corruption from mutable or imbalanced entries |
| 17 | Wallet projections | Phase 16 | Balance projection, paginated statements, currency/date formatting, Wallet UI adapter | Available/pending/reserved values derive only from ledger; pagination/export and reconciliation discrepancy views work | Misleading balance or slow projections |
| 18 | Payment-provider adapters | Phases 4–5, 7–8, 16 | Provider interface, intent flow, signed webhook inbox, idempotent processors, reconciliation jobs, secret rotation | Sandbox end-to-end deposit/refund/failure/replay tests pass; persisted verified events reconcile with ledger | Forged/replayed webhooks and provider lock-in |
| 19 | Payouts | Phases 9, 16–18 | Destinations, eligibility/limits/risk, reservation, provider workflow, payout UI/admin exception queue | Step-up and KYC required; funds reserve atomically; success/failure/reversal reconcile; duplicate requests are safe | Loss from race, fraud, or incorrect destination |
| 20 | Messaging | Phases 3, 7–8, 12–13 | Conversation membership, messages/receipts, realtime transport, attachment flow, mobile master/detail routes | Server sequence, pagination, reconnect/offline behavior, membership/blocked-user tests, scanning and reporting pass | Private-message leakage and realtime complexity |
| 21 | Notifications | Durable events from preceding domains | Notification inbox/preferences, event consumers, delivery adapters, Header/Notifications migration | Deduplication, retries, read state, preferences and safe deep links work; sensitive copy is channel-appropriate | Notification storms and privacy leaks |
| 22 | Moderation and reports | Phases 8, 11–12, 20 | Report creation, case/evidence/state machine, sanctions/appeals, moderation queues | Report creates a durable case; permissions, stale-write prevention, evidence retention, decisions and appeals are audited | Harmful content persistence or moderator overreach |
| 23 | Admin operations | Phases 8–9, 17–19, 22 | Scoped admin layouts/queues, redacted detail views, explicit commands, audit search, step-up | Least-privilege roles and separation of duties tested; no generic entity patch; every high-impact action is attributable | Powerful consolidated access and insider risk |
| 24 | Security and privacy hardening | All implemented P0 domains | Threat models, CSP/security headers, secret/KMS rotation, rate/abuse controls, data inventory, retention/DSAR jobs, scanning pipeline | Critical findings closed; SAST/SCA/secret/authorization/upload/abuse/privacy tests pass; penetration test remediated | Late discovery may require contract redesign |
| 25 | Observability and operational controls | Begins Phase 4; completes after Phase 24 | Structured redacted logs, metrics/traces, SLOs, dashboards, alerts, audit retention, runbooks | Core journeys and provider/worker queues have actionable telemetry; alert drills trace request to domain/provider event | Sensitive telemetry or unactionable alert volume |
| 26 | Automated release test system | Begins Phase 1; completes after Phase 25 | Unit, component, contract, integration, authorization, ledger, E2E, accessibility, visual, performance, resilience suites | CI uses deterministic fixtures and ephemeral services; risk-based gates are reliable; flaky tests have ownership/budgets | False confidence or slow/flaky pipelines |
| 27 | Staging and migration rehearsal | Phases 24–26 | Production-like isolated environment, IaC, sanitized seed data, provider sandboxes, migration/restore/load scripts | Full deploy, migration, rollback, restore, reconciliation, load, accessibility and incident exercises succeed | Staging differs from production or contains real personal data |
| 28 | Production launch preparation | Phase 27 and all P0 blocker evidence | CI/CD approvals, feature flags, support/moderation/finance procedures, status/incident comms, launch checklist | Signed launch gate; zero open Critical findings; rollback/kill switches and on-call ownership active; controlled rollout metrics defined | Schedule pressure overrides safety evidence |
| 29 | React Native client | Stable production APIs and operations after Phase 28 | Shared generated transport/domain package; native navigation, secure storage/session, media upload/playback, platform accessibility | Native threat model and platform tests pass; no web-only authority is copied; API compatibility/version policy is proven | Premature sharing of UI assumptions and mobile credential/media mistakes |

## Ordering clarification for commerce phases

The table numbers reflect product workstreams, while the hard technical dependency for commerce is: **ledger (16) → wallet projection (17) and payment adapters (18) → subscriptions (14), PPV/tips (15), and payouts (19)**. Teams may scaffold subscription/PPV UI and contracts earlier behind non-production flags, but no purchase flow can meet definition of done before ledger and provider settlement are proven.

## Exact responsive implementation order

1. Correct the studio route identifier and introduce typed navigation.
2. Add semantic design tokens, focus-visible and reduced-motion policies, safe-area and dynamic-viewport utilities.
3. Implement `AppShell`, page containers, stacks/grids, buttons/fields, dialogs/sheets, toasts, and scrollable tabs with automated accessibility tests.
4. Recompose Header and BottomNav for 320, 360, 375, 390, 412, and 430 pixels.
5. Implement Messages mobile list/thread routes and keyboard-safe composer layout.
6. Migrate story, creation, payment, subscription, tip, rating, report, logout, and KYC overlays; move KYC to a full-page resumable route.
7. Recompose CreatorProfile, CreatorStudio, Wallet, AdminDashboard, and Live for phone, portrait tablet, and landscape tablet.
8. Normalize Feed/PostCard, Explore, Notifications, Landing, AgeGate, and media sizing/loading.
9. Validate 320, 360, 375, 390, 412, 430, 768, 820, 834, 1024, 1280, 1366, 1440, 1536, 1920, and 2560 widths in browsers.
10. Complete keyboard-only, screen-reader, 200%/400% zoom/reflow, reduced-motion, touch-target, contrast, software-keyboard, orientation, slow-network, and Core Web Vitals acceptance.

## Parallel work lanes

After Phases 1–5 establish contracts, three bounded lanes can proceed: frontend route/design-system migration; identity/profile/content backend; and infrastructure/observability/test foundations. Media begins once storage/security ownership is agreed. Commerce remains gated on ledger and authenticated provider events. KYC and admin share RBAC/audit primitives but should be developed with separate restricted-data review. A single architecture decision record set must govern identifiers, money, timezones, errors, pagination, idempotency, authorization, media access, events, and deletion.

## Delivery checkpoints

- **Checkpoint A — navigable prototype:** Phases 1–3; same fixture capabilities, typed routes, accessible responsive shell, mock API boundary.
- **Checkpoint B — durable identity/content:** Phases 4–13 excluding commerce completion; real sessions, authorization, profiles/KYC, social/content, secure media, entitlement checks.
- **Checkpoint C — financially coherent MVP:** Phases 16–19 plus 14–15; reconciled ledger/provider operations and server-granted commerce access.
- **Checkpoint D — operational MVP:** Phases 20–28 according to P0/P1 scope; moderation/admin/privacy/security/observability/testing and exercised launch operations.
- **Checkpoint E — native expansion:** Phase 29 only after production contracts and operational feedback stabilize.

