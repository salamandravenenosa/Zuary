// Cron job: Refresh de tokens expirados
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { log, LogLevel } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Busca tokens que expiram em menos de 1 hora
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

    const expiringTokens = await prisma.oAuthToken.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lt: oneHourFromNow },
        encryptedRefreshToken: { not: null },
      },
      include: { clinic: { select: { name: true } } },
    });

    const results = { checked: 0, refreshed: 0, failed: 0 };

    for (const token of expiringTokens) {
      results.checked++;

      try {
        // Tenta renovar o token
        const { getAccessToken } = await import("@/services/oauth-token");
        await getAccessToken(token.clinicId, token.integrationType);

        results.refreshed++;
        log(LogLevel.INFO, `Token renovado`, {
          clinic: token.clinic?.name,
          type: token.integrationType,
        });
      } catch (error: any) {
        results.failed++;

        await prisma.oAuthToken.update({
          where: { id: token.id },
          data: { status: "REFRESH_FAILED", errorMessage: error.message },
        });

        log(LogLevel.ERROR, `Falha ao renovar token`, {
          clinic: token.clinic?.name,
          type: token.integrationType,
          error: error.message,
        });
      }
    }

    log(LogLevel.INFO, `Refresh tokens concluído`, results);
    return NextResponse.json(results);
  } catch (error: any) {
    log(LogLevel.ERROR, "Erro no cron de refresh", { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
