// Sistema de monitoramento — logs estruturados + health checks
import { prisma } from "@/lib/prisma";

// Log levels
export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

// Log estruturado
export function log(level: LogLevel, message: string, details?: Record<string, any>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...details,
  };

  if (level === LogLevel.ERROR || level === LogLevel.CRITICAL) {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

// Log de auditoria
export async function auditLog(params: {
  userId?: string;
  clinicId?: string;
  action: string;
  resource?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || undefined,
        action: params.action,
        resource: params.resource || undefined,
        details: params.details || undefined,
        ipAddress: params.ipAddress || undefined,
      },
    });
  } catch (error) {
    log(LogLevel.ERROR, "Falha ao registrar auditoria", { error: (error as Error).message });
  }
}

// Health check completo
export async function healthCheck(): Promise<{
  status: "healthy" | "degraded" | "unhealthy";
  checks: Record<string, { status: string; latency?: number; error?: string }>;
}> {
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};
  let allHealthy = true;

  // 1. Database
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "ok", latency: Date.now() - dbStart };
  } catch (error) {
    checks.database = { status: "error", error: (error as Error).message };
    allHealthy = false;
  }

  // 2. Redis
  const redisStart = Date.now();
  try {
    const { redisHealthCheck } = await import("@/lib/cache");
    const redisOk = await redisHealthCheck();
    checks.redis = { status: redisOk ? "ok" : "error", latency: Date.now() - redisStart };
    if (!redisOk) allHealthy = false;
  } catch (error) {
    checks.redis = { status: "error", error: (error as Error).message };
    allHealthy = false;
  }

  // 3. Prisma connections
  try {
    const userCount = await prisma.user.count();
    checks.prisma = { status: "ok" };
  } catch (error) {
    checks.prisma = { status: "error", error: (error as Error).message };
    allHealthy = false;
  }

  return {
    status: allHealthy ? "healthy" : "degraded",
    checks,
  };
}

// Métricas de performance
export async function getPerformanceMetrics(): Promise<{
  activeUsers: number;
  activeIntegrations: number;
  lastSync: Date | null;
  dbSize: string;
}> {
  const [activeUsers, activeIntegrations, lastSync] = await Promise.all([
    prisma.user.count({ where: { active: true } }),
    prisma.integration.count({ where: { status: "CONNECTED" } }),
    prisma.integration.findFirst({
      where: { status: "CONNECTED" },
      orderBy: { lastSyncAt: "desc" },
      select: { lastSyncAt: true },
    }),
  ]);

  return {
    activeUsers,
    activeIntegrations,
    lastSync: lastSync?.lastSyncAt || null,
    dbSize: "N/A", // Em produção, query do PostgreSQL
  };
}
