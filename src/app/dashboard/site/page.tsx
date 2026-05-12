// Página /dashboard/site: Google Analytics 4 com dados reais
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  Clock,
  Globe,
  MousePointerClick,
  Plug,
  Users,
} from "lucide-react";
import { DashboardPageShell } from "@/components/dashboard/page-shell";
import { EmptyState } from "@/components/dashboard/empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiCardSkeleton } from "@/components/dashboard/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type IntegrationStatus = {
  type: string;
  status: string;
  lastSyncAt?: string | null;
};

type GA4Metrics = {
  sessions?: number;
  totalUsers?: number;
  bounceRate?: number;
  averageSessionDuration?: number;
  screenPageViews?: number;
  trafficSources?: Record<string, number>;
  conversions?: number;
  leads?: number;
  appointments?: number;
  formSubmissions?: number;
  whatsappClicks?: number;
  topPages?: Array<{
    url?: string;
    path?: string;
    title?: string;
    pageviews?: number;
    screenPageViews?: number;
  }>;
};

type DashboardResponse = {
  integrations?: IntegrationStatus[];
  metrics?: {
    GOOGLE_ANALYTICS?: GA4Metrics | null;
  };
};

const sourceColors = ["#7C3AED", "#A855F7", "#22D3EE", "#C084FC", "#F59E0B", "#8B5CF6"];

function isGAConnected(integrations: IntegrationStatus[] | undefined) {
  return integrations?.some((integration) => integration.type === "GOOGLE_ANALYTICS" && integration.status === "CONNECTED") ?? false;
}

function formatDuration(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  if (minutes <= 0) return `${rest}s`;
  return `${minutes}m ${String(rest).padStart(2, "0")}s`;
}

