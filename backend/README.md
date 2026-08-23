# FanScale backend foundation

This directory contains the Java 21 / Spring Boot 4.1 modular-monolith foundation. It does not implement FanScale authentication, content, commerce, KYC, messaging, or moderation workflows yet.

## Requirements

- JDK 21 LTS (`java` and `javac`)
- Docker with Compose v2 for PostgreSQL and Testcontainers
- No system Maven installation is required; Maven Wrapper 3.3.4 downloads Maven 3.9.16.

## Local start

From the repository root, copy documented values from `.env.example` into an ignored `.env`, then start PostgreSQL:

```powershell
docker compose up -d postgres
docker compose ps
```

Run the backend from `backend/`:

```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Foundation endpoints:

- `GET http://localhost:8080/api/v1/health`
- `GET http://localhost:8080/actuator/health`
- `GET http://localhost:8080/actuator/info`
- local-only API docs when enabled: `/v3/api-docs` and `/swagger-ui.html`

All other `/api/v1/**` routes require authentication and currently fail closed because the identity/session implementation does not exist yet.

## Tests

```powershell
.\mvnw.cmd clean verify
```

Integration tests use PostgreSQL through Testcontainers. They do not use an uncontrolled local database. Docker must be running.

## Database and migrations

- PostgreSQL is canonical.
- Flyway owns schema changes under `src/main/resources/db/migration`.
- Hibernate uses `ddl-auto=validate`; it must not create or destroy production schema.
- HikariCP defaults are retained until measurements justify environment-specific tuning.
- `V1__baseline.sql` creates only the `fanscale` schema and a small infrastructure metadata proof.

Future identifiers are backend-generated UUID/opaque IDs. Persistent timestamps use UTC (`Instant` in Java and `TIMESTAMPTZ` in PostgreSQL). Mutable aggregates add `updatedAt` and optimistic `@Version` only where concurrency requires them; no universal base entity is mandated. Monetary authority uses `long` integer minor units plus explicit `MZN`; `BigDecimal` is reserved for rates or calculations that require decimal precision and must be rounded explicitly before ledger posting.

## Profiles and secrets

- `local`: compose-friendly non-production defaults and API docs enabled.
- `test`: Testcontainers connection and API docs disabled.
- `staging`: database, CORS, and secrets are environment-provided.
- `production`: fail-closed environment configuration and API docs disabled.

Committed configuration contains no production credentials. `fanscale_local_only` is an explicit local Compose default and must never be used outside local development.

## Security boundary

The foundation is stateless, disables form/basic login and the generated default user, permits only health/info/docs routes, and denies protected APIs. CORS allows the configured exact origins and never combines wildcard origins with credentials.

CSRF is temporarily disabled because there are no cookie-authenticated state-changing endpoints and no implemented authentication transport. It must be revisited before browser cookie sessions or any protected command is enabled. This is not a permanent security decision.

Request logging records only method, path, status, duration, and a bounded correlation ID. It does not log query strings, bodies, authorization headers, passwords, KYC data, payment credentials, or media.
