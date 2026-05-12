// Página /dashboard/social — Instagram e TikTok lado a lado
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Music2,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCardSkeleton } from "@/components/dashboard/skeletons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Dados mockados do Instagram
const instagramData = {
  seguidores: 8450,
  seguidoresAnterior: 7900,
  alcance: 45200,
  alcanceAnterior: 38100,
  impressoes: 62800,
  engajamento: 4.2,
  engajamentoAnterior: 3.8,
  storiesViews: 12400,
  posts: [
    { id: 1, title: "Clareamento Dental", tipo: "Reels", curtidas: 1850, comentarios: 142, alcance: 12400, data: "2026-04-28" },
    { id: 2, title: "Dica de Escovação", tipo: "Carrossel", curtidas: 920, comentarios: 67, alcance: 6800, data: "2026-04-25" },
    { id: 3, title: "Depoimento Paciente", tipo: "Reels", curtidas: 1340, comentarios: 98, alcance: 9200, data: "2026-04-22" },
  ],
  crescimentoSemanal: [
    { semana: "Sem 1", seguidores: 200 },
    { semana: "Sem 2", seguidores: 150 },
    { semana: "Sem 3", seguidores: 120 },
    { semana: "Sem 4", seguidores: 80 },
  ],
};

// Dados mockados do TikTok
const tiktokData = {
  seguidores: 4000,
  seguidoresAnterior: 3900,
  visualizacoes: 89200,
  visualizacoesAnterior: 72000,
  curtidas: 15600,
  comentarios: 2340,
  shares: 1890,
  engajamento: 21.9,
  engajamentoAnterior: 18.5,
  audienciaPorIdade: [
    { faixa: "18-24", percentual: 35 },
    { faixa: "25-34", percentual: 42 },
    { faixa: "35-44", percentual: 15 },
    { faixa: "45+", percentual: 8 },
  ],
  videos: [
    { id: 1, title: "Como funciona clareamento", visualizacoes: 34200, curtidas: 8900, comentarios: 1200, shares: 890 },
    { id: 2, title: "Mitos sobre dentista", visualizacoes: 28100, curtidas: 4500, comentarios: 780, shares: 620 },
    { id: 3, title: "Rotina de higiene bucal", visualizacoes: 26900, curtidas: 2200, comentarios: 360, shares: 380 },
  ],
};

