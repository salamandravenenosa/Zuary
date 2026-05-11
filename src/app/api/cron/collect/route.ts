// Cron job — coleta automática de métricas a cada 24h
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verifica autenticação do cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { clinics: 0, synced: 0, errors: 0 };

  try {
    // Busca todas as clínicas ativas com integrações conectadas
    const clinics = await prisma.clinic.findMany({
      where: { active: true },
      include: {
        integrations: { where: { status: "CONNECTED" } },
      },
    });

    results.clinics = clinics.length;

    for (const clinic of clinics) {
      for (const integration of clinic.integrations) {
        try {
          // Em produção, aqui coletaria dados reais das APIs
          // Por agora, cria um snapshot fake atualizado
          const now = new Date();
          const dateFrom = new Date(now);
          dateFrom.setDate(dateFrom.getDate() - 1);

          await prisma.metricSnapshot.upsert({
            where: {
              clinicId_source_period_dateFrom: {
                clinicId: clinic.id,
                source: integration.type as any,
                period: "DAILY",
                dateFrom,
              },
            },
            update: {
              data: { synced: true, timestamp: now.toISOString() },
              totalValue: Math.floor(Math.random() * 1000),
              dateTo: now,
            },
            create: {
              clinicId: clinic.id,
              source: integration.type as any,
              period: "DAILY",
              dateFrom,
              dateTo: now,
              data: { synced: true, timestamp: now.toISOString() },
              totalValue: Math.floor(Math.random() * 1000),
            },
          });

          // Atualiza lastSyncAt
          await prisma.integration.update({
            where: { id: integration.id },
            data: { lastSyncAt: now },
          });

          results.synced++;
        } catch (err: any) {
          results.errors++;
          console.error(`[CRON] Erro ao sincronizar ${integration.type} da clínica ${clinic.id}:`, err.message);
        }
      }
    }

    console.log(`[CRON] Concluído: ${results.synced} sincronizados, ${results.errors} erros`);
    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
