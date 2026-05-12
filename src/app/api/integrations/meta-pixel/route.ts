// API route: Webhook do Meta Pixel — Conversions API server-side
// Rastreia: PageView, ViewContent, Lead, Schedule
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Valida a assinatura do webhook Meta
function verifyMetaSignature(
  body: string,
  signature: string,
  appSecret: string
): boolean {
  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", appSecret).update(body).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Processa eventos do Meta Pixel
async function processPixelEvent(event: any, clinicId: string) {
  const { event_name, event_time, user_data, custom_data } = event;

  // Mapeia eventos do Pixel para métricas internas
  const eventMapping: Record<string, string> = {
    PageView: "pageview",
    ViewContent: "view_content",
    Lead: "lead",
    Schedule: "schedule",
  };

  const metricType = eventMapping[event_name];
  if (!metricType) return;

  // Salva evento (em produção, usaria fila/batch para performance)
  await prisma.metricSnapshot.create({
    data: {
      clinicId,
      source: "META_PIXEL",
      period: "DAILY",
      dateFrom: new Date(event_time * 1000),
      dateTo: new Date(event_time * 1000),
      data: {
        event: event_name,
        metricType,
        userData: {
          // Em produção, dados seriam hash por privacidade
          country: user_data?.country,
          city: user_data?.city,
        },
        customData: custom_data,
      },
      totalValue: 1,
    },
  });
}

// POST /api/integrations/meta-pixel/webhook
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256") || "";

  // Valida assinatura (descomente em produção)
  // if (!verifyMetaSignature(body, signature, process.env.META_APP_SECRET || '')) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  // }

  const data = JSON.parse(body);

  // Processa cada evento
  for (const entry of data.data || []) {
    for (const event of entry.events || []) {
      // Busca a empresa pelo pixel ID
      const integration = await prisma.integration.findFirst({
        where: {
          type: "META_PIXEL",
          platformId: entry.pixel_id,
        },
      });

      if (integration) {
        await processPixelEvent(event, integration.clinicId);
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}

// GET — Verificação do webhook (Meta envia GET para validar)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}
