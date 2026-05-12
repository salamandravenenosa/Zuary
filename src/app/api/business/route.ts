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

  const { default: jwt } = await import("jsonwebtoken");
  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as any;
  const userId = decoded.sub;

  // Gera slug
  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Verifica se slug já existe
  const existing = await prisma.clinic.findUnique({ where: { slug: generatedSlug } });
  if (existing) {
    return NextResponse.json({ error: "Esse nome já está em uso" }, { status: 400 });
  }

  // Cria a empresa
  const clinic = await prisma.clinic.create({
    data: {
      name,
      slug: generatedSlug,
      primaryColor: "#7C3AED",
      phone: phone || null,
      email: null,
      websiteUrl: website || null,
    },
  });

  // Vincula o usuário à empresa
  await prisma.user.update({
    where: { id: userId },
    data: { clinicId: clinic.id },
  });

  return NextResponse.json({ success: true, clinicId: clinic.id, slug: clinic.slug });
}
