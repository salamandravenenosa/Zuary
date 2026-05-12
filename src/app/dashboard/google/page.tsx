// Página /dashboard/google — Google Meu Negócio: Maps, avaliações, ações
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Globe,
  Navigation,
  Star,
  Eye,
  Search,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  Calendar,
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
} from "recharts";

// Dados mockados do Google Meu Negócio
const gmbData = {
  visualizacoes: 8920,
  visualizacoesAnterior: 7650,
  buscasNome: 3200,
  buscasCategoria: 5720,
  cliquesLigar: 342,
  cliquesSite: 890,
  cliquesRotas: 1250,
  totalAvaliacoes: 287,
  notaMedia: 4.8,
  notaAnterior: 4.7,
  novasAvaliacoes: 18,
  novasAvaliacoesAnterior: 12,
  // Avaliações recentes com texto
  avaliacoesRecentes: [
    {
      id: 1,
      autor: "Maria Silva",
      nota: 5,
      data: "2026-04-28",
      texto: "Excelente atendimento! Dra. Ana muito atenciosa e profissional. Recomendo demais!",
      respondeu: true,
    },
    {
      id: 2,
      autor: "João Santos",
      nota: 5,
      data: "2026-04-25",
      texto: "Melhor empresa da região. Limpeza impecável e preço justo.",
      respondeu: false,
    },
    {
      id: 3,
      autor: "Ana Costa",
      nota: 4,
      data: "2026-04-22",
      texto: "Bom atendimento, mas a sala de espera poderia ser mais confortável.",
      respondeu: true,
    },
    {
      id: 4,
      autor: "Pedro Lima",
      nota: 5,
      data: "2026-04-20",
      texto: "Fiz clareamento e ficou incrível! Equipe muito gente boa.",
      respondeu: false,
    },
  ],
  // Evolução de visualizações
  evolucao: [
    { mes: "Jan", vistas: 5200 },
    { mes: "Fev", vistas: 5800 },
    { mes: "Mar", vistas: 6400 },
    { mes: "Abr", vistas: 7100 },
    { mes: "Mai", vistas: 7650 },
    { mes: "Jun", vistas: 8920 },
  ],
};

// Renderiza estrelas
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-[#F59E0B] text-[#F59E0B]"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default function GoogleDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-white">Google Meu Negócio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visualizações, ações realizadas e avaliações no Google Maps
          </p>
        </div>
      </div>

      {/* KPIs */}
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
            title="Visualizações"
            value={gmbData.visualizacoes}
            previousValue={gmbData.visualizacoesAnterior}
            icon={<Eye className="h-5 w-5" />}
            tooltip="Quantas vezes seu perfil apareceu no Google Maps e Pesquisa. Isso inclui quem viu seu nome, fotos e avaliações."
            color="#7C3AED"
          />
          <KpiCard
            title="Cliques p/ Ligar"
            value={gmbData.cliquesLigar}
            icon={<Phone className="h-5 w-5" />}
            tooltip="Pessoas que clicaram no botão de ligar para sua empresa. Esses são leads quase prontos para agendar!"
            color="#7C3AED"
          />
          <KpiCard
            title="Cliques p/ Rotas"
            value={gmbData.cliquesRotas}
            icon={<Navigation className="h-5 w-5" />}
            tooltip="Pessoas que pediram direções até sua empresa. Indica que elas pretendem ir até lá."
            color="#22D3EE"
          />
          <KpiCard
            title="Nota Média"
            value={gmbData.notaMedia}
            previousValue={gmbData.notaAnterior}
            icon={<Star className="h-5 w-5" />}
            tooltip="Sua nota média no Google. Notas acima de 4.5 aumentam significativamente a chance de novos pacientes."
            color="#F59E0B"
            formatAsDecimal
          />
        </motion.div>
      )}

      {/* Buscas por nome vs categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">Tipo de Busca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-[#7C3AED]" />
                        <span className="text-foreground">Busca por Nome</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {gmbData.buscasNome.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(gmbData.buscasNome / gmbData.visualizacoes) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full bg-[#7C3AED]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((gmbData.buscasNome / gmbData.visualizacoes) * 100).toFixed(0)}% — pessoas que já conhecem sua marca
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        <span className="text-foreground">Busca por Categoria</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {gmbData.buscasCategoria.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(gmbData.buscasCategoria / gmbData.visualizacoes) * 100}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((gmbData.buscasCategoria / gmbData.visualizacoes) * 100).toFixed(0)}% — pessoas que buscam "dentista" ou "empresa odontológica"
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong className="text-foreground">Insight:</strong> Mais pessoas te encontram por categoria que por nome. Isso mostra que o SEO local está funcionando — pessoas que buscam "dentista perto de mim" estão encontrando sua empresa.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Evolução de visualizações */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">Evolução de Visualizações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gmbData.evolucao}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="mes" stroke="rgba(255,255,255,0.2)" tick={{ fill: "#71717A", fontSize: 12 }} />
                      <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "#71717A", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1E1E2A",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          color: "#E4E4E7",
                        }}
                      />
                      <Bar dataKey="vistas" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Avaliações Recentes */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Avaliações Recentes
                </CardTitle>
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                  {gmbData.notaMedia} · {gmbData.totalAvaliacoes} avaliações
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gmbData.avaliacoesRecentes.map((avaliacao) => (
                  <div
                    key={avaliacao.id}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {avaliacao.autor}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={avaliacao.nota} />
                          <span className="text-xs text-muted-foreground">
                            {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      {avaliacao.respondeu ? (
                        <Badge variant="success" className="text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Respondida
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Sem resposta
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {avaliacao.texto}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
