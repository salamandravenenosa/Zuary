// API: Criar empresa
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, slug, industry, phone, website } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  // Pega o usuário do cookie
  const token = req.cookies.get("authjs.session-token")?.value || req.cookies.get("__Secure-authjs.session-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { default: jwt } = await import("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as any;
    const userId = decoded.sub;

    if (!userId) {
      return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
    }

    // Busca o usuário
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Se já tem empresa, atualiza
    if (user.clinicId) {
      const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      await prisma.clinic.update({
        where: { id: user.clinicId },
        data: { name, slug: generatedSlug, phone: phone || null, websiteUrl: website || null },
      });
      return NextResponse.json({ success: true, clinicId: user.clinicId, slug: generatedSlug });
    }

    // Cria nova empresa
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

    const existing = await prisma.clinic.findUnique({ where: { slug: generatedSlug } });
    if (existing) {
      return NextResponse.json({ error: "Esse nome já está em uso" }, { status: 400 });
    }

    const clinic = await prisma.clinic.create({
      data: {
        name,
        slug: generatedSlug,
        primaryColor: "#7C3AED",
        phone: phone || null,
        websiteUrl: website || null,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { clinicId: clinic.id },
    });

    return NextResponse.json({ success: true, clinicId: clinic.id, slug: clinic.slug });
  } catch (err: any) {
    console.error("Erro ao criar empresa:", err);
    return NextResponse.json({ error: "Erro interno: " + err.message }, { status: 500 });
  }
}
