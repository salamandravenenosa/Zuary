// API: Callback do TikTok OAuth
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state"); // clinicId
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=tiktok_auth_failed`, req.url));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=missing_params`, req.url));
  }

  try {
    // Troca code por access token
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY || "",
        client_secret: process.env.TIKTOK_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/tiktok/callback`,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || "Erro ao obter token TikTok");
    }

    const accessToken = tokenData.access_token;
    const openId = tokenData.open_id;

    // Busca informações do perfil
    const userRes = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,display_name,avatar_url,follower_count,video_count,likes_count`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const userData = await userRes.json();
    const userInfo = userData.data?.user || {};

    // Salva token encriptografado
    const encAccess = encrypt(accessToken);

    await prisma.oAuthToken.upsert({
      where: { clinicId_integrationType: { clinicId: state, integrationType: "TIKTOK" } },
      update: {
        encryptedAccessToken: encAccess.encrypted,
        ivAccessToken: encAccess.iv,
        authTagAccessToken: encAccess.authTag,
        platformUserId: openId,
        platformUsername: userInfo.username || userInfo.display_name,
        lastRefreshAt: new Date(),
        status: "ACTIVE",
      },
      create: {
        clinicId: state,
        integrationType: "TIKTOK",
        encryptedAccessToken: encAccess.encrypted,
        ivAccessToken: encAccess.iv,
        authTagAccessToken: encAccess.authTag,
        platformUserId: openId,
        platformUsername: userInfo.username || userInfo.display_name,
        status: "ACTIVE",
      },
    });

    // Atualiza integração
    await prisma.integration.upsert({
      where: { clinicId_type: { clinicId: state, type: "TIKTOK" } },
      update: { status: "CONNECTED", lastSyncAt: new Date(), platformName: userInfo.username || userInfo.display_name, errorMessage: null },
      create: { clinicId: state, type: "TIKTOK", status: "CONNECTED", platformName: userInfo.username || userInfo.display_name, lastSyncAt: new Date() },
    });

    return NextResponse.redirect(new URL(`/dashboard/integrations?success=tiktok_connected`, req.url));
  } catch (err: any) {
    console.error("Erro no callback TikTok:", err);
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=${encodeURIComponent(err.message)}`, req.url));
  }
}
