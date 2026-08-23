# Resource contract decisions

## Canonical primitives

- API prefix: `/api/v1`.
- IDs: opaque backend-generated strings; fixture IDs are not a persistence requirement.
- Time: ISO-8601 UTC at API/storage boundaries.
- Money: integer minor units with explicit `MZN` currency. One metical is represented as 100 minor units.
- Errors: stable code, safe message, correlation ID, optional field errors.
- Lists: cursor pagination by default for feed, posts, messages, and notifications.
- Writes: explicit commands for money, access, KYC, and moderation; no unrestricted state patching.

## Domain DTOs

TypeScript contracts cover authentication/sessions, public and private users, creators/pricing/verification/analytics, feed/posts/comments/likes/saves, media lifecycle/access, entitlements, subscriptions/PPV, payments/tips, wallet/ledger projections, payouts, messaging, notifications, KYC, reports/moderation, and admin/audit views.

Public creator DTOs exclude legal identity, document numbers, KYC evidence, payout destinations, and private analytics. KYC reviewer DTOs are restricted and redacted. Protected media DTOs expose safe previews and short-lived variants only after a server access decision; durable object-storage origins are never part of the public contract.

## Prototype mappings

| Prototype value | Canonical contract |
| --- | --- |
| `subscriber` post visibility | `subscribers` |
| `promo` post visibility | public visibility plus future promotional/ranking metadata; promotion is not an entitlement class |
| `priceMT: number` | `Money { currency: MZN, minorUnits }` |
| `isUnlocked` | server `ContentAccessDecision` / `EntitlementState` |
| `isSubscribed` | server `Subscription` plus viewer-specific entitlement projection |
| raw `mediaUrls` | `MediaAsset`, safe preview, then authorized short-lived `MediaAccess` |
| display-relative timestamps | UTC ISO-8601 timestamps, localized in the UI |

The initial OpenAPI prioritizes auth, current user, creator, feed, posts, KYC, subscriptions, PPV, payment intents, tips, wallet, payouts, and reports. Messaging and notification TypeScript DTOs are prepared, while their HTTP paths remain a later contract expansion.
