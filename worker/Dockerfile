# ─────────────────────────────────────────────
# Worker Dockerfile (Background Jobs)
# ─────────────────────────────────────────────
FROM node:20-alpine AS base

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    docker-cli \
    git

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# ─────────────────────────────────────────────
# Builder stage
# ─────────────────────────────────────────────
FROM base AS builder

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ─────────────────────────────────────────────
# Production stage
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

RUN apk add --no-cache \
    docker-cli \
    git \
    dumb-init \
    postgresql-client \
    redis

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

USER nodejs

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/worker.js"]