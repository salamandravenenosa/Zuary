// Serviço de coleta — Instagram Graph API
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "./oauth-token";

export async function collectInstagramData(clinicId: string): Promise<void> {
  const token = await getAccessToken(clinicId, "INSTAGRAM");
  if (!token) return;

  // Busca o integration para pegar o platformId (Instagram account ID)
  const integration = await prisma.integration.findUnique({
    where: { clinicId_type: { clinicId, type: "INSTAGRAM" } },
  });
  if (!integration?.platformId) return;

  const accountId = integration.platformId;
  const base = "https://graph.facebook.com/v19.0";

  // 1. Busca dados do perfil
  const profileRes = await fetch(
    `${base}/${accountId}?fields=follower_count,media_count,biography&access_token=${token}`
  );
  const profileData = await profileRes.json();
  if (profileData.error) throw new Error(profileData.error.message);

  // 2. Busca posts recentes com insights
  const mediaRes = await fetch(
    `${base}/${accountId}/media?fields=id,caption,media_type,like_count,comments_count,timestamp,insights.metric(impressions,reach,engagement)&limit=10&access_token=${token}`
  );
  const mediaData = await mediaRes.json();

  // 3. Busca stories
  const storiesRes = await fetch(
    `${base}/${accountId}/stories?fields=insights.metric(impressions)&access_token=${token}`
  );
  const storiesData = await storiesRes.json();

  // 4. Calcula métricas consolidadas
  const posts = mediaData.data || [];
  const totalLikes = posts.reduce((sum: number, p: any) => sum + (p.like_count || 0), 0);
  const totalComments = posts.reduce((sum: number, p: any) => sum + (p.comments_count || 0), 0);
  const totalImpressions = posts.reduce((sum: number, p: any) => {
    const insight = p.insights?.data?.find((i: any) => i.name === "impressions");
    return sum + (insight?.values?.[0]?.value || 0);
  }, 0);
  const totalReach = posts.reduce((sum: number, p: any) => {
    const insight = p.insights?.data?.find((i: any) => i.name === "reach");
    return sum + (insight?.values?.[0]?.value || 0);
  }, 0);

  const engajamento = totalReach > 0 ? ((totalLikes + totalComments) / totalReach * 100) : 0;

  // 5. Salva snapshot
  const now = new Date();
  const dateFrom = new Date(now);
  dateFrom.setDate(dateFrom.getDate() - 1);

  const snapshotData = {
    followerCount: profileData.follower_count || 0,
    mediaCount: profileData.media_count || 0,
    impressions: totalImpressions,
    reach: totalReach,
    engagement: Number(engajamento.toFixed(2)),
    recentPosts: posts.slice(0, 5).map((p: any) => ({
      id: p.id,
      type: p.media_type,
      likes: p.like_count || 0,
      comments: p.comments_count || 0,
      timestamp: p.timestamp,
    })),
    storiesViews: storiesData.data?.reduce((sum: number, s: any) => {
      const insight = s.insights?.data?.find((i: any) => i.name === "impressions");
      return sum + (insight?.values?.[0]?.value || 0);
    }, 0) || 0,
  };

  await prisma.metricSnapshot.upsert({
    where: {
      clinicId_source_period_dateFrom: {
        clinicId, source: "INSTAGRAM", period: "DAILY", dateFrom,
      },
    },
    update: { data: snapshotData, totalValue: profileData.follower_count || 0, dateTo: now },
    create: {
      clinicId, source: "INSTAGRAM", period: "DAILY",
      dateFrom, dateTo: now, data: snapshotData, totalValue: profileData.follower_count || 0,
    },
  });

  await prisma.integration.update({
    where: { id: integration.id },
    data: { lastSyncAt: now, errorMessage: null },
  });
}
