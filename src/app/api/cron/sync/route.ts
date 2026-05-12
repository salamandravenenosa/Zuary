// Cron job único — coleta dados + renova tokens expirados
// Roda 1x por dia às 3h (compatível com plano Hobby do Vercel)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collectInstagramData } from "@/services/collect-instagram";
import { collectGA4Data } from "@/services/collect-ga4";
import { collectTikTokData } from "@/services/collect-tiktok";
import { log, LogLevel } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { clinics: 0, synced: 0, errors: 0, tokensRefreshed: 0, details: [] as any[] };

  try {
    // 1. Renova tokens expirados primeiro
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const expiringTokens = await prisma.oAuthToken.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lt: oneHourFromNow },
        encryptedRefreshToken: { not: null },
      },
    });

    for (const token of expiringTokens) {
      try {
        const { getAccessToken } = await import("@/services/oauth-token");
        await getAccessToken(token.clinicId, token.integrationType);
        results.tokensRefreshed++;
      } catch (err: any) {
        await prisma.oAuthToken.update({
          where: { id: token.id },
          data: { status: "REFRESH_FAILED", errorMessage: err.message },
        });
      }
    }

    // 2. Coleta dados de todas as clínicas ativas
    const clinics = await prisma.clinic.findMany({
      where: { active: true },
      include: { integrations: { where: { status: "CONNECTED" } } },
    });

    results.clinics = clinics.length;

    for (const clinic of clinics) {
      for (const integration of clinic.integrations) {
        try {
          switch (integration.type) {
            case "INSTAGRAM": await collectInstagramData(clinic.id); break;
            case "GOOGLE_ANALYTICS": await collectGA4Data(clinic.id); break;
            case "TIKTOK": await collectTikTokData(clinic.id); break;
            default: continue;
          }
          results.synced++;
          results.details.push({ clinic: clinic.name, source: integration.type, status: "ok" });
        } catch (err: any) {
          results.errors++;
          await prisma.integration.update({
            where: { id: integration.id },
            data: { status: "ERROR", errorMessage: err.message, retryCount: { increment: 1 } },
          });
          results.details.push({ clinic: clinic.name, source: integration.type, status: "error" });
        }
      }
    }

    log(LogLevel.INFO, `Cron concluído`, { synced: results.synced, errors: results.errors, tokensRefreshed: results.tokensRefreshed });
    return NextResponse.json(results);
  } catch (err: any) {
    log(LogLevel.ERROR, "Erro no cron", { error: err.message });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
