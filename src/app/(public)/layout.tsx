// Layout para páginas públicas
import Image from "next/image";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-foreground">
      {/* Header público */}
      <header className="border-b border-white/[0.08] bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon-1024.png" alt="Zuary" width={34} height={34} className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-bold text-white">Zuary</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Sobre</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Preços</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contato</Link>
            <Link href="/login" className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors">Entrar</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/icon-1024.png" alt="Zuary" width={34} height={34} className="h-8 w-8 rounded-lg" />
                <span className="text-lg font-bold text-white">Zuary</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dashboard de marketing para agências que atendem clínicas e negócios locais.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Preços</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">Sobre</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-foreground transition-colors">Política de Cookies</Link></li>
                <li><Link href="/legal/data-deletion" className="hover:text-foreground transition-colors">Exclusão de Dados</Link></li>
                <li><Link href="/legal/acceptable-use" className="hover:text-foreground transition-colors">Uso Aceitável</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Contato</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contato@zuary.vercel.app</li>
                <li>suporte@zuary.vercel.app</li>
                <li>São Paulo, SP — Brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.08] mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 Zuary. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
            </p>
            <p className="text-xs text-muted-foreground">
              Em conformidade com LGPD, Meta Platform Policies, Google API Services e TikTok Developer Policies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
