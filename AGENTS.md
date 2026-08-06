# Service Marketplace - Agent Instructions

## Project Overview
Self-hosted service marketplace platform with React frontend (Cloudflare Pages) and Fastify backend (Docker/VPS).

**Stack:**
- Frontend: React 18 + TypeScript + Vite + TanStack Router + Tailwind CSS
- Backend: Fastify + TypeScript + Prisma + PostgreSQL + Redis + BullMQ
- Deployment: Cloudflare Pages (frontend) + Docker Compose (backend on VPS)

## Repository Structure
```
service-marketplace/
├── web/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages (Dashboard, Marketplace)
│   │   ├── hooks/          # Zustand stores
│   │   ├── utils/          # Helpers (cn, api)
│   │   └── styles/         # Global CSS + Tailwind
│   ├── tailwind.config.js  # Design system tokens
│   └── wrangler.toml       # Cloudflare Pages config
├── server/                 # Backend (Fastify)
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   └── plugins/        # Fastify plugins
│   └── prisma/schema.prisma
├── worker/                 # Cloudflare Worker (Hono) - alternative backend
├── docker/                 # Docker Compose files
├── design-system/          # Generated from ui-ux-pro-max-skill
└── .github/workflows/      # CI/CD
```

## Design System (ui-ux-pro-max)
**Pattern:** Marketplace / Directory (search-first)
**Style:** Vibrant & Block-based
- Primary: `#7C3AED` (Trust purple)
- Accent/CTA: `#16A34A` (Transaction green)
- Fonts: Fira Code (mono/headings) + Fira Sans (body)
- Spacing: 48px+ macro gaps, 200-300ms transitions
- No emojis as icons - use Lucide React

Key files: `design-system/service-marketplace/MASTER.md`, `web/tailwind.config.js`

## Development Commands
```bash
# Frontend
cd web && npm run dev        # Dev server (port 5173)
cd web && npm run build      # Production build → dist/
cd web && npm run typecheck  # TypeScript check

# Backend
cd server && npm run dev     # Dev server (port 3000)
cd server && npm run build   # Build → dist/
cd server && npm run typecheck

# Database
cd server && npx prisma migrate dev
cd server && npx prisma studio
```

## Key Patterns

### Frontend Routing (TanStack Router v1)
- File-based routes in `src/routes/`
- `routeTree.gen.ts` auto-generated
- Search params via `useSearch()`
- Navigation via `Link` or `useNavigate()`

### State Management (Zustand)
- `useAuthStore.ts` - auth tokens + user
- Persist middleware for tokens
- Dynamic import to break circular deps with api.ts

### API Client
- `web/src/utils/api.ts` - Axios instance with interceptors
- Auto-attaches JWT from localStorage
- 401 → clears auth store + redirects to login

### Backend Auth
- JWT in cookies (httpOnly)
- `@fastify/jwt` + `@fastify/cookie`
- Middleware: `server/src/middleware/auth.ts`

### Database (Prisma)
- Schema: `server/prisma/schema.prisma`
- Models: User, Project, Service, Deployment, AuditLog, Session
- Run migrations: `npx prisma migrate deploy` (prod)

## Deployment

### Frontend (Cloudflare Pages)
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `web`
- SPA redirects: `public/_redirects` → `/* /index.html 200`
- Env var: `VITE_API_URL` (build-time)

### Backend (VPS Docker)
```bash
# On VPS
./deploy-vps.sh
# Requires .env with: POSTGRES_PASSWORD, JWT_SECRET, FRONTEND_URL, APP_URL, LETSENCRYPT_EMAIL, DOMAIN
```
- Services: postgres, redis, server (Fastify), traefik (auto-TLS)
- Docker Hub: `okongzinc/service-marketplace-api`

### CI/CD (GitHub Actions)
- `.github/workflows/deploy.yml` - Pages + Docker Hub
- `.github/workflows/deploy-vps.yml` - VPS SSH deploy
- Required secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `DOCKERHUB_TOKEN`, `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`

## Common Tasks

### Add New Page
1. Create `web/src/pages/<name>/<Name>Page.tsx`
2. Add route to `web/src/routes/` (auto-generated)
3. Follow design system: hero search, cards, bento grid

### Add API Endpoint
1. Create route in `server/src/routes/<name>.ts`
2. Register in `server/src/routes/index.ts`
3. Add types to `server/src/types/fastify.d.ts` if needed

### Update Design System
```bash
cd /c/Users/asusv/service-marketplace
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Service Marketplace" --output-dir .
```

## Anti-Patterns (Do Not)
- ❌ Emojis as icons (use Lucide)
- ❌ Missing `cursor-pointer` on clickable elements
- ❌ Raw hex colors in components (use Tailwind tokens)
- ❌ Instant state changes (always 150-300ms transitions)
- ❌ Invisible focus states
- ❌ `beforeLoad` hooks with React hooks (use components instead)

## Testing Checklist
- [ ] `npm run build` passes (web + server)
- [ ] `npm run typecheck` passes (web + server)
- [ ] Dev server runs with 0 console errors
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] `prefers-reduced-motion` respected
- [ ] Contrast 4.5:1 minimum (light mode)
- [ ] Focus states visible