// API route: Cron job para sincronização de métricas
// Chamado periodicamente via Vercel Cron ou Upstash QStash
import { NextRequest, NextResponse } from "next/server";
import { runSyncJob } from "@/services/sync-service";
import { checkExpiringTokens } from "@/services/oauth-token";
import { logAudit, AuditActions } from "@/lib/rbac/audit";

// GET — Vercel Cron chama esta rota
export async function GET(request: NextRequest) {
  // Verifica autenticação do cron (Vercel Cron usa header especial)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Verifica tokens prestes a expirar
    await checkExpiringTokens();

    // 2. Executa sincronização de métricas
    await runSyncJob();

    await logAudit({
      action: "cron.sync.completed",
      resource: "system",
      details: { timestamp: new Date().toISOString() },
    });

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    await logAudit({
      action: AuditActions.SYNC_FAILED,
      resource: "system",
      details: { error: error.message },
    });

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
