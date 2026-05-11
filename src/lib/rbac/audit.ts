// Serviço de auditoria — log de todas as ações sensíveis
// Compliance com LGPD + requisitos de aprovação de plataformas
import { prisma } from "@/lib/prisma";

export interface AuditLogEntry {
  userId?: string;
  clinicId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// Registra evento de auditoria
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId || undefined,
        action: entry.action,
        resource: entry.resource || undefined,
        resourceId: entry.resourceId || undefined,
        details: entry.details || undefined,
        ipAddress: entry.ipAddress || undefined,
        userAgent: entry.userAgent || undefined,
      },
    });
  } catch (error) {
    // Log de auditoria NUNCA deve falhar silenciosamente
    // Em produção, enviar para serviço de monitoramento
    console.error("[AUDIT] Erro ao registrar log:", error);
  }
}

// Ações pré-definidas para consistência
export const AuditActions = {
  // Autenticação
  USER_LOGIN: "user.login",
  USER_LOGOUT: "user.logout",
  USER_LOGIN_FAILED: "user.login.failed",
  PASSWORD_CHANGED: "password.changed",

  // Integrações
  INTEGRATION_CONNECTED: "integration.connected",
  INTEGRATION_DISCONNECTED: "integration.disconnected",
  INTEGRATION_TOKEN_REFRESHED: "integration.token.refreshed",
  INTEGRATION_ERROR: "integration.error",

  // Dados
  METRICS_SYNCED: "metrics.synced",
  REPORT_GENERATED: "report.generated",
  GOAL_CREATED: "goal.created",
  GOAL_UPDATED: "goal.updated",
  GOAL_ACHIEVED: "goal.achieved",

  // Admin
  CLINIC_CREATED: "clinic.created",
  CLINIC_UPDATED: "clinic.updated",
  USER_CREATED: "user.created",
  USER_UPDATED: "user.updated",
  USER_DELETED: "user.deleted",

  // Segurança
  RATE_LIMIT_HIT: "security.rate_limit",
  UNAUTHORIZED_ACCESS: "security.unauthorized",
  DATA_EXPORTED: "data.exported",
  DATA_DELETED: "data.deleted",

  // Sync
  SYNC_FAILED: "sync.failed",

  // LGPD
  CONSENT_GIVEN: "lgpd.consent",
  CONSENT_REVOKED: "lgpd.consent_revoked",
  DATA_DELETION_REQUESTED: "lgpd.deletion_requested",
} as const;

// Helper para extrair IP do request
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Helper para extrair User-Agent
export function getUserAgent(request: Request): string {
  return request.headers.get("user-agent") || "unknown";
}
