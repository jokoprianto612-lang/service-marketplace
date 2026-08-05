# Service Marketplace Platform

> **Self-hosted Service Marketplace** — Deploy managed services (n8n, Hermes Agent, databases, monitoring, etc.) on your own infrastructure with a single click. Like Nouverse, but fully self-hosted, no vendor lock-in, and free (only your infrastructure costs).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js: >=20](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](https://nodejs.org/)
[![pnpm: >=9](https://img.shields.io/badge/pnpm-%3E%3D9-orange.svg)](https://pnpm.io/)
[![Docker](https://img.shields.io/badge/Docker-24%2B-blue.svg)](https://docker.com/)

---

## 🎯 What is this?

A **complete platform** to run your own service marketplace:

| Feature | Description |
|---------|-------------|
| 🏪 **Marketplace Catalog** | Browse 20+ curated services (n8n, Hermes, PostgreSQL, Redis, Grafana, MinIO, etc.) |
| 🚀 **One-Click Deploy** | Quick deploy with defaults, or custom configure env vars, volumes, resources |
| 📊 **Service Management** | Real-time logs, metrics (CPU/RAM/Network), health checks, scaling, backups |
| 🔐 **Auth & RBAC** | OIDC (GitHub, Google, Keycloak), Email/Password, Projects with quotas |
| 🔄 **GitOps** | Sync service definitions from Git, auto-deploy on push |
| 🐳 **Docker Native** | Uses Docker Engine API directly — no Kubernetes required for MVP |
| 📈 **Observability** | Prometheus + Grafana dashboards included |
| 🌐 **Auto TLS** | Traefik with Let's Encrypt for automatic HTTPS |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Dashboard (React)                    │
│  Marketplace │ My Services │ Logs │ Metrics │ Settings       │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   API Gateway     │
                    │   (Fastify)       │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Catalog      │    │  Deployment   │    │  Management   │
│  Service      │    │  Engine       │    │  Service      │
│  (Git/FS)     │    │  (Docker)     │    │  (Health,     │
│               │    │               │    │   Logs,       │
└───────────────┘    └───────────────┘    │   Metrics)    │
                                           └───────────────┘
```

**Tech Stack:**
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query/Router
- **Backend**: Node.js 20 + Fastify + TypeScript + Prisma ORM
- **Database**: PostgreSQL 16 + Redis 7
- **Container Runtime**: Docker Engine API (Dockerode)
- **Reverse Proxy**: Traefik v3 (auto TLS)
- **Monitoring**: Prometheus + Grafana + cAdvisor

---

## 🚀 Quick Start

### Prerequisites
- **Docker** 24+ with BuildKit (`DOCKER_BUILDKIT=1`)
- **Docker Compose** v2+
- **Linux** (Ubuntu 22.04+, Debian 12+, RHEL 9+) or WSL2 on Windows
- **Min Resources**: 2 CPU, 4 GB RAM, 20 GB disk
- **Ports**: 80, 443, 8080 (Traefik), 3000 (API), 5173 (Web dev)

### 1. Clone & Configure
```bash
git clone https://github.com/your-org/service-marketplace.git
cd service-marketplace

# Copy environment template
cp .env.example .env

# Edit .env with your values (required: POSTGRES_PASSWORD, REDIS_PASSWORD, JWT_SECRET, etc.)
# For production: set DOMAIN=yourdomain.com and ACME_EMAIL=you@domain.com
nano .env
```

### 2. Start with Docker Compose (Recommended)
```bash
# Build and start all services
docker compose -f docker/docker-compose.yml up -d

# With monitoring stack (Prometheus + Grafana)
docker compose -f docker/docker-compose.yml --profile monitoring up -d

# With automated backups
docker compose -f docker/docker-compose.yml --profile backup up -d
```

### 3. Access the Dashboard
- **Development**: http://localhost:5173 (web) + http://localhost:3000 (api)
- **Production**: https://yourdomain.com (web) + https://api.yourdomain.com (api)
- **Traefik Dashboard**: https://traefik.yourdomain.com (protect in production!)

### 4. Default Login
After first start, register a new account — the first user becomes **Owner**.

---

## 🛠 Development Setup

### Install Dependencies
```bash
# Install pnpm if needed
corepack enable && corepack prepare pnpm@latest --activate

# Install all workspace dependencies
pnpm install

# Generate Prisma client
pnpm db:generate
```

### Run Development Servers
```bash
# Starts API (3000), Web (5173), Worker concurrently
pnpm dev

# Or individually:
pnpm --filter @svcmarket/server run dev   # API on :3000
pnpm --filter @svcmarket/web run dev      # Web on :5173
pnpm --filter @svcmarket/worker run dev   # Background worker
```

### Database Operations
```bash
# Push schema changes (dev)
pnpm db:push

# Create migration
pnpm db:migrate

# Apply migrations (production)
pnpm db:migrate:prod

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

### Build for Production
```bash
# Build all packages
pnpm build

# Type-check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Run tests
pnpm test
```

---

## 📦 Service Catalog

The platform comes with **20+ pre-configured services**:

| Category | Services |
|----------|----------|
| **Automation** | n8n, Huginn, Windmill |
| **AI/ML** | Hermes Agent, Ollama, Text Generation WebUI |
| **Databases** | PostgreSQL, MySQL, MongoDB, Redis, Valkey, Dragonfly |
| **Monitoring** | Grafana + Prometheus, Uptime Kuma, Netdata, Glances |
| **Storage** | MinIO, SeaweedFS, Garage |
| **Networking** | Nginx Proxy Manager, Traefik, Caddy, Tailscale |
| **Identity** | Authentik, Keycloak, Authelia, PocketID |
| **Security** | Vaultwarden, Vault, CrowdSec |
| **Developer Tools** | Portainer, Appsmith, ToolJet, NocoDB, Gitea, Drone CI |
| **Search** | Meilisearch, Typesense |
| **Messaging** | ntfy, Gotify, Matrix (Synapse) |

### Adding Custom Services
1. Fork the [catalog repository](https://github.com/your-org/svcmarket-catalog)
2. Add a new service definition (see [Service Definition Format](#service-definition-format))
3. Submit a PR — once merged, it's available to all users
4. Or configure `CATALOG_GIT_REPO` to use your private catalog

### Service Definition Format
```yaml
# Example: n8n service definition
id: n8n-workflow
name: "n8n Workflow Automation"
description: "Extendable workflow automation tool"
category: automation
icon: "workflow"
version: "1.0.0"
dockerCompose: |
  version: '3.8'
  services:
    n8n:
      image: docker.n8n.io/n8nio/n8n:latest
      ports: ["5678:5678"]
      environment:
        - N8N_BASIC_AUTH_ACTIVE=true
        - N8N_BASIC_AUTH_USER={{USERNAME}}
        - N8N_BASIC_AUTH_PASSWORD={{PASSWORD}}
      volumes: ["n8n_data:/home/node/.n8n"]
  volumes:
    n8n_data:
defaultConfig:
  envVars:
    USERNAME: "admin"
    PASSWORD: "{{GENERATE_PASSWORD:16}}"
configSchema:
  type: object
  properties:
    USERNAME:
      type: string
      title: "Admin Username"
      default: "admin"
    PASSWORD:
      type: string
      title: "Admin Password"
      format: password
      description: "Leave empty to auto-generate"
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_PASSWORD` | ✅ | PostgreSQL password |
| `REDIS_PASSWORD` | ✅ | Redis password |
| `JWT_SECRET` | ✅ | JWT signing key (32+ chars) |
| `REFRESH_TOKEN_SECRET` | ✅ | Refresh token key (32+ chars) |
| `DOMAIN` | ✅ (prod) | Your domain (e.g., `example.com`) |
| `ACME_EMAIL` | ✅ (prod) | Email for Let's Encrypt |
| `AUTH_GITHUB_CLIENT_ID` | ❌ | GitHub OAuth app ID |
| `AUTH_GITHUB_CLIENT_SECRET` | ❌ | GitHub OAuth secret |
| `CATALOG_GIT_REPO` | ❌ | Private catalog Git URL |
| `CATALOG_GIT_TOKEN` | ❌ | Git token for private repos |
| `BACKUP_S3_*` | ❌ | S3 backup configuration |

### Docker Compose Profiles
```bash
# Core services only
docker compose -f docker/docker-compose.yml up -d

# + Monitoring (Prometheus, Grafana, cAdvisor)
docker compose -f docker/docker-compose.yml --profile monitoring up -d

# + Automated backups to S3
docker compose -f docker/docker-compose.yml --profile backup up -d

# All profiles
docker compose -f docker/docker-compose.yml --profile monitoring --profile backup up -d
```

---

## 🔐 Authentication

### Supported Providers
- **Email/Password** — Built-in, no config needed
- **GitHub OAuth** — Set `AUTH_GITHUB_CLIENT_ID/SECRET`
- **Google OAuth** — Set `AUTH_GOOGLE_CLIENT_ID/SECRET`
- **OIDC** — Set `AUTH_OIDC_ISSUER/CLIENT_ID/SECRET` (Keycloak, Authentik, etc.)

### RBAC Roles
| Role | Permissions |
|------|-------------|
| **Owner** | Full access, manage project, billing, delete project |
| **Admin** | Manage services, members, project settings |
| **Developer** | Deploy/manage services, view logs/metrics |
| **Viewer** | Read-only access to services, logs, metrics |

---

## 📊 Monitoring & Observability

### Included Dashboards (Grafana)
- **System Overview** — CPU, RAM, Disk, Network
- **Service Metrics** — Per-service resource usage
- **Deployment Status** — Success/failure rates, duration
- **API Metrics** — Request rate, latency, errors

### Access
```bash
# Start with monitoring profile
docker compose -f docker/docker-compose.yml --profile monitoring up -d

# Access Grafana
https://grafana.yourdomain.com
# Default: admin / $GRAFANA_PASSWORD (from .env)
```

### Custom Metrics
The API exposes `/metrics` endpoint (Prometheus format). Services deployed through the platform automatically get cAdvisor metrics.

---

## 🔄 GitOps Workflow

1. **Connect Repository** — In Settings → GitOps, add your GitHub/GitLab repo
2. **Add `svcmarket.yaml`** — Define services in your repo:
```yaml
services:
  - definitionId: n8n-workflow
    name: my-n8n
    mode: quick
  - definitionId: postgresql
    name: app-db
    mode: custom
    config:
      envVars:
        POSTGRES_DB: myapp
```
3. **Push to Main** — Webhook triggers automatic sync & deploy
4. **Track Status** — Deployment status shown in dashboard & Git commit status

---

## 🗂 Project Structure

```
service-marketplace/
├── PRD.md                      # Product Requirements Document
├── .env.example                # Environment template
├── .gitignore
├── package.json                # Root workspace config
├── docker/
│   ├── docker-compose.yml      # Main compose file
│   ├── postgres/init.sql       # DB initialization
│   ├── prometheus/prometheus.yml
│   ├── grafana/                # Grafana provisioning
│   └── api/entrypoint.sh       # API startup script
├── server/                     # Fastify API
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── models/             # Prisma models
│   │   ├── middleware/         # Auth, validation, etc.
│   │   └── utils/              # Helpers
│   ├── prisma/schema.prisma    # Database schema
│   ├── Dockerfile
│   └── package.json
├── web/                        # React Dashboard
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Helpers
│   │   └── styles/             # Global styles
│   ├── docker/nginx.conf
│   ├── Dockerfile
│   └── package.json
├── worker/                     # Background Jobs
│   ├── src/
│   │   ├── queues/             # BullMQ queues
│   │   ├── jobs/               # Job processors
│   │   └── services/           # Deployment, backup, etc.
│   ├── Dockerfile
│   └── package.json
├── shared/
│   ├── types/                  # Shared TypeScript types
│   └── constants/              # Shared constants
└── scripts/                    # Utility scripts
    └── sync-catalog.sh
```

---

## 📖 API Documentation

### Base URL
- **Dev**: `http://localhost:3000/api/v1`
- **Prod**: `https://api.yourdomain.com/api/v1`

### Authentication
```bash
# Login
curl -X POST /api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

# Use token
curl -H "Authorization: Bearer <token>" /api/v1/services
```

### Key Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/catalog` | List marketplace services |
| `GET` | `/catalog/:id` | Get service details |
| `POST` | `/services` | Deploy new service |
| `GET` | `/services` | List my services |
| `GET` | `/services/:id` | Get service details |
| `POST` | `/services/:id/start` | Start service |
| `POST` | `/services/:id/stop` | Stop service |
| `POST` | `/services/:id/restart` | Restart service |
| `POST` | `/services/:id/scale` | Scale replicas |
| `GET` | `/services/:id/logs` | Stream logs (WS) |
| `GET` | `/services/:id/metrics` | Get metrics |
| `POST` | `/services/:id/backup` | Create backup |
| `POST` | `/backups/:id/restore` | Restore backup |

### WebSocket Events
```javascript
const ws = new WebSocket('wss://api.yourdomain.com/ws');
ws.onmessage = (event) => {
  const { type, payload } = JSON.parse(event.data);
  // Types: log:entry, metrics:update, deployment:progress, service:status_change
};
```

---

## 🚢 Production Deployment

### Single Server (Recommended for Start)
```bash
# 1. Provision VPS (2+ CPU, 4+ GB RAM, 50+ GB SSD)
# 2. Point DNS: *.yourdomain.com → VPS IP
# 3. On server:
git clone https://github.com/your-org/service-marketplace.git
cd service-marketplace
cp .env.example .env
# Edit .env with production values
docker compose -f docker/docker-compose.yml --profile monitoring up -d
```

### High Availability (Future)
- Multiple API replicas behind load balancer
- PostgreSQL primary + replicas
- Redis Cluster
- Docker Swarm or Kubernetes for multi-node

### Backup Strategy
```bash
# Automated (with backup profile)
docker compose -f docker/docker-compose.yml --profile backup up -d

# Manual backup
docker exec svcmarket-api pnpm db:backup

# Restore
docker exec svcmarket-api pnpm db:restore <backup-file>
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- **TypeScript strict mode** — no `any`, proper types
- **Conventional Commits** — `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- **Tests required** — Unit tests for services, integration for API
- **Documentation** — Update README & code comments for new features

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Inspired by and built upon patterns from:
- **[Coolify](https://coolify.io/)** — PaaS deployment engine patterns
- **[CapRover](https://caprover.com/)** — One-click apps catalog format
- **[Portainer](https://www.portainer.io/)** — Docker management UI
- **[Homepage](https://gethomepage.dev/)** — Service dashboard patterns
- **[Nouverse](https://nouverse.tech/)** — Marketplace UX reference

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/service-marketplace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/service-marketplace/discussions)
- **Discord**: [Join our community](https://discord.gg/your-invite)

---

<div align="center">

**Made with ❤️ by OkongzINC Studio**

[Website](https://okongzinc.com) • [GitHub](https://github.com/okongzinc) • [Twitter](https://twitter.com/okongzinc)

</div>