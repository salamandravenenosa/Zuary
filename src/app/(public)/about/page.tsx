// Página Sobre — About
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Sobre o DentalMetrics</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Somos uma plataforma de analytics de marketing digital construída especificamente para clínicas odontológicas. Nosso objetivo é tornar os dados de marketing acessíveis e acionáveis para dentistas e gestores de clínicas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <div className="h-12 w-12 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Dados Claros</h3>
          <p className="text-sm text-muted-foreground">
            Métricas de Instagram, TikTok, Google Analytics e Google Maps em um só lugar, traduzidas para linguagem simples.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <div className="h-12 w-12 rounded-xl bg-[#10B981]/15 flex items-center justify-center mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Seguro</h3>
          <p className="text-sm text-muted-foreground">
            Tokens encriptografados com AES-256-GCM. Senhas nunca são coletadas. Conexões via OAuth oficial das plataformas.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <div className="h-12 w-12 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Tempo Real</h3>
          <p className="text-sm text-muted-foreground">
            Dados atualizados automaticamente via cron jobs. Sem necessidade de atualizar a página.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-white/[0.08] bg-white/[0.02]">
        <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Acreditamos que toda clínica odontológica merece ter acesso profissional a métricas de marketing, sem precisar de um time de数据分析 dedicado. O DentalMetrics traduz dados complexos em insights acionáveis que ajudam clínicas a crescer.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Trabalhamos em conformidade total com as políticas de plataforma do Meta, Google e TikTok, garantindo que seus dados estejam sempre seguros e que o serviço seja utilizado de forma ética e responsável.
        </p>
      </div>
    </div>
  );
}
