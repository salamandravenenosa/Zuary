// Página /dashboard/site — métricas completas do site: funil, tráfego, top páginas
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Users,
  MousePointerClick,
  Clock,
  ArrowDownRight,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Search,
  Share2,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCardSkeleton } from "@/components/dashboard/skeletons";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Dados mockados do site
const siteData = {
  sessoes: 4832,
  sessoesAnterior: 4210,
  usuariosUnicos: 3210,
  usuariosAnterior: 2890,
  pageviews: 12450,
  pageviewsAnterior: 10200,
  taxaRejeicao: 38.5,
  taxaRejeicaoAnterior: 42.1,
  tempoMedio: "2m 34s",
  tempoMedioSeg: 154,
  tempoMedioAnterior: 138,
  // Origem do tráfego
  origemTrafego: [
    { name: "Orgânico", value: 42, color: "#10B981" },
    { name: "Direto", value: 28, color: "#7C3AED" },
    { name: "Social", value: 18, color: "#EC4899" },
    { name: "Pago", value: 12, color: "#F59E0B" },
  ],
  // Dispositivos
  dispositivos: [
    { name: "Mobile", value: 68, icon: Smartphone },
    { name: "Desktop", value: 26, icon: Monitor },
    { name: "Tablet", value: 6, icon: Tablet },
  ],
  // Top páginas
  topPaginas: [
    { url: "/", titulo: "Página Inicial", pageviews: 4200, taxaRejeicao: 25.3, tempoMedio: "1m 42s" },
    { url: "/servicos", titulo: "Serviços", pageviews: 2800, taxaRejeicao: 32.1, tempoMedio: "3m 15s" },
    { url: "/sobre", titulo: "Sobre Nós", pageviews: 1950, taxaRejeicao: 28.7, tempoMedio: "2m 08s" },
    { url: "/contato", titulo: "Contato", pageviews: 1420, taxaRejeicao: 18.5, tempoMedio: "4m 22s" },
    { url: "/blog/clareamento", titulo: "Blog: Clareamento", pageviews: 1080, taxaRejeicao: 45.2, tempoMedio: "5m 10s" },
  ],
  // Dados do funil
  funil: [
    { etapa: "Visitas ao Site", valor: 4832, cor: "#7C3AED" },
    { etapa: "Interesse (ViewContent)", valor: 2150, cor: "#3B82F6" },
    { etapa: "Leads (WhatsApp/Form)", valor: 187, cor: "#F59E0B" },
    { etapa: "Agendamentos", valor: 52, cor: "#10B981" },
  ],
  // Heatmap de horários (7 dias x 24 horas simplificado)
  heatmapData: [
    { dia: "Seg", manha: 65, tarde: 80, noite: 40 },
    { dia: "Ter", manha: 70, tarde: 85, noite: 35 },
    { dia: "Qua", manha: 75, tarde: 90, noite: 45 },
    { dia: "Qui", manha: 68, tarde: 82, noite: 38 },
    { dia: "Sex", manha: 72, tarde: 78, noite: 50 },
    { dia: "Sáb", manha: 55, tarde: 45, noite: 20 },
    { dia: "Dom", manha: 30, tarde: 25, noite: 15 },
  ],
};

// Benchmark do setor odontológico
const benchmark = {
  taxaConversao: 3.8, // percentual médio do setor
  taxaRejeicao: 45, // percentual médio
};

