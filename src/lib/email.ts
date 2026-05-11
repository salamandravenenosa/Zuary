// Serviço de email com Resend
// Emails transacionais: boas-vindas, redefinição, meta atingida, erro de integração
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || "Zuary <noreply@resend.dev>";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

// Envia email
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    console.log(`[EMAIL] Enviado para ${params.to}: ${params.subject}`);
    return true;
  } catch (error: any) {
    console.error(`[EMAIL] Erro:`, error.message);
    return false;
  }
}

// ==========================================
// TEMPLATES
// ==========================================

// Base HTML wrapper
function wrapHtml(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="display:inline-flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:12px;background:#7C3AED;display:flex;align-items:center;justify-content:center;">
                  <span style="color:white;font-size:20px;font-weight:bold;">Z</span>
                </div>
                <span style="color:#ffffff;font-size:20px;font-weight:700;">Zuary</span>
              </div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color:#111118;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="color:#5a5a6e;font-size:12px;margin:0;">
                © 2026 Zuary · Marketing Analytics
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Email de boas-vindas
export function welcomeEmail(name: string, loginUrl: string): SendEmailParams {
  return {
    to: "",
    subject: "Bem-vindo ao Zuary! 🎉",
    html: wrapHtml("Bem-vindo ao Zuary", `
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 16px;">Bem-vindo, ${name}! 👋</h1>
      <p style="color:#8b8b9e;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Sua conta foi criada com sucesso. Agora você pode acessar o dashboard de métricas de marketing do seu negócio.
      </p>
      <a href="${loginUrl}" style="display:inline-block;background:#7C3AED;color:white;padding:14px 28px;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
        Acessar Dashboard
      </a>
      <p style="color:#5a5a6e;font-size:13px;margin:24px 0 0;line-height:1.6;">
        Se você não criou esta conta, ignore este email.
      </p>
    `),
  };
}

// Email: redefinição de senha
export function passwordResetEmail(resetUrl: string): SendEmailParams {
  return {
    to: "",
    subject: "Redefinir sua senha — Zuary",
    html: wrapHtml("Redefinir Senha", `
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 16px;">Redefinir sua senha</h1>
      <p style="color:#8b8b9e;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:#7C3AED;color:white;padding:14px 28px;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
        Redefinir Senha
      </a>
      <p style="color:#5a5a6e;font-size:13px;margin:24px 0 0;line-height:1.6;">
        Este link expira em 1 hora. Se você não solicitou, ignore este email.
      </p>
    `),
  };
}

// Email: meta atingida 🏆
export function goalAchievedEmail(businessName: string, goalName: string, value: number): SendEmailParams {
  return {
    to: "",
    subject: `Meta atingida! ${goalName}`,
    html: wrapHtml("Meta Atingida", `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:48px;margin-bottom:8px;">🏆</div>
      </div>
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 16px;text-align:center;">Parabéns!</h1>
      <p style="color:#8b8b9e;font-size:15px;line-height:1.7;margin:0 0 16px;text-align:center;">
        <strong style="color:#10B981;">${businessName}</strong> atingiu a meta de <strong>${goalName}</strong>!
      </p>
      <div style="text-align:center;margin:24px 0;">
        <span style="font-size:36px;font-weight:700;color:#10B981;">${value.toLocaleString("pt-BR")}</span>
      </div>
      <p style="color:#8b8b9e;font-size:15px;line-height:1.7;margin:0 0 24px;text-align:center;">
        Continue assim! Acesse o dashboard para ver todos os detalhes.
      </p>
    `),
  };
}

// Email: erro de integração ⚠️
export function integrationErrorEmail(businessName: string, integration: string, errorMsg: string): SendEmailParams {
  return {
    to: "",
    subject: `Erro na integração: ${integration}`,
    html: wrapHtml("Erro de Integração", `
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:48px;margin-bottom:8px;">⚠️</div>
      </div>
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 16px;text-align:center;">Erro de Integração</h1>
      <p style="color:#8b8b9e;font-size:15px;line-height:1.7;margin:0 0 16px;text-align:center;">
        A integração <strong style="color:#EF4444;">${integration}</strong> de <strong>${businessName}</strong> apresentou um erro.
      </p>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin:16px 0;">
        <code style="color:#EF4444;font-size:13px;font-family:monospace;">${errorMsg}</code>
      </div>
      <p style="color:#8b8b9e;font-size:15px;line-height:1.7;margin:0;text-align:center;">
        Acesse o dashboard para reconectar a integração.
      </p>
    `),
  };
}
