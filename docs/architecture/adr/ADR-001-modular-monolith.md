# ADR-001: Modular monolith

## Status

Accepted

## Context

FanScale spans identity, content, sensitive KYC, commerce, messaging, moderation, and audit concerns. Premature services would multiply deployment and consistency complexity before the domain boundaries are proven.

## Decision

Build one Spring Boot deployable organized by top-level business modules under `com.fanscale`. Use Spring Modulith 2.1.0 to verify package boundaries and support module documentation. Modules expose deliberate APIs and do not reach into another module's internals.

## Consequences

Transactions and local operations remain simple while boundaries stay testable. Modules may be extracted later only with evidence. A single process remains a failure/scaling unit, so high-risk background/provider work still needs explicit asynchronous and idempotent boundaries.
