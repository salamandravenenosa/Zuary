// Serviço de coleta — TikTok Display API
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "./oauth-token";

export async function collectTikTokData(clinicId: string): Promise<void> {
  const token = await getAccessToken(clinicId, "TIKTOK");
  if (!token) return;

  const integration = await prisma.integration.findUnique({
    where: { clinicId_type: { clinicId, type: "TIKTOK" } },
  });
  if (!integration) return;

  // 1. Busca informações do perfil
  const userRes = await fetch(
    "https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,display_name,avatar_url,follower_count,following_count,likes_count,video_count",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const userData = await userRes.json();
  if (userData.error?.code !== "ok") throw new Error(userData.error?.message || "TikTok API error");

  const user = userData.data?.user || {};

  // 2. Busca vídeos recentes
  const videosRes = await fetch(
    "https://open.tiktokapis.com/v2/video/list/?fields=id,title,create_time,like_count,comment_count,share_count,view_count&max_count=10",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const videosData = await videosRes.json();
  const videos = videosData.data?.videos || [];

  // 3. Calcula métricas
  const totalViews = videos.reduce((sum: number, v: any) => sum + (v.view_count || 0), 0);
  const totalLikes = videos.reduce((sum: number, v: any) => sum + (v.like_count || 0), 0);
  const totalComments = videos.reduce((sum: number, v: any) => sum + (v.comment_count || 0), 0);
  const totalShares = videos.reduce((sum: number, v: any) => sum + (v.share_count || 0), 0);
  const engajamento = totalViews > 0 ? ((totalLikes + totalComments + totalShares) / totalViews * 100) : 0;

  // 4. Salva snapshot
  const now = new Date();
  const dateFrom = new Date(now);
  dateFrom.setDate(dateFrom.getDate() - 1);

  const snapshotData = {
    followerCount: user.follower_count || 0,
    followingCount: user.following_count || 0,
    likesCount: user.likes_count || 0,
    videoCount: user.video_count || 0,
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    engagement: Number(engajamento.toFixed(2)),
    recentVideos: videos.slice(0, 5).map((v: any) => ({
      id: v.id,
      title: v.title,
      views: v.view_count || 0,
      likes: v.like_count || 0,
      comments: v.comment_count || 0,
      shares: v.share_count || 0,
    })),
  };

  await prisma.metricSnapshot.upsert({
    where: {
      clinicId_source_period_dateFrom: {
        clinicId, source: "TIKTOK", period: "DAILY", dateFrom,
      },
    },
    update: { data: snapshotData, totalValue: user.follower_count || 0, dateTo: now },
    create: {
      clinicId, source: "TIKTOK", period: "DAILY",
      dateFrom, dateTo: now, data: snapshotData, totalValue: user.follower_count || 0,
    },
  });

  await prisma.integration.update({
    where: { id: integration.id },
    data: { lastSyncAt: now, errorMessage: null },
  });
}
