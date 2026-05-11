// API route: Gerar relatório — COM AUTH
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasClinicAccess } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { clinicId, month, year } = body;

    if (!clinicId || !month || !year) {
      return NextResponse.json({ error: "clinicId, month e year são obrigatórios" }, { status: 400 });
    }

    if (!hasClinicAccess(user, clinicId)) {
      return NextResponse.json({ error: "Sem acesso" }, { status: 403 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        metrics: { where: { dateFrom: { gte: new Date(year, month - 1, 1), lt: new Date(year, month, 1) } } },
        goals: { where: { month, year } },
      },
    });

    if (!clinic) {
      return NextResponse.json({ error: "Clínica não encontrada" }, { status: 404 });
    }

    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;
    const previousMetrics = await prisma.metricSnapshot.findMany({
      where: { clinicId, dateFrom: { gte: new Date(previousYear, previousMonth - 1, 1), lt: new Date(previousYear, previousMonth, 1) } },
    });

    const reportData = {
      clinic: { name: clinic.name, logo: clinic.logoUrl, primaryColor: clinic.primaryColor },
      period: { month, year, label: new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, month - 1)) },
      currentMonth: clinic.metrics.map((m: any) => ({ source: m.source, data: m.data, totalValue: m.totalValue })),
      previousMonth: previousMetrics.map((m: any) => ({ source: m.source, data: m.data, totalValue: m.totalValue })),
      goals: clinic.goals.map((g: any) => ({ metric: g.metricType, target: g.targetValue, current: g.currentValue, achieved: g.achieved })),
    };

    const report = await prisma.report.create({
      data: { clinicId, title: `Relatório ${reportData.period.label}`, month, year, data: reportData as any },
    });

    return NextResponse.json({ reportId: report.id, data: reportData, message: "Relatório gerado com sucesso" });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
