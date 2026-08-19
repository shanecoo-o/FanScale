# FanScale current-state audit

Baseline date: 2026-08-20

## Frontend architecture

The repository is a client-only React 19 and TypeScript prototype built by Vite 6. Tailwind CSS 4 is integrated through `@tailwindcss/vite`; project-specific base styles and animations live in `src/index.css`.

`src/main.tsx` mounts `App` into `#root`. `src/App.tsx` is the central state and interaction coordinator. It owns the active role and navigation state, mock domain collections, modal visibility, wallet balance, notifications, and simulated product operations.

There is no router package. Views are selected through state in `App.tsx`. There is no backend source, API client layer, database configuration, server-side session management, or secure media service in the repository.

## Component inventory

The `src/components/` directory contains 26 components:

- application shell and navigation: `Header`, `BottomNav`, `LandingView`, `Feed`, and `ExplorePage`;
- creator and administration views: `CreatorProfileView`, `CreatorStudio`, `WalletView`, `MessagesView`, `NotificationsView`, and `AdminDashboard`;
- content components: `PostCard` and `StoriesReel`;
- authentication and confirmation UI: `LoginView`, `LogoutConfirmModal`, and `AgeGateModal`;
- product modals: `CreatePostModal`, `StoryViewerModal`, `SubscriptionModal`, `PaymentPromptModal`, `TipModal`, `KycModal`, `RateCreatorModal`, and `LiveRoomModal`.

## Mock-data and local-state dependencies

`src/data/mockData.ts` exports prototype collections for creators, posts, stories, conversations, notifications, wallet transactions, administrator reports, KYC requests, creator reviews, and live sessions.

`src/App.tsx` initializes these collections into React state and mutates them in memory. Authentication selects hard-coded prototype users after timeouts. Payment prompts, subscriptions, PPV unlocks, tips, wallet entries, KYC actions, post creation, and message activity are simulated locally. Refreshing the page resets this state. The age-gate acknowledgement is the only confirmed value persisted in `localStorage`.

## Scripts

- `dev`: Vite development server on `0.0.0.0:3000`, using the runner config loader.
- `build`: Vite production build, using the runner config loader.
- `preview`: Vite production preview, using the runner config loader.
- `lint`: TypeScript `--noEmit` validation.
- `clean`: POSIX-style removal of `dist` and `server.js`.

The runner config loader is used because Vite's default bundled config loader attempted to scan a sandbox-restricted parent directory in the verified Windows environment. `vite.config.ts` uses `import.meta.dirname` so the config remains valid as an ES module.

## Environment assumptions

- The repository uses `bun.lock`; Bun is the baseline package manager.
- `.env.example` lists `GEMINI_API_KEY` and `APP_URL` as Google AI Studio-era variables.
- Current source code does not reference those variables, so local startup does not require `.env.local`.
- `DISABLE_HMR=true` optionally disables HMR and file watching through `vite.config.ts`.
- `index.html` loads Outfit and Plus Jakarta Sans from Google Fonts, so those webfonts require network access at runtime; system fonts are configured as fallbacks.
- Several mock images are loaded from remote Unsplash URLs.

## Known technical debt

- `App.tsx` is a large stateful coordinator containing navigation and many domain workflows.
- `vite` is declared in both `dependencies` and `devDependencies`; Bun warns about the duplicate declaration.
- The `clean` script uses `rm -rf`, which is not portable to a default Windows command shell.
- There is no automated unit, integration, or end-to-end test script.
- There is no linting rule set beyond TypeScript checking.
- Prototype claims in UI copy about security, payments, KYC, moderation, and infrastructure are not backed by production services in this repository.

## Security baseline

`.gitignore` excludes `node_modules/`, `dist/`, logs, and `.env*`, while explicitly retaining `.env.example`. A non-invasive pattern scan found no committed real credentials. Matches were limited to environment-variable placeholders, dependency-lock metadata, UI copy, and password form state.

The prototype collects or displays sensitive-looking KYC, payment, and identity fields in the browser. Because processing is simulated and no secure backend exists, the current implementation is not suitable for real identity documents, credentials, money movement, or private media.

## Validation status

- `bun install`: PASS with Bun 1.3.14; warning for duplicate `vite` declaration.
- `bun run lint`: PASS before bootstrap changes.
- Initial `bun run build`: PRE-EXISTING ENVIRONMENT FAILURE while Vite's bundled config loader scanned a sandbox-restricted parent directory.
- Build with runner config loader before the ESM config fix: PRE-EXISTING SOURCE/CONFIG FAILURE because `__dirname` is undefined when the config runs as an ES module.
- Final `bun run lint`: PASS.
- Final `bun run build`: PASS. Vite emitted an existing chunk-size warning for the 921.63 kB minified JavaScript bundle (245.41 kB gzip).
- `bun run dev`: PRE-EXISTING ENVIRONMENT FAILURE. Vite starts on port 3000, but its esbuild dependency optimizer cannot traverse the fifth parent directory in the Codex filesystem sandbox and reports cascading false module-resolution failures. The referenced package files exist and the production build succeeds.
- `bun run preview -- --host 0.0.0.0 --port 4173`: requires the runner loader in this sandbox; after adding it to the script, the production preview returned HTTP 200 with the React root and generated asset entry.
- Browser automation: unavailable because the in-app browser runtime failed to initialize. HTTP smoke testing passed; visual rendering, browser console, and navigation interaction were not verified.

## Production blockers

- No authenticated backend or authorization enforcement.
- No database or durable state.
- No real payment-provider integration or transaction verification.
- No secure KYC document processing or storage.
- No secure media upload, storage, access control, or DRM implementation.
- No server-side moderation, audit trail, rate limiting, or operational monitoring.

These findings describe the current prototype only; no backend or product functionality was added during this bootstrap.
