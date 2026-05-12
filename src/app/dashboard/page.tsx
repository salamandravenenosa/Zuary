// Dashboard principal — dados reais do banco
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointerClick, ArrowUpRight, Users, Star, Plug } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCardSkeleton } from "@/components/dashboard/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";

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
                    <div className="relative flex h-[280px] items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-muted/20">
                      <div className="absolute inset-x-6 bottom-10 top-10 grid grid-rows-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <span key={index} className="border-t border-border/60" />
                        ))}
                      </div>
                      <div className="absolute bottom-10 left-6 right-6 h-24 rounded-t-[2rem] border-t-2 border-[#7C3AED]/50 bg-gradient-to-t from-[#7C3AED]/10 to-transparent" />
                      <p className="relative max-w-xs text-center text-sm leading-6 text-muted-foreground">
                        A evolução aparece aqui quando houver série histórica suficiente.
                      </p>
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
