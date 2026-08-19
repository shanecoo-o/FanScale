# FanScale

## Current status

FanScale currently represents a React/Vite frontend prototype. Product flows such as authentication, creator verification, payments, subscriptions, wallet activity, messaging, and administration use mock data or local component state; there is no production backend or database in this repository.

## Requirements

The baseline was verified on Windows with:

- Git 2.53.0
- Node.js 24.13.0
- Bun 1.3.14

Use current supported releases of Git and Node.js and Bun 1.3 or newer. Java and Docker are not required for the current frontend.

## Setup

```bash
git clone https://github.com/rachidecassimo/FanScale-.git
cd FanScale-
bun install
bun run dev
```

The Vite development server listens on `http://localhost:3000` and is exposed on all local interfaces.

## Available scripts

- `bun run dev` starts the Vite development server on port 3000.
- `bun run build` creates a production bundle in `dist/`.
- `bun run preview` previews the production bundle.
- `bun run lint` runs TypeScript validation without emitting files.
- `bun run clean` removes generated `dist/` and `server.js` files. The clean script requires a shell that provides `rm`.

## Environment

`.env.example` documents the legacy Google AI Studio variables `GEMINI_API_KEY` and `APP_URL`. The current frontend source does not read either variable, so no `.env.local` is required for local startup.

If environment variables become necessary, copy only documented keys to `.env.local` and provide local values there. Never commit `.env`, `.env.local`, credentials, or API tokens. The repository's `.gitignore` excludes `.env*` while retaining `.env.example`.

## Validation

```bash
bun run lint
bun run build
```

## Branching

Create a branch for feature, maintenance, and documentation work. Do not commit new work directly to `main`.

## Current architecture

- React 19 and TypeScript provide the UI and type system.
- Vite 6 provides development and production builds.
- Tailwind CSS 4 is loaded through the Vite plugin and `src/index.css`.
- `src/main.tsx` mounts the application and `src/App.tsx` coordinates navigation, modal state, and prototype interactions.
- `src/components/` contains the application views, navigation, cards, and modal components.
- `src/data/mockData.ts` supplies creators, posts, stories, conversations, notifications, wallet transactions, KYC requests, reports, reviews, and live sessions.
- `src/types.ts` defines the shared frontend models.

Important product flows currently rely on mock data and client-side state. They must be integrated with authenticated production services in a later phase; this repository does not currently contain a backend, database, payment gateway integration, or secure media service.
