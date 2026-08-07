// ─────────────────────────────────────────────
// Shared Types - Cloudflare Worker
// ─────────────────────────────────────────────
import type { KVNamespace, D1Database, Fetcher } from '@cloudflare/workers-types';

export interface Env {
  JOBS_KV: KVNamespace;
  DB: D1Database;
  ASSETS: Fetcher;
  NODE_ENV: string;
  API_URL: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
}

export interface Variables {
  user: {
    id: string;
    email: string;
    roles: string[];
  } | null;
}