# Production blocker register and MVP priority audit

## Severity and priority

- **Critical**: direct account, authorization, privacy, paid-content, or financial compromise; or a fundamental production capability is absent.
- **High**: major reliability, accessibility, operational, or domain-integrity risk that can block core journeys.
- **Medium**: important quality or scale risk with a temporary bounded fallback.
- **P0**: required for a safe MVP launch. **P1**: required shortly after core safety/capability, ideally before public scale. **P2**: later differentiation. **P3**: explicitly deferred.

## Blocker matrix

| ID | Area | Finding | Severity | Current state | Required state / definition of done | Dependencies | Priority |
|---|---|---|---|---|---|---|---|
| BLK-01 | Frontend architecture | `App.tsx` is a 1,068-line router, store, mutation service, modal manager, and shell. | High | Free-form local state and direct mock imports | Typed routes, domain API clients, query/mutation state, and extracted shell/overlays with characterization tests | Design-system and routing foundations | P0 |
| BLK-02 | Navigation | No URL routing, deep links, browser history, refresh restoration, or route authorization; studio shortcut identifier is broken. | High | String tabs, including `creator_studio`/`studio` mismatch | Canonical typed route tree, guarded layouts, not-found/error routes, working back/forward and refresh | BLK-01 | P0 |
| BLK-03 | Responsive shell | Header can overflow at phone widths; fixed bottom nav lacks safe areas. | High | Component-local breakpoint utilities | Verified shell at all scoped widths, safe areas, compact navigation, no obscured content | Tokens, route model | P0 |
| BLK-04 | Accessibility | Modals lack dialog/focus lifecycle; icon buttons, live feedback, focus-visible, reduced motion, and form relationships are incomplete. | High | Fifteen duplicated fixed overlays and no shared semantics | Accessible primitives, zero critical axe issues, keyboard/screen-reader/zoom/reflow acceptance | Design-system foundation | P0 |
| BLK-05 | Async UX | Screens assume synchronous local mutations and lack standardized loading/error/offline/conflict states. | High | Timer and state callbacks | Domain error contract, retry/cancel/idempotency UX, skeleton/empty/error states, stale-data policy | API abstraction | P0 |
| BLK-06 | Authentication | Password and OTP are not verified; demo identities and creator/admin selection ship in UI. | Critical | Client simulation | Production identity integration, throttling, recovery, verification, secure session issuance, demo exclusion | Backend foundation | P0 |
| BLK-07 | Session security | No server session, revocation, device model, expiry, CSRF defense, or step-up authentication. | Critical | React memory only | Secure session lifecycle and tests for rotation, revocation, fixation, CSRF, and logout | BLK-06 | P0 |
| BLK-08 | Authorization | Roles and ownership are trusted from the client; admin and resource actions have no server checks. | Critical | Conditional rendering | Deny-by-default RBAC/ABAC on every API with cross-account/IDOR tests and audited privileged actions | Auth/session, API resources | P0 |
| BLK-09 | Database | No durable backend or PostgreSQL persistence exists. | Critical | `mockData.ts` and component state | Versioned migrations, constraints, transactions, backups, restore test, retention rules, and operational ownership | Backend foundation | P0 |
| BLK-10 | API contracts | No runtime validation, pagination, concurrency, idempotency, or normalized errors. | High | Shared frontend interfaces | Versioned OpenAPI/contracts, generated transport types, validation, error envelope, cursors, optimistic concurrency | Backend/API foundation | P0 |
| BLK-11 | Creator/KYC | KYC is simulated, prefilled with sensitive-looking data, consent is forced, and documents are not securely handled. | Critical | Local modal/booleans | Restricted resumable KYC workflow, versioned consent, provider integration, encrypted assets, reviewer controls, retention/access logs | Auth, RBAC, media | P0 |
| BLK-12 | Financial ledger | Balance and transaction records are client-mutated; no immutable double-entry ledger or reconciliation. | Critical | Numeric state and appended fixtures | Balanced immutable postings, available/pending/reserved projections, invariant tests, reconciliation and repair procedures | Database, auth | P0 |
| BLK-13 | Payment processing | Payment success is simulated by any PIN/timer; no provider intent, webhook verification, or idempotency. | Critical | Client callback | Adapter interface, verified persisted webhooks, provider intents, settlement/refund/chargeback state machine, reconciliation | Ledger, secrets infrastructure | P0 |
| BLK-14 | Subscriptions | Client toggles subscription and content unlock; no billing lifecycle. | Critical | Local flags | Versioned offers, provider lifecycle, server entitlement, cancellation/expiry/refund behavior, idempotent commands | Payments, entitlements, ledger | P0 |
| BLK-15 | PPV/tips | Client controls price/unlock and tips; message PPV does not create a transaction. | Critical | Local flags and aggregates | Server quotes, atomic purchase/tip plus ledger and entitlement, duplicate/retry/refund tests | Payments, ledger, entitlements | P0 |
| BLK-16 | Payouts | Pending payout can be created without reservation, destination verification, KYC, limits, or reconciliation. | Critical | Appended local record | Verified destination, eligibility/risk checks, transactional reserve, async provider lifecycle, reconciliation | KYC, ledger, payments | P0 |
| BLK-17 | Entitlements | No server-owned access model for subscriber, PPV, message, or live content. | Critical | `isUnlocked`/subscription booleans | Central entitlement service with expiry/revocation and authorization tests for every protected resource | Auth, commerce | P0 |
| BLK-18 | Private media | Paid/private content uses direct public URLs; upload/scan/transcode/access controls do not exist. | Critical | Unsplash URLs in payloads | Private origin, quarantine/scanning, renditions, short-lived authorized delivery, leak/IDOR tests | Media workers, entitlements | P0 |
| BLK-19 | Feed/content | Posts, comments, reactions, saves, stories, and counts are not durable or concurrency-safe. | High | In-memory arrays | Authorized paginated resources, moderation states, stable ordering, idempotent writes, count strategy | Auth, database, media | P0 |
| BLK-20 | Reporting/moderation | Report action targets the wrong identifier and no durable case/evidence/appeal/audit model exists. | Critical | False success and local queue | Report creation, case workflow, evidence retention, decision permissions/reasons, sanctions/appeal, immutable audit | RBAC, database, content | P0 |
| BLK-21 | Privacy | No data classification, consent/retention/deletion/export policy, purpose limitation, or sensitive-log controls. | Critical | Sensitive domains modeled like ordinary UI data | Approved privacy model, DSAR flows, retention jobs, redaction, encryption, access reviews, incident policy | Legal/product input, backend | P0 |
| BLK-22 | Secrets/config | No production secrets/configuration boundary or environment validation is defined. | Critical | Frontend-only build; server packages appear in browser dependencies | Secret manager, typed startup validation, key rotation, least-privilege service identities, environment isolation | Deployment platform | P0 |
| BLK-23 | Observability/audit | No structured logs, traces, metrics, alerting, financial/KYC audit, or incident correlation. | High | UI feedback only | Correlation IDs, redacted telemetry, SLOs/alerts, immutable privileged audit, dashboards and runbooks | Backend services | P0 |
| BLK-24 | Testing | No automated unit, integration, contract, E2E, accessibility, authorization, ledger, or visual regression suite is established. | High | Manual/prototype behavior | Risk-based suite in CI with deterministic fixtures and release gates | Stable contracts and test environments | P0 |
| BLK-25 | Deployment/operations | No documented staging/production topology, migrations, rollback, backup/restore, incident, or release process. | Critical | Static prototype workflow | Isolated environments, IaC, CI/CD gates, zero-downtime migration policy, rollback, restore drill, on-call/runbooks | Backend, observability, security | P0 |
| BLK-26 | Dependency/build | Baseline JavaScript is about 921.63 kB (245.41 kB gzip); all screens are eagerly imported and unused dependencies appear declared. | Medium | One large Vite chunk | Route splitting, dependency cleanup, bundle budgets/reporting, measured Core Web Vitals | Router and feature boundaries | P1 |
| BLK-27 | Messaging | No durable membership, sequencing, receipts, attachment security, abuse controls, or realtime/offline model. | High | Local conversation arrays | Authorized paginated messaging with server sequence, delivery/read state, attachment scan, block/report/rate limits | Auth, media, moderation | P1 |
| BLK-28 | Notifications | Notifications are client-created with no domain events, preferences, delivery, or deduplication. | Medium | Local array | Durable event-driven inbox, read state, preferences, retry/deduplication and channel policy | Event infrastructure | P1 |
| BLK-29 | Admin UX/security | Admin screen exposes mixed report/KYC operations without queue scopes, step-up, stale-write protection, or separation of duties. | High | Single dashboard and local buttons | Scoped queues, redacted views, explicit commands, version checks, step-up, audit and role tests | RBAC, KYC, moderation | P1 |
| BLK-30 | Live streaming | No provider, secure ingest/playback, entitlement, moderation, lifecycle, recording, or reliability model. | High | Visual fixture modal | Provider-backed bounded MVP or defer the surface; credentials and access server-controlled | Media, entitlements, moderation | P2 |
| BLK-31 | Analytics | Creator charts are fixtures with no metric definitions, privacy thresholds, timezone/currency, or aggregation jobs. | Medium | Static arrays | Metric catalog, verified aggregates, authorization, privacy threshold, freshness and export policy | Events, ledger/content domains | P2 |
| BLK-32 | Native mobile | React Native is not started and web architecture is not yet shareable at domain level. | Medium | Responsive web prototype | Stabilize API/domain contracts, extract platform-neutral client/types, then implement native security/media/navigation | Production web/API foundations | P3 |

