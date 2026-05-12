// API: Status das integrações da clínica
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasClinicAccess } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const clinicId = searchParams.get("clinicId") || user.clinicId;

    if (!clinicId || !hasClinicAccess(user, clinicId)) {
      return NextResponse.json({ error: "Sem acesso" }, { status: 403 });
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
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
