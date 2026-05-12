// Dashboard principal — dados reais do banco
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointerClick, ArrowUpRight, Users, Star, Plug } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCardSkeleton, ChartSkeleton, PostFeedSkeleton } from "@/components/dashboard/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { EmptyState } from "@/components/dashboard/empty-state";
import Link from "next/link";

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
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const hasIntegrations = data?.integrations?.some((i: any) => i.status === "CONNECTED");
  const hasData = data?.hasData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {hasData
            ? "Acompanhe suas métricas de marketing em tempo real"
            : "Conecte suas integrações para ver métricas reais"}
        </p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)}
        </div>
      ) : hasData ? (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <KpiCard title="Sessões" value={data.metrics.GOOGLE_ANALYTICS?.sessions || 0}
              icon={<MousePointerClick className="h-5 w-5" />}
              tooltip="Número de visitas ao site no período." color="#7C3AED" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard title="Seguidores" value={(data.metrics.INSTAGRAM?.followerCount || 0) + (data.metrics.TIKTOK?.followerCount || 0)}
              icon={<Users className="h-5 w-5" />}
              tooltip="Total de seguidores no Instagram e TikTok." color="#EC4899" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard title="Alcance" value={data.metrics.INSTAGRAM?.reach || 0}
              icon={<ArrowUpRight className="h-5 w-5" />}
              tooltip="Pessoas únicas que viram seus posts." color="#10B981" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KpiCard title="Nota Google" value={data.metrics.GOOGLE_BUSINESS?.rating || 0}
              icon={<Star className="h-5 w-5" />}
              tooltip="Nota média no Google Maps." color="#F59E0B" formatAsDecimal />
          </motion.div>
        </motion.div>
      ) : (
        /* Estado vazio — não tem dados */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Sessões", tooltip: "Conecte o Google Analytics" },
            { label: "Seguidores", tooltip: "Conecte Instagram ou TikTok" },
            { label: "Alcance", tooltip: "Conecte o Instagram" },
            { label: "Nota Google", tooltip: "Conecte o Google Meu Negócio" },
          ].map((item) => (
            <Card key={item.label} className="border-dashed border-border bg-card/30">
              <CardContent className="p-5 flex flex-col items-center justify-center h-[140px] text-center">
                <Plug className="h-6 w-6 text-muted-foreground/40 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{item.tooltip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Gráfico + Posts ou Estado vazio */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hasData ? (
            <>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
                <Card className="overflow-hidden border-border bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">Evolução</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <span className="h-2 w-2 rounded-full bg-[#7C3AED]" /> Sessões
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[]}>
                          <defs>
                            <linearGradient id="gradSessoes" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                          <XAxis dataKey="date" stroke="rgba(128,128,128,0.2)" tick={{ fill: "#71717A", fontSize: 11 }} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(128,128,128,0.2)" tick={{ fill: "#71717A", fontSize: 11 }} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "13px" }} />
                          <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} fill="url(#gradSessoes)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="overflow-hidden border-border bg-card h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-foreground">Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Dados aparecerão aqui após a sincronização automática.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <div className="lg:col-span-3">
              <EmptyState
                title="Nenhuma integração conectada"
                description="Conecte suas redes sociais, Google Analytics e Google Meu Negócio para ver suas métricas de marketing em tempo real."
                actionLabel="Conectar Integrações"
                actionHref="/dashboard/integrations"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
