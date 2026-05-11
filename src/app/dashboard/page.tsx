// Página principal /dashboard — visão geral com KPIs, gráfico de evolução e feed
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MousePointerClick,
  Heart,
  Star,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCardSkeleton, ChartSkeleton, PostFeedSkeleton } from "@/components/dashboard/skeletons";
import { GoalBanner } from "@/components/dashboard/goal-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Dados mockados para demonstração — em produção viria da API
const mockData = {
  kpis: {
    sessoes: { value: 4832, previousValue: 4210 },
    leads: { value: 187, previousValue: 156 },
    seguidores: { value: 12450, previousValue: 11800 },
    avaliacoes: { value: 4.8, previousValue: 4.7 },
  },
  goals: {
    sessoes: 5000,
    leads: 200,
    seguidores: 13000,
    avaliacoes: 4.5,
  },
  // Dados do gráfico de evolução (30 dias)
  chartData: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      sessoes: Math.floor(120 + Math.random() * 80 + i * 2),
      leads: Math.floor(4 + Math.random() * 8),
      seguidores: Math.floor(30 + Math.random() * 20),
    };
  }),
  // Melhores posts do período
  topPosts: [
    {
      id: 1,
      title: "Clareamento dental: antes e depois",
      platform: "Instagram",
      likes: 342,
      comments: 45,
      reach: 2890,
      type: "Reels",
    },
    {
      id: 2,
      title: "Dica de higiene bucal para crianças",
      platform: "TikTok",
      likes: 1205,
      comments: 89,
      reach: 8430,
      type: "Vídeo",
    },
    {
      id: 3,
      title: "Depoimento paciente — aparelho ortodôntico",
      platform: "Instagram",
      likes: 278,
      comments: 32,
      reach: 1920,
      type: "Carrossel",
    },
    {
      id: 4,
      title: "Tour pela clínica",
      platform: "Instagram",
      likes: 189,
      comments: 21,
      reach: 1450,
      type: "Stories",
    },
  ],
};

// Animação stagger para os cards
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [data, setData] = useState(mockData);

  // Simula carregamento de dados da API
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner de meta atingida */}
      <GoalBanner
        title="Parabéns! Vocês atingiram a meta de avaliações de abril 🎉"
        message="A meta era 4.5 estrellas e vocês já estão com 4.8. Continue assim!"
        visible={showBanner}
        onDismiss={() => setShowBanner(false)}
      />

      {/* Título da página */}
      <div>
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe as principais métricas da sua clínica em tempo real
        </p>
      </div>

      {/* KPIs Principais */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KpiCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants}>
            <KpiCard
              title="Sessões no Site"
              value={data.kpis.sessoes.value}
              previousValue={data.kpis.sessoes.previousValue}
              icon={<MousePointerClick className="h-5 w-5" />}
              tooltip="Número de vezes que pessoas visitaram seu site no período. Cada visita conta como uma sessão."
              color="#7C3AED"
              goal={data.goals.sessoes}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KpiCard
              title="Leads Gerados"
              value={data.kpis.leads.value}
              previousValue={data.kpis.leads.previousValue}
              icon={<ArrowUpRight className="h-5 w-5" />}
              tooltip="Pessoas que entraram em contato (WhatsApp, formulário ou ligação). Esses são potenciais pacientes!"
              color="#10B981"
              goal={data.goals.leads}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KpiCard
              title="Seguidores Totais"
              value={data.kpis.seguidores.value}
              previousValue={data.kpis.seguidores.previousValue}
              icon={<Users className="h-5 w-5" />}
              tooltip="Total de pessoas que te seguem no Instagram e TikTok combinados. Quanto mais seguidores, mais alcance."
              color="#EC4899"
              goal={data.goals.seguidores}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KpiCard
              title="Nota Google"
              value={data.kpis.avaliacoes.value}
              previousValue={data.kpis.avaliacoes.previousValue}
              icon={<Star className="h-5 w-5" />}
              tooltip="Sua nota média no Google Maps. Notas acima de 4.5 ajudam a atrair mais pacientes pelo Google."
              color="#F59E0B"
              goal={data.goals.avaliacoes}
              formatAsDecimal
            />
          </motion.div>
        </motion.div>
      )}

      {/* Gráfico de Evolução + Feed de Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico principal — evolução 30 dias */}
        {loading ? (
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">
                    Evolução — Últimos 30 dias
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                      Sessões
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                      Leads
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData}>
                      <defs>
                        <linearGradient id="gradSessoes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.2)"
                        tick={{ fill: "#71717A", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.2)"
                        tick={{ fill: "#71717A", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1E1E2A",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          color: "#E4E4E7",
                          fontSize: "13px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sessoes"
                        stroke="#7C3AED"
                        strokeWidth={2}
                        fill="url(#gradSessoes)"
                        name="Sessões"
                      />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#gradLeads)"
                        name="Leads"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Feed de melhores posts */}
        {loading ? (
          <PostFeedSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="overflow-hidden border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-white">
                  Melhores Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {data.topPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    >
                      {/* Número de ranking */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-sm font-bold text-[#A78BFA]">
                        #{index + 1}
                      </div>

                      {/* Info do post */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {post.platform} · {post.type}
                        </p>
                      </div>

                      {/* Métricas */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-semibold text-[#10B981]">
                          {post.likes.toLocaleString("pt-BR")}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          curtidas
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
