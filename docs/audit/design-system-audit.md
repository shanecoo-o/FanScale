# Design-system audit

## Executive assessment

FanScale already has a recognizable warm creator-economy identity: stone neutrals, pink/rose accents, rounded surfaces, friendly typography, image-led cards, and energetic success effects. The identity is consistent enough to preserve, but its implementation is primarily copied Tailwind utility combinations. Tokens, variants, accessibility contracts, and responsive behavior are not centralized. The next step is codification, not a visual reset.

## Current visual language

| Area | Current evidence | Status | Risk | Recommendation |
|---|---|---|---|---|
| Brand color | Pink and rose accents dominate CTAs, selected states, badges, gradients, and feedback. | Partially centralized through Tailwind palette names | Raw palette shades encode meaning differently across files. | Create semantic roles such as `brand`, `brand-hover`, `accent-soft`, `danger`, `success`, and `focus`. |
| Neutral color | Stone 50–900 is the primary background/text scale. | Repeated | Muted text, disabled text, borders, and surfaces lack tested contrast contracts. | Define semantic canvas, surface, elevated, border, text, and muted-text tokens. |
| Gradients | Pink-to-rose gradients appear in CTAs, avatars, hero regions, and celebratory states. | Duplicated | Gradients can become decoration without hierarchy and complicate contrast. | Keep two named gradients: brand action and decorative wash; disallow text over untested gradients. |
| Typography | Heavy bold/black weights, compact labels, and many 9–11 px arbitrary sizes. | Inconsistent | Very small labels harm readability and browser zoom behavior. | Define display, heading, body, label, caption, and numeric styles; keep general UI text at 12 px or larger. |
| Font family | System/default sans treatment. | Implicit | Platform variation is uncontrolled. | Declare a tested system stack or intentional product family with metric fallbacks. |
| Spacing | Tailwind spacing is used broadly but component gaps are selected locally. | Duplicated | Similar cards/forms have subtly different rhythm. | Define compact/default/comfortable density and page/section/field gap tokens. |
| Radius | `rounded-full` (302), `rounded-2xl` (109), `rounded-xl` (89), and `rounded-3xl` (76) are heavily repeated. | Duplicated | Excess radius levels reduce hierarchy and complicate nested surfaces. | Use named control, card, panel, dialog, and pill radii with rules for nesting. |
| Shadows | `shadow-sm` (108), `shadow-md` (52), and colored shadows are repeated. | Duplicated | Elevation meaning is unclear and colored shadows may reduce restraint. | Define three elevation levels and one optional celebratory brand shadow. |
| Borders | Stone/pink borders mark cards, inputs, selection, and separation. | Partially consistent | Focus, selected, error, and hover borders can overlap semantically. | Separate structural border from interactive state ring tokens. |
| Buttons | Solid pink, gradient, neutral, outlined, icon, and destructive patterns recur. | Duplicated | Loading, disabled, focus, icon-only naming, and target sizes vary. | Build `Button` and `IconButton` with semantic variants, sizes, busy state, and 44 px compact minimum. |
| Inputs | Rounded bordered inputs with pink focus rings are common. | Duplicated | Labels, help text, errors, adornments, and autofill behavior vary. | Build field primitives with stable label/control/error relationships and mobile input attributes. |
| Cards | Highly rounded white/stone cards organize posts, creators, stats, wallet, and admin content. | Duplicated | Cards are used where sections, list rows, or tables may communicate better. | Define content card, action card, metric card, list row, and data record variants. |
| Badges | Pills represent roles, visibility, price, state, and counts. | Duplicated | Color alone may carry meaning. | Build a badge with text/icon semantics and neutral/success/warning/danger/info variants. |
| Avatars | Circular remote images, often with status or verification markers. | Duplicated | Broken-image, alt, sizes, and status announcements are inconsistent. | Create avatar sizes, fallback initials, status semantics, and intrinsic dimensions. |
| Navigation | Header, bottom nav, tabs, profile tabs, and dashboard controls each implement state locally. | Inconsistent | Active state, route identity, keyboard behavior, and responsive priority diverge. | Bind navigation components to typed routes and `aria-current`. |
| Modals | At least 15 fixed-inset overlays implement similar shells independently. | Hardcoded/duplicated | Focus, Escape, safe area, overflow, layering, and mobile layout are unsafe. | One accessible dialog foundation with alert-dialog, sheet, and full-screen variants. |
| Tables/data lists | Wallet, admin, messages, and notifications improvise record layouts. | Inconsistent | Responsive behavior and row actions are not predictable. | Define desktop table plus compact disclosure-card transformation. |
| Charts | Creator Studio uses Recharts with screen-local styling. | Isolated | Colors, typography, mobile behavior, and accessible equivalents are undefined. | Add chart tokens, tooltip/legend wrappers, compact layouts, and text/table summaries. |
| Motion | Many `transition-all` utilities and confetti effects. | Hardcoded | Unnecessary property animation and no reduced-motion response. | Use property-specific motion tokens and a global reduced-motion policy. |
| Z-index/layers | Fixed overlays and shell controls choose layering locally. | Hardcoded | Modal, toast, header, and live overlays can conflict. | Define layer tokens for base, sticky, header, popover, sheet, modal, toast, and critical alert. |

## Recommended semantic tokens

The token names describe purpose and can initially map to the existing Tailwind values.

