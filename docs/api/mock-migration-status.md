# Mock migration status

## Completed representative reads

The following path now exists:

```text
App
  ↓
FanScaleDataService
  ↓
MockFanScaleDataService
  ↓
mockData.ts
```

Migrated initial reads:

- feed/posts;
- creator collection and username lookup capability;
- conversations;
- wallet balance and transactions.

The adapter returns cloned fixture data so UI mutations do not alter shared fixture exports. Loading and adapter failure have explicit bootstrap UI. Mock mode remains the default.

## Remaining direct mock consumers

`App.tsx` still imports stories, notifications, admin reports, KYC requests, reviews, and live sessions. `ExplorePage` still consumes categories and `CreatorStudio` still consumes analytics fixtures. Existing local write simulations also remain for likes, saves, comments, follows, subscriptions, PPV, tips, messages, deposits, payouts, KYC, reports, reviews, posts, notifications, and live interactions.

These writes are intentionally preserved for prototype compatibility. They are not implementations of the canonical server contract and must not be copied into HTTP mode. Money, entitlement, KYC, moderation, role, approval, and protected-media mutations migrate only after their backend integrity prerequisites exist.

## HTTP status

The typed `ApiClient` exists, but `HttpFanScaleDataService` is an explicit skeleton. Selecting HTTP mode produces a clear development error instead of inventing endpoints or falling back to fixtures. The next frontend integration step is DTO-to-UI mapping against implemented Spring Boot endpoints.
