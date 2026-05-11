// Página /dashboard/relatorio — gerador de relatório PDF mensal
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Building2,
  TrendingUp,
  Users,
  MousePointerClick,
  Star,
  Share2,
  MapPin,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dados mockados para o relatório
const reportData = {
  clinica: "Clínica Sorriso Odontologia",
  periodo: "Abril 2026",
  resumoExecutivo: {
    sessoes: 4832,
    sessoesVariacao: 14.8,
    leads: 187,
    leadsVariacao: 19.9,
    seguidores: 12450,
    seguidoresVariacao: 5.5,
    avaliacoes: 4.8,
    avaliacoesVariacao: 2.1,
    notaGoogle: 4.8,
    visualizacoesMaps: 8920,
    engajamento: 4.2,
  },
  destaques: [
    "Crescimento de 19.9% no número de leads gerados",
    "Taxa de engajamento do Instagram acima da média do setor",
    "18 novas avaliações no Google com nota média 4.8",
    "Aumento de 25% nas visualizações do perfil no Google Maps",
  ],
  comparativo: {
    anterior: {
      sessoes: 4210,
      leads: 156,
      seguidores: 11800,
      avaliacoes: 4.7,
    },
  },
};

export default function RelatorioPage() {
  const [mes, setMes] = useState("04");
  const [ano, setAno] = useState("2026");
  const [gerando, setGerando] = useState(false);
  const [gerado, setGerado] = useState(false);

  // Função para gerar o PDF (simulada — em produção usaria Puppeteer)
  const gerarPDF = async () => {
    setGerando(true);
    // Simula geração do PDF
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setGerando(false);
    setGerado(true);

    // Em produção, aqui faríamos fetch na API que gera o PDF
    // const response = await fetch('/api/reports/generate', {
    //   method: 'POST',
    //   body: JSON.stringify({ mes, ano, clinicId }),
    // });
    // const blob = await response.blob();
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `relatorio-${mes}-${ano}.pdf`;
    // a.click();
  };

  const meses = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-[#7C3AED]" />
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gere relatórios PDF mensais com um clique para enviar aos seus clientes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração do relatório */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">Gerar Relatório</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Clínica
                </label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <Building2 className="h-4 w-4 text-[#7C3AED]" />
                  <span className="text-sm text-foreground">
                    {reportData.clinica}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Mês
                  </label>
                  <Select value={mes} onValueChange={setMes}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {meses.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Ano
                  </label>
                  <Select value={ano} onValueChange={setAno}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={gerarPDF}
                disabled={gerando}
                className="w-full gap-2"
                size="lg"
              >
                {gerando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando PDF...
                  </>
                ) : gerado ? (
                  <>
                    <Download className="h-4 w-4" />
                    Baixar Novamente
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Gerar Relatório PDF
                  </>
                )}
              </Button>

              {gerado && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20"
                >
                  <p className="text-sm text-[#10B981] font-medium">
                    Relatório gerado com sucesso!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Clique no botão acima para baixar o PDF.
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview do relatório */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Preview do Relatório</CardTitle>
                <Badge variant="secondary">
                  <Calendar className="h-3 w-3 mr-1" />
                  {reportData.periodo}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Simula a aparência do PDF */}
              <div className="rounded-xl bg-white text-gray-900 p-8 max-h-[600px] overflow-y-auto">
                {/* Header do relatório */}
                <div className="flex items-center justify-between pb-6 border-b-2 border-gray-100 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Relatório Mensal
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {reportData.periodo} · {reportData.clinica}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white font-bold text-lg">
                    DM
                  </div>
                </div>

                {/* Resumo Executivo */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Resumo Executivo
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Em {reportData.periodo.toLowerCase()}, a {reportData.clinica} obteve
                    resultados positivos em todas as métricas principais. Foram{" "}
                    <strong>{reportData.resumoExecutivo.sessoes.toLocaleString("pt-BR")}</strong> visitas
                    ao site, gerando{" "}
                    <strong>{reportData.resumoExecutivo.leads}</strong> leads qualificados.
                    A presença nas redes sociais cresceu com{" "}
                    <strong>{reportData.resumoExecutivo.seguidores.toLocaleString("pt-BR")}</strong> seguidores
                    totais e taxa de engajamento de{" "}
                    <strong>{reportData.resumoExecutivo.engajamento}%</strong>.
                  </p>
                </div>

                {/* KPIs em grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gray-50 text-center">
                    <p className="text-2xl font-bold text-[#7C3AED]">
                      {reportData.resumoExecutivo.sessoes.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Sessões</p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      +{reportData.resumoExecutivo.sessoesVariacao}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 text-center">
                    <p className="text-2xl font-bold text-[#10B981]">
                      {reportData.resumoExecutivo.leads}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Leads</p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      +{reportData.resumoExecutivo.leadsVariacao}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 text-center">
                    <p className="text-2xl font-bold text-[#EC4899]">
                      {reportData.resumoExecutivo.seguidores.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Seguidores</p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      +{reportData.resumoExecutivo.seguidoresVariacao}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 text-center">
                    <p className="text-2xl font-bold text-[#F59E0B]">
                      {reportData.resumoExecutivo.notaGoogle} ★
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Nota Google</p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      +{reportData.resumoExecutivo.avaliacoesVariacao}%
                    </p>
                  </div>
                </div>

                {/* Destaques */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Destaques do Período
                  </h3>
                  <ul className="space-y-2">
                    {reportData.destaques.map((destaque, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#10B981] mt-0.5">✓</span>
                        {destaque}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Comparativo */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Comparativo com Mês Anterior
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500 font-medium">Métrica</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Mês Anterior</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Este Mês</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-700">Sessões</td>
                        <td className="py-2 text-right text-gray-500">{reportData.comparativo.anterior.sessoes.toLocaleString("pt-BR")}</td>
                        <td className="py-2 text-right font-medium text-gray-900">{reportData.resumoExecutivo.sessoes.toLocaleString("pt-BR")}</td>
                        <td className="py-2 text-right text-green-600 font-medium">+{reportData.resumoExecutivo.sessoesVariacao}%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-700">Leads</td>
                        <td className="py-2 text-right text-gray-500">{reportData.comparativo.anterior.leads}</td>
                        <td className="py-2 text-right font-medium text-gray-900">{reportData.resumoExecutivo.leads}</td>
                        <td className="py-2 text-right text-green-600 font-medium">+{reportData.resumoExecutivo.leadsVariacao}%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-700">Seguidores</td>
                        <td className="py-2 text-right text-gray-500">{reportData.comparativo.anterior.seguidores.toLocaleString("pt-BR")}</td>
                        <td className="py-2 text-right font-medium text-gray-900">{reportData.resumoExecutivo.seguidores.toLocaleString("pt-BR")}</td>
                        <td className="py-2 text-right text-green-600 font-medium">+{reportData.resumoExecutivo.seguidoresVariacao}%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-700">Nota Google</td>
                        <td className="py-2 text-right text-gray-500">{reportData.comparativo.anterior.avaliacoes}</td>
                        <td className="py-2 text-right font-medium text-gray-900">{reportData.resumoExecutivo.avaliacoes}</td>
                        <td className="py-2 text-right text-green-600 font-medium">+{reportData.resumoExecutivo.avaliacoesVariacao}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">
                    Relatório gerado por Zuary · {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
