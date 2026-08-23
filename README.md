# FanScale

## Current status

FanScale contains a React/Vite frontend prototype and the production-oriented foundation for a Java Spring Boot modular-monolith backend. Product flows such as authentication, creator verification, payments, subscriptions, wallet activity, messaging, and administration still use frontend mocks; the backend currently implements infrastructure and health proofs only.

## Requirements

Frontend development requires:

- Git 2.53.0
- Node.js 24.13.0
- Bun 1.3.14

Backend development additionally requires:

- Java 21 LTS
- Docker with Compose v2

Use current supported releases of Git and Node.js and Bun 1.3 or newer. Maven is supplied through `backend/mvnw` and `backend/mvnw.cmd`.

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

`.env.example` documents frontend API mode, local backend/PostgreSQL variables, CORS/OpenAPI switches, and legacy Google AI Studio placeholders. Local Compose defaults are explicitly non-production; staging and production secrets must come from managed environment configuration.

Copy only documented keys into an ignored `.env` or `.env.local` as appropriate. Never commit either file, credentials, or API tokens. The repository's `.gitignore` excludes `.env*` while retaining `.env.example`.

## Validation

```bash
bun run lint
bun run build
```

Backend validation, from `backend/`, requires Java 21 and running Docker because integration tests use PostgreSQL Testcontainers:

```powershell
.\mvnw.cmd clean verify
```

Start the local PostgreSQL service from the repository root, then run the backend with the local profile:

```powershell
docker compose up -d postgres
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

See `backend/README.md` for profiles, Flyway, security boundaries, configuration, and foundation endpoints.

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
- `backend/` contains the Java 21 / Spring Boot 4.1.1 modular-monolith foundation.
- `compose.yaml` provides local PostgreSQL with a healthcheck and persistent volume.
- `contracts/openapi/fanscale-api-v1.yaml` remains the canonical `/api/v1` product contract.

Important product flows still rely on mock data and client-side state. They must be integrated with authenticated production services in later phases; the new backend foundation does not yet implement business APIs, payment gateways, KYC storage, ledger accounting, or secure media delivery.
