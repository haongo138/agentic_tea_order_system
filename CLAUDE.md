# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lamtra** is a milk tea chain ordering system (Vietnamese school project / đồ án). It consists of:

| Service | Stack | Status |
|---------|-------|--------|
| `client/` | Next.js 15 + Turborepo monorepo | Active — primary frontend |
| `server/` | Express 5 + TypeScript + Drizzle ORM | Active — API backend |
| `backend-api/` | PHP (vanilla, MVC structure) | Deprecated — replaced by `server/` |
| `ai-service/` | Python + FastAPI | Empty scaffolding |

## Quick Start (Devbox)

```bash
devbox shell              # Activate isolated dev environment (Node 20)
devbox run install        # Install all npm dependencies (client + server)
devbox services up        # Start all services via process-compose
```

| Service | URL |
|---------|-----|
| Customer app | http://localhost:3000 |
| Admin app | http://localhost:3001 |
| Express API | http://localhost:4000 |

## Environment Setup

```bash
cd server
cp .env.example .env     # Then fill in values below
```

Required environment variables (`server/.env`):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL direct connection string |
| `JWT_SECRET` | At least 32 chars — `openssl rand -base64 48` |
| `JWT_EXPIRES_IN` | Token TTL (default: `7d`) |
| `SUPABASE_URL` | Supabase project URL (for storage) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for storage) |
| `AUTO_DELIVERY_MINUTES` | Auto-deliver threshold in minutes (default: `10`) |

## Commands

### Frontend (`client/`)

```bash
cd client
npm install           # Install all workspace deps
npm run dev           # Run both apps in parallel
npm run dev:customer  # Customer app only → http://localhost:3000
npm run dev:admin     # Admin app only → http://localhost:3001
npm run build         # Build all apps
npm run type-check    # TypeScript check across all packages
npm run lint          # Lint all packages
```

### Backend API (`server/`)

```bash
cd server
npm install           # Install dependencies
npm run dev           # Start dev server (tsx watch) → http://localhost:4000
npm run build         # Compile TypeScript
npm run test          # Run tests (vitest)
npm run db:generate   # Generate Drizzle migrations
npm run db:migrate    # Run pending migrations
npm run db:push       # Push schema to database
npm run db:seed       # Seed database with initial data (scripts/seed.sql)
npm run db:reset      # Run migrations + seed in one step
npm run db:studio     # Open Drizzle Studio
```

## Architecture

### Client Monorepo (`client/`)

Turborepo workspace with:
- `apps/customer/` — Next.js 15 customer ordering app
- `apps/admin/` — Next.js 15 admin control panel
- `packages/ui/` — Shared React component library (`@lamtra/ui`)

Both apps use `transpilePackages: ["@lamtra/ui"]` — no separate build step for the UI package.

### Customer App (`client/apps/customer/`)

**Next.js 15 App Router routes:**
- `/` → Homepage (hero, featured products, loyalty section)
- `/menu` → Product catalogue with category filter + search
- `/menu/[id]` → Product detail with size/ice/sugar/topping customization
- `/cart` → Shopping cart review + checkout (supports guest checkout)
- `/track` → Guest order tracking by order ID + phone
- `/orders` → Order history (authenticated users)
- `/login` → Customer login
- `/branches` → Branch listing
- `/news` → News articles
- `/about` → About Lam Trà

**Design tokens** (`tailwind.config.ts`): `lam-cream`, `lam-green`, `lam-gold`, `lam-terracotta`
**Fonts**: Cormorant Garamond (display) + Figtree (body) via `next/font/google`

### Admin App (`client/apps/admin/`)

**Next.js 15 App Router routes:**
- `/` → Dashboard (KPI cards, revenue chart, live order feed)
- `/orders` → Order management with status advancement
- `/menu` → Product CRUD + availability toggle
- `/menu/[id]` → Edit product
- `/menu/create` → Create product
- `/staff` → Staff directory
- `/staff/[id]` → Edit staff member
- `/staff/create` → Create staff member
- `/branches` → Branch metrics
- `/news` → News management
- `/login` → Admin login

**Design tokens** (`tailwind.config.ts`): `admin-bg`, `admin-surface`, `admin-gold`, `admin-emerald`, `admin-rose`, `admin-sky`
**Fonts**: Sora (display) + JetBrains Mono (data values) via `next/font/google`

### Shared UI Package (`client/packages/ui/`)

Components: `Button` (CVA variants for both themes), `Badge`, `Input`, `Rating`
Utility: `cn()` via `clsx` + `tailwind-merge`
Import as: `import { Button, cn } from "@lamtra/ui"`

### Express API (`server/`)

TypeScript backend with Express 5, Drizzle ORM, and Supabase PostgreSQL:
```
src/
  server.ts              Entry point (HTTP + Socket.IO)
  app.ts                 Express app config (helmet, cors, rate-limit, morgan)
  config/env.ts          Zod-validated environment variables
  config/swagger.ts      OpenAPI/Swagger setup
  config/supabase.ts     Supabase client (for storage)
  db/index.ts            Drizzle database client
  db/schema/             Drizzle ORM table schemas (core, orders, relations)
  routes/                Public API routes (auth, products, orders, branches)
  routes/admin/          Admin API routes (dashboard, employees, products, news, upload)
  controllers/           Public request handlers
  controllers/admin/     Admin request handlers (dashboard, employees, products, news)
  middleware/auth.ts     JWT authentication middleware
  middleware/upload.ts   Multer file upload middleware
  middleware/validate.ts Zod request validation
  validators/            Zod schemas for request validation
  sockets/               Socket.IO event handlers (real-time order updates)
  utils/                 Shared utilities
scripts/
  seed.sql               Database seed data
  seed.ts                Seed runner
  migrate.ts             Migration runner
```

Key dependencies: Express 5, Drizzle ORM, Zod, Helmet, Swagger UI, Socket.IO, node-cron
Database: Supabase PostgreSQL (connection via `DATABASE_URL` env var)
Storage: Supabase Storage (product/news images)
Testing: Vitest + Supertest

### Business Workflows

- **Ordering**: Product selection → Cart review → Payment → Confirmation (supports guest checkout without account)
- **Payment**: COD or online bank transfer
- **Order status lifecycle**: `pending` → `preparing` → `ready` → `delivering` → `delivered` → `completed` (also `cancelled`)
- **Auto-delivery scheduler**: Orders in `delivering` status auto-advance to `delivered` after configurable timeout (node-cron)
- **Real-time updates**: Socket.IO broadcasts order status changes to admin dashboard
- **Loyalty points**: Auto-accumulated after completed orders
- **Post-order reviews**: Customer feedback after delivery

## Language & Conventions

- Vietnamese is used in UI text and git commit messages — this is expected
- Component names and TypeScript types are in English
- CSS via Tailwind in the `client/` monorepo