Blocker count: **32 total — Critical: 16, High: 12, Medium: 4; P0: 25, P1: 4, P2: 2, P3: 1.**

## Top 10 audit findings

1. The browser currently owns identity, roles, balances, purchases, entitlements, KYC, and moderation state; every authoritative decision must move server-side.
2. Paid/private media URLs are already present in client data, so local lock flags provide no protection.
3. A ledger and reconciled payment lifecycle are prerequisites for subscriptions, PPV, tips, deposits, and payouts.
4. Authentication is deliberately bypassed by demo logic, including any-password/any-OTP behavior and hard-coded admin access.
5. KYC combines sensitive fixtures, forced consent, and simulated uploads without a restricted data boundary.
6. There is no backend, database, API contract, authorization enforcement, or durable audit trail.
7. App-level string navigation has no URL/history behavior and contains a confirmed studio destination mismatch that renders an empty body.
8. The global phone shell and duplicated modals lack a safe responsive/accessibility foundation.
9. Reporting currently shows success while calling a mismatched resolution operation instead of creating a report.
10. The baseline bundle eagerly loads every role/screen, including charts and admin functionality, into a large initial chunk.

## MVP priority audit

| Priority | Include | Explicit boundary |
|---|---|---|
| P0 | Responsive/accessibility foundation; typed web routes; API abstraction; Spring Boot/API foundation; PostgreSQL/migrations; auth/session/RBAC; creator profile/onboarding/KYC; core social graph/feed/posts/comments/reactions/saves; secure image media; entitlement service; ledger/wallet; one payment-provider adapter; subscriptions, PPV, tips, deposits, payouts; reports/moderation/admin; privacy/security/observability/testing/staging/launch operations | Launch is blocked until all 25 P0 register items meet their definitions of done. Scope individual payment methods and KYC provider breadth narrowly, but do not weaken integrity controls. |
| P1 | Messaging, notifications, hardened admin workflow, route splitting/performance | May ship in a bounded private beta only if absent surfaces are removed or clearly unavailable; no fake-success UI. |
| P2 | Live streaming, reviews/ratings expansion, mature creator analytics and taxonomy/config management | Defer rather than shipping client-authoritative simulations. |
| P3 | React Native app and broad platform expansion | Begin after web/API contracts and production operations stabilize. |

## Launch gate

Production readiness requires evidence, not feature-complete screens: all P0 definitions of done; zero open Critical security/privacy/financial findings; authorization and ledger invariants passing; provider reconciliation proven in staging; paid/private media denial tests passing; KYC access/retention approved; WCAG-oriented keyboard/screen-reader/zoom checks completed; performance budgets measured; backup restoration and rollback exercised; monitoring and incident ownership active; and a signed launch decision with accepted residual risks.
