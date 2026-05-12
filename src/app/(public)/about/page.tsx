import type { Metadata } from "next";
import { BarChart3, Lock, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre o dashboard de marketing",
  description:
    "Conheça o Zuary, um dashboard para agências mostrarem métricas de marketing de forma clara para clientes locais.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Sobre o Zuary</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Zuary é um dashboard de marketing para agências que precisam mostrar resultado sem depender de planilhas, prints soltos ou telas difíceis do GA4.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <div className="h-12 w-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center mb-4">
            <BarChart3 className="h-6 w-6 text-[#7C3AED]" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Dados claros</h2>
          <p className="text-sm text-muted-foreground">
            Instagram, TikTok, Google Analytics e Google Maps em uma visão que o cliente entende.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <div className="h-12 w-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-[#7C3AED]" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Conexões seguras</h2>
          <p className="text-sm text-muted-foreground">
            As integrações usam OAuth. Os tokens ficam criptografados no banco.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <div className="h-12 w-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center mb-4">
            <RefreshCw className="h-6 w-6 text-[#7C3AED]" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Coleta automática</h2>
          <p className="text-sm text-muted-foreground">
            O cron busca dados novos e salva snapshots para o dashboard.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-white/[0.08] bg-white/[0.02]">
        <h2 className="text-2xl font-bold text-white mb-4">Para que serve</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          O Zuary ajuda a agência a provar o trabalho do mês. O cliente vê sessões, seguidores, avaliações, leads e relatórios sem entrar nas ferramentas de origem.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          A interface foi feita para negócios locais — quem quer saber se o marketing está trazendo resultado.
        </p>
      </div>
    </div>
  );
}
