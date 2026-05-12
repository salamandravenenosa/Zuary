// Página de Preços
export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Planos e Preços</h1>
        <p className="text-lg text-muted-foreground">
          Escolha o plano ideal para sua empresa. Comece grátis, evolua quando precisar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plano Free */}
        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <h3 className="text-lg font-semibold text-white mb-2">Grátis</h3>
          <p className="text-3xl font-bold text-white mb-1">R$ 0</p>
          <p className="text-sm text-muted-foreground mb-6">para sempre</p>
          <ul className="space-y-3 text-sm text-muted-foreground mb-6">
            <li>✓ 1 integração</li>
            <li>✓ Dashboard básico</li>
            <li>✓ 30 dias de dados</li>
            <li>✓ Relatórios mensais</li>
          </ul>
          <button className="w-full py-2.5 rounded-lg border border-white/[0.08] text-foreground text-sm font-medium hover:bg-white/[0.06] transition-colors">
            Começar Grátis
          </button>
        </div>

        {/* Plano Pro */}
        <div className="p-6 rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/[0.03] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#7C3AED] text-white text-xs font-semibold">
            Mais Popular
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
          <p className="text-3xl font-bold text-white mb-1">R$ 197</p>
          <p className="text-sm text-muted-foreground mb-6">por mês</p>
          <ul className="space-y-3 text-sm text-muted-foreground mb-6">
            <li>✓ Todas as integrações</li>
            <li>✓ Dashboard completo</li>
            <li>✓ 12 meses de dados</li>
            <li>✓ Relatórios PDF ilimitados</li>
            <li>✓ Metas mensais</li>
            <li>✓ Suporte por email</li>
          </ul>
          <button className="w-full py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors">
            Assinar Pro
          </button>
        </div>

        {/* Plano Enterprise */}
        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <h3 className="text-lg font-semibold text-white mb-2">Enterprise</h3>
          <p className="text-3xl font-bold text-white mb-1">R$ 497</p>
          <p className="text-sm text-muted-foreground mb-6">por mês</p>
          <ul className="space-y-3 text-sm text-muted-foreground mb-6">
            <li>✓ Tudo do Pro</li>
            <li>✓ Múltiplas empresas</li>
            <li>✓ API de acesso</li>
            <li>✓ White-label</li>
            <li>✓ Suporte prioritário</li>
            <li>✓ SLA 99.9%</li>
          </ul>
          <button className="w-full py-2.5 rounded-lg border border-white/[0.08] text-foreground text-sm font-medium hover:bg-white/[0.06] transition-colors">
            Falar com Vendas
          </button>
        </div>
      </div>
    </div>
  );
}
