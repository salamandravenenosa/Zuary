// Serviço de sincronização de métricas via CRON
// Coleta dados das APIs e armazena snapshots no banco
// O dashboard LE do banco, não chama APIs diretamente
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "./oauth-token";
import { logAudit, AuditActions } from "@/lib/rbac/audit";

// Job de sincronização — chamado pelo cron
export async function syncMetrics(clinicId: string, source: string): Promise<void> {
  const startTime = Date.now();

  try {
    // Verifica se a integração está ativa
    const integration = await prisma.integration.findUnique({
      where: { clinicId_type: { clinicId, type: source as any } },
    });

    if (!integration || integration.status !== "CONNECTED") {
      return;
    }

    // Obtém token encriptografado
    const token = await getAccessToken(clinicId, source);
    if (!token) {
      await prisma.integration.update({
        where: { id: integration.id },
        data: { status: "TOKEN_EXPIRED", errorMessage: "Token expirado ou indisponível" },
      });
      return;
    }

    // Sincroniza baseado no tipo de fonte
    let metricsData: any;

    switch (source) {
      case "INSTAGRAM":
        metricsData = await syncInstagramMetrics(token, integration.platformId);
        break;
      case "TIKTOK":
        metricsData = await syncTikTokMetrics(token, integration.platformId);
        break;
      case "GOOGLE_ANALYTICS":
        metricsData = await syncGAMetrics(token, integration.platformId);
        break;
      case "GOOGLE_BUSINESS":
        metricsData = await syncGMBMetrics(token, integration.platformId);
        break;
      default:
        return;
    }

    if (metricsData) {
      // Salva snapshot
      const now = new Date();
      const dateFrom = new Date(now);
      dateFrom.setDate(dateFrom.getDate() - 1);

      await prisma.metricSnapshot.upsert({
        where: {
          clinicId_source_period_dateFrom: {
            clinicId,
            source: source as any,
            period: "DAILY",
            dateFrom,
          },
        },
        update: {
          data: metricsData,
          totalValue: metricsData.totalValue || 0,
          dateTo: now,
        },
        create: {
          clinicId,
          source: source as any,
          period: "DAILY",
          dateFrom,
          dateTo: now,
          data: metricsData,
          totalValue: metricsData.totalValue || 0,
        },
      });

      // Atualiza lastSyncAt
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          lastSyncAt: now,
          nextSyncAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Próximo sync em 24h
          retryCount: 0,
          errorMessage: null,
        },
      });
    }

    // Log de auditoria
    await logAudit({
      clinicId,
      action: AuditActions.METRICS_SYNCED,
      resource: "metric_snapshot",
      details: { source, duration: Date.now() - startTime },
    });
  } catch (error: any) {
    // Incrementa retry count com exponential backoff
    const integration = await prisma.integration.findUnique({
      where: { clinicId_type: { clinicId, type: source as any } },
    });

    if (integration) {
      const retryCount = integration.retryCount + 1;
      const backoffMs = Math.min(retryCount * 60000, 3600000); // Max 1h

      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          status: retryCount >= 3 ? "ERROR" : "DISCONNECTED",
          retryCount,
          errorMessage: error.message,
          nextSyncAt: new Date(Date.now() + backoffMs),
        },
      });
    }

    await logAudit({
      clinicId,
      action: AuditActions.SYNC_FAILED,
      resource: "metric_sync",
      details: { source, error: error.message },
    });
  }
}

// ==========================================
// SYNC POR FONTE
// ==========================================

async function syncInstagramMetrics(token: string, accountId: string | null) {
  if (!accountId) return null;

  const base = "https://graph.facebook.com/v19.0";
  const fields = "follower_count,media_count,impressions,reach,engagement";

  // Busca dados do perfil
  const profileRes = await fetch(
    `${base}/${accountId}?fields=${fields}&access_token=${token}`
  );
  const profileData = await profileRes.json();

  if (profileData.error) throw new Error(profileData.error.message);

  // Busca posts recentes
  const mediaRes = await fetch(
    `${base}/${accountId}/media?fields=id,caption,media_type,like_count,comments_count,timestamp&limit=10&access_token=${token}`
  );
  const mediaData = await mediaRes.json();

  return {
    followerCount: profileData.follower_count || 0,
    mediaCount: profileData.media_count || 0,
    impressions: profileData.impressions || 0,
    reach: profileData.reach || 0,
    engagement: profileData.engagement || 0,
    recentPosts: mediaData.data || [],
    totalValue: profileData.follower_count || 0,
  };
}

async function syncTikTokMetrics(token: string, accountId: string | null) {
  if (!accountId) return null;

  const response = await fetch("https://open.tiktokapis.com/v2/user/info/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (data.error?.code !== "ok") throw new Error(data.error?.message || "TikTok API error");

  const userInfo = data.data?.user || {};

  return {
    followerCount: userInfo.follower_count || 0,
    followingCount: userInfo.following_count || 0,
    likesCount: userInfo.likes_count || 0,
    videoCount: userInfo.video_count || 0,
    totalValue: userInfo.follower_count || 0,
  };
}

async function syncGAMetrics(token: string, propertyId: string | null) {
  if (!propertyId) return null;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: dateStr, endDate: dateStr }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
        ],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
      }),
    }
  );
  const data = await response.json();

  if (data.error) throw new Error(data.error.message);

  const rows = data.rows || [];
  let totalSessions = 0;
  let totalUsers = 0;
  const trafficSources: Record<string, number> = {};

  for (const row of rows) {
    const channel = row.dimensionValues?.[0]?.value || "unknown";
    const sessions = parseInt(row.metricValues?.[0]?.value || "0");
    totalSessions += sessions;
    trafficSources[channel] = sessions;
  }

  return {
    sessions: totalSessions,
    totalUsers,
    trafficSources,
    totalValue: totalSessions,
  };
}

async function syncGMBMetrics(token: string, accountId: string | null) {
  if (!accountId) return null;

  // Google Business Profile API
  const response = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();

  return {
    locations: data.locations || [],
    totalValue: data.locations?.length || 0,
  };
}

// ==========================================
// CRON JOB RUNNER
// ==========================================

// Executa sync para todas as clínicas ativas
export async function runSyncJob(): Promise<void> {
  const activeClinics = await prisma.clinic.findMany({
    where: { active: true },
    include: {
      integrations: {
        where: { status: "CONNECTED" },
      },
    },
  });

  const results = { success: 0, failed: 0, skipped: 0 };

  for (const clinic of activeClinics) {
    for (const integration of clinic.integrations) {
      // Verifica se já sincronizou hoje
      if (
        integration.lastSyncAt &&
        new Date(integration.lastSyncAt).toDateString() === new Date().toDateString()
      ) {
        results.skipped++;
        continue;
      }

      try {
        await syncMetrics(clinic.id, integration.type);
        results.success++;
      } catch {
        results.failed++;
      }
    }
  }

  console.log(`[CRON] Sync completo: ${results.success} sucesso, ${results.failed} falha, ${results.skipped} pulado`);
}