export default function SocialDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Calcula taxa de engajamento consolidada
  const calcEngajamento = (curtidas: number, comentarios: number, shares: number, alcance: number) => {
    if (alcance === 0) return 0;
    return ((curtidas + comentarios + shares) / alcance) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-white">Redes Sociais</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Instagram e TikTok lado a lado — acompanhe seu alcance e engajamento
        </p>
      </div>

      {/* ============ INSTAGRAM ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Camera className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">Instagram</h2>
          <Badge variant="success" className="ml-2">Conectado</Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <KpiCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <KpiCard
              title="Seguidores"
              value={instagramData.seguidores}
              previousValue={instagramData.seguidoresAnterior}
              icon={<Users className="h-5 w-5" />}
              tooltip="Pessoas que te seguem no Instagram. Seguidores fiéis são mais propensos a agendar consultas."
              color="#E1306C"
            />
            <KpiCard
              title="Alcance"
              value={instagramData.alcance}
              previousValue={instagramData.alcanceAnterior}
              icon={<Eye className="h-5 w-5" />}
              tooltip="Número de pessoas únicas que viram seus posts. Indica quantas pessoas sua marca está alcançando."
              color="#833AB4"
            />
            <KpiCard
              title="Engajamento"
              value={instagramData.engajamento}
              previousValue={instagramData.engajamentoAnterior}
              suffix="%"
              icon={<Heart className="h-5 w-5" />}
              tooltip="Taxa de engajamento: de cada 100 pessoas que viram seu post, quantas interagiram (curtiram, comentaram, compartilham)."
              color="#F77737"
              formatAsDecimal
            />
            <KpiCard
              title="Views Stories"
              value={instagramData.storiesViews}
              icon={<BarChart3 className="h-5 w-5" />}
              tooltip="Total de visualizações nos seus Stories. Stories são ótimos para manter contato diário com seus seguidores."
              color="#405DE6"
            />
          </motion.div>
        )}

        {/* Melhores posts Instagram */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mt-4 border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">Top Posts — Instagram</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08]">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Curtidas</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coment.</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alcance</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engajamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instagramData.posts.map((post) => {
                        const eng = calcEngajamento(post.curtidas, post.comentarios, 0, post.alcance);
                        return (
                          <tr key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                            <td className="py-3 px-4 font-medium text-foreground">{post.title}</td>
                            <td className="py-3 px-4"><Badge variant="secondary">{post.tipo}</Badge></td>
                            <td className="py-3 px-4 text-right text-muted-foreground">{post.curtidas.toLocaleString("pt-BR")}</td>
                            <td className="py-3 px-4 text-right text-muted-foreground">{post.comentarios}</td>
                            <td className="py-3 px-4 text-right text-muted-foreground">{post.alcance.toLocaleString("pt-BR")}</td>
                            <td className="py-3 px-4 text-right">
                              <span className={eng >= 3 ? "text-[#10B981] font-medium" : "text-[#F59E0B] font-medium"}>
                                {eng.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* ============ TIKTOK ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center border border-white/[0.08]">
            <Music2 className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">TikTok</h2>
          <Badge variant="success" className="ml-2">Conectado</Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <KpiCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <KpiCard
              title="Seguidores"
              value={tiktokData.seguidores}
              previousValue={tiktokData.seguidoresAnterior}
              icon={<Users className="h-5 w-5" />}
              tooltip="Pessoas que te seguem no TikTok. O TikTok tem ótimo alcance orgânico para empresas."
              color="#000000"
            />
            <KpiCard
              title="Visualizações"
              value={tiktokData.visualizacoes}
              previousValue={tiktokData.visualizacoesAnterior}
              icon={<Eye className="h-5 w-5" />}
              tooltip="Total de vezes que seus vídeos foram assistidos. Visualizações no TikTok podem gerar alcance massivo."
              color="#25F4EE"
            />
            <KpiCard
              title="Engajamento"
              value={tiktokData.engajamento}
              previousValue={tiktokData.engajamentoAnterior}
              suffix="%"
              icon={<Heart className="h-5 w-5" />}
              tooltip="Taxa de engajamento: (curtidas + comentários + shares) / visualizações × 100. TikTok costuma ter engajamento alto."
              color="#FE2C55"
              formatAsDecimal
            />
            <KpiCard
              title="Shares"
              value={tiktokData.shares}
              icon={<Share2 className="h-5 w-5" />}
              tooltip="Quantas vezes seus vídeos foram compartilhados. Compartilhamentos aumentam seu alcance organicamente."
              color="#25F4EE"
            />
          </motion.div>
        )}

        {/* Audiência por faixa etária */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base">Audiência por Faixa Etária — TikTok</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tiktokData.audienciaPorIdade}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="faixa" stroke="rgba(255,255,255,0.2)" tick={{ fill: "#71717A", fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "#71717A", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1E1E2A",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "8px",
                            color: "#E4E4E7",
                          }}
                          formatter={(value: any) => [`${value}%`, "Audiência"]}
                        />
                        <Bar dataKey="percentual" fill="#FE2C55" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top vídeos TikTok */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base">Top Vídeos — TikTok</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tiktokData.videos.map((video, index) => (
                      <div key={video.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FE2C55]/10 flex items-center justify-center text-sm font-bold text-[#FE2C55]">
                          #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {video.visualizacoes.toLocaleString("pt-BR")} views · {video.curtidas.toLocaleString("pt-BR")} curtidas
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>

      {/* Comparativo consolidado */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">Comparativo Instagram vs TikTok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Métrica</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Instagram</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">TikTok</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04]">
                      <td className="py-3 px-4 font-medium">Seguidores</td>
                      <td className="py-3 px-4 text-right text-muted-foreground">{instagramData.seguidores.toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-4 text-right text-muted-foreground">{tiktokData.seguidores.toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-4 text-right font-semibold text-white">{(instagramData.seguidores + tiktokData.seguidores).toLocaleString("pt-BR")}</td>
                    </tr>
                    <tr className="border-b border-white/[0.04]">
                      <td className="py-3 px-4 font-medium">Alcance Total</td>
                      <td className="py-3 px-4 text-right text-muted-foreground">{instagramData.alcance.toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-4 text-right text-muted-foreground">{tiktokData.visualizacoes.toLocaleString("pt-BR")}</td>
                      <td className="py-3 px-4 text-right font-semibold text-white">{(instagramData.alcance + tiktokData.visualizacoes).toLocaleString("pt-BR")}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Taxa Engajamento</td>
                      <td className="py-3 px-4 text-right text-[#10B981]">{instagramData.engajamento}%</td>
                      <td className="py-3 px-4 text-right text-[#10B981]">{tiktokData.engajamento}%</td>
                      <td className="py-3 px-4 text-right font-semibold text-[#10B981]">
                        {calcEngajamento(
                          instagramData.posts.reduce((a, p) => a + p.curtidas, 0) + tiktokData.curtidas,
                          instagramData.posts.reduce((a, p) => a + p.comentarios, 0) + tiktokData.comentarios,
                          tiktokData.shares,
                          instagramData.alcance + tiktokData.visualizacoes
                        ).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
