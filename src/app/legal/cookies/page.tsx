// Política de Cookies — LGPD + Transparência
export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Política de Cookies</h1>
      <p className="text-sm text-muted-foreground mb-8">Última atualização: 11 de maio de 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. O que são Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles são amplamente usados para fazer o site funcionar corretamente e fornecer informações aos proprietários do site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Cookies que Utilizamos</h2>
          <h3 className="text-lg font-medium text-white mb-2">2.1 Cookies Essenciais</h3>
          <p className="text-muted-foreground leading-relaxed">
            Estes cookies são necessários para o funcionamento do serviço e não podem ser desativados:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>next-auth.session-token:</strong> Cookie de sessão JWT para autenticação. Expira em 24 horas.</li>
            <li><strong>next-auth.csrf-token:</strong> Cookie CSRF para proteção contra ataques cross-site request forgery.</li>
            <li><strong>next-auth.callback-url:</strong> Armazena a URL de retorno após autenticação.</li>
          </ul>

          <h3 className="text-lg font-medium text-white mb-2 mt-4">2.2 Cookies de Funcionalidade</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>theme-preference:</strong> Armazena sua preferência de tema (dark/light). Expira em 1 ano.</li>
          </ul>

          <h3 className="text-lg font-medium text-white mb-2 mt-4">2.3 O que NÃO Usamos</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Cookies de rastreamento de terceiros</li>
            <li>Cookies de marketing ou publicidade</li>
            <li>Cookies de analytics de terceiros (usamos nossa própria coleta)</li>
            <li>Cookies de redes sociais embutidos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Gerenciamento de Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Você pode gerenciar cookies através das configurações do seu navegador. Note que desabilitar cookies essenciais pode impedir o funcionamento do serviço.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Cookies e LGPD</h2>
          <p className="text-muted-foreground leading-relaxed">
            Em conformidade com a LGPD, utilizamos apenas cookies essenciais para o funcionamento do serviço. Não é necessário consentimento para cookies essenciais, pois são estritamente necessários para prestar o serviço solicitado pelo usuário.
          </p>
        </section>
      </div>
    </div>
  );
}
