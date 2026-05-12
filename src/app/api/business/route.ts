// API: Criar empresa — sem JWT manual, busca clinicId do cookie
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, industry, phone, website } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  // Pega o token do cookie
  const token = req.cookies.get("authjs.session-token")?.value
    || req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    // Decodifica JWT sem verificar (só pegar dados)
    // NextAuth v5 usa JWE/JWS — decodifica base64
    const parts = token.split(".");
    if (parts.length !== 3) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    const userId = payload.sub;

    if (!userId) {
      return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Se já tem empresa, atualiza
    if (user.clinicId) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
      await prisma.clinic.update({
        where: { id: user.clinicId },
        data: { name, slug, phone: phone || null, websiteUrl: website || null },
      });
      return NextResponse.json({ success: true, clinicId: user.clinicId, slug });
    }

    // Cria nova empresa
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

    const clinic = await prisma.clinic.create({
      data: {
        name,
        slug,
        primaryColor: "#7C3AED",
        phone: phone || null,
        websiteUrl: website || null,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { clinicId: clinic.id },
    });

    return NextResponse.json({ success: true, clinicId: clinic.id, slug });
  } catch (err: any) {
    console.error("Erro ao criar empresa:", err);
    return NextResponse.json({ error: "Erro interno: " + err.message }, { status: 500 });
  }
}
