// Serviço de coleta — GA4 Data API
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "./oauth-token";

export async function collectGA4Data(clinicId: string): Promise<void> {
  const token = await getAccessToken(clinicId, "GOOGLE_ANALYTICS");
  if (!token) return;

  const integration = await prisma.integration.findUnique({
    where: { clinicId_type: { clinicId, type: "GOOGLE_ANALYTICS" } },
  });
  if (!integration?.platformId) return;

  const propertyId = integration.platformId;

  // Busca dados dos últimos 7 dias
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // 1. Métricas gerais
  const reportRes = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
          { name: "screenPageViews" },
        ],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
      }),
    }
  );
  const reportData = await reportRes.json();
  if (reportData.error) throw new Error(reportData.error.message);

  // 2. Processa dados
  const rows = reportData.rows || [];
  let totalSessions = 0;
  let totalUsers = 0;
  let totalBounceRate = 0;
  let totalDuration = 0;
  let totalPageviews = 0;
  const trafficSources: Record<string, number> = {};

  for (const row of rows) {
    const channel = row.dimensionValues?.[0]?.value || "unknown";
    const sessions = parseInt(row.metricValues?.[0]?.value || "0");
    const users = parseInt(row.metricValues?.[1]?.value || "0");
    const bounceRate = parseFloat(row.metricValues?.[2]?.value || "0");
    const duration = parseFloat(row.metricValues?.[3]?.value || "0");
    const pageviews = parseInt(row.metricValues?.[4]?.value || "0");

    totalSessions += sessions;
    totalUsers += users;
    totalBounceRate += bounceRate;
    totalDuration += duration;
    totalPageviews += pageviews;
    trafficSources[channel] = sessions;
  }

  const avgBounceRate = rows.length > 0 ? totalBounceRate / rows.length : 0;
  const avgDuration = rows.length > 0 ? totalDuration / rows.length : 0;

  // 3. Salva snapshot
  const now = new Date();
  const dateFrom = new Date(now);
  dateFrom.setDate(dateFrom.getDate() - 1);

  const snapshotData = {
    sessions: totalSessions,
    totalUsers,
    bounceRate: Number((avgBounceRate * 100).toFixed(1)),
    averageSessionDuration: Math.round(avgDuration),
    screenPageViews: totalPageviews,
    trafficSources,
    dateRange: { startDate, endDate },
  };

  await prisma.metricSnapshot.upsert({
    where: {
      clinicId_source_period_dateFrom: {
        clinicId, source: "GOOGLE_ANALYTICS", period: "DAILY", dateFrom,
      },
    },
    update: { data: snapshotData, totalValue: totalSessions, dateTo: now },
    create: {
      clinicId, source: "GOOGLE_ANALYTICS", period: "DAILY",
      dateFrom, dateTo: now, data: snapshotData, totalValue: totalSessions,
    },
  });

  await prisma.integration.update({
    where: { id: integration.id },
    data: { lastSyncAt: now, errorMessage: null },
  });
}
