.PHONY: help

# Default target
help:
	@echo ""
	@echo "  Lam Trà — available commands"
	@echo ""
	@echo "  devbox:"
	@echo "    make dev                  Start all services (devbox + process-compose)"
	@echo "    make install              Install all dependencies"
	@echo ""
	@echo "  client:"
	@echo "    make client:install       Install all npm dependencies"
	@echo "    make client:dev           Run customer + admin in parallel"
	@echo "    make client:dev-customer  Customer app only  →  http://localhost:3000"
	@echo "    make client:dev-admin     Admin app only     →  http://localhost:3001"
	@echo "    make client:build         Production build (all apps)"
	@echo "    make client:lint          Lint all packages"
	@echo "    make client:type-check    TypeScript check across all packages"
	@echo "    make client:clean         Remove node_modules and build artifacts"
	@echo ""
	@echo "  server:"
	@echo "    make server:dev           Start Express API  →  http://localhost:4000"
	@echo "    make server:install       Install server dependencies"
	@echo "    make server:test          Run server tests"
	@echo "    make server:build         Build server for production"
	@echo ""

# ── client: ───────────────────────────────────────────────────────────────────

client\:install:
	cd client && npm install

client\:dev:
	cd client && npm run dev

client\:dev-customer:
	cd client && npm run dev:customer

client\:dev-admin:
	cd client && npm run dev:admin

client\:build:
	cd client && npm run build

client\:lint:
	cd client && npm run lint

client\:type-check:
	cd client && npm run type-check

client\:clean:
	rm -rf client/node_modules client/apps/customer/.next client/apps/admin/.next client/.turbo

# ── devbox: ───────────────────────────────────────────────────────────────────

dev:
	devbox services up

install:
	devbox run install

# ── server: ───────────────────────────────────────────────────────────────────

server\:install:
	cd server && npm install

server\:dev:
	cd server && npm run dev

server\:test:
	cd server && npm run test

server\:build:
	cd server && npm run build
