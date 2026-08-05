# Service Marketplace Platform - Product Requirements Document

**Version:** 1.0  
**Date:** 2026-08-06  
**Status:** Draft  
**Author:** OkongzINC Studio

---

## 1. Executive Summary

### 1.1 Product Vision
Build a **self-hosted, open-source Service Marketplace Platform** that enables users to deploy managed services (n8n, Hermes Agent, databases, monitoring tools, etc.) on their own infrastructure with a single click — similar to Nouverse but fully self-hosted, no vendor lock-in, and free (only infrastructure costs).

### 1.2 Problem Statement
- **Nouverse/Coolify Cloud**: Managed platforms with recurring costs, vendor lock-in, limited customization
- **Coolify/CapRover/Dokku**: Powerful but complex for non-technical users, no built-in marketplace UI
- **Gap**: Need a **marketplace-first UX** (browse → click deploy → done) with self-hosted control

### 1.3 Solution
A **three-tier architecture**:
1. **Marketplace Catalog** — Curated service definitions (Docker Compose + metadata)
2. **Deployment Engine** — Orchestrates containers via Docker API / Portainer / Kubernetes
3. **Management Dashboard** — Service lifecycle, logs, metrics, scaling, backups

---

## 2. Target Users

| Persona | Needs | Technical Level |
|---------|-------|-----------------|
| **Solo Developer** | Deploy n8n, Postgres, Redis fast | Medium |
| **Small Team** | Shared services, RBAC, monitoring | Medium-High |
| **Homelab Enthusiast** | Self-host everything, GitOps | High |
| **Agency/Freelancer** | Client isolation, white-label | High |

---

## 3. Core Features (MVP)

### 3.1 Marketplace Catalog
- **Service Definitions** (YAML/JSON): Docker Compose + metadata (name, description, category, icon, pricing, requirements)
- **Categories**: AI/ML, Automation, Databases, Monitoring, Storage, Networking, Developer Tools
- **Versioning**: Multiple versions per service, rollback support
- **Community Repository**: Git-based catalog (like CapRover one-click-apps), PR workflow for new services

### 3.2 Deployment Engine
- **Target Runtimes**: Docker (single host), Docker Swarm, Kubernetes (v2)
- **Deployment Modes**:
  - **Quick Deploy**: Defaults + auto-generated secrets
  - **Custom Deploy**: Form-based config (env vars, volumes, ports, resources)
  - **Stack Deploy**: Multi-service compositions (e.g., n8n + Postgres + Redis)
- **Secret Management**: Auto-generate passwords, API keys; integrate with Vault/Sealed Secrets (v2)

