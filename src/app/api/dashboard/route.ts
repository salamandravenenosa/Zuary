// API: Dados reais da dashboard — com cache Redis
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCachedMetrics, setCachedMetrics } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("authjs.session-token")?.value || request.cookies.get("__Secure-authjs.session-token")?.value;
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { default: jwt } = await import("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as any;
    const clinicId = decoded.clinicId || decoded.sub;

    if (!clinicId) return NextResponse.json({ error: "ClinicId não encontrado" }, { status: 400 });

    // Tenta cache primeiro
    const cached = await getCachedMetrics(clinicId);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Busca do banco
    const integrations = await prisma.integration.findMany({
      where: { clinicId },
      select: { type: true, status: true, lastSyncAt: true, platformName: true },
    });

    const sources = ["INSTAGRAM", "TIKTOK", "GOOGLE_ANALYTICS", "GOOGLE_BUSINESS"] as const;
    const metrics: Record<string, any> = {};

    for (const source of sources) {
      const latest = await prisma.metricSnapshot.findFirst({
        where: { clinicId, source },
        orderBy: { dateFrom: "desc" },
      });
      metrics[source] = latest?.data || null;
    }

    const now = new Date();
    const goals = await prisma.goal.findMany({
      where: { clinicId, month: now.getMonth() + 1, year: now.getFullYear() },
    });

    const result = {
      integrations,
      metrics,
      goals,
      hasData: Object.values(metrics).some((m) => m !== null),
    };

    // Salva no cache (5 min)
    await setCachedMetrics(clinicId, result);

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
