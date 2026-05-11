// Utilitários OAuth do Google — funções auxiliares
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

export function getGoogleAuthUrl(clinicId: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`,
    scope: [
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/business.manage",
    ].join(" "),
    state: clinicId,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function handleGoogleCallback(code: string, state: string) {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenResponse.json();
  if (tokenData.error) throw new Error(`Erro ao obter token Google: ${tokenData.error}`);

  const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userInfo = await userInfoResponse.json();

  const analyticsResponse = await fetch("https://analyticsadmin.googleapis.com/v1alpha/accountSummaries", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const analyticsData = await analyticsResponse.json();
  const analyticsProperty = analyticsData.accountSummaries?.[0]?.propertySummaries?.[0];

  // Salva token do Analytics
  if (analyticsProperty) {
    const encAccess = encrypt(tokenData.access_token);
    const encRefresh = tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null;

    await prisma.oAuthToken.upsert({
      where: { clinicId_integrationType: { clinicId: state, integrationType: "GOOGLE_ANALYTICS" } },
      update: {
        encryptedAccessToken: encAccess.encrypted, ivAccessToken: encAccess.iv, authTagAccessToken: encAccess.authTag,
        encryptedRefreshToken: encRefresh?.encrypted || null, ivRefreshToken: encRefresh?.iv || null, authTagRefreshToken: encRefresh?.authTag || null,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        platformUserId: analyticsProperty.property, platformUsername: analyticsProperty.displayName,
        lastRefreshAt: new Date(), status: "ACTIVE",
      },
      create: {
        clinicId: state, integrationType: "GOOGLE_ANALYTICS",
        encryptedAccessToken: encAccess.encrypted, ivAccessToken: encAccess.iv, authTagAccessToken: encAccess.authTag,
        encryptedRefreshToken: encRefresh?.encrypted || null, ivRefreshToken: encRefresh?.iv || null, authTagRefreshToken: encRefresh?.authTag || null,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        platformUserId: analyticsProperty.property, platformUsername: analyticsProperty.displayName, status: "ACTIVE",
      },
    });
    await prisma.integration.upsert({
      where: { clinicId_type: { clinicId: state, type: "GOOGLE_ANALYTICS" } },
      update: { status: "CONNECTED", lastSyncAt: new Date(), platformId: analyticsProperty.property, platformName: analyticsProperty.displayName },
      create: { clinicId: state, type: "GOOGLE_ANALYTICS", status: "CONNECTED", platformId: analyticsProperty.property, platformName: analyticsProperty.displayName, lastSyncAt: new Date() },
    });
  }

  // Salva token do Business Profile
  const encAccess = encrypt(tokenData.access_token);
  const encRefresh = tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null;

  await prisma.oAuthToken.upsert({
    where: { clinicId_integrationType: { clinicId: state, integrationType: "GOOGLE_BUSINESS" } },
    update: {
      encryptedAccessToken: encAccess.encrypted, ivAccessToken: encAccess.iv, authTagAccessToken: encAccess.authTag,
      encryptedRefreshToken: encRefresh?.encrypted || null, ivRefreshToken: encRefresh?.iv || null, authTagRefreshToken: encRefresh?.authTag || null,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      platformUserId: userInfo.id, platformUsername: userInfo.name,
      lastRefreshAt: new Date(), status: "ACTIVE",
    },
    create: {
      clinicId: state, integrationType: "GOOGLE_BUSINESS",
      encryptedAccessToken: encAccess.encrypted, ivAccessToken: encAccess.iv, authTagAccessToken: encAccess.authTag,
      encryptedRefreshToken: encRefresh?.encrypted || null, ivRefreshToken: encRefresh?.iv || null, authTagRefreshToken: encRefresh?.authTag || null,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      platformUserId: userInfo.id, platformUsername: userInfo.name, status: "ACTIVE",
    },
  });
  await prisma.integration.upsert({
    where: { clinicId_type: { clinicId: state, type: "GOOGLE_BUSINESS" } },
    update: { status: "CONNECTED", lastSyncAt: new Date(), platformId: userInfo.id, platformName: userInfo.name },
    create: { clinicId: state, type: "GOOGLE_BUSINESS", status: "CONNECTED", platformId: userInfo.id, platformName: userInfo.name, lastSyncAt: new Date() },
  });

  return { success: true, email: userInfo.email };
}
