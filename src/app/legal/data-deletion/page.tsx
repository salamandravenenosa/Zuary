// Página de Exclusão de Dados — LGPD + Meta Data Deletion Requirements
export default function DataDeletionPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Instruções de Exclusão de Dados</h1>
      <p className="text-sm text-muted-foreground mb-8">Última atualização: 11 de maio de 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Como Solicitar a Exclusão dos Seus Dados</h2>
          <p className="text-muted-foreground leading-relaxed">
            De acordo com a LGPD (Lei nº 13.709/2018) e as políticas de plataforma do Meta, Google e TikTok, você tem o direito de solicitar a exclusão completa dos seus dados pessoais do Zuary.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Dados que Serão Excluídos</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Conta de usuário (nome, email, senha hasheada)</li>
            <li>Dados da empresa (nome, endereço, CNPJ)</li>
            <li>Todos os tokens OAuth encriptografados (revogados antes da exclusão)</li>
            <li>Todas as métricas e snapshots armazenados</li>
            <li>Relatórios gerados</li>
            <li>Metas e configurações</li>
            <li>Logs de auditoria (mantidos apenas se exigido por lei, por até 5 anos)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Como Solicitar</h2>
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-3">
            <p className="text-foreground font-medium">Envie um email para:</p>
            <p className="text-[#7C3AED]">privacidade@negóciometrics.com.br</p>
            <p className="text-muted-foreground">Com o assunto: &quot;Solicitação de Exclusão de Dados&quot;</p>
            <p className="text-muted-foreground">Inclua: Seu email cadastrado e nome da empresa</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Prazo de Resposta</h2>
          <p className="text-muted-foreground leading-relaxed">
            Processaremos sua solicitação em até <strong>15 dias úteis</strong>, conforme exigido pela LGPD. Você receberá uma confirmação por email quando a exclusão for concluída.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Revogação de Acesso OAuth</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ao solicitar a exclusão, todos os tokens de acesso OAuth são imediatamente revogados nas plataformas correspondentes (Meta, Google, TikTok). Issoremove qualquer acesso que o Zuary tenha às suas contas externas.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            Você também pode revogar o acesso individualmente antes da exclusão completa, acessando <strong>Configurações → Integrações</strong> no painel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Confirmação de Exclusão</h2>
          <p className="text-muted-foreground leading-relaxed">
            Após a exclusão, enviaremos uma confirmação por email com:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Data e hora da exclusão</li>
            <li>Lista de dados excluídos</li>
            <li>Confirmação de revogação dos tokens OAuth</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
