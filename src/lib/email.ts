// Serviço de email transacional — MailPit (local)
// SMTP: localhost:1025 | UI: http://localhost:8025
import nodemailer from "nodemailer";

// Transporter conectado ao MailPit local
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "1025"),
  secure: false, // MailPit não usa TLS localmente
  auth: undefined, // MailPit aceita qualquer credencial
});

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Envia email transacional
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Zuary <noreply@dentalmetrics.com.br>",
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text || params.html.replace(/<[^>]*>/g, ""),
    });
    console.log(`[EMAIL] Enviado para ${params.to}: ${params.subject}`);
    return true;
  } catch (error: any) {
    console.error(`[EMAIL] Erro ao enviar para ${params.to}:`, error.message);
    return false;
  }
}

// Template: Email de boas-vindas
export function welcomeEmail(name: string, loginUrl: string): SendEmailParams & { subject: string } {
  return {
    to: "",
    subject: "Bem-vindo ao Zuary!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7C3AED;">Bem-vindo ao Zuary! 🎉</h1>
        <p>Olá ${name},</p>
        <p>Sua conta foi criada com sucesso. Você já pode acessar o dashboard de métricas da sua clínica.</p>
        <a href="${loginUrl}" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Acessar Dashboard</a>
        <p style="color: #666; font-size: 12px;">Se você não criou esta conta, ignore este email.</p>
      </div>
    `,
  };
}

// Template: Notificação de meta atingida
export function goalAchievedEmail(clinicName: string, goalName: string, value: number): SendEmailParams & { subject: string } {
  return {
    to: "",
    subject: `Meta atingida! ${goalName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10B981;">Parabéns! 🏆</h1>
        <p>A clínica <strong>${clinicName}</strong> atingiu a meta de <strong>${goalName}</strong>!</p>
        <p style="font-size: 24px; color: #10B981; font-weight: bold;">${value.toLocaleString("pt-BR")}</p>
        <p>Acesse o dashboard para ver todos os detalhes.</p>
      </div>
    `,
  };
}

// Template: Erro de integração
export function integrationErrorEmail(clinicName: string, integration: string, error: string): SendEmailParams & { subject: string } {
  return {
    to: "",
    subject: `Erro na integração: ${integration}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #EF4444;">⚠️ Erro de Integração</h1>
        <p>A integração <strong>${integration}</strong> da clínica <strong>${clinicName}</strong> apresentou um erro:</p>
        <p style="background: #f5f5f5; padding: 12px; border-radius: 6px; font-family: monospace;">${error}</p>
        <p>Acesse o dashboard para reconectar a integração.</p>
      </div>
    `,
  };
}
