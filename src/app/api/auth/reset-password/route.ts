// API: Redefinir senha — valida token e atualiza
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Token e senha são obrigatórios" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Senha deve ter no mínimo 8 caracteres" }, { status: 400 });
  }

  // Busca session com o token
  const session = await prisma.session.findUnique({
    where: { sessionToken: `reset:${token}` },
  });

  if (!session || session.expires < new Date()) {
    return NextResponse.json({ error: "Token expirado ou inválido" }, { status: 400 });
  }

  // Atualiza a senha
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: session.userId },
    data: { passwordHash },
  });

  // Remove o token
  await prisma.session.delete({ where: { id: session.id } });

  return NextResponse.json({ message: "Senha redefinida com sucesso" });
}
