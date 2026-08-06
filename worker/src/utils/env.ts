// ─────────────────────────────────────────────
// Environment Validation
// ─────────────────────────────────────────────
export function validateEnv(env: Env): void {
  const required = [
    'JOBS_KV',
    'DB',
  ];

  for (const key of required) {
    if (!env[key as keyof Env]) {
      console.warn(`Missing required binding: ${key}`);
    }
  }
}

export function getEnv<T extends keyof Env>(env: Env, key: T): Env[T] {
  const value = env[key];
  if (!value) {
    throw new Error(`Required environment binding '${key}' is not configured`);
  }
  return value;
}