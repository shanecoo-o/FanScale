# PATCH-04 laptop viewport polish

Implemented on 2026-09-03 for the 1024–1366px laptop family. This pass builds on PATCH-01 through PATCH-03 and deliberately stops before the full 1440–1536 desktop composition in PATCH-05.

## Width classification

- **1024 × 768 — compact laptop:** desktop header with icon-only primary navigation, no feed context panel, a centred 672px feed, three-column live discovery, two-column Creator Studio KPIs, and the established Messages split view with a fixed 320px conversation rail.
- **1280 × 800 — standard laptop:** labelled primary navigation and the existing creator shortcut, bounded two-region feed with a 672px primary column and 320px context panel, four-column discovery grids, four-column Creator Studio KPIs, and the fixed Messages rail.
- **1366 × 768 — standard laptop, height constrained:** the same bounded 1280 composition with deliberately reduced dashboard/banner spacing so more primary content remains above the fold.

Regression boundaries remain 834px (tablet navigation and tablet screen compositions from PATCH-03) and 1440px (full header search/role controls and the original spacious rhythm reserved for PATCH-05).

## Layout architecture

- **Navigation transition:** the existing top header remains the only desktop navigation system. It switches from compact icon controls at 1024px to labelled primary controls at 1180px, adds the existing creator shortcut at 1280px, and leaves global search plus role switching at 1440px. No new navigation rail was introduced.
- **Sidebar:** FanScale has no shared persistent sidebar contract. This patch does not invent one or add a shell offset.
- **Main content:** PATCH-01 page containers remain authoritative. Screen-level grids now protect reading and working widths instead of expanding merely because the desktop header is active.
- **Context panel:** the feed context column is optional below 1280px. From 1280px it is a bounded 320px region beside a bounded 672px primary column.
- **Feed:** posts remain centred and capped at 672px at every laptop width; the context region enters only when both columns have useful room.
- **Messages:** the PATCH-03 820px master/detail transition is preserved. From 1024px the conversation list is fixed at 320px and the thread receives all remaining space.
- **Wallet:** the 1024px standard container and four-method grid remain intact; laptop-only vertical rhythm and balance-card padding are reduced, returning to the existing spacious values at 1440px.
- **Creator Studio:** KPIs use two columns at 1024px and four from 1280px. Existing analytics and working panels remain bounded; banner and section rhythm are tightened only across the laptop family.
- **Admin:** dense four-column KPIs and structured moderation rows remain appropriate at 1024px; banner and section rhythm are tightened for 768–800px-high laptops.

## Screen status

- **Feed:** changed — protected reading width and delayed optional context.
- **Explore:** changed — live cards use three columns at 1024px and four from 1280px; creator cards gain the same 1280px expansion; hero rhythm is laptop-specific.
- **Creator Profile:** changed — the media gallery expands to four columns from 1280px while the standard profile container remains bounded.
- **Messages:** changed — the desktop conversation rail is fixed at 320px.
- **Wallet:** changed — laptop-height rhythm tightened without changing wallet behavior or transaction structure.
- **Auth:** verified by source — the existing 1024px two-panel transition gives the form approximately 560px and remains bounded; no change required.
- **Creator Studio:** changed — progressive KPI density and laptop-height rhythm.
- **KYC:** verified by source — the existing 896px form container and paired fields remain suitable; no change required.
- **Admin:** changed — laptop-height rhythm; existing four-card summary and record/action layout retained.
- **Dialogs:** verified by source — shared bounded dialog contracts remain authoritative; no change required.

## Validation

- TypeScript lint: passed through the established mirror, bundled Node running local `typescript/bin/tsc --noEmit`. Bun is unavailable on this host.
- Production build: passed through the established mirror, bundled Node running local Vite with `build --configLoader runner`. The installed dependency tree was missing `set-cookie-parser@2.7.2`, although it is pinned by `bun.lock`; restoring its required export in ignored `node_modules` allowed the unchanged manifest to build.
- Diff check: passed. The tracked diff is restricted to responsive class composition and PATCH-04 documentation; no routes, data, APIs, mock behavior, or business logic changed.
- Browser geometry: 834×1112, 1024×768, 1280×800, 1366×768, and 1440×900 all reported no horizontal overflow and no warning/error console entries on the public surface.
- Browser access: the 18+ gate was visible at every checked width and was not bypassed. Routed application screens therefore retain source/build verification rather than claiming authenticated visual inspection.

## Residual risks

- The 1180px labelled-navigation threshold is close to the lower standard-laptop range and should be rechecked with unusually long translated labels.
- 1366×768 remains height constrained in deep Creator Studio, admin, and wallet tabs; this patch improves the initial viewport but does not shorten feature content.
- The 1440px boundary deliberately restores the pre-existing spacious rhythm while enabling the full header controls; PATCH-05 owns final alignment there.
