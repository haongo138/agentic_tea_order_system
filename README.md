# Lamtra — Milk Tea Ordering System

Hệ thống bán trà sữa trực tuyến cho chuỗi **Lam Trà**, phục vụ mục tiêu đồ án học phần và định hướng xây dựng hệ thống thực tế.

## Kiến trúc

```
lamtra-system/
├── client/                 # Next.js 15 + Turborepo monorepo
│   ├── apps/customer/      #   Website khách hàng       → :3000
│   ├── apps/admin/         #   Website quản trị          → :3001
│   └── packages/ui/        #   Shared component library  (@lamtra/ui)
├── server/                 # Express 5 + TypeScript API  → :4000
│   ├── src/
│   │   ├── db/schema/      #   Drizzle ORM schemas
│   │   ├── routes/         #   Public API routes
│   │   ├── routes/admin/   #   Admin API routes
│   │   ├── controllers/    #   Request handlers
│   │   ├── middleware/     #   Auth, upload, validation
│   │   ├── sockets/        #   Socket.IO (real-time orders)
│   │   └── validators/     #   Zod request schemas
│   └── scripts/            #   DB seed & migration scripts
├── ai-service/             # Python + FastAPI (planned)
├── docs/                   # Tài liệu dự án
├── devbox.json             # Devbox environment config
└── process-compose.yml     # Service orchestration
```

## Công nghệ sử dụng

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Turborepo |
| Backend | Express 5, TypeScript, Drizzle ORM, Zod, Swagger, Socket.IO |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage (images) |
| Scheduler | node-cron (auto-delivery) |
| AI Service | Python, FastAPI (planned) |

## Tính năng chính

- Đặt hàng trực tuyến (hỗ trợ đặt hàng không cần tài khoản — guest checkout)
- Quản lý đơn hàng realtime qua Socket.IO
- Vòng đời đơn hàng: `pending` → `preparing` → `ready` → `delivering` → `delivered` → `completed`
- Tự động chuyển trạng thái giao hàng (auto-delivery scheduler)
- Tra cứu đơn hàng cho khách vãng lai (theo mã đơn + số điện thoại)
- Hệ thống điểm tích lũy (loyalty points)
- Đánh giá đơn hàng sau khi nhận
- Upload hình ảnh sản phẩm/tin tức qua Supabase Storage

## Quick Start

### With Devbox (recommended)

```bash
devbox shell              # Activate isolated dev environment (Node 20)
devbox run install        # Install all dependencies
devbox services up        # Start all services
```

### Without Devbox

```bash
# Backend
cd server
cp .env.example .env      # Configure DATABASE_URL, JWT_SECRET, SUPABASE_URL, etc.
npm install
npm run db:migrate         # Run database migrations
npm run db:seed            # Seed initial data
npm run dev                # Express API (:4000)

# Frontend
cd client
npm install
npm run dev                # Customer (:3000) + Admin (:3001)
```

### Biến môi trường (`server/.env`)

Copy từ `server/.env.example` và điền các giá trị:

| Biến | Mô tả |
|------|--------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `JWT_SECRET` | Ít nhất 32 ký tự — `openssl rand -base64 48` |
| `JWT_EXPIRES_IN` | Thời hạn token (mặc định: `7d`) |
| `SUPABASE_URL` | URL dự án Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (cho storage) |
| `AUTO_DELIVERY_MINUTES` | Thời gian tự động giao hàng, phút (mặc định: `10`) |

### Make shortcuts

```bash
make help                 # List all commands
make install              # Install all dependencies
make dev                  # Start all services via devbox
```

## Available Commands

### Frontend (`client/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Run customer + admin in parallel |
| `npm run dev:customer` | Customer app only (:3000) |
| `npm run dev:admin` | Admin app only (:3001) |
| `npm run build` | Production build |
| `npm run type-check` | TypeScript check across all packages |
| `npm run lint` | Lint all packages |

### Backend (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (:4000) |
| `npm run build` | Compile TypeScript |
| `npm run test` | Run tests (Vitest) |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:reset` | Run migrations + seed in one step |
| `npm run db:studio` | Open Drizzle Studio |

## Quy tắc làm việc nhóm

- Không commit file `.env` — mỗi thành viên tự tạo từ `.env.example`
- Mỗi tính năng làm trên **branch riêng**
- Chỉ merge vào `main` khi hoàn thành và test

## Tài liệu

Xem chi tiết trong thư mục [`docs/`](./docs)

---

© 2026 — Lamtra Online Milk Tea System
