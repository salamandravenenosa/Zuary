// Página /dashboard/social — Instagram e TikTok com dados reais
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Camera,
  Eye,
  Heart,
  MessageCircle,
  Music2,
  Plug,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import { ChannelSection, DashboardPageShell } from "@/components/dashboard/page-shell";
import { EmptyState } from "@/components/dashboard/empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCardSkeleton } from "@/components/dashboard/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/utils";

type IntegrationStatus = {
  type: string;
  status: string;
  lastSyncAt?: string | null;
  platformName?: string | null;
};

type InstagramPost = {
  id?: string;
  caption?: string;
  type?: string;
  media_type?: string;
  likes?: number;
  like_count?: number;
  comments?: number;
  comments_count?: number;
  reach?: number;
  timestamp?: string;
};

type TikTokVideo = {
  id?: string;
  title?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
};

type SocialMetrics = {
  followerCount?: number;
  mediaCount?: number;
  impressions?: number;
  reach?: number;
  engagement?: number;
  storiesViews?: number;
  recentPosts?: InstagramPost[];
  followingCount?: number;
  likesCount?: number;
  videoCount?: number;
  totalViews?: number;
  totalLikes?: number;
  totalComments?: number;
  totalShares?: number;
  recentVideos?: TikTokVideo[];
};

