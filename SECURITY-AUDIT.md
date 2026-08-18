# Service Marketplace - Security Audit (Pre-CF Deploy)
Repo: https://github.com/jokoprianto612-lang/service-marketplace
Audit date: 2026-08-18
Status: DRAFT / PRE-DEPLOY

## 1. PRD File Check (service-marketplace/PRD.md)
- Version: 1.0
- Date: 2026-08-06
- Author: OkongzINC Studio
- Status: Draft
- Content: Complete (Executive Summary, User Flows, Architecture, Catalog, Security Considerations, Roadmap, Appendix)
- No malicious injections found in PRD.md (no hidden scripts, no suspicious URLs, no backdoor commands)

## 2. Bot / Attack Vector Audit
### 2.1 What is MISSING (vulnerable to bot attacks):
- NO CAPTCHA on /auth/login or /auth/register (bot can brute-force / register spam)
- NO CSRF token mechanism (no double-submit cookie / CSRF header)
- NO bot detection middleware (no User-Agent filter, no honeypot field, no rate limit per endpoint — only global 100/min)
- NO WAF rules configured in Cloudflare (wrangler.toml / deploy.yml does not include WAF / bot management)
- NO input sanitization layer beyond Zod schema (SQL injection possible if raw queries used — currently Prisma ORM used, so safe)
- NO XSS protection headers beyond helmet CSP (CSP is strict in production — OK)
- NO email verification required before register (first user becomes OWNER automatically — risk if bot registers first)

### 2.2 What is PRESENT (good):
- Helmet CSP + HSTS + frameguard + referrerPolicy (production mode)
- CORS strict allowlist (FRONTEND_URL only)
- JWT in cookies (httpOnly) + bcrypt (12 rounds) for passwords
- Global rate limit @fastify/rate-limit: max 100, 1 minute window
- Zod validation on auth/login, auth/register, deployments, catalog
- Prisma ORM (prevents SQL injection)
- Swagger disabled in production (reduces info leak)

### 2.3 Bot Attack Scenarios for CF Deploy:
A. Brute-force login bot: hits POST /auth/login repeatedly. Rate limit 100/min per IP may not stop distributed botnet.
B. Spam registration bot: POST /auth/register creates fake accounts (first account becomes OWNER — HIGH RISK if bot hits before real user).
C. Catalog scraping bot: GET /catalog is public (optionalAuth) — no rate limit specifically for scraping.
D. Deployment retry bot: POST /deployments/:id/retry has auth but no extra rate limit.

## 3. File Integrity Check
- PRD.md: clean, no malicious injection
- server/src/index.ts: clean, graceful shutdown, error handler
- server/src/plugins/index.ts: helmet, CORS, JWT, rateLimit — standard
- server/src/middleware/auth.ts: standard JWT verify + role check
- deploy-vps.sh: standard clone + docker compose
- docker/docker-compose.prod.yml: standard services (postgres, redis, server, traefik)
- web/dist/index.html: standard Vite build output (no injected scripts)
- .github/workflows/deploy.yml: standard CF Pages + Workers deploy
- .env.production.example: standard env vars, no leaked secrets (only examples with placeholders)

## 4. Recommendations Before CF Deploy (Anti-Bot / Security)
### Critical (do before deploy):
1. Add CAPTCHA (reCAPTCHA v3 or Turnstile) to /auth/login and /auth/register endpoints (server/src/routes/auth.ts)
2. Add rate limit specifically for auth endpoints (lower max, shorter window, e.g. 5/min per IP for login/register)
3. Add bot/honeypot check (hidden field in register form, User-Agent filter for suspicious patterns)
4. Ensure FRONTEND_URL is set correctly in production .env (CORS strict allowlist requires it)

### High (add before production traffic):
5. Enable Cloudflare Bot Management / Super Bot Fight Mode (CF dashboard, not in code) for service-marketplace-web Pages project
6. Add CSRF token mechanism for state-changing requests (POST login/register/deploy) — or rely on SameSite=Strict cookies + CORS
7. Add email verification before allowing login / deploy (currently emailVerified is set to new Date() on register)

### Medium:
8. Add audit log endpoint protection (only OWNER / ADMIN should read all audit logs)
9. Add request body size limits for auth endpoints (currently multipart limits to 10MB — OK, but auth endpoints don't need that much)

## 5. PRD Status for Deploy
- PRD is DRAFT (not final) — OK for initial deploy, but should be finalized before public release.
- No malicious code or hidden backdoor found in PRD.md or source files.
- No bot protection implemented — HIGH RISK for public deploy.

## 6. Deploy Readiness (CF Pages + Workers)
- web/wrangler.toml: OK (name = service-marketplace-web, build command = npm run build)
- server/wrangler.toml: OK (name = service-marketplace-api, database_name commented)
- .github/workflows/deploy.yml: uses cloudflare/pages-action@v1 and cloudflare/wrangler-action@v3 — standard
- Build artifacts (web/dist/) exist — OK for deploy
- Environment variables (FRONTEND_URL, APP_URL, JWT_SECRET, etc.) must be configured in CF Pages/Workers dashboard before deploy

## Conclusion
Repo is clean (no malicious injection). PRD.md is complete and safe. Main risk for CF deploy is LACK OF BOT PROTECTION (no CAPTCHA, weak rate limit on auth, no WAF rules). Fix auth rate limits and add CAPTCHA before exposing to public traffic.