### 3.3 Service Management Dashboard
- **Service List**: Status (running/stopped/error), health checks, resource usage
- **Actions**: Start/Stop/Restart, Scale (replicas), Update (image version), Backup/Restore
- **Logs**: Real-time streaming, search, download
- **Metrics**: CPU, Memory, Disk, Network (Prometheus/Grafana integration)
- **Networking**: Auto TLS (Let's Encrypt), custom domains, ingress rules

### 3.4 Authentication & Authorization
- **Auth Providers**: OIDC (Keycloak, Authentik, Google, GitHub), Email/Password
- **RBAC**: Owner, Admin, Developer, Viewer roles
- **Multi-tenancy**: Projects/Organizations with resource quotas
- **Audit Log**: All actions logged with user, timestamp, resource

### 3.5 GitOps & Automation
- **Git Sync**: Service configs stored in Git repo, auto-deploy on push
- **Webhooks**: Deploy triggers from CI/CD, GitHub/GitLab webhooks
- **API**: REST + GraphQL for programmatic access
- **CLI**: `svcmarket deploy <service>`, `svcmarket logs <service>`

---

## 4. Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| **Performance** | Dashboard load time | < 2s |
| **Performance** | Deploy latency (small service) | < 30s |
| **Reliability** | Uptime (self-hosted) | 99.9% |
| **Security** | TLS everywhere | Enforced |
| **Security** | Secrets at rest | Encrypted |
| **Scalability** | Services per host | 50+ |
| **Scalability** | Concurrent deploys | 10 |
| **Observability** | Metrics retention | 30d default |
| **Compliance** | Audit log retention | 1 year |

---

## 5. Technical Architecture

### 5.1 High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Web Dashboard (React)                   │
│  Marketplace │ Services │ Logs │ Metrics │ Settings          │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   API Gateway     │
                    │  (Express/Fastify)│
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Catalog      │    │  Deployment   │    │  Management   │
│  Service      │    │  Engine       │    │  Service      │
│  (Git/FS)     │    │  (Docker/     │    │  (Health,     │
│               │    │   K8s)        │    │   Logs,       │
└───────────────┘    └───────────────┘    │   Metrics)    │
                                           └───────────────┘
```

### 5.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS | Modern, fast, type-safe |
| **Backend** | Node.js 20 + Fastify + TypeScript | High performance, plugin ecosystem |
| **Database** | PostgreSQL 16 (primary) + Redis 7 (cache/sessions) | Reliable, JSON support, pub/sub |
| **ORM** | Prisma | Type-safe DB access, migrations |
| **Container Runtime** | Docker Engine API / Dockerode | Native Docker control |
| **Orchestration (v2)** | Kubernetes client-go | For K8s target |
| **Auth** | NextAuth.js / Lucia | Flexible auth providers |
| **Real-time** | Socket.io / Server-Sent Events | Logs, metrics streaming |
| **Monitoring** | Prometheus + Grafana (sidecar) | Industry standard |
| **Reverse Proxy** | Traefik / Nginx Proxy Manager | Auto TLS, routing |
| **CI/CD** | GitHub Actions / GitLab CI | Standard |

### 5.3 Data Models

#### Service Definition (Catalog)
```typescript
interface ServiceDefinition {
  id: string;                    // slug: "n8n-workflow"
  name: string;                  // "n8n Workflow Automation"
  description: string;
  longDescription: string;       // Markdown
  category: ServiceCategory;
  icon: string;                  // URL or lucide icon name
  version: string;               // "1.0.0"
  maintainer: string;            // GitHub username/org
  repository: string;            // GitHub repo URL
  documentation: string;         // Docs URL
  license: string;               // MIT, Apache-2.0, etc.
  
  // Deployment
  dockerCompose: string;         // Raw docker-compose.yml content
  defaultConfig: ServiceConfig;  // Default env vars, volumes, etc.
  configSchema: JsonSchema;      // Form validation for custom deploy
  
  // Requirements
  minMemory: number;             // MB
  minCpu: number;                // millicores
  minDisk: number;               // MB
  requiresGpu: boolean;
  supportedArchitectures: string[]; // ["amd64", "arm64"]
  
  // Metadata
  tags: string[];
  pricing: PricingModel;         // Free, Freemium, Paid (for managed)
  maturity: MaturityLevel;       // Alpha, Beta, Stable
  createdAt: Date;
  updatedAt: Date;
}
```

#### Deployed Service (Instance)
```typescript
interface ServiceInstance {
  id: string;                    // UUID
  definitionId: string;          // Ref to ServiceDefinition
  projectId: string;             // Multi-tenancy
  name: string;                  // User-defined name
  status: ServiceStatus;         // deploying, running, stopped, error, updating
  config: ServiceConfig;         // Resolved config (secrets expanded)
  deployment: DeploymentInfo;    // Docker/K8s specific
  healthCheck: HealthStatus;
  resources: ResourceUsage;      // Current CPU, RAM, Disk
  createdAt: Date;
  updatedAt: Date;
  deployedBy: string;            // User ID
}
```

---

## 6. User Flows

### 6.1 Browse & Deploy (Happy Path)
1. User lands on **Marketplace** page
2. Filters by category (AI, Automation, Databases...)
3. Clicks service card → **Service Detail** page
4. Clicks **"Deploy"** → **Deploy Modal**
5. Chooses: Quick Deploy / Custom Deploy
6. If Custom: fills form (validated against `configSchema`)
7. Clicks **Confirm** → Deployment starts
8. Real-time progress: Pulling images → Starting containers → Health checks
9. Success → Redirect to **Service Dashboard** with connection info

### 6.2 Service Management
1. User sees **My Services** list with status badges
2. Clicks service → **Detail View**: Logs, Metrics, Config, Backups
3. Actions: Restart, Scale, Update, Backup, Delete
4. **Logs tab**: Real-time stream, filter by level, download
5. **Metrics tab**: Graphs (CPU, RAM, Network, Custom)
6. **Config tab**: Edit env vars (requires restart), view secrets (masked)

### 6.3 GitOps Flow
1. User connects Git repo (GitHub/GitLab) in Settings
2. Adds `svcmarket.yaml` to repo with service definitions
3. Push to main → Webhook triggers sync
4. Platform validates → Deploys/Updates services
5. Status reported back as Git commit status

---

## 7. Service Catalog (Initial Set)

| Service | Category | Description | Complexity |
|---------|----------|-------------|------------|
| **n8n** | Automation | Workflow automation, 400+ integrations | Medium |
| **Hermes Agent** | AI | Self-improving AI agent with skills | High |
| **PostgreSQL** | Database | Primary relational database | Low |
| **Redis** | Database | Cache, sessions, queues | Low |
| **MongoDB** | Database | Document database | Low |
| **MinIO** | Storage | S3-compatible object storage | Low |
| **Grafana + Prometheus** | Monitoring | Full observability stack | Medium |
| **Uptime Kuma** | Monitoring | Uptime monitoring, status pages | Low |
| **Portainer** | Infrastructure | Docker management UI | Low |
| **Nginx Proxy Manager** | Networking | Reverse proxy, SSL management | Low |
| **Authentik** | Identity | OIDC/SAML identity provider | Medium |
| **Vaultwarden** | Security | Bitwarden-compatible password manager | Low |
| **Meilisearch** | Search | Fast search engine | Low |
| **Appsmith** | Dev Tools | Internal tools builder | Medium |
| **ToolJet** | Dev Tools | Extensible internal tools | Medium |

---

## 8. Deployment & Operations

### 8.1 Self-Hosted Installation
```bash
# One-line install (like Coolify)
curl -fsSL https://get.svcmarket.io | bash

# Or Docker Compose
docker compose -f docker-compose.prod.yml up -d
```

### 8.2 Requirements
- **OS**: Linux (Ubuntu 22.04+, Debian 12+, RHEL 9+)
- **Docker**: 24+ with BuildKit
- **Resources**: Min 2 CPU, 4GB RAM, 20GB disk
- **Network**: Ports 80, 443, 8080 (dashboard), 2376 (Docker API)

### 8.3 Backup Strategy
- **Database**: Daily pg_dump to S3-compatible storage
- **Configs**: Git-backed (auto-commit on change)
- **Volumes**: Scheduled snapshots (restic/kopia)
- **Disaster Recovery**: One-click restore from backup

---

## 9. Security Considerations

| Area | Measures |
|------|----------|
| **Authentication** | MFA support, session rotation, device tracking |
| **Authorization** | RBAC with deny-by-default, resource-level permissions |
| **Secrets** | Encrypted at rest (AES-256), never in logs, Vault integration |
| **Network** | mTLS between services, egress controls, network policies |
| **Supply Chain** | Image signing (cosign), SBOM generation, vulnerability scanning |
| **Audit** | Immutable audit log, SIEM export (JSON/CEF) |

---

## 10. Roadmap

### Phase 1: MVP (Weeks 1-6)
- [ ] Core API + Database schema
- [ ] React dashboard (Marketplace, Services, Logs)
- [ ] Docker deployment engine
- [ ] Auth (OIDC + Email/Password)
- [ ] 10 initial services in catalog
- [ ] Basic metrics (CPU/RAM via cAdvisor)

### Phase 2: Polish (Weeks 7-10)
- [ ] Custom deploy forms (dynamic from schema)
- [ ] Backup/Restore UI
- [ ] GitOps integration (GitHub/GitLab)
- [ ] CLI tool
- [ ] Multi-arch support (ARM64)
- [ ] Community catalog repo

### Phase 3: Scale (Weeks 11-16)
- [ ] Kubernetes deployment target
- [ ] Multi-node / Swarm support
- [ ] Advanced RBAC (ABAC)
- [ ] Plugin system for custom deployment targets
- [ ] Marketplace ratings/reviews
- [ ] Cost estimation per service

### Phase 4: Enterprise (Month 6+)
- [ ] SSO/SAML/LDAP
- [ ] Air-gapped deployment
- [ ] Compliance reports (SOC2, ISO27001)
- [ ] White-label / OEM
- [ ] Managed cloud offering (optional)

---

## 11. Success Metrics

| Metric | Target (6 months) |
|--------|-------------------|
| **GitHub Stars** | 1,000+ |
| **Active Deployments** | 500+ |
| **Services in Catalog** | 50+ |
| **Contributors** | 20+ |
| **Deploy Success Rate** | > 95% |
| **Mean Time to Deploy** | < 60s |
| **Community PRs/month** | 10+ |

---

## 12. Open Questions

1. **Monetization**: Optional cloud-hosted version? Support subscriptions?
2. **Kubernetes**: Native K8s operator vs. Docker Swarm only for MVP?
3. **Catalog Governance**: Curated only vs. community submissions with review?
4. **Windows Support**: WSL2 only or native Windows containers?
5. **Offline/Air-gapped**: Full support in MVP or Phase 3?

---

## 13. Appendix

### 13.1 Related Projects
- **Coolify** — PaaS alternative, inspired deployment engine
- **CapRover** — One-click apps pattern, inspired catalog format
- **Portainer** — Docker management UI reference
- **Homepage** — Service dashboard, inspired metrics UI
- **Nouverse** — Marketplace UX reference (managed)

### 13.2 Glossary
- **Service Definition** — Immutable template for a deployable service
- **Service Instance** — Running deployment of a definition
- **Project** — Logical grouping for multi-tenancy
- **Catalog** — Collection of service definitions (Git or FS backed)
- **Deployment Target** — Docker host, Swarm cluster, or K8s cluster

---

*End of PRD*