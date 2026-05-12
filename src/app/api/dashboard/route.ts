// API: Dados reais da dashboard — busca do banco de dados
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasClinicAccess } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const clinicId = searchParams.get("clinicId") || user.clinicId;

    if (!clinicId || !hasClinicAccess(user, clinicId)) {
      return NextResponse.json({ error: "Sem acesso" }, { status: 403 });
    }

    // Busca integrações ativas
    const integrations = await prisma.integration.findMany({
      where: { clinicId },
      select: { type: true, status: true, lastSyncAt: true, platformName: true },
    });

    // Busca métricas mais recentes por fonte
    const sources = ["INSTAGRAM", "TIKTOK", "GOOGLE_ANALYTICS", "GOOGLE_BUSINESS"] as const;
    const metrics: Record<string, any> = {};

    for (const source of sources) {
      const latest = await prisma.metricSnapshot.findFirst({
        where: { clinicId, source },
        orderBy: { dateFrom: "desc" },
      });
      metrics[source] = latest?.data || null;
    }

    // Busca metas do mês atual
    const now = new Date();
    const goals = await prisma.goal.findMany({
      where: {
        clinicId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    });

    // Conta notificações não lidas
    const unreadNotifications = await prisma.notification.count({
      where: { clinicId, read: false },
    });

    return NextResponse.json({
      integrations,
      metrics,
      goals,
      unreadNotifications,
      hasData: Object.values(metrics).some((m) => m !== null),
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