export default function SiteDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Calcula taxa de conversão
  const taxaConversao = ((siteData.funil[3].valor / siteData.sessoes) * 100);
  const isAboveBenchmark = taxaConversao >= benchmark.taxaConversao;

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center gap-2">
        <Globe className="h-6 w-6 text-[#7C3AED]" />
        <div>
          <h1 className="text-2xl font-bold text-white">Site & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Google Analytics 4 + Meta Pixel — acompanhe seu funil de conversão
          </p>
        </div>
      </div>

      {/* KPIs do site */}
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
            title="Sessões"
            value={siteData.sessoes}
            previousValue={siteData.sessoesAnterior}
            icon={<MousePointerClick className="h-5 w-5" />}
            tooltip="Número total de visitas ao site. Uma sessão é quando alguém entra no site e sai ou fica inativo por 30 minutos."
            color="#7C3AED"
          />
          <KpiCard
            title="Usuários Únicos"
            value={siteData.usuariosUnicos}
            previousValue={siteData.usuariosAnterior}
            icon={<Users className="h-5 w-5" />}
            tooltip="Pessoas distintas que visitaram o site. Uma pessoa pode ter múltiplas sessões."
            color="#3B82F6"
          />
          <KpiCard
            title="Taxa de Rejeição"
            value={siteData.taxaRejeicao}
            previousValue={siteData.taxaRejeicaoAnterior}
            suffix="%"
            icon={<ArrowDownRight className="h-5 w-5" />}
            tooltip="Porcentagem de pessoas que saíram do site sem interagir. Quanto menor, melhor — significa que as pessoas estão explorando o site."
            color="#EF4444"
            formatAsDecimal
          />
          <KpiCard
            title="Tempo Médio"
            value={siteData.tempoMedioSeg}
            previousValue={siteData.tempoMedioAnterior}
            suffix="s"
            icon={<Clock className="h-5 w-5" />}
            tooltip="Tempo médio que as pessoas ficam no site. Tempo maior indica que o conteúdo está interessante."
            color="#10B981"
          />
        </motion.div>
      )}

      {/* Funil de Conversão + Origem do Tráfego */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funil de Conversão Visual */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  Funil de Conversão
                  <Badge variant={isAboveBenchmark ? "success" : "warning"}>
                    {isAboveBenchmark ? "Acima" : "Abaixo"} do benchmark ({benchmark.taxaConversao}%)
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {siteData.funil.map((etapa, index) => {
                    const largura = (etapa.valor / siteData.funil[0].valor) * 100;
                    const taxaConversaoEtapa = index > 0
                      ? ((etapa.valor / siteData.funil[index - 1].valor) * 100).toFixed(1)
                      : "100";

                    return (
                      <div key={etapa.etapa} className="relative">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-foreground font-medium">{etapa.etapa}</span>
                          <span className="text-muted-foreground">
                            {etapa.valor.toLocaleString("pt-BR")}
                            {index > 0 && (
                              <span className="ml-2 text-xs text-muted-foreground/60">
                                ({taxaConversaoEtapa}% conversão)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="h-8 rounded-lg bg-white/[0.04] overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${largura}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                            className="h-full rounded-lg flex items-center px-3"
                            style={{ backgroundColor: `${etapa.cor}25`, borderLeft: `3px solid ${etapa.cor}` }}
                          >
                            <span className="text-xs font-medium" style={{ color: etapa.cor }}>
                              {largura.toFixed(0)}%
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Taxa de conversão final */}
                <div className="mt-6 p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Taxa de Conversão Final</p>
                      <p className="text-2xl font-bold text-white mt-1">{taxaConversao.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Benchmark do setor</p>
                      <p className="text-lg font-semibold text-muted-foreground mt-1">{benchmark.taxaConversao}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Taxa de conversão = (Agendamentos / Sessões) × 100. O benchmark do setor odontológico é {benchmark.taxaConversao}%.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Origem do Tráfego */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">Origem do Tráfego</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={siteData.origemTrafego}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {siteData.origemTrafego.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1E1E2A",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          color: "#E4E4E7",
                        }}
                        formatter={(value: any) => [`${value}%`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legendas */}
                <div className="flex flex-wrap gap-4 mt-2 justify-center">
                  {siteData.origemTrafego.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-semibold text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>

                {/* Dispositivos */}
                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Dispositivos</p>
                  <div className="flex gap-4">
                    {siteData.dispositivos.map((disp) => (
                      <div key={disp.name} className="flex items-center gap-2">
                        <disp.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{disp.name}</span>
                        <span className="text-sm font-semibold text-foreground">{disp.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Top Páginas */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">Páginas Mais Visitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Página</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Pageviews</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Taxa Rejeição</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Tempo Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteData.topPaginas.map((pag) => (
                      <tr key={pag.url} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="py-3 px-4">
                          <p className="font-medium text-foreground">{pag.titulo}</p>
                          <p className="text-xs text-muted-foreground font-mono">{pag.url}</p>
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{pag.pageviews.toLocaleString("pt-BR")}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={pag.taxaRejeicao > 40 ? "text-[#EF4444]" : "text-[#10B981]"}>
                            {pag.taxaRejeicao}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{pag.tempoMedio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Heatmap de Horários */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">Horários de Maior Acesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={siteData.heatmapData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="dia" stroke="rgba(255,255,255,0.2)" tick={{ fill: "#71717A", fontSize: 12 }} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "#71717A", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E1E2A",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        color: "#E4E4E7",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="manha" name="Manhã" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="tarde" name="Tarde" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="noite" name="Noite" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
