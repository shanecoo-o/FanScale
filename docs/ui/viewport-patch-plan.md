# FanScale viewport polish patch plan

This plan sequences responsive visual polish after the responsive-foundation and typed-navigation phases. The existing pink/white identity, typography, routes, mock-domain behavior, accessibility foundations, and API boundaries remain authoritative throughout.

## PATCH-01 Global shell

- **Scope:** Application and public shells, shared page containers, fluid gutters, header and navigation geometry, safe areas, viewport sizing, main-content offsets, wide-screen containment, scroll ownership, and global layer tokens.
- **Main screens:** All routes, with shell checks centred on feed, explore, messages, wallet, Creator Studio, and admin.
- **Likely files:** `src/index.css`, `src/layouts/AppLayout.tsx`, `src/layouts/PublicLayout.tsx`, `src/components/Header.tsx`, `src/components/BottomNav.tsx`, shared layout primitives, and route-page outer wrappers.
- **Risks:** Double padding, hidden final content behind mobile navigation, intermediate-width header crowding, nested scroll regions, and unintended changes to page-level composition.
- **Definition of done:** One reusable shell contract works from 320px through 2560px; application width is bounded and centred; gutters, safe areas, navigation offsets, and layers are tokenised; every routed page has `min-width: 0`; no global horizontal overflow is introduced; existing accessibility and routing semantics remain intact.

## PATCH-02 Mobile 320–430

- **Status:** Complete — implemented and validated on 2026-08-24.
- **Dependencies:** PATCH-01 Global shell complete at `07c5ef2`; the shared page-container, safe-area, dialog, layer, and mobile-navigation contracts remain the foundation for this patch.
- **Scope:** Compact composition, touch density, wrapping, short-height behaviour, and mobile-specific visual rhythm after the shell is stable.
- **Main screens:** Feed, explore, creator profile, messages, wallet, authentication, Creator Studio, KYC, and admin summaries.
- **Likely files:** Individual routed screen components, feed/story components, compact form and action-row styles, and responsive dialog consumers where needed.
- **Risks:** Over-compressing controls, hiding useful labels, keyboard obstruction, and making screen-specific fixes that bypass shared primitives.
- **Definition of done:** Master widths 320, 390, and 430 remain usable without horizontal overflow or obscured controls; key tasks retain 44px targets; phone layouts are deliberately recomposed rather than squeezed desktop layouts.

## PATCH-03 Tablet 768–834

- **Status:** Complete — implemented and validated on 2026-08-24.
- **Dependencies:** PATCH-01 provides the 24px tablet gutter, safe-area, page-container, header, bottom-navigation, and dialog contracts; PATCH-02 provides the phone-first wrapping and 44px touch-target baseline preserved by this patch. Messages uses an evidence-backed 820px split-view threshold rather than the generic 768px breakpoint.
- **Scope:** Portrait-tablet gutters, controlled single/two-column transitions, compact navigation, form-grid thresholds, and balanced content density.
- **Main screens:** Feed, explore, creator profile, messages, wallet, Creator Studio, KYC, and admin.
- **Likely files:** Routed screen grid wrappers, form layouts, dashboard summaries, message master/detail layout, and shared responsive-grid utilities if justified.
- **Risks:** Activating multi-column layouts before children have enough width and creating cramped pseudo-desktop screens.
- **Definition of done:** 768, 820, and 834 widths use centred content and stable gutters; no crowded three-column layouts appear; navigation and primary actions remain clear.

## PATCH-04 Laptop 1024–1366

- **Status:** Complete — implemented and validated on 2026-09-03.
- **Dependencies:** PATCH-01 provides the bounded shell, 32px laptop gutters, desktop-header transition, page-width tiers, and layer contracts; PATCH-02 and PATCH-03 provide the compact wrapping, touch-target, and 820px Messages split-view baselines preserved by this patch. Feed context now enters at 1280px, after the primary 672px reading column is protected.
- **Scope:** Compact desktop navigation, dashboard density, optional context regions, and content-width tuning for landscape tablet and common laptop widths.
- **Main screens:** Feed, messages, wallet, Creator Studio, creator profile, and admin.
- **Likely files:** Header/navigation variants, routed dashboard grids, context panels, and screen-level width constraints.
- **Risks:** Treating 1024px like a large desktop, excessive persistent navigation width, and central content becoming too narrow.
- **Definition of done:** 1024, 1280, and 1366 widths use desktop-style navigation without crowding; primary content remains dominant; optional regions collapse cleanly.

## PATCH-05 Desktop 1440–1536

- **Status:** Complete — implemented and validated on 2026-09-03.
- **Dependencies:** PATCH-01 provides the 1536px shell, 1280px wide-content tier, shared gutters, header, and page-container contracts; PATCH-04 provides the compact-to-full header transition, protected 672px feed, optional feed context, fixed laptop Messages rail, and laptop-height rhythm preserved at the 1366px boundary.
- **Scope:** Full navigation, balanced three-region compositions where already supported, page rhythm, and visual alignment within the application shell.
- **Main screens:** Feed, explore, messages, wallet, Creator Studio, creator profile, and admin.
- **Likely files:** Header, existing multi-column page layouts, contextual panels, and spacing tokens only where shared values are insufficient.
- **Risks:** Unnecessary whitespace, over-wide side regions, and changing established card or feature styling during layout tuning.
- **Definition of done:** 1440 and 1536 widths show the full shell with controlled readable content, aligned navigation, and no accidental stretching.

## PATCH-06 Wide 1920–2560

- **Scope:** Wide-display centring, background treatment, maximum widths, and proportional whitespace without increasing text line length.
- **Main screens:** Landing, feed, explore, creator profile, messages, wallet, Creator Studio, and admin.
- **Likely files:** Shell/container tokens, selected full-bleed section wrappers, and existing contextual-region layouts.
- **Risks:** Expanding feeds or dashboard cards across the viewport and creating large visually empty margins without intentional composition.
- **Definition of done:** 1920 and 2560 widths keep the application centred within its maximum width; readable regions remain bounded; backgrounds may extend without stretching functional content.

## PATCH-07 Cross-viewport polish

- **Scope:** Transition points, content reflow between master families, shared loading/empty/error geometry, and removal of isolated responsive inconsistencies.
- **Main screens:** All routed screens and shared overlays.
- **Likely files:** Shared components and the smallest set of screen-level responsive classes revealed by the completed viewport passes.
- **Risks:** Accumulating one-off media queries and regressing a previously verified family while fixing another.
- **Definition of done:** Intermediate widths 360, 375, 412, 820, 834, 1280, 1366, and 1536 transition smoothly; no breakpoint cliff or duplicated layout rule remains.

## PATCH-08 Accessibility + final QA

- **Scope:** Keyboard and screen-reader regression checks, zoom/reflow, target sizes, contrast, reduced motion, route focus, modal behaviour, and final cross-browser/device QA.
- **Main screens:** All routes, navigation, dialogs, transactional flows, and representative empty/error states.
- **Likely files:** Only components with evidence-backed accessibility or final-QA defects, plus verification documentation.
- **Risks:** Treating static inspection as conformance evidence and making late visual changes without rerunning the full matrix.
- **Definition of done:** Master viewports, 200%/400% zoom, keyboard navigation, focus restoration, `aria-current`, dialog focus/Escape/inert behaviour, live regions, reduced motion, and safe areas are verified; lint, production build, and diff checks pass; residual risks are recorded.
