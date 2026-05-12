// API: Redireciona para Instagram OAuth
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  let clinicId = req.nextUrl.searchParams.get("clinicId") || "";

  if (!clinicId) {
    const token = req.cookies.get("authjs.session-token")?.value || req.cookies.get("__Secure-authjs.session-token")?.value;
    if (token) {
      try {
        const { default: jwt } = await import("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as any;
        clinicId = decoded.clinicId || decoded.sub || "";
        if (!clinicId) {
          const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
          if (user && !user.clinicId) {
            const clinic = await prisma.clinic.create({ data: { name: user.name || "Meu Negócio", slug: `negocio-${Date.now()}`, primaryColor: "#7C3AED" } });
            await prisma.user.update({ where: { id: user.id }, data: { clinicId: clinic.id } });
            clinicId = clinic.id;
          } else if (user?.clinicId) {
            clinicId = user.clinicId;
          }
        }
      } catch {}
    }
  }

  if (!clinicId) return NextResponse.redirect(new URL(`/dashboard/integrations?error=no_clinic`, req.url));

  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID || "",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/instagram/callback`,
    scope: "instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement",
    state: clinicId,
    response_type: "code",
  });

  return NextResponse.redirect(`https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`);
}
