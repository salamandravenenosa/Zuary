// Dashboard principal — KPIs + gráfico + top posts
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointerClick, ArrowUpRight, Users, Star, TrendingUp } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCardSkeleton, ChartSkeleton, PostFeedSkeleton } from "@/components/dashboard/skeletons";
import { GoalBanner } from "@/components/dashboard/goal-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { generateFakeMetrics } from "@/lib/fake-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateFakeMetrics("30d"));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {showBanner && (
        <GoalBanner
          title="Meta atingida!"
          message="Parabéns! Você já superou a meta de leads deste mês."
          visible={showBanner}
          onDismiss={() => setShowBanner(false)}
        />
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe suas métricas de marketing em tempo real
        </p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <KpiCard title="Sessões no Site" value={data.kpis.sessoes.value} previousValue={data.kpis.sessoes.previousValue}
              icon={<MousePointerClick className="h-5 w-5" />}
              tooltip="Número de visitas ao site no período. Cada pessoa que entra conta como uma sessão."
              color="#7C3AED" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard title="Leads Gerados" value={data.kpis.leads.value} previousValue={data.kpis.leads.previousValue}
              icon={<ArrowUpRight className="h-5 w-5" />}
              tooltip="Pessoas que entraram em contato (WhatsApp, formulário ou ligação)."
              color="#10B981" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard title="Seguidores" value={data.kpis.seguidores.value} previousValue={data.kpis.seguidores.previousValue}
              icon={<Users className="h-5 w-5" />}
              tooltip="Total de seguidores no Instagram e TikTok combinados."
              color="#EC4899" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard title="Nota Google" value={Number(data.kpis.notaGoogle.value.toFixed(1))} previousValue={Number(data.kpis.notaGoogle.previousValue.toFixed(1))}
              icon={<Star className="h-5 w-5" />}
              tooltip="Nota média no Google Maps. Acima de 4.5 atrai mais clientes."
              color="#F59E0B" formatAsDecimal />
          </motion.div>
        </motion.div>
      )}

      {/* Gráfico + Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="lg:col-span-2"><ChartSkeleton /></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <Card className="overflow-hidden border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-white">Evolução</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <span className="h-2 w-2 rounded-full bg-[#7C3AED]" /> Sessões
                    </Badge>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Leads
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData}>
                      <defs>
                        <linearGradient id="gradSessoes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.15)" tick={{ fill: "#71717A", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fill: "#71717A", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#1E1E2A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#E4E4E7", fontSize: "13px" }} />
                      <Area type="monotone" dataKey="sessoes" stroke="#7C3AED" strokeWidth={2} fill="url(#gradSessoes)" name="Sessões" />
                      <Area type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} fill="url(#gradLeads)" name="Leads" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <PostFeedSkeleton />
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="overflow-hidden border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-white">Melhores Posts</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {data.topPosts.slice(0, 5).map((post: any, index: number) => (
                    <motion.div key={post.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#7C3AED]/10 flex items-center justify-center text-xs font-bold text-[#A78BFA]">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                        <p className="text-[11px] text-muted-foreground">{post.platform} · {post.type}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-semibold text-[#10B981]">{post.likes.toLocaleString("pt-BR")}</p>
                        <p className="text-[10px] text-muted-foreground">curtidas</p>
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
