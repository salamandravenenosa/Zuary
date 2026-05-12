// API: Redireciona para Google OAuth
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  let clinicId = req.nextUrl.searchParams.get("clinicId") || "";

  // Se não tem clinicId, busca do cookie
  if (!clinicId) {
    const token = req.cookies.get("authjs.session-token")?.value || req.cookies.get("__Secure-authjs.session-token")?.value;
    if (token) {
      try {
        const { default: jwt } = await import("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as any;
        clinicId = decoded.clinicId || decoded.sub || "";
      } catch {}
    }
  }

  // Se ainda não tem clinicId, cria uma clínica padrão
  if (!clinicId) {
    const token = req.cookies.get("authjs.session-token")?.value || req.cookies.get("__Secure-authjs.session-token")?.value;
    if (token) {
      try {
        const { default: jwt } = await import("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as any;
        const userId = decoded.sub;

        // Busca o usuário
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && !user.clinicId) {
          // Cria uma clínica padrão
          const clinic = await prisma.clinic.create({
            data: {
              name: user.name || "Meu Negócio",
              slug: `negocio-${Date.now()}`,
              primaryColor: "#7C3AED",
            },
          });
          // Vincula o usuário à clínica
          await prisma.user.update({
            where: { id: userId },
            data: { clinicId: clinic.id },
          });
          clinicId = clinic.id;
        } else if (user?.clinicId) {
          clinicId = user.clinicId;
        }
      } catch {}
    }
  }

  if (!clinicId) {
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=no_clinic`, req.url));
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`,
    scope: "openid email profile https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/business.manage",
    state: clinicId,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
