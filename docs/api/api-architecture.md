# FanScale API architecture

## Boundary

The target topology is:

```text
React component
  ↓
domain/read service
  ↓
FanScale adapter port
  ↓
mock adapter or HTTP adapter
  ↓
mockData.ts or /api/v1
```

Components should not scatter `fetch()` calls, import new fixtures directly, or calculate authoritative business outcomes. Transport DTOs are mapped into UI models at the service boundary so components cannot mutate a response and mistake it for server state.

## Runtime modes

- `VITE_API_MODE=mock` is the default and keeps the prototype usable without a backend.
- `VITE_API_MODE=http` selects the HTTP boundary.
- `VITE_API_BASE_URL` defaults to `http://localhost:8080/api/v1` and is not a secret.
- HTTP mode never falls back silently to mocks. Until endpoint-to-UI mapping is implemented, representative read methods return `HTTP_ADAPTER_NOT_IMPLEMENTED` visibly.

## HTTP client

`ApiClient` supports GET, POST, PUT, PATCH, DELETE, query parameters, JSON bodies, custom headers, cancellation signals, bearer-token injection hooks, correlation IDs, and caller-supplied idempotency keys. Authentication-token storage and refresh strategy are intentionally undecided.

The caller owns the idempotency key for one logical financial command. A retry must reuse that key; neither the client nor a component should generate a new key merely because the transport failed.

## Errors

All HTTP failures normalize into `ApiError` with:

- stable machine code;
- safe user-facing message;
- HTTP status;
- correlation ID;
- optional field errors;
- retryability classification.

Responses must not expose stack traces, SQL details, Java class names, provider secrets, or sensitive records. The future query/mutation layer must give screens explicit loading, empty, validation, authorization, conflict, throttling, offline, retry, and server-failure states.

## Pagination and resource rules

Feed, posts, messages, and notifications use opaque cursor pagination with `items`, `nextCursor`, and `hasMore`. Cursors are continuation tokens, not client-readable authority. Administrative tables may later use constrained sorting/filtering and cursor or offset pagination where operational navigation requires it.

Identifiers are backend-generated opaque strings. Mock IDs such as `c1` remain fixture-only. API timestamps are ISO-8601 at the UTC boundary and localized only for display. Money is `{ currency: "MZN", minorUnits: integer }`; frontend floating-point values are not canonical financial inputs.

## Testability

Services depend on an interface, so unit tests can inject deterministic fakes, integration tests can use an HTTP adapter against an ephemeral backend, and E2E tests can select mock or HTTP mode explicitly. Tests must never depend on an automatic production-like fallback to fixtures.
