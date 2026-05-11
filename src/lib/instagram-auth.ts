// Utilitários OAuth do Instagram — funções auxiliares
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

export function getInstagramAuthUrl(clinicId: string): string {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID || "",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/instagram/callback`,
    scope: "instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement",
    state: clinicId,
    response_type: "code",
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}

export async function handleInstagramCallback(code: string, state: string) {
  const tokenResponse = await fetch("https://graph.facebook.com/v19.0/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/instagram/callback`,
      code,
    }),
  });
  const tokenData = await tokenResponse.json();
  if (tokenData.error) throw new Error(`Erro ao obter token: ${tokenData.error.message}`);

  const longTokenResponse = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.INSTAGRAM_APP_ID}&client_secret=${process.env.INSTAGRAM_APP_SECRET}&fb_exchange_token=${tokenData.access_token}`
  );
  const longTokenData = await longTokenResponse.json();

  const pagesResponse = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${longTokenData.access_token}`
  );
  const pagesData = await pagesResponse.json();

  let instagramAccountId: string | null = null;
  let instagramUsername: string | null = null;

  for (const page of pagesData.data || []) {
    const igResponse = await fetch(
      `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${longTokenData.access_token}`
    );
    const igData = await igResponse.json();
    if (igData.instagram_business_account) {
      instagramAccountId = igData.instagram_business_account.id;
      const profileResponse = await fetch(
        `https://graph.facebook.com/v19.0/${instagramAccountId}?fields=username&access_token=${longTokenData.access_token}`
      );
      const profileData = await profileResponse.json();
      instagramUsername = profileData.username;
      break;
    }
  }

  // Salva token encriptografado no OAuthToken
  const encAccess = encrypt(longTokenData.access_token);

  await prisma.oAuthToken.upsert({
    where: { clinicId_integrationType: { clinicId: state, integrationType: "INSTAGRAM" } },
    update: {
      encryptedAccessToken: encAccess.encrypted,
      ivAccessToken: encAccess.iv,
      authTagAccessToken: encAccess.authTag,
      expiresAt: new Date(Date.now() + longTokenData.expires_in * 1000),
      platformUserId: instagramAccountId,
      platformUsername: instagramUsername,
      lastRefreshAt: new Date(),
      status: "ACTIVE",
    },
    create: {
      clinicId: state,
      integrationType: "INSTAGRAM",
      encryptedAccessToken: encAccess.encrypted,
      ivAccessToken: encAccess.iv,
      authTagAccessToken: encAccess.authTag,
      expiresAt: new Date(Date.now() + longTokenData.expires_in * 1000),
      platformUserId: instagramAccountId,
      platformUsername: instagramUsername,
      status: "ACTIVE",
    },
  });

  // Atualiza status da integração
  await prisma.integration.upsert({
    where: { clinicId_type: { clinicId: state, type: "INSTAGRAM" } },
    update: { status: "CONNECTED", lastSyncAt: new Date(), errorMessage: null, platformId: instagramAccountId, platformName: instagramUsername },
    create: { clinicId: state, type: "INSTAGRAM", status: "CONNECTED", platformId: instagramAccountId, platformName: instagramUsername, lastSyncAt: new Date() },
  });

  return { success: true, username: instagramUsername };
}
