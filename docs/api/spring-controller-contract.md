# OpenAPI to Spring mapping

The canonical product API remains `contracts/openapi/fanscale-api-v1.yaml`. Spring implementation must follow this direction:

```text
canonical OpenAPI operation/schema
  ↓
Spring controller request/response DTO
  ↓
domain application command/query
  ↓
domain model and infrastructure ports
```

Controllers are transport adapters. They validate syntax, map DTOs, call one application use case, and map the result. They do not calculate money, grant entitlements, approve KYC, decide moderation, or expose JPA entities. Application/domain layers own policy and transactions; infrastructure implements persistence and provider ports.

The foundation `GET /api/v1/health` is intentionally supplemental operational proof and does not implement any of the existing 28 product operations. Future product controllers must retain `/api/v1`, operation semantics, opaque IDs, ISO-8601 UTC timestamps, cursor pagination, MZN integer minor units, idempotency headers, and the safe error envelope. A contradiction requires an explicit contract review and ADR; controller and OpenAPI must not drift silently.

Springdoc provides implementation visibility in local development, but generated documentation is not a replacement for the canonical contract. Contract tests should later compare implemented operations and generated DTO schemas to the committed specification.
