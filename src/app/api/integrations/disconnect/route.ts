// API: Desconectar integração
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revokeOAuthToken } from "@/services/oauth-token";

export async function POST(req: NextRequest) {
  const { type } = await req.json();

  if (!type) {
    return NextResponse.json({ error: "type é obrigatório" }, { status: 400 });
  }

  // Busca o clinicId do cookie
  const token = req.cookies.get("authjs.session-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Decodifica JWT para pegar clinicId
  const { default: jwt } = await import("jsonwebtoken");
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as any;
    const clinicId = decoded.clinicId;
    if (!clinicId) {
      return NextResponse.json({ error: "ClinicId não encontrado" }, { status: 400 });
    }

    await revokeOAuthToken(clinicId, type);

    return NextResponse.json({ message: "Integração desconectada" });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
