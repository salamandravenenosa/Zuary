// Cron job — coleta automática de dados reais das APIs
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collectInstagramData } from "@/services/collect-instagram";
import { collectGA4Data } from "@/services/collect-ga4";
import { collectTikTokData } from "@/services/collect-tiktok";
import { sendEmail, integrationErrorEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { clinics: 0, synced: 0, errors: 0, details: [] as any[] };

  try {
    const clinics = await prisma.clinic.findMany({
      where: { active: true },
      include: { integrations: { where: { status: "CONNECTED" } } },
    });

    results.clinics = clinics.length;

    for (const clinic of clinics) {
      for (const integration of clinic.integrations) {
        try {
          switch (integration.type) {
            case "INSTAGRAM":
              await collectInstagramData(clinic.id);
              break;
            case "GOOGLE_ANALYTICS":
              await collectGA4Data(clinic.id);
              break;
            case "TIKTOK":
              await collectTikTokData(clinic.id);
              break;
            default:
              continue;
          }

          results.synced++;
          results.details.push({ clinic: clinic.name, source: integration.type, status: "ok" });
        } catch (err: any) {
          results.errors++;

          // Marca erro na integração
          await prisma.integration.update({
            where: { id: integration.id },
            data: { status: "ERROR", errorMessage: err.message, retryCount: { increment: 1 } },
          });

          // Envia email de notificação
          const clinicUsers = await prisma.user.findMany({
            where: { clinicId: clinic.id },
            select: { email: true },
          });

          for (const user of clinicUsers) {
            await sendEmail(
              integrationErrorEmail(clinic.name, integration.type, err.message)
            ).catch(() => {});
          }

          results.details.push({ clinic: clinic.name, source: integration.type, status: "error", error: err.message });
        }
      }
    }

    console.log(`[CRON] ${results.synced} ok, ${results.errors} erros, ${results.clinics} clínicas`);
    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
