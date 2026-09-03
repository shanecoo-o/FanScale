# PATCH-06 wide viewport polish

Implemented on 2026-09-03 for the 1920–2560px wide-display family. This pass preserves the established product geometry and makes the outer canvas intentional without stretching content, inventing side panels, or changing application behavior.

## Files changed

- `src/index.css`
- `docs/ui/viewport-patch-plan.md`
- `docs/implementation/viewport-polish-patch-06-wide.md`

## Shell max-width decision

The 1536px (`96rem`) application shell remains the final maximum. It already sits inside the preferred 1440–1600px range and keeps header controls, navigation, and routed content connected at 1920px and 2560px. Functional wide content remains capped at 1280px (`80rem`). No shell or page container was enlarged for PATCH-06.

## Outer whitespace strategy

From 1920px, a subtle stone canvas gradient frames the existing 1536px shell. The centre retains the established stone-50 product surface while the unused outer canvas eases toward stone-100. This treatment is presentation-only: it adds no decorative panels, content, click targets, spacing, or scroll regions.

At 1920px the shell has approximately 192px of outer space per side. At 2560px it has approximately 512px per side. Both remain symmetric around the same product centreline.

## Wide behavior

- **1920 × 1080:** centred 1536px shell; 1280px functional regions; stable full header; bounded Feed, context, dashboards, tables, and forms; subtle framed outer canvas.
- **2560 × 1440:** identical internal geometry with naturally larger outer whitespace; no attempt to consume the additional pixels or increase vertical rhythm.
- **Intermediate widths:** 1600px and 1728px retain the completed PATCH-05 surface; the wide canvas treatment enters at 1920px and remains stable through 2048px and 2560px.
- **1536 regression:** no wide rule applies, so PATCH-05 proportions remain unchanged.

## Screen decisions

- **Feed/context:** unchanged at 672px plus 352px with a 40px gap. Stories remain inside the primary feed column; context remains secondary and visually attached.
- **Explore:** retained four columns inside the 1280px region. Five columns would reduce cards to roughly 227px and create a weak final row with the current four live sessions and six creators; six columns would make interactive cards too narrow. Discovery remains substantial rather than artificially dense.
- **Creator Profile:** retained the cohesive 1024px profile container, bounded cover, 672px text regions, and four-column media grid.
- **Messages:** retained the 1280px workspace and 352px conversation rail. The active thread and composer do not expand with the browser; no unsupported third pane was invented.
- **Wallet:** retained the 1280px two-region summary and bounded transaction content. Amount/status alignment and truncated descriptions prevent uncontrolled row width.
- **Creator Studio:** retained the 1280px KPI row and 8/4 analytical composition. The primary chart remains under approximately 800px rather than expanding across the shell.
- **Admin:** retained the 1280px KPI, moderation, and metric regions. Record actions stay attached to their metadata rather than drifting to the viewport edge.
- **KYC/Auth/Notifications:** retained the 896px form, focused authentication card, and 768px reading widths respectively.
- **Dialogs:** retained the shared purpose-specific maximum widths and existing internal scroll ownership.
- **Landing/loading/error/empty states:** remain centred within their existing functional regions; full-width public backgrounds can extend independently without widening readable copy.

## Validation

- TypeScript lint: passed through the established mirror, bundled Node running local `typescript/bin/tsc --noEmit`. Bun is unavailable on this host.
- Production build: passed through the established mirror, bundled Node running local Vite with `build --configLoader runner`; 2,303 modules transformed.
- Generated CSS: verified for the 1920px media query, stone canvas, and 1536px-centred gradient stops.
- Diff check: passed. The tracked diff is restricted to the wide-only canvas treatment and PATCH-06 documentation; routes, data, APIs, mocks, lockfiles, and business logic remain unchanged.
- Browser geometry: 1536×864, 1600×900, 1728×1117, 1920×1080, 2048×1152, and 2560×1440 all reported no horizontal overflow and no warning/error console entries.
- Browser measurement: the header remained 1536px wide from 1600 upward; its measured left edge progressed from 29px at 1600 to 189px at 1920 and 509px at 2560 after accounting for the browser scrollbar. The public hero remained 1152px wide.
- Visual QA: 1920×1080 and 2560×1440 are `VISUALLY_VERIFIED` for the public shell, outer canvas, and age gate. The gate remained centred within the layout viewport, fully contained, and was not bypassed. Protected screens are `STATICALLY_VERIFIED` through source inspection, TypeScript, and the production build.

## Remaining wide risks

- The outer-canvas treatment is intentionally subtle and may appear flatter on poorly calibrated high-brightness displays.
- Protected route contents cannot be claimed as visually verified while the age gate remains active; their geometry remains source/build verified.
- Viewports above 2560px retain the same 1536px shell by design and may require product art direction only if future brand assets justify it.
