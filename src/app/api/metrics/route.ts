// API route: Busca métricas consolidadas — COM AUTH
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasClinicAccess } from "@/lib/auth-helpers";

// GET /api/metrics?clinicId=xxx&source=INSTAGRAM&period=30d
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const clinicId = searchParams.get("clinicId");
    const source = searchParams.get("source");
    const period = searchParams.get("period") || "30d";

    if (!clinicId) {
      return NextResponse.json({ error: "clinicId é obrigatório" }, { status: 400 });
    }

    // Verifica acesso à empresa
    if (!hasClinicAccess(user, clinicId)) {
      return NextResponse.json({ error: "Sem acesso a esta empresa" }, { status: 403 });
    }

    const dateFrom = new Date();
    switch (period) {
      case "7d": dateFrom.setDate(dateFrom.getDate() - 7); break;
      case "90d": dateFrom.setDate(dateFrom.getDate() - 90); break;
      default: dateFrom.setDate(dateFrom.getDate() - 30);
    }

    const where: any = { clinicId, dateFrom: { gte: dateFrom } };
    if (source) where.source = source;

    const metrics = await prisma.metricSnapshot.findMany({ where, orderBy: { dateFrom: "asc" } });

    const aggregated = metrics.reduce((acc: Record<string, any>, metric: any) => {
      if (!acc[metric.source]) {
        acc[metric.source] = { source: metric.source, dataPoints: [], latest: null };
      }
      acc[metric.source].dataPoints.push({ date: metric.dateFrom, value: metric.totalValue, data: metric.data });
      acc[metric.source].latest = metric;
      return acc;
    }, {});

    return NextResponse.json({ clinicId, period, dateFrom: dateFrom.toISOString(), metrics: Object.values(aggregated) });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