type DashboardResponse = {
  integrations?: IntegrationStatus[];
  metrics?: {
    INSTAGRAM?: SocialMetrics | null;
    TIKTOK?: SocialMetrics | null;
  };
  hasData?: boolean;
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function isConnected(integrations: IntegrationStatus[] | undefined, type: string) {
  return integrations?.some((integration) => integration.type === type && integration.status === "CONNECTED") ?? false;
}

function getLastSync(integrations: IntegrationStatus[] | undefined, type: string) {
  const value = integrations?.find((integration) => integration.type === type)?.lastSyncAt;
  return value ? formatDate(value) : "Sem sincronização";
}

function engagementRate(likes = 0, comments = 0, shares = 0, reach = 0) {
  if (!reach) return 0;
  return ((likes + comments + shares) / reach) * 100;
}

function postTitle(post: InstagramPost, index: number) {
  const caption = post.caption?.trim();
  if (caption) return caption.length > 64 ? `${caption.slice(0, 64)}...` : caption;
  return `Publicação ${index + 1}`;
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <KpiCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ChannelEmptyState({
  title,
  description,
  accent,
}: {
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60"
            style={{ color: accent }}
          >
            <Plug className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/integrations">
            Conectar <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SocialDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/dashboard", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Nao foi possivel carregar os dados sociais.");
        return response.json();
      })
      .then((payload: DashboardResponse) => {
        if (!active) return;
        setData(payload);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const instagram = data?.metrics?.INSTAGRAM ?? null;
  const tiktok = data?.metrics?.TIKTOK ?? null;
  const instagramConnected = isConnected(data?.integrations, "INSTAGRAM");
  const tiktokConnected = isConnected(data?.integrations, "TIKTOK");
  const hasInstagramData = Boolean(instagram);
  const hasTikTokData = Boolean(tiktok);
  const hasAnySocial = hasInstagramData || hasTikTokData;

  const totals = useMemo(() => {
    const instagramLikes = instagram?.recentPosts?.reduce((sum, post) => sum + (post.likes ?? post.like_count ?? 0), 0) ?? 0;
    const instagramComments = instagram?.recentPosts?.reduce((sum, post) => sum + (post.comments ?? post.comments_count ?? 0), 0) ?? 0;
    const tiktokLikes = tiktok?.totalLikes ?? tiktok?.likesCount ?? 0;
    const tiktokComments = tiktok?.totalComments ?? 0;
    const tiktokShares = tiktok?.totalShares ?? 0;
    const totalReach = (instagram?.reach ?? 0) + (tiktok?.totalViews ?? 0);

    return {
      followers: (instagram?.followerCount ?? 0) + (tiktok?.followerCount ?? 0),
      reach: totalReach,
      interactions: instagramLikes + instagramComments + tiktokLikes + tiktokComments + tiktokShares,
      engagement: engagementRate(instagramLikes + tiktokLikes, instagramComments + tiktokComments, tiktokShares, totalReach),
    };
  }, [instagram, tiktok]);

  if (error) {
    return (
      <DashboardPageShell
        eyebrow="Social cockpit"
        title="Redes Sociais"
        description="Instagram e TikTok conectados ao banco de dados do Zuary."
        icon={<Sparkles className="h-5 w-5" />}
        status={{ label: "Erro ao carregar", tone: "danger" }}
      >
        <EmptyState
          title="Nao foi possivel carregar os dados"
          description={error}
          actionLabel="Ver integrações"
          actionHref="/dashboard/integrations"
        />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell
      eyebrow="Social cockpit"
      title="Redes Sociais"
      description="Acompanhe alcance, engajamento e conteudos recentes sem depender de dados mockados."
      icon={<Sparkles className="h-5 w-5" />}
      status={{
        label: loading ? "Sincronizando" : hasAnySocial ? "Dados reais" : "Sem dados sociais",
        tone: loading ? "default" : hasAnySocial ? "success" : "warning",
      }}
    >
      {loading ? (
        <LoadingGrid />
      ) : hasAnySocial ? (
        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <KpiCard
              title="Seguidores"
              value={totals.followers}
              icon={<Users className="h-5 w-5" />}
              tooltip="Total de seguidores somando Instagram e TikTok conectados."
              color="#7C3AED"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard
              title="Alcance Social"
              value={totals.reach}
              icon={<Eye className="h-5 w-5" />}
              tooltip="Alcance do Instagram somado as visualizações recentes do TikTok."
              color="#22D3EE"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard
              title="Interações"
              value={totals.interactions}
              icon={<Heart className="h-5 w-5" />}
              tooltip="Curtidas, comentários e compartilhamentos capturados nos conteúdos recentes."
              color="#EC4899"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard
              title="Engajamento"
              value={totals.engagement}
              suffix="%"
              icon={<BarChart3 className="h-5 w-5" />}
              tooltip="Taxa consolidada de engajamento calculada a partir das interações e alcance social."
              color="#A855F7"
              formatAsDecimal
            />
          </motion.div>
        </motion.div>
      ) : (
        <EmptyState
          title="Nenhuma rede social com dados"
          description="Conecte Instagram ou TikTok e aguarde a primeira sincronização para transformar esta tela em um cockpit social real."
          actionLabel="Conectar redes sociais"
          actionHref="/dashboard/integrations"
        />
      )}

      <ChannelSection
        title="Instagram"
        description={`Ultima sincronizacao: ${getLastSync(data?.integrations, "INSTAGRAM")}`}
        icon={<Camera className="h-5 w-5" />}
        accent="#C084FC"
        connected={instagramConnected}
      >
        {loading ? (
          <LoadingGrid />
        ) : instagram ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard title="Seguidores" value={instagram.followerCount ?? 0} icon={<Users className="h-5 w-5" />} tooltip="Total de seguidores capturado pela API do Instagram." color="#C084FC" />
              <KpiCard title="Alcance" value={instagram.reach ?? 0} icon={<Eye className="h-5 w-5" />} tooltip="Pessoas unicas impactadas pelos posts recentes." color="#7C3AED" />
              <KpiCard title="Impressões" value={instagram.impressions ?? 0} icon={<BarChart3 className="h-5 w-5" />} tooltip="Total de impressões coletadas dos posts recentes." color="#A855F7" />
              <KpiCard title="Stories" value={instagram.storiesViews ?? 0} icon={<MessageCircle className="h-5 w-5" />} tooltip="Visualizações de stories na ultima coleta disponivel." color="#22D3EE" />
            </div>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">Top posts recentes</CardTitle>
                <Badge variant="secondary">{formatNumber(instagram.recentPosts?.length ?? 0)} posts</Badge>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Curtidas</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comentários</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alcance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(instagram.recentPosts ?? []).map((post, index) => (
                        <tr key={post.id ?? index} className="border-b border-border/60 transition-colors hover:bg-muted/35">
                          <td className="max-w-[360px] px-4 py-3 font-medium text-foreground">{postTitle(post, index)}</td>
                          <td className="px-4 py-3"><Badge variant="secondary">{post.type ?? post.media_type ?? "Post"}</Badge></td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{formatNumber(post.likes ?? post.like_count ?? 0)}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{formatNumber(post.comments ?? post.comments_count ?? 0)}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{formatNumber(post.reach ?? 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(instagram.recentPosts?.length ?? 0) === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Posts recentes aparecerão após a próxima sincronização.</p>
                ) : null}
              </CardContent>
            </Card>
          </>
        ) : (
          <ChannelEmptyState
            title={instagramConnected ? "Instagram conectado, aguardando dados" : "Instagram ainda nao conectado"}
            description={instagramConnected ? "A integração existe, mas ainda nao ha snapshot de metricas. Rode a coleta ou aguarde o cron." : "Conecte o Instagram para acompanhar alcance, impressões, stories e posts recentes."}
            accent="#C084FC"
          />
        )}
      </ChannelSection>

      <ChannelSection
        title="TikTok"
        description={`Ultima sincronizacao: ${getLastSync(data?.integrations, "TIKTOK")}`}
        icon={<Music2 className="h-5 w-5" />}
        accent="#22D3EE"
        connected={tiktokConnected}
      >
        {loading ? (
          <LoadingGrid />
        ) : tiktok ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard title="Seguidores" value={tiktok.followerCount ?? 0} icon={<Users className="h-5 w-5" />} tooltip="Total de seguidores capturado pela API do TikTok." color="#22D3EE" />
              <KpiCard title="Visualizações" value={tiktok.totalViews ?? 0} icon={<Eye className="h-5 w-5" />} tooltip="Visualizações somadas dos videos recentes coletados." color="#7C3AED" />
              <KpiCard title="Curtidas" value={tiktok.totalLikes ?? tiktok.likesCount ?? 0} icon={<Heart className="h-5 w-5" />} tooltip="Curtidas totais dos videos recentes ou do perfil." color="#A855F7" />
              <KpiCard title="Shares" value={tiktok.totalShares ?? 0} icon={<Share2 className="h-5 w-5" />} tooltip="Compartilhamentos dos videos recentes coletados." color="#C084FC" />
            </div>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">Videos recentes</CardTitle>
                <Badge variant="secondary">{formatNumber(tiktok.recentVideos?.length ?? 0)} videos</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {(tiktok.recentVideos ?? []).map((video, index) => (
                    <div key={video.id ?? index} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-colors hover:bg-muted/35">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        #{index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{video.title || `Video ${index + 1}`}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatNumber(video.views ?? 0)} views · {formatNumber(video.likes ?? 0)} curtidas · {formatNumber(video.shares ?? 0)} shares
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {(tiktok.recentVideos?.length ?? 0) === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Videos recentes aparecerão após a próxima sincronização.</p>
                ) : null}
              </CardContent>
            </Card>
          </>
        ) : (
          <ChannelEmptyState
            title={tiktokConnected ? "TikTok conectado, aguardando dados" : "TikTok ainda nao conectado"}
            description={tiktokConnected ? "A integração existe, mas ainda nao ha snapshot de metricas. Rode a coleta ou aguarde o cron." : "Conecte o TikTok para acompanhar seguidores, views, curtidas e videos recentes."}
            accent="#22D3EE"
          />
        )}
      </ChannelSection>
    </DashboardPageShell>
  );
}
