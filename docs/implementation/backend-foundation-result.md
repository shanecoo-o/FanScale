# Spring Boot backend foundation result

## Outcome

FanScale now contains a production-oriented Java 21 / Spring Boot 4.1.1 modular-monolith foundation under `backend/`, plus a reproducible PostgreSQL 18.6 local-development definition in the repository-level `compose.yaml`. This phase implements infrastructure and operational proofs only; it does not implement FanScale business domains.

## Selected stable stack

- Java target: 21 LTS.
- Spring Boot: 4.1.1 stable.
- Maven Wrapper: 3.3.4, script-only distribution using Maven 3.9.16.
- Spring Modulith: 2.1.0 stable, aligned with the Spring Boot 4.1 release train.
- Springdoc OpenAPI: 3.1.0 stable, aligned with Spring Boot 4.1.
- PostgreSQL: 18.6 Alpine image for Compose and Testcontainers.
- Flyway, Spring Data JPA, Spring Security, Bean Validation, Actuator, JUnit, and Testcontainers are configured through the Boot-managed dependency set.

## Modules created

Spring Modulith boundaries exist for `identity`, `users`, `creators`, `kyc`, `social`, `content`, `media`, `subscriptions`, `entitlements`, `payments`, `ledger`, `wallet`, `payouts`, `messaging`, `notifications`, `moderation`, `admin`, `audit`, `configuration`, and `shared`.

The modules are intentionally empty beyond foundation code. `ApplicationModulesTest` verifies the package model once Java 21 can execute the test suite.

## Database and Flyway

- Database/name/user: `fanscale` / `fanscale` with an explicit local-only password default.
- Profiles: `local`, `test`, `staging`, and `production`.
- Staging/production credentials and CORS origins are environment-required; no production secret defaults exist.
- Flyway owns schema changes; Hibernate is `ddl-auto=validate` and Open Session in View is disabled.
- `V1__baseline.sql` creates the `fanscale` schema and one infrastructure metadata table proving PostgreSQL UUID, `TIMESTAMPTZ`, update/version, and Flyway conventions.
- HikariCP defaults are retained.
- Money remains explicit MZN integer minor units; timestamps remain UTC/`Instant` at the backend/API boundary.

## Foundation endpoint and operations

- `GET /api/v1/health` returns only status, service name, API version, and UTC timestamp.
- Actuator exposes only `health` and `info`; discovery and health details are disabled.
- Local Springdoc endpoints can be enabled; staging defaults them off and production disables them.
- The existing 28 product operations in `contracts/openapi/fanscale-api-v1.yaml` remain unimplemented and unchanged.

## Security and observability foundation

- Generated default users/passwords, form login, HTTP Basic, and server logout are disabled.
- Health/info/docs are explicitly public; `/api/v1/**` otherwise requires authentication and fails closed; other paths are denied.
- CORS uses typed configuration, exact origins, bounded methods/headers, no wildcard credentials, and exposes the correlation header.
- CSRF is temporarily disabled only because the foundation is stateless and has no cookie-authenticated commands. It must be configured before a browser cookie/session transport is adopted.
- Correlation IDs accept a safe `[A-Za-z0-9._-]` value up to 128 characters or generate a UUID, return `X-Correlation-Id`, populate the error envelope, and enter MDC.
- Request logs contain method, path, status, duration, and correlation ID only; no query/body/auth/KYC/payment/media data is logged.
- Validation and unexpected exceptions use the safe `{ code, message, correlationId, fieldErrors? }` contract without returning stack traces or internal details.

## Tests created

- application context load with PostgreSQL Testcontainers;
- public health response and correlation propagation;
- oversized correlation header regeneration;
- protected API canonical security error;
- PostgreSQL connectivity and baseline Flyway migration;
- Spring Modulith boundary verification.

## Validation and environment blockers

Static checks passed:

- `pom.xml` is well-formed and resolves structurally to Spring Boot 4.1.1, Java 21, and `fanscale-backend`.
- seven YAML files parse with unique-key validation;
- Flyway migration naming is valid;
- all 20 required module package boundaries exist;
- dependency choices were matched to official stable compatibility information;
- no secret patterns, build outputs, database files, or private IDE files were added;
- `git diff --check` passed before commit staging.

Execution is environment-blocked, not classified as a source failure:

- `BLOCKED_BY_LOCAL_JAVA_VERSION`: installed Java/Javac are 17.0.18; the project correctly targets Java 21.
- Maven is not installed globally. The wrapper is committed, but this Codex PowerShell session uses constrained language mode that prevents the generated Windows wrapper bootstrap from executing.
- `BLOCKED_BY_DOCKER_NOT_INSTALLED`: Docker and Docker Compose are absent, so PostgreSQL Compose and Testcontainers cannot run.

## Remaining backend work

Authentication/session transport, identity and registration, RBAC/ABAC, users/creators/KYC, social/content/media, subscriptions/entitlements, providers/payments, ledger/wallet/payouts, messaging/notifications, moderation/admin/audit persistence, runtime OpenAPI conformance, privacy controls, production deployment, observability, backups, and operational security remain unimplemented.

NEXT STEP: FanScale Java 21 and Docker local environment completion, then authentication and identity domain implementation
