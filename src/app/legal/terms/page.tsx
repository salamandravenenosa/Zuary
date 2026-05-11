// Termos de Uso — Compliance com plataformas
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Termos de Uso</h1>
      <p className="text-sm text-muted-foreground mb-8">Última atualização: 11 de maio de 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ao acessar ou usar o Zuary, você concorda com estes Termos de Uso. Se não concordar, não use o serviço.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Descrição do Serviço</h2>
          <p className="text-muted-foreground leading-relaxed">
            O Zuary é uma plataforma SaaS de dashboard de métricas de marketing digital para clínicas odontológicas. O serviço permite que clínicas visualizem dados consolidados de redes sociais (Instagram, TikTok), analytics de site (Google Analytics), Google Meu Negócio e WhatsApp Business em um único painel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Uso de Integrações OAuth</h2>
          <p className="text-muted-foreground leading-relaxed">
            O Zuary utiliza autenticação OAuth para acessar dados de plataformas de terceiros (Meta, Google, TikTok). Ao conectar uma integração:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Você autoriza o Zuary a acessar apenas os dados necessários para exibir métricas</li>
            <li>Tokens de acesso são armazenados de forma encriptografada (AES-256-GCM)</li>
            <li>Você pode revogar o acesso a qualquer momento nas configurações</li>
            <li>Nunca coletamos ou armazenamos suas senhas de plataformas externas</li>
            <li>Não publicamos, alteramos ou interagimos com suas contas — apenas lemos dados de métricas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Uso Aceitável</h2>
          <p className="text-muted-foreground leading-relaxed">Você concorda em NÃO:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Usar o serviço para scraping ou coleta automatizada de dados</li>
            <li>Tentar acessar contas de outros usuários</li>
            <li>Manipular métricas de engajamento</li>
            <li>Usar o serviço para envio de spam ou automação não autorizada</li>
            <li>Revender ou redistribuir dados obtidos through o serviço</li>
            <li>Interferir no funcionamento do serviço ou de suas integrações</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Propriedade Intelectual</h2>
          <p className="text-muted-foreground leading-relaxed">
            Todo o conteúdo, código, design e funcionalidades do Zuary são de propriedade exclusiva da empresa. Você não pode copiar, modificar ou distribuir qualquer parte do serviço.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Disponibilidade e Suporte</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nos esforçamos para manter o serviço disponível 24/7, mas não garantimos disponibilidade ininterrupta. Suporte técnico está disponível via email: suporte@dentalmetrics.com.br
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Limitação de Responsabilidade</h2>
          <p className="text-muted-foreground leading-relaxed">
            O Zuary é uma ferramenta de visualização de dados. Não garantimos resultados específicos de marketing. Os dados exibidos dependem das APIs de terceiros e podem ter variações.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Modificações</h2>
          <p className="text-muted-foreground leading-relaxed">
            Reservamos o direito de modificar estes termos a qualquer momento. Usuários serão notificados de mudanças significativas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Lei Aplicável</h2>
          <p className="text-muted-foreground leading-relaxed">
            Estes termos são regidos pelas leis da República Federativa do Brasil.
          </p>
        </section>
      </div>
    </div>
  );
}
