// Debug — verifica conexão com banco em produção
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const results: Record<string, unknown> = {};

  try {
    // 1. Testa conexão com banco
    await prisma.$queryRaw`SELECT 1`;
    results.dbConnection = "OK";
  } catch (e: any) {
    results.dbConnection = "FAILED";
    results.dbError = e.message;
  }

  try {
    // 2. Busca usuário
    const user = await prisma.user.findUnique({
      where: { email: "diaspessoalmkt@gmail.com" },
      select: { id: true, email: true, name: true, role: true, active: true, passwordHash: true },
    });
    results.user = user ? { ...user, passwordHash: user.passwordHash.substring(0, 15) + "..." } : null;

    // 3. Testa senha
    if (user) {
      results.passwordValid = await bcrypt.compare("@1Pontesdavi", user.passwordHash);
    }
  } catch (e: any) {
    results.userError = e.message;
  }

  // 4. Variáveis
  results.env = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING",
    DATABASE_URL: process.env.DATABASE_URL ? "SET (" + process.env.DATABASE_URL.substring(0, 30) + "...)" : "MISSING",
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ? "SET" : "MISSING",
  };

  return NextResponse.json(results);
}
