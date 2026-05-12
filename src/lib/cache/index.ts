// Serviço de cache com Upstash Redis
// Cache para dados que mudam pouco (métricas, status de integrações)
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://localhost:6379",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "no-token",
});

// Cache genérico com TTL
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {}
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {}
}

// Cache para métricas (TTL: 5 minutos)
export async function getCachedMetrics(clinicId: string): Promise<any | null> {
  return cacheGet(`metrics:${clinicId}`);
}

export async function setCachedMetrics(clinicId: string, data: any): Promise<void> {
  await cacheSet(`metrics:${clinicId}`, data, 300); // 5 min
}

// Cache para status de integrações (TTL: 1 minuto)
export async function getCachedIntegrations(clinicId: string): Promise<any | null> {
  return cacheGet(`integrations:${clinicId}`);
}

export async function setCachedIntegrations(clinicId: string, data: any): Promise<void> {
  await cacheSet(`integrations:${clinicId}`, data, 60); // 1 min
}

// Cache para sessão (TTL: 5 minutos)
export async function getCachedSession(sessionId: string): Promise<any | null> {
  return cacheGet(`session:${sessionId}`);
}

export async function setCachedSession(sessionId: string, data: any): Promise<void> {
  await cacheSet(`session:${sessionId}`, data, 300);
}

// Rate limiting com Redis
export async function checkRateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const current = await redis.incr(`ratelimit:${key}`);
    if (current === 1) {
      await redis.expire(`ratelimit:${key}`, windowSeconds);
    }
    return {
      allowed: current <= maxRequests,
      remaining: Math.max(0, maxRequests - current),
    };
  } catch {
    return { allowed: true, remaining: maxRequests };
  }
}

// Health check do Redis
export async function redisHealthCheck(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
