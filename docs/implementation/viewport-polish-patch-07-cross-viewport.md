# PATCH-07 cross-viewport polish

Implemented on 2026-09-03 across the completed 320–2560px responsive system. This pass audited transition continuity and removed isolated inconsistencies without redesigning FanScale or changing routes, data, business logic, APIs, mocks, or package configuration.

## Files changed

- `src/components/LandingView.tsx`
- `src/index.css`
- `docs/ui/viewport-patch-plan.md`
- `docs/implementation/viewport-polish-patch-07-cross-viewport.md`

## Breakpoint inventory

The effective system is intentionally layered rather than forced into one scale:

- Shared CSS shell thresholds: 360px gutters, 640px tablet gutters/dialog treatment, 768px Messages height treatment, 1024px desktop navigation/gutters, 1440px desktop-wide content, and 1920px outer-canvas treatment.
- Tailwind composition thresholds: `sm` 640px, `md` 768px, and `lg` 1024px.
- Evidence-based component thresholds: 390px compact-label/card reflow, 430px metadata reflow, 480px and 760px form-specific layout, 720px KYC pairing, 820px Messages split view, 1180px navigation labels, 1280px Feed context/desktop grids/creator shortcut, 1440px desktop density/search/role context, and 1536px final header spacing/control exposure.
- A max-639px rule preserves deliberate edge-to-edge Messages behavior on phones.

No breakpoint value was changed. The duplicate 640px CSS media block was consolidated into the existing 640px block; its declarations and behavior are unchanged.

## Issues found and fixed

1. The landing page independently repeated `max-width`, centring, and 16px horizontal padding while all routed screens used the shared `PageContainer` gutter contract. It now uses the existing wide `PageContainer`, removes repeated inner padding, and preserves its established 1152px/1024px/896px section bounds. The hero now has 12px at 320px, 16px from 360px, 24px from 640px, and 32px from 1024px instead of touching the compact viewport edge.
2. `src/index.css` contained two separate `@media (min-width: 640px)` blocks. The toast declarations now live in the first block, removing an avoidable duplicate without changing computed behavior.
3. The skip link used an isolated `z-index: 120` above the documented layer scale. It now uses the existing toast-layer token, remaining above the header while staying below the critical age-gate layer.

## Cross-viewport matrix

`PASS` means browser-rendered shell or age-gate verification. `STATIC_PASS` means source inspection plus TypeScript/build verification because the age gate was preserved and not accepted.

| Surface | 320 | 390 | 430 | 768 | 1024 | 1440 | 1920 | 2560 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shell | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Header | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Navigation | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Feed | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Explore | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Creator | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Messages | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Wallet | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Auth | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Studio | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| KYC | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Admin | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS | STATIC_PASS |
| Dialogs | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

## Navigation and header continuity

- 1023px retains bottom navigation and 80px main bottom clearance; 1024px removes it, exposes desktop navigation, and applies the 40px desktop page ending.
- Navigation labels remain hidden through 1179px and appear at 1180px without header overflow.
- The creator shortcut enters at 1280px; search and role context enter at 1440px; final spacing and direct logout enter at 1536px.
- Runtime measurement found no duplicate navigation, missing-navigation interval, or header `scrollWidth` overflow around these transitions.
- Active destinations continue to use the existing `aria-current` and routing semantics.

## Container and screen continuity

- Landing now shares the same gutter source as header and routed content while retaining narrower section caps.
- Feed remains a bounded 672px column, adding its 320/352px context only at 1280/1440.
- Explore retains 1/2/3/4 useful columns at 320/640/1024/1280.
- Creator Profile retains phone stacking, the 640px horizontal identity/action composition, and bounded desktop media grids.
- Messages remains single-pane through 819px and becomes a 4/8 split at 820px. Measured rail/thread widths at 820px were 257px/514px; the back control is visible only in single-pane mode. At 1024px the explicit 320px rail replaces the fractional tablet rail.
- Wallet, Studio, and Admin retain their staged 1/2/4-column or two-region compositions; no desktop table semantics were moved into phone layouts.
- Auth remains independently bounded; KYC retains its 720px paired-field threshold and 896px final form cap.
- Dialog maximum widths and local scrolling remain independent of viewport growth.

## Overflow, height, content, and media audit

- Browser geometry reported no document-level horizontal overflow at 320, 390, 430, 768, 1024, 1440, 1920, or 2560 on Landing, Feed, Explore, Creator Profile, Messages, Wallet, Auth, Studio, KYC, and Admin routes.
- Intermediate public-shell checks at 360, 375, 412, 640, 767/768, 819/820, 833/834, 1023/1024, 1179/1180, 1279/1280, 1366, 1439/1440, 1536, 1600, 1728, 1919/1920, and 2048 also showed no document overflow.
- Dedicated heights 320×568, 390×844, 768×1024, 1024×768, 1366×768, 1536×864, and 1920×1080 preserve age-gate containment or intentional internal scrolling.
- Horizontal scrolling remains local and intentional for category rails, tabs, compact filters, code/reference values, and data tables.
- Long names, usernames, captions, transaction descriptions, monetary values, and status metadata retain the existing `min-width: 0`, wrapping, truncation, or locally scrollable contracts appropriate to their importance.
- Post media, creator covers, profile grids, stories, Messages media, and locked-media aspect-ratio rules do not change at unrelated breakpoints.

## CSS cleanup and preservation

- Consolidated one duplicate 640px media block.
- Reused `PageContainer` instead of adding a competing container abstraction.
- Replaced one arbitrary layer value with an existing semantic layer token.
- Retained safe-area variables, Messages scroll ownership, dialog containment, reduced-motion rules, route focus behavior, focus-visible styling, inert dialog background, and existing z-index ordering.
- No obsolete screen rule or apparently repeated class was removed unless its computed replacement was equivalent.

## Visual and static QA

- The public shell, landing bounds, shared gutters, header, and non-dismissible age gate were visually inspected at representative phone, tablet, desktop, and wide sizes.
- The age gate remained active throughout; its affirmative control was never invoked.
- Protected page compositions are `STATIC_PASS`, supported by source inspection, rendered shell geometry behind the inert backdrop, TypeScript validation, and the production build.
- Console inspection showed no warning or error entries during the final responsive checks.

## PATCH-08 input

- Perform keyboard and screen-reader regression checks, including route focus, landmarks, active navigation, dialog focus trap, Escape behavior, and focus restoration.
- Verify 200% and 400% zoom/reflow, target sizes, contrast, reduced motion, and screen-reader announcements.
- Complete final visual QA of protected route contents after an authorized age-gate interaction by the user.
- Run physical-device safe-area and mobile browser-chrome checks.
- Recheck the full viewport matrix and any responsive defect discovered during accessibility/device testing.
- Produce final release-readiness documentation.
