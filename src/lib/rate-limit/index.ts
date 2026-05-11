// Rate limiting com Upstash Redis
// Proteção contra abuso de API — compliance com plataformas
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Configuração do Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://localhost:6379",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "no-token",
});

// Rate limiters pré-configurados por tipo de rota
export const rateLimiters = {
  // Rotas gerais da API — 60 req/min
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    analytics: true,
    prefix: "rl:api",
  }),

  // Login — 5 tentativas/min (proteção contra brute force)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "rl:auth",
  }),

  // Webhooks — 100 req/min (Meta envia muitos)
  webhook: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    analytics: true,
    prefix: "rl:webhook",
  }),

  // CRUD de clínicas — 10 req/min
  admin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
    prefix: "rl:admin",
  }),

  // Geração de relatórios — 3 req/min
  reports: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "60 s"),
    analytics: true,
    prefix: "rl:reports",
  }),
};

// Gera chave de rate limit baseada no IP + clinicId
function getKey(request: NextRequest, clinicId?: string): string {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  return clinicId ? `${ip}:${clinicId}` : ip;
}

// Middleware de rate limit — retorna 429 se exceder
export async function rateLimit(
  request: NextRequest,
  limiter: keyof typeof rateLimiters = "api",
  clinicId?: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const key = getKey(request, clinicId);
  const result = await rateLimiters[limiter].limit(key);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

// Wrapper para rotas API com rate limit automático
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limiter: keyof typeof rateLimiters = "api"
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const result = await rateLimit(req, limiter);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Rate limit excedido. Tente novamente em alguns instantes.",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "60",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": result.reset.toString(),
            "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(req);
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    return response;
  };
}
