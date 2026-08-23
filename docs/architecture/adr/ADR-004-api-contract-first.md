# ADR-004: API contract first

## Status

Accepted

## Context

The React client already has a canonical `/api/v1` OpenAPI contract and server-authority rules. Controller-first development could silently diverge and recreate client authority.

## Decision

Treat `contracts/openapi/fanscale-api-v1.yaml` as the canonical product contract. Map controller DTOs into application commands/queries; never expose persistence entities. Keep safe errors, correlation IDs, cursor pagination, opaque IDs, UTC time, explicit MZN minor units, and idempotency semantics aligned. Generated Springdoc output is supporting evidence, not the contract source.

## Consequences

Contract changes require explicit review. Future CI should compare implementation/generated schemas with the canonical file. The foundation health endpoint is supplemental and does not imply implementation of product operations.
