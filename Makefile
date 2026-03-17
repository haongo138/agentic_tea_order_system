.PHONY: help

# Default target
help:
	@echo ""
	@echo "  Lam Trà — available commands"
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
	@echo "    make server:start         Start PHP dev server  →  http://localhost:8000"
	@echo "    make server:logs          Tail PHP error log"
	@echo ""
	@echo "  ai:"
	@echo "    make ai:install           Install Python dependencies"
	@echo "    make ai:start             Start AI service  →  http://localhost:8001"
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

# ── server: ───────────────────────────────────────────────────────────────────

server\:start:
	php -S localhost:8000 -t backend-api/public backend-api/index.php

server\:logs:
	tail -f backend-api/logs/error.log

# ── ai: ───────────────────────────────────────────────────────────────────────

ai\:install:
	cd ai-service && pip install -r requirements.txt

ai\:start:
	cd ai-service && python main.py
