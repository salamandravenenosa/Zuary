// Política de Uso Aceitável — Compliance com plataformas
export default function AcceptableUsePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Política de Uso Aceitável</h1>
      <p className="text-sm text-muted-foreground mb-8">Última atualização: 11 de maio de 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Compromisso com Plataformas</h2>
          <p className="text-muted-foreground leading-relaxed">
            O Zuary é comprometido em seguir todas as políticas de plataforma do Meta, Google e TikTok. Esta política define o uso aceitável da nossa plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Uso Permitido</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Visualizar métricas de marketing da sua própria conta</li>
            <li>Gerar relatórios para uso interno da sua empresa</li>
            <li>Definir metas de marketing baseadas nos dados</li>
            <li>Conectar suas próprias contas de redes sociais via OAuth</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Uso Proibido</h2>
          <div className="p-4 rounded-lg bg-[#EF4444]/[0.05] border border-[#EF4444]/20">
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Scraping:</strong> Coletar dados de contas que não são suas</li>
              <li><strong>Automatização de publicação:</strong> Publicar conteúdo automaticamente em redes sociais</li>
              <li><strong>Manipulação de engajamento:</strong> Curtir, comentar ou seguir automaticamente</li>
              <li><strong>Coleta de dados de terceiros:</strong> Acessar métricas de contas sem autorização</li>
              <li><strong>Venda de dados:</strong> Revender qualquer dados obtidos through o serviço</li>
              <li><strong>Spam:</strong> Enviar mensagens não solicitadas usando dados do serviço</li>
              <li><strong>Engenharia reversa:</strong> Tentar acessar tokens ou dados de outros usuários</li>
              <li><strong>Burlar rate limits:</strong> Tentar contornar limites de requisição das APIs</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Conformidade com Meta</h2>
          <p className="text-muted-foreground leading-relaxed">
            O Zuary usa as APIs do Meta (Instagram Graph API, Facebook Login, Conversions API) em conformidade com as Platform Policies do Meta:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Acesso read-only para dados de métricas</li>
            <li>Nenhuma publicação ou interação automatizada</li>
            <li>Armazenamento seguro de tokens com criptografia</li>
            <li>Revogação imediata quando solicitado</li>
            <li>Dados de usuários não são compartilhados com terceiros</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Conformidade com Google</h2>
          <p className="text-muted-foreground leading-relaxed">
            O Zuary cumpre a Google API Services User Data Policy:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Apenas dados necessários são solicitados (least privilege)</li>
            <li>Dados não são usados para fins diferentes dos declarados</li>
            <li>Dados não são transferidos para outros serviços</li>
            <li>Política de privacidade publicada e atualizada</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Conformidade com TikTok</h2>
          <p className="text-muted-foreground leading-relaxed">
            O Zuary cumpre as TikTok Developer Policies:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Acesso read-only para dados de perfil e métricas</li>
            <li>Nenhuma manipulação de seguidores ou engajamento</li>
            <li>Nenhuma automação de publicação</li>
            <li>Dados usados apenas para analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Violações</h2>
          <p className="text-muted-foreground leading-relaxed">
            Violações desta política resultarão em:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Aviso por email</li>
            <li>Suspensão temporária da conta</li>
            <li>Desconexão de integrações</li>
            <li>Encerramento permanente da conta em casos graves</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
