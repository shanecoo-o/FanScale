# API contract foundation result

## Outcome

FanScale now has an incremental typed frontend API boundary and an initial OpenAPI 3.1 contract for the future Spring Boot modular monolith. The prototype still runs without a backend in mock mode. No Spring Boot, PostgreSQL, Redis, object-storage implementation, real authentication, or payment integration was added.

## API abstractions introduced

- `ApiClient` supports GET/POST/PUT/PATCH/DELETE, headers, query parameters, JSON bodies, abort signals, correlation IDs, optional authentication-token injection, and caller-owned idempotency keys.
- `ApiError` normalizes status, stable code, safe message, correlation ID, field errors, and retryability.
- `apiConfig` supports `VITE_API_MODE=mock|http` and `VITE_API_BASE_URL`, defaulting to mock mode and `http://localhost:8080/api/v1`.
- `FanScaleDataService` is the replaceable frontend service port for representative reads.
- Canonical TypeScript DTOs cover common primitives, auth, users, creators, feed, posts, media, entitlements, subscriptions/PPV, payments/tips, wallet, payouts, messaging, notifications, KYC, moderation, and admin/audit.

## Adapters and migration

`MockFanScaleDataService` consumes `src/data/mockData.ts` and returns cloned fixture data. `HttpFanScaleDataService` is deliberately a skeleton: selecting HTTP mode produces `HTTP_ADAPTER_NOT_IMPLEMENTED` rather than silently falling back to mocks or pretending a backend exists.

`App.tsx` now retrieves the following initial data through `FanScaleDataService`:

- feed/posts;
- creators;
- conversations;
- wallet balance and transactions.

The routed Feed, Explore, Creator Profile, Messages, Wallet, and Creator Studio screens therefore receive those initial read models through the new boundary. A bootstrap loading/error state makes adapter failure explicit.

Remaining direct fixture reads are stories, notifications, admin reports, KYC requests, reviews, and live sessions in `App.tsx`; categories in `ExplorePage`; and analytics in `CreatorStudio`. Prototype write simulations also remain local and are not canonical implementations of server operations.

## OpenAPI inventory

`contracts/openapi/fanscale-api-v1.yaml` defines:

- OpenAPI 3.1.0;
- 25 paths and 28 operations;
- 41 reusable schemas;
- auth registration/login/logout/logout-all/refresh/contact verification/recovery/session-device operations;
- current user, feed, creator profile, posts and likes;
- creator KYC status/submission;
- subscription checkout and PPV unlock initiation;
- payment intents and tips;
- wallet projection/transactions and payout requests;
- report creation;
- a separately marked provider-facing payment webhook.

Reusable components cover opaque identifiers, UTC timestamps, MZN money in integer minor units, cursor pagination, correlation headers, idempotency keys, safe errors, and common authorization failures.

## Server-authoritative fields

The contract and authority matrix explicitly assign the server as source of truth for roles, account state, creator/KYC approval, age eligibility, prices and offer versions, subscriptions, PPV entitlements, media access, payment settlement, tips, commissions, wallet balances, ledger entries, payout eligibility/status, moderation decisions, admin permissions, metrics, and audit evidence.

Client values such as `isSubscribed`, `isUnlocked`, `verified`, `walletBalanceMT`, and prototype role state are presentation fixtures only. Payment success must originate from authenticated provider events and reconciled ledger processing. Protected media origins and KYC evidence are excluded from public DTOs.

## Validation

- Bun lint (`tsc --noEmit`): passed through the established C-drive validation mirror.
- Bun Vite production build: passed; 2,310 modules transformed.
- Main JavaScript: 395.35 kB (116.86 kB gzip); Creator Studio lazy chunk: 394.88 kB (114.37 kB gzip).
- Vite oversized-chunk warnings: none.
- `git diff --check`: passed.
- OpenAPI YAML: parsed successfully with unique-key checking.
- OpenAPI structure: 28 unique operation IDs, all 56 distinct internal references resolved, every path template has a required path parameter, and no duplicate YAML routes were found.
- Additional package manager lockfiles: none.

## Java preparation

Current local Java remains 17. Java 21 LTS is recommended for the new backend baseline because it offers a longer new-project LTS runway while remaining within the supported range of the selected modern Spring Boot generation. The backend phase must pin the exact Spring Boot version, Java toolchain, build wrapper, and CI runtime together; this task changed no machine configuration.

## Known gaps

- HTTP DTO-to-UI mapping is not implemented until real endpoints exist.
- Runtime response schema validation and generated OpenAPI transport types are not yet installed.
- Auth cookie/token, CSRF, refresh rotation, and step-up strategy require a backend security decision.
- Messaging, notifications, media upload/access, admin review, and audit HTTP paths need expansion after their module boundaries stabilize.
- Offer quoting, ledger posting, provider webhooks, entitlement grants, KYC review, moderation commands, and payout processing are contracts only.
- Existing local write simulations remain unsafe for production and must not be reused as server logic.

NEXT STEP: FanScale Spring Boot modular-monolith foundation and PostgreSQL development environment
