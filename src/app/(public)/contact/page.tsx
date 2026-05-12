import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o Zuary para suporte, vendas, privacidade ou demonstração do dashboard de marketing.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">Contato</h1>
        <p className="text-lg text-muted-foreground">
          Fale com a gente sobre suporte, vendas ou privacidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white mb-2">Suporte técnico</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Problemas com a plataforma, integrações ou conta.
            </p>
            <p className="text-[#7C3AED]">suporte@zuary.vercel.app</p>
          </div>
          <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white mb-2">Vendas</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Planos, preços e demos personalizadas.
            </p>
            <p className="text-[#7C3AED]">vendas@zuary.vercel.app</p>
          </div>
          <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white mb-2">Privacidade</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Dúvidas sobre dados pessoais e LGPD.
            </p>
            <p className="text-[#7C3AED]">privacidade@zuary.vercel.app</p>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white mb-4">Envie uma mensagem</h2>
          <form className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Nome</label>
              <input type="text" className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#7C3AED]" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Email</label>
              <input type="email" className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#7C3AED]" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Assunto</label>
              <select className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#7C3AED]">
                <option>Suporte técnico</option>
                <option>Vendas</option>
                <option>Privacidade / LGPD</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Mensagem</label>
              <textarea rows={4} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#7C3AED] resize-none" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors">
              Enviar mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
