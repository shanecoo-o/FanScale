# Spring Boot contract map

## Target

The future backend is a Java Spring Boot modular monolith exposing `/api/v1`, with PostgreSQL, Redis where justified, private object storage, background workers, OpenAPI, and an auditable event boundary. This phase creates no backend source code or infrastructure.

| Planned module | Contract ownership |
| --- | --- |
| identity | registration, login, verification, recovery, session rotation/revocation |
| users | current user, settings, account lifecycle |
| creators | public/private creator projections, pricing offers, onboarding |
| kyc | restricted cases, consent, provider results, reviewer commands |
| social | follows, blocks, discovery relationships |
| content | posts, comments, reactions, saves, feed projections |
| media | upload intents, scanning/processing, renditions, access grants |
| subscriptions | offer/version and billing lifecycle |
| entitlements | deny-by-default content and media access decisions |
| payments | intents, provider adapters, signed webhook inbox, reconciliation |
| ledger | balanced immutable postings and reversals |
| wallet | available/pending/reserved/paid projections |
| payouts | destinations, eligibility, reservation and provider lifecycle |
| messaging | membership, sequence, messages, receipts and attachments |
| notifications | event-derived inbox, preferences and delivery |
| moderation | reports, cases, decisions, sanctions and appeals |
| admin | scoped queue projections and explicit privileged commands |
| audit | immutable actor/action/resource/correlation evidence |

Domain modules should own business state and expose application services; controllers map HTTP DTOs without embedding policy. Financial/KYC/moderation commands use transactions, expected versions where needed, idempotency, correlation, and audit records. Durable cross-module effects use an outbox or equivalent atomic publication guarantee.

## Java decision

Current local Java is 17. Do not modify it during contract work. For the backend phase, recommend Java 21 LTS for the new service baseline, while retaining Java 17 as a viable fallback if deployment or vendor constraints require it. Spring Boot 3.4 requires Java 17 and supports later Java releases, including 21, so Java 21 provides the newer LTS runway without leaving the supported range: [Spring Boot 3.4 system requirements](https://docs.spring.io/spring-boot/3.4/system-requirements.html).

The backend bootstrap phase must pin an exact Spring Boot line, build-tool wrapper, Java toolchain, dependency policy, and CI runtime together rather than depending on whichever JDK happens to be installed locally.
