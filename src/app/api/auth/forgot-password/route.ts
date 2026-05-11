// API: Esqueci a senha — gera token e envia email
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
  }

  // Busca usuário
  const user = await prisma.user.findUnique({ where: { email } });

  // Sempre retorna sucesso (não revela se o email existe)
  if (!user) {
    return NextResponse.json({ message: "Se o email existir, enviaremos um link de redefinição." });
  }

  // Gera token de redefinição (expira em 1h)
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  // Salva no banco (usando session como storage temporário)
  // Em produção, usar tabela dedicada
  await prisma.session.create({
    data: {
      sessionToken: `reset:${token}`,
      userId: user.id,
      expires,
    },
  });

  // Envia email (usa MailPit em dev, SMTP em produção)
  // Em produção, descomentar:
  // await sendEmail({
  //   to: user.email,
  //   subject: "Redefinir sua senha — Zuary",
  //   html: `<p>Clique no link para redefinir:</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">Redefinir Senha</a>`,
  // });

  console.log(`[PASSWORD RESET] Token para ${email}: ${token}`);
  console.log(`[PASSWORD RESET] Link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`);

  return NextResponse.json({ message: "Se o email existir, enviaremos um link de redefinição." });
}
