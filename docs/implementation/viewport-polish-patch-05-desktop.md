# PATCH-05 desktop viewport polish

Implemented on 2026-09-03 for the 1440–1536px desktop family. This pass completes the full-header and existing multi-region desktop composition without introducing a new sidebar, expanding reading lines, or pre-empting PATCH-06 wide-display work.

## Width classification

- **1440 × 900 — standard desktop:** full role control and global search enter with a deliberately bounded 256px search field and compact 8px action spacing. Feed uses a 672px primary column plus a 352px context region. Messages expands to the 1280px content tier with a 352px conversation rail. Wallet uses the wide tier and composes its balance beside a two-by-two payment-method region.
- **1536 × 864 — full desktop:** the 1536px shell is fully occupied while content remains capped at 1280px. Search expands to 320px, header action spacing returns to 12px, and the existing direct logout action enters without changing route-derived navigation.

The 1366px laptop boundary remains unchanged. The 1920px wide boundary continues to use the same 1536px shell and is owned by PATCH-06 for final proportional-whitespace review.

## Layout architecture

- **Navigation:** the existing top header remains authoritative. PATCH-05 balances the full control set instead of adding a second navigation system.
- **Header:** role switching and global search enter at 1440px; the search and action gaps grow progressively at 1536px so the 1440 composition does not crowd.
- **Sidebar:** no shared persistent sidebar exists in FanScale, so none was invented. The specification's multi-region requirement is applied only to context regions already supported by individual screens.
- **Main content:** the 1536px shell and 1280px wide-content token remain the maximum desktop geometry. Reading content stays narrower.
- **Context panel:** Feed retains its existing contextual cards and expands that region from 320px to 352px at 1440px.
- **Feed:** the primary reading column remains capped at 672px; only context balance and the inter-column gap change on desktop.
- **Messages:** the screen expands from its 1152px laptop cap to the 1280px wide tier, with a 352px conversation rail and the remaining width reserved for the active thread.
- **Wallet:** the page expands only at 1440px. Balance and payment methods form a two-region desktop summary while filtering, history, and transactional flows remain full-width below.
- **Creator Studio and Admin:** their existing 1280px wide containers, four-card summaries, and 8/4 analytics grids already match the desktop contract; no further change was justified.

## Screen status

- **Feed:** changed — desktop context balance improved without widening posts.
- **Explore:** verified by source — four-column discovery and 1280px containment already align at 1440–1536.
- **Creator Profile:** verified by source — the bounded 1024px profile and four-column media grid remain readable.
- **Messages:** changed — expanded desktop container and 352px conversation rail.
- **Wallet:** changed — wide desktop summary composition with unchanged transaction behavior.
- **Auth:** verified by source — the established 1024px two-panel composition remains intentionally focused.
- **Creator Studio:** verified by source — wide four-KPI and 8/4 analytics layouts already satisfy desktop density.
- **KYC:** verified by source — the 896px form tier prevents over-wide fields.
- **Admin:** verified by source — wide KPIs, moderation records, and metrics are already balanced.
- **Notifications:** verified by source — the 768px reading tier remains appropriate.
- **Dialogs:** verified by source — shared bounded dialog geometry remains authoritative.

## Validation

- TypeScript lint: passed through the established mirror, bundled Node running local `typescript/bin/tsc --noEmit`. Bun is unavailable on this host.
- Production build: passed through the established mirror, bundled Node running local Vite with `build --configLoader runner`.
- Generated CSS: verified for the 1440px feed, Messages, Wallet, header, and desktop-container rules.
- Diff check: passed. The tracked diff is restricted to desktop responsive composition and PATCH-05 documentation; routes, data, APIs, mocks, and business logic remain unchanged.
- Browser geometry: 1366×768, 1440×900, 1536×864, and 1920×1080 all reported no horizontal overflow and no warning/error console entries on the public surface.
- Browser access: the 18+ gate was visible at every checked width and was not bypassed. Protected application screens therefore retain source/build verification rather than claimed visual inspection.

## Residual risks

- The 1536px direct logout action is intentionally redundant with the profile menu and remains a candidate for product-level simplification outside viewport polish.
- Localized header labels longer than the Portuguese source strings may consume the remaining 1440px slack.
- PATCH-06 still owns the visual balance of the 1536px shell inside 1920px and wider viewports.
