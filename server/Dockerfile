# ─────────────────────────────────────────────
# Server Dockerfile (Fastify + TypeScript)
# ─────────────────────────────────────────────
FROM node:20-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    docker-cli \
    git

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# ─────────────────────────────────────────────
# Builder stage
# ─────────────────────────────────────────────
FROM base AS builder

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build TypeScript
RUN pnpm build

# ─────────────────────────────────────────────
# Production stage
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    docker-cli \
    git \
    dumb-init \
    postgresql-client \
    redis

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# Copy built files
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Create catalog directory
RUN mkdir -p /app/catalog && chown -R nodejs:nodejs /app/catalog

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]