// API: Status das integrações — busca do banco
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Pega o clinicId do cookie de sessão
  const token =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!token) {
    return NextResponse.json({ integrations: [] });
  }

  try {
    // Decodifica JWT para pegar clinicId
    const { default: jwt } = await import("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as any;
    const clinicId = decoded.clinicId || decoded.sub;

    if (!clinicId) {
      return NextResponse.json({ integrations: [] });
    }

    const integrations = await prisma.integration.findMany({
      where: { clinicId },
      select: {
        type: true,
        status: true,
        platformName: true,
        lastSyncAt: true,
        errorMessage: true,
      },
    });

    return NextResponse.json({ integrations });
  } catch {
    return NextResponse.json({ integrations: [] });
  }
}