function trafficLabel(label: string) {
  const labels: Record<string, string> = {
    Organic: "Orgânico",
    "Organic Search": "Orgânico",
    Direct: "Direto",
    Referral: "Referral",
    "Paid Search": "Pago",
    Social: "Social",
    "Organic Social": "Social",
    Unassigned: "Não atribuído",
    unknown: "Desconhecido",
  };

  return labels[label] ?? label;
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

function SiteEmptyState({ connected }: { connected: boolean }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60 text-primary">
            <Plug className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {connected ? "GA4 conectado" : "Google Analytics não conectado"}
            </h3>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              {connected
                ? "Ainda não há métricas salvas. Aguarde a próxima coleta."
                : "Conecte o GA4 para ver sessões, usuários e origem de tráfego."}
            </p>
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

export default function SiteDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/dashboard", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não deu para carregar os dados do site.");
        return response.json();
      })
      .then((payload: DashboardResponse) => {
        if (active) setData(payload);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const ga = data?.metrics?.GOOGLE_ANALYTICS ?? null;
  const connected = isGAConnected(data?.integrations);

  const trafficSources = useMemo(() => {
    const sourceEntries = Object.entries(ga?.trafficSources ?? {});
    const total = sourceEntries.reduce((sum, [, value]) => sum + value, 0);

    return sourceEntries
      .filter(([, value]) => value > 0)
      .map(([name, value], index) => ({
        name: trafficLabel(name),
        sessions: value,
        percent: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
        color: sourceColors[index % sourceColors.length],
      }));
  }, [ga]);

  const funnel = useMemo(() => {
    if (!ga) return [];

    const leads = ga.leads ?? ga.formSubmissions ?? ga.whatsappClicks;
    const conversions = ga.appointments ?? ga.conversions;
    const steps = [
      { label: "Sessões", value: ga.sessions ?? 0, color: "#7C3AED" },
      { label: "Usuários", value: ga.totalUsers ?? 0, color: "#22D3EE" },
    ];

    if (typeof leads === "number") {
      steps.push({ label: "Leads", value: leads, color: "#F59E0B" });
    }

    if (typeof conversions === "number") {
      steps.push({ label: "Conversões", value: conversions, color: "#A855F7" });
    }

    return steps.filter((step) => step.value > 0);
  }, [ga]);

  const hasRealFunnel = funnel.length >= 3;
  const topPages = ga?.topPages ?? [];

  if (error) {
    return (
      <DashboardPageShell
        eyebrow="Site"
        title="Site & Analytics"
        description="Métricas do GA4 no Zuary."
        icon={<Globe className="h-5 w-5" />}
        status={{ label: "Erro ao carregar", tone: "danger" }}
      >
        <EmptyState title="Não deu para carregar os dados" description={error} actionLabel="Ver integrações" actionHref="/dashboard/integrations" />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell
      eyebrow="Site"
      title="Site & Analytics"
      description="Tráfego, canais e conversão sem número inventado."
      icon={<Globe className="h-5 w-5" />}
      status={{
        label: loading ? "Sincronizando" : ga ? "Atualizado" : "Sem dados",
        tone: loading ? "default" : ga ? "success" : "warning",
      }}
    >
      {loading ? (
        <LoadingGrid />
      ) : ga ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Sessões" value={ga.sessions ?? 0} icon={<MousePointerClick className="h-5 w-5" />} tooltip="Visitas registradas pelo GA4." color="#7C3AED" />
          <KpiCard title="Usuários" value={ga.totalUsers ?? 0} icon={<Users className="h-5 w-5" />} tooltip="Pessoas únicas no período." color="#22D3EE" />
          <KpiCard title="Rejeição" value={ga.bounceRate ?? 0} suffix="%" icon={<ArrowDownRight className="h-5 w-5" />} tooltip="Sessões sem interação." color="#F59E0B" formatAsDecimal />
          <KpiCard title="Tempo médio" value={ga.averageSessionDuration ?? 0} suffix="s" icon={<Clock className="h-5 w-5" />} tooltip={formatDuration(ga.averageSessionDuration ?? 0)} color="#A855F7" />
        </motion.div>
      ) : (
        <SiteEmptyState connected={connected} />
      )}

      {!loading && ga ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <Card className="xl:col-span-3">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">Funil de conversão</CardTitle>
              <Badge variant={hasRealFunnel ? "success" : "warning"}>
                {hasRealFunnel ? "Eventos reais" : "Eventos pendentes"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnel.map((step, index) => {
                  const base = funnel[0]?.value || 1;
                  const previous = funnel[index - 1]?.value || base;
                  const width = Math.max(4, (step.value / base) * 100);
                  const conversion = index === 0 ? 100 : (step.value / previous) * 100;

                  return (
                    <div key={step.label}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-foreground">{step.label}</span>
                        <span className="text-muted-foreground">
                          {formatNumber(step.value)}
                          {index > 0 ? <span className="ml-2 text-xs">({conversion.toFixed(1)}%)</span> : null}
                        </span>
                      </div>
                      <div className="h-9 overflow-hidden rounded-xl bg-muted/45">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.8, delay: index * 0.08 }}
                          className="flex h-full items-center rounded-xl border-l-4 px-3"
                          style={{ borderColor: step.color, backgroundColor: `${step.color}22` }}
                        >
                          <span className="text-xs font-semibold" style={{ color: step.color }}>
                            {((step.value / base) * 100).toFixed(0)}%
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!hasRealFunnel ? (
                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200 dark:text-amber-200">
                  Faltam eventos de lead ou agendamento. Sem eles, o funil fica incompleto.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Origem do tráfego</CardTitle>
            </CardHeader>
            <CardContent>
              {trafficSources.length > 0 ? (
                <>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} dataKey="sessions" stroke="none">
                          {trafficSources.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--panel-strong)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            color: "var(--foreground)",
                          }}
                          formatter={(value: unknown) => [formatNumber(Number(value ?? 0)), "Sessões"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {trafficSources.map((source) => (
                      <div key={source.name} className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                          {source.name}
                        </span>
                        <span className="font-semibold text-foreground">{source.percent}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">As origens aparecem na próxima coleta.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {!loading && ga ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Páginas e volume</CardTitle>
            <Badge variant="secondary">{formatNumber(ga.screenPageViews ?? 0)} pageviews</Badge>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Página</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((page, index) => (
                      <tr key={`${page.url ?? page.path ?? index}`} className="border-b border-border/60 hover:bg-muted/35">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{page.title ?? page.path ?? page.url ?? `Página ${index + 1}`}</p>
                          <p className="font-mono text-xs text-muted-foreground">{page.url ?? page.path ?? "/"}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{formatNumber(page.pageviews ?? page.screenPageViews ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficSources}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-line)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--panel-strong)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Bar dataKey="sessions" name="Sessões" radius={[8, 8, 0, 0]}>
                      {trafficSources.map((source) => (
                        <Cell key={source.name} fill={source.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </DashboardPageShell>
  );
}
