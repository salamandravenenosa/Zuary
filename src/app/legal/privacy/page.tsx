// Política de Privacidade — LGPD + GDPR Compliance
// Página obrigatória para aprovação em todas as plataformas
export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidade</h1>
      <p className="text-sm text-muted-foreground mb-8">Última atualização: 11 de maio de 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Introdução</h2>
          <p className="text-muted-foreground leading-relaxed">
            O Zuary (&quot;nós&quot;, &quot;nosso&quot;) opera a plataforma de dashboard de métricas de marketing digital para empresas e negócios. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), o Regulamento Geral de Proteção de Dados (GDPR) da União Europeia, e as políticas de plataforma do Meta, Google e TikTok.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Dados que Coletamos</h2>
          <h3 className="text-lg font-medium text-white mb-2">2.1 Dados de Cadastro</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Nome completo e endereço de email</li>
            <li>Nome da empresa e dados de contato (telefone, endereço)</li>
            <li>CNPJ (quando aplicável)</li>
          </ul>

          <h3 className="text-lg font-medium text-white mb-2 mt-4">2.2 Dados de Autenticação</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Hash da senha (nunca armazenamos senhas em texto plano)</li>
            <li>Tokens de sessão JWT</li>
          </ul>

          <h3 className="text-lg font-medium text-white mb-2 mt-4">2.3 Tokens de Integração OAuth</h3>
          <p className="text-muted-foreground leading-relaxed">
            Quando você conecta uma integração (Instagram, Google Analytics, Google Business Profile, TikTok), armazenamos tokens de acesso OAuth de forma encriptografada usando AES-256-GCM. Estes tokens são necessários para acessar as APIs das plataformas para exibir suas métricas. <strong>Nunca coletamos ou armazenamos suas senhas de plataformas externas.</strong> A autenticação é feita exclusivamente via OAuth, onde você autoriza o acesso através das plataformas oficiais.
          </p>

          <h3 className="text-lg font-medium text-white mb-2 mt-4">2.4 Dados de Métricas</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Dados de engajamento do Instagram e TikTok (seguidores, alcance, curtidas)</li>
            <li>Dados de analytics do Google Analytics (sessões, pageviews, origem de tráfego)</li>
            <li>Dados do Google Meu Negócio (visualizações, avaliações)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-2">
            Estes dados são coletados apenas mediante sua autorização explícita e são usados exclusivamente para exibição no dashboard.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Finalidade do Tratamento</h2>
          <p className="text-muted-foreground leading-relaxed">
            Tratamos seus dados para as seguintes finalidades:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Prestação do serviço:</strong> Fornecer o dashboard de métricas e relatórios</li>
            <li><strong>Autenticação:</strong> Verificar sua identidade e garantir acesso seguro</li>
            <li><strong>Comunicação:</strong> Enviar notificações sobre o status das integrações e metas</li>
            <li><strong>Segurança:</strong> Prevenir fraudes e proteger contra acesso não autorizado</li>
            <li><strong>Cumprimento legal:</strong> Atender obrigações legais e regulatórias</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Base Legal para Tratamento</h2>
          <p className="text-muted-foreground leading-relaxed">
            O tratamento dos seus dados é fundamentado em:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Consentimento:</strong> Quando você autoriza a conexão de integrações OAuth</li>
            <li><strong>Execução de contrato:</strong> Para fornecer o serviço contratado</li>
            <li><strong>Legítimo interesse:</strong> Para segurança e melhoria do serviço</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Compartilhamento de Dados</h2>
          <p className="text-muted-foreground leading-relaxed">
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Plataformas de integração (Meta, Google, TikTok) — apenas para obter métricas autorizadas por você</li>
            <li>Prestadores de serviços essenciais (hosting, banco de dados) — sob acordos de confidencialidade</li>
            <li>Autoridades legais — quando exigido por lei</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Segurança dos Dados</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Tokens OAuth encriptografados com AES-256-GCM</li>
            <li>Senhas armazenadas com hash bcrypt</li>
            <li>Comunicação HTTPS/TLS em todas as rotas</li>
            <li>Isolamento multi-tenant por clinicId</li>
            <li>Rate limiting para prevenir abuso</li>
            <li>Logs de auditoria para todas as ações sensíveis</li>
            <li>Sessões com expiração automática</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Seus Direitos (LGPD)</h2>
          <p className="text-muted-foreground leading-relaxed">
            De acordo com a LGPD, você tem direito a:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Acesso:</strong> Solicitar uma cópia dos seus dados pessoais</li>
            <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados</li>
            <li><strong>Exclusão:</strong> Solicitar a exclusão dos seus dados pessoais</li>
            <li><strong>Revogação de consentimento:</strong> Revogar o consentimento a qualquer momento</li>
            <li><strong>Portabilidade:</strong> Solicitar a transferência dos seus dados</li>
            <li><strong>Oposição:</strong> Opor-se ao tratamento dos seus dados</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-2">
            Para exercer seus direitos, entre em contato com nosso Encarregado de Dados: <strong>privacidade@negóciometrics.com.br</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Retenção de Dados</h2>
          <p className="text-muted-foreground leading-relaxed">
            Seus dados são mantidos enquanto sua conta estiver ativa. Após a exclusão da conta, mantemos apenas os dados exigidos por lei (logs de auditoria por 5 anos). Tokens OAuth são imediatamente revogados e deletados quando você desconecta uma integração ou exclui sua conta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Utilizamos cookies essenciais para autenticação e funcionamento do sistema. Não utilizamos cookies de rastreamento ou terceiros para fins de marketing. Para mais detalhes, consulte nossa <a href="/legal/cookies" className="text-[#7C3AED] hover:underline">Política de Cookies</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">10. Contato</h2>
          <p className="text-muted-foreground leading-relaxed">
            Encarregado de Proteção de Dados (DPO):<br />
            Email: privacidade@negóciometrics.com.br<br />
            Endereço: São Paulo, SP — Brasil
          </p>
        </section>
      </div>
    </div>
  );
}
