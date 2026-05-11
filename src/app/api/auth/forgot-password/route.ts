// API: Esqueci a senha — gera token e envia email via Resend
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, passwordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Sempre retorna sucesso (não revela se o email existe)
  if (!user) {
    return NextResponse.json({ message: "Se o email existir, enviaremos um link de redefinição." });
  }

  // Gera token (expira em 1h)
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      sessionToken: `reset:${token}`,
      userId: user.id,
      expires,
    },
  });

  // Envia email via Resend
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/reset-password?token=${token}`;
  const emailTemplate = passwordResetEmail(resetUrl);
  await sendEmail({ to: user.email, subject: emailTemplate.subject, html: emailTemplate.html });

  return NextResponse.json({ message: "Se o email existir, enviaremos um link de redefinição." });
}
