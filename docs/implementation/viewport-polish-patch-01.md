# Viewport polish PATCH-01 result

## Outcome

PATCH-01 establishes one reusable responsive shell contract for FanScale without changing the existing brand language, routes, mock business behaviour, API boundaries, or screen-specific card compositions. The authenticated application is centred within a 1536px maximum shell, functional page content remains deliberately bounded, and shared gutters/navigation offsets now adapt fluidly across the supported viewport families.

## Files changed

- `src/index.css`
- `src/layouts/AppLayout.tsx`
- `src/app/router.tsx`
- `src/App.tsx`
- `src/components/ui/PageContainer.tsx`
- `src/components/Header.tsx`
- `src/components/BottomNav.tsx`
- Outer wrappers in Feed, Explore, Messages, Notifications, Wallet, Creator Profile, Creator Studio, KYC, Admin, route loading, and missing-resource views
- `src/components/LoginView.tsx`
- `src/components/AgeGateModal.tsx`
- `docs/ui/viewport-patch-plan.md`
- `docs/implementation/viewport-polish-patch-01.md`

## Layout primitives

- Added `PageContainer` with named reading, form, standard, messages, and wide widths. It replaces repeated `max-width`, auto-margin, and breakpoint-padding combinations at routed page boundaries.
- `AppLayout` now identifies the existing Messages route as a legitimate local-scroll surface. Normal routes retain document/main scrolling; Messages does not receive redundant bottom-navigation padding in addition to its viewport calculation.
- `AppLayout` and `PublicLayout` retain the skip link, focusable main landmark, route outlet, route focus restoration, and existing accessibility semantics.

## Tokens

Added or consolidated tokens for:

- 1536px application-shell maximum
- 1280px wide content, 1152px Messages content, 1024px standard content, 896px form content, and 768px reading content
- 12px compact-phone gutter, 16px larger-phone gutter, 24px tablet gutter, and 32px laptop/desktop gutter
- Header and bottom-navigation heights
- Full and compact future sidebar geometry; the current application has no persistent sidebar to offset
- Four safe-area insets and the total mobile-content inset
- Sticky, header, popover, modal, toast, and critical-alert layers

The root no longer forces `min-width: 320px`; that rule caused six pixels of horizontal overflow when an exact 320px viewport also had a vertical scrollbar.

## Shell behaviour by family

### Mobile

- Single-column routed content uses 12px gutters at 320px and 16px from 360px upward.
- Desktop navigation, search, wallet, role switcher, and creator shortcuts remain hidden.
- The mobile header keeps the brand plus prioritised actions without horizontal overflow.
- Fixed bottom navigation reserves content space and includes left, right, and bottom safe-area insets.
- Messages retains its deliberate edge-to-edge mobile surface and owns its local viewport scroll region.

### Tablet

- Routed content is centred with 24px gutters.
- Bottom navigation remains the compact primary navigation through 1023px.
- The wallet summary may remain visible in the header where space permits; desktop navigation stays hidden.
- No global three-column shell is forced.

### Laptop

- Desktop navigation begins at 1024px in icon-only form, then reveals labels when adequate width is available.
- Creator shortcuts wait until 1280px; the role switcher and search do not compete with navigation at compact laptop widths.
- Content uses 32px gutters and remains inside named width constraints.

### Desktop

- At 1440px, full navigation labels, search, role context, wallet, and role-appropriate creator shortcut are available.
- Header and page geometry share the same shell/gutter contract.
- Existing page-specific multi-region layouts are preserved for later viewport patches.

### Wide

- Header and main application regions stop at 1536px and remain centred at 1920–2560px.
- Wide functional content stops at 1280px; feeds and dashboards do not stretch across the viewport.
- Full-width page backgrounds remain possible in the public layout without widening readable text.

## Validation

- TypeScript lint (`tsc --noEmit`): passed using the established dependency-complete validation mirror.
- Vite production build: passed with Vite 6.4.3; 2,305 modules transformed.
- Final output: 99.92kB CSS (15.11kB gzip); main JavaScript 391.70kB (115.29kB gzip); route splitting preserved.
- Browser runtime geometry: passed at 320×568, 390×844, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080, and 2560×1440.
- Representative routes exercised: `/feed`, `/explore`, `/messages`, `/wallet`, `/creator/studio`, and `/admin`.
- Horizontal overflow: none at the tested master widths after removing the root minimum-width defect.
- Header/content/navigation widths: no measured `scrollWidth` overflow.
- Browser console errors: none recorded during the final route checks.
- `git diff --check`: passed before result documentation and must be repeated in the final diff review.

The exact repository-local `bun run lint` and `bun run build` commands remain unavailable because Bun is not discoverable in the active shell. No package manager or lockfile was changed. The equivalent project scripts passed using the established C-drive validation mirror and Node runtime.

## Visual QA status

`PARTIAL_RUNTIME_VISUAL_QA`

The in-app browser successfully rendered the production preview, applied the master viewport sizes, and allowed live shell geometry and console inspection. The age-confirmation alert correctly occupied the critical layer and remained safe within the 320×568 viewport. It also obscured detailed routed content; the test did not assert an age or persist age verification on the user's behalf. Detailed page-level visual inspection therefore remains for the later viewport-family patches, while PATCH-01 shell geometry is runtime-verified.

## Known risks

- Real-device notch/home-indicator values remain dependent on physical safe-area testing; the CSS contract is present but desktop emulation reports zero inset.
- Detailed route visuals behind the age gate were not signed through during automated QA.
- 640–767px remains a fluid transition range using the tablet gutter and mobile navigation contract.
- The application currently has no persistent desktop sidebar. Width tokens are defined for future compatible geometry, but adding or redesigning a sidebar is outside PATCH-01.
- Page-specific feed cards, creator details, wallet cards, Studio metrics, KYC fields, and admin records intentionally remain for PATCH-02 through PATCH-08.
