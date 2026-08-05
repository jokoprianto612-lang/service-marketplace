-- ─────────────────────────────────────────────
-- PostgreSQL Initialization Script
-- ─────────────────────────────────────────────

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS svcmarket;

-- Set search path
ALTER DATABASE svcmarket SET search_path TO svcmarket, public;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA svcmarket TO svcmarket;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA svcmarket TO svcmarket;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA svcmarket TO svcmarket;

-- Default roles (will be managed by Prisma migrations)
-- This script runs before Prisma migrations