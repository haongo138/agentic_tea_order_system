# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lamtra** is a milk tea chain ordering system (Vietnamese school project / đồ án). It consists of:

| Service | Stack | Status |
|---------|-------|--------|
| `client/` | Next.js 15 + Turborepo monorepo | Active — primary frontend |
| `backend-api/` | PHP (vanilla, MVC structure) | Scaffolded only |
| `ai-service/` | Python + FastAPI | Empty scaffolding |
| `frontend-customer/` | React 19 + Vite | Legacy — to be removed |
| `frontend-admin/` | React 19 + Vite | Legacy — to be removed |

## Commands

All frontend commands run from the `client/` directory:

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

### Backend API
No build step — PHP served directly. Configure a local PHP server pointing at `backend-api/index.php`.

### AI Service
```bash
cd ai-service
pip install -r requirements.txt
python main.py
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

**Design tokens** (`tailwind.config.ts`): `lam-cream`, `lam-green`, `lam-gold`, `lam-terracotta`
**Fonts**: Cormorant Garamond (display) + Figtree (body) via `next/font/google`

### Admin App (`client/apps/admin/`)

**Next.js 15 App Router routes:**
- `/` → Dashboard (KPI cards, revenue chart, live order feed)
- `/orders` → Order management with status advancement
- `/menu` → Product availability toggle
- `/branches` → Branch metrics
- `/staff` → Staff directory

**Design tokens** (`tailwind.config.ts`): `admin-bg`, `admin-surface`, `admin-gold`, `admin-emerald`, `admin-rose`, `admin-sky`
**Fonts**: Sora (display) + JetBrains Mono (data values) via `next/font/google`

### Shared UI Package (`client/packages/ui/`)

Components: `Button` (CVA variants for both themes), `Badge`, `Input`, `Rating`
Utility: `cn()` via `clsx` + `tailwind-merge`
Import as: `import { Button, cn } from "@lamtra/ui"`

### Backend API (`backend-api/`)

MVC folder structure is in place but empty:
```
app/controllers/   models/   routes/   services/
    middlewares/   views/    helpers/
config/app.php     config/database.php
index.php          (entry point)
```

Planned: JWT authentication, RESTful endpoints under `/api/*`, PDO for database access.

### Business Workflows (from `docs/workflow.md`)

Key flows to implement:
- **Ordering**: Product selection → Cart review → Payment → Confirmation
- **Payment**: COD or online bank transfer
- **Order status lifecycle**: Received → Prepared → Collected → Paid
- **Loyalty points**: Auto-accumulated after completed orders
- **Post-order reviews**: Customer feedback after delivery

## Language & Conventions

- Vietnamese is used in UI text, route names, and git commit messages — this is expected
- Component names and TypeScript types are in English
- CSS via Tailwind in the `client/` monorepo; legacy `frontend-*` apps use colocated CSS modules
