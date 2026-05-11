// API route: Refresh token — COM AUTH
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/encryption";
import { requireAuth, hasClinicAccess } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { integrationId } = body;

    if (!integrationId) {
      return NextResponse.json({ error: "integrationId é obrigatório" }, { status: 400 });
    }

    const integration = await prisma.integration.findUnique({ where: { id: integrationId } });
    if (!integration) {
      return NextResponse.json({ error: "Integração não encontrada" }, { status: 404 });
    }

    // Verifica acesso
    if (!hasClinicAccess(user, integration.clinicId)) {
      return NextResponse.json({ error: "Sem acesso" }, { status: 403 });
    }

    const tokenRecord = await prisma.oAuthToken.findUnique({
      where: { clinicId_integrationType: { clinicId: integration.clinicId, integrationType: integration.type } },
    });

    if (!tokenRecord?.encryptedRefreshToken || !tokenRecord?.ivRefreshToken || !tokenRecord?.authTagRefreshToken) {
      await prisma.integration.update({
        where: { id: integrationId },
        data: { status: "TOKEN_EXPIRED", errorMessage: "Refresh token não disponível. Reconecte." },
      });
      return NextResponse.json({ error: "Refresh token não disponível" }, { status: 400 });
    }

    const refreshTokenValue = decrypt({
      encrypted: tokenRecord.encryptedRefreshToken,
      iv: tokenRecord.ivRefreshToken,
      authTag: tokenRecord.authTagRefreshToken,
    });

    let newAccessToken: string;
    let newExpiresAt: Date;

    if (integration.type === "INSTAGRAM") {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.INSTAGRAM_APP_ID}&client_secret=${process.env.INSTAGRAM_APP_SECRET}&fb_exchange_token=${refreshTokenValue}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      newAccessToken = data.access_token;
      newExpiresAt = new Date(Date.now() + data.expires_in * 1000);
    } else if (integration.type === "GOOGLE_ANALYTICS" || integration.type === "GOOGLE_BUSINESS") {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          refresh_token: refreshTokenValue,
          grant_type: "refresh_token",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      newAccessToken = data.access_token;
      newExpiresAt = new Date(Date.now() + data.expires_in * 1000);
    } else {
      return NextResponse.json({ error: "Tipo não suportado" }, { status: 400 });
    }

    const encAccess = encrypt(newAccessToken);
    await prisma.oAuthToken.update({
      where: { id: tokenRecord.id },
      data: {
        encryptedAccessToken: encAccess.encrypted, ivAccessToken: encAccess.iv, authTagAccessToken: encAccess.authTag,
        expiresAt: newExpiresAt, lastRefreshAt: new Date(),
        refreshCount: { increment: 1 }, status: "ACTIVE", errorMessage: null,
      },
    });

    return NextResponse.json({ message: "Token renovado", refreshed: true });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