| Token group | Required tokens | Intent |
|---|---|---|
| Color | `canvas`, `surface`, `surface-muted`, `surface-elevated`, `text`, `text-muted`, `border`, `brand`, `brand-hover`, `brand-soft`, `focus`, `success`, `warning`, `danger`, `info`, `scrim` | Decouple component meaning from raw pink/stone shade numbers. |
| Typography | `display`, `h1`, `h2`, `h3`, `body`, `body-strong`, `label`, `caption`, `numeric` | Bound size, line height, weight, and letter spacing. |
| Spacing | `page-gutter`, `section-gap`, `stack-1` through `stack-6`, `field-gap`, `control-inline-gap` | Preserve consistent rhythm across widths and densities. |
| Sizing | `touch-target`, `control-sm`, `control-md`, `control-lg`, `content-reading`, `content-wide`, `sidebar`, `avatar-*` | Prevent arbitrary control and container dimensions. |
| Shape | `radius-control`, `radius-card`, `radius-panel`, `radius-dialog`, `radius-pill` | Make surface hierarchy intentional. |
| Elevation | `elevation-1`, `elevation-2`, `elevation-3`, `elevation-brand` | Tie shadow to layering rather than component preference. |
| Motion | `duration-fast`, `duration-base`, `duration-slow`, `ease-standard`, `ease-emphasized`, `motion-distance` | Limit animated properties and support reduced motion. |
| Layout | `safe-top`, `safe-right`, `safe-bottom`, `safe-left`, `header-height`, `bottom-nav-height`, `dialog-gutter` | Make shell offsets and device cutouts composable. |
| Layers | `z-sticky`, `z-header`, `z-popover`, `z-sheet`, `z-modal`, `z-toast`, `z-critical` | Prevent stacking-context accidents. |

Contrast ratios must be measured before exact semantic color mappings are approved. Tokenization must not bless an inaccessible current value.

## Component foundation

| Primitive | Responsibilities | Why it is required before feature work |
|---|---|---|
| `AppShell` | Header/bottom-nav slots, safe-area offsets, main landmark, skip link, route outlet, toast portal. | Fixes global overlap and establishes one viewport contract. |
| `PageContainer` | Fluid gutters and bounded readable/wide sizes. | Removes repeated `max-w-*` and padding decisions. |
| `Stack` / `Inline` | Responsive gap, alignment, wrap, and collapse behavior. | Replaces ad hoc flex combinations. |
| `ResponsiveGrid` | Minimum item width and explicit column caps. | Prevents premature tablet grids. |
| `Button` / `IconButton` | Variants, sizes, accessible names, busy/disabled state, focus, touch target. | More than 200 current buttons need one interaction contract. |
| `Field` family | Label, input, select, textarea, hint, error, adornment, input mode. | Authentication, KYC, payments, and creation depend on reliable forms. |
| `Dialog` / `AlertDialog` / `Sheet` | Focus lifecycle, Escape, labelling, scroll lock, safe areas, responsive presentation. | Every sensitive modal currently duplicates unsafe behavior. |
| `ToastViewport` | Live-region semantics, safe placement, deduplication, timeout and dismissal. | Mutations need accessible, consistent feedback. |
| `Tabs` / `ScrollableTabs` | Roving focus, active route state, compact overflow. | Profiles, creator tools, and dashboards need mobile-safe navigation. |
| `Media` / `Avatar` | Aspect ratio, intrinsic dimensions, loading, fallback, responsive sources, access-state placeholder. | Current remote images risk layout shift and entitlement leakage. |
| `Card` / `ListRow` / `DataRecord` | Consistent density, hierarchy, actions, and compact disclosure. | Feed, wallet, notifications, and admin currently diverge. |
| `StatusBadge` | Semantic tone plus text/icon, not color alone. | KYC, payment, report, post, and live states require consistent meaning. |
| `EmptyState` / `ErrorState` / `Skeleton` | Standard recovery action, busy semantics, and layout stability. | Current local-state screens lack a complete async state model. |
| `Currency` / `DateTime` | Locale-aware display, precise labels, timezone handling. | Wallet and content timestamps must not be formatted ad hoc. |
| `ChartFrame` | Responsive dimensions, semantic title/summary, tokens, loading/empty state. | Keeps Recharts isolated and usable on compact screens. |

## Governance rules

1. Feature code consumes semantic tokens and primitives; it does not introduce arbitrary colors, radii, shadows, z-indexes, or sub-12 px general-purpose text without review.
2. All interactive primitives ship keyboard, focus-visible, accessible-name, disabled, busy, error, reduced-motion, and touch-target behavior together.
3. Variants express semantics such as primary, danger, warning, selected, or quiet; they do not encode a screen name.
4. Responsive behavior belongs to primitives and documented composition patterns, with exceptions recorded at feature level.
5. Visual regression stories must cover 320, 390, 768, 1024, and 1440 widths plus long text, large text, empty, error, loading, disabled, and reduced-motion states.
6. Dark mode is not a prerequisite for the first extraction. Semantic tokens should make it possible without requiring an immediate second theme.
7. Tailwind can remain the implementation mechanism; the design system is the semantic API and behavioral contract above it.

## Extraction sequence

First extract tokens and the shell, then buttons/fields/focus, then dialogs/toasts, then layout/tabs, followed by media/data-display primitives and charts. Migrate one complete vertical slice—authentication, then feed/post—before broad mechanical replacement. This validates APIs against real forms, navigation, media, and mutations while preserving the current pink/stone identity.

