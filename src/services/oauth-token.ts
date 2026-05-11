// Serviço de gerenciamento de tokens OAuth
// Encriptografa, armazena, renova e revoga tokens de forma segura
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt, isTokenExpiringSoon } from "@/lib/encryption";
import { logAudit, AuditActions, getClientIp, getUserAgent } from "@/lib/rbac/audit";

// Salva ou atualiza token OAuth encriptografado
export async function saveOAuthToken(params: {
  clinicId: string;
  integrationType: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope?: string;
  platformUserId?: string;
  platformUsername?: string;
  request?: Request;
}): Promise<void> {
  const { clinicId, integrationType, accessToken, refreshToken, expiresAt, scope, platformUserId, platformUsername, request } = params;

  // Encriptografa os tokens
  const encAccess = encrypt(accessToken);
  const encRefresh = refreshToken ? encrypt(refreshToken) : null;

  // Salva no banco
  await prisma.oAuthToken.upsert({
    where: {
      clinicId_integrationType: {
        clinicId,
        integrationType: integrationType as any,
      },
    },
    update: {
      encryptedAccessToken: encAccess.encrypted,
      ivAccessToken: encAccess.iv,
      authTagAccessToken: encAccess.authTag,
      encryptedRefreshToken: encRefresh?.encrypted || null,
      ivRefreshToken: encRefresh?.iv || null,
      authTagRefreshToken: encRefresh?.authTag || null,
      expiresAt: expiresAt || null,
      scope: scope || null,
      platformUserId: platformUserId || null,
      platformUsername: platformUsername || null,
      lastRefreshAt: new Date(),
      status: "ACTIVE",
      errorMessage: null,
    },
    create: {
      clinicId,
      integrationType: integrationType as any,
      encryptedAccessToken: encAccess.encrypted,
      ivAccessToken: encAccess.iv,
      authTagAccessToken: encAccess.authTag,
      encryptedRefreshToken: encRefresh?.encrypted || null,
      ivRefreshToken: encRefresh?.iv || null,
      authTagRefreshToken: encRefresh?.authTag || null,
      expiresAt: expiresAt || null,
      scope: scope || null,
      platformUserId: platformUserId || null,
      platformUsername: platformUsername || null,
      status: "ACTIVE",
    },
  });

  // Atualiza status da integração
  await prisma.integration.updateMany({
    where: { clinicId, type: integrationType as any },
    data: { status: "CONNECTED", lastSyncAt: new Date(), errorMessage: null },
  });

  // Log de auditoria
  await logAudit({
    clinicId,
    action: AuditActions.INTEGRATION_CONNECTED,
    resource: "integration",
    details: { type: integrationType, platformUsername },
    ipAddress: request ? getClientIp(request) : undefined,
    userAgent: request ? getUserAgent(request) : undefined,
  });
}

// Desencriptografa e retorna o token de acesso
export async function getAccessToken(
  clinicId: string,
  integrationType: string
): Promise<string | null> {
  const tokenRecord = await prisma.oAuthToken.findUnique({
    where: {
      clinicId_integrationType: {
        clinicId,
        integrationType: integrationType as any,
      },
    },
  });

  if (!tokenRecord || tokenRecord.status === "REVOKED") {
    return null;
  }

  // Verifica se expirou
  if (tokenRecord.expiresAt && new Date(tokenRecord.expiresAt) < new Date()) {
    // Tenta renovar
    const refreshed = await refreshToken(clinicId, integrationType);
    if (refreshed) return refreshed;

    // Marca como expirado
    await prisma.oAuthToken.update({
      where: { id: tokenRecord.id },
      data: { status: "EXPIRED" },
    });
    return null;
  }

  // Desencriptografa
  return decrypt({
    encrypted: tokenRecord.encryptedAccessToken,
    iv: tokenRecord.ivAccessToken,
    authTag: tokenRecord.authTagAccessToken,
  });
}

// Renova token usando refresh token
async function refreshToken(
  clinicId: string,
  integrationType: string
): Promise<string | null> {
  const tokenRecord = await prisma.oAuthToken.findUnique({
    where: {
      clinicId_integrationType: {
        clinicId,
        integrationType: integrationType as any,
      },
    },
  });

  if (!tokenRecord?.encryptedRefreshToken || !tokenRecord?.ivRefreshToken || !tokenRecord?.authTagRefreshToken) {
    return null;
  }

  // Desencriptografa o refresh token
  const refreshTokenValue = decrypt({
    encrypted: tokenRecord.encryptedRefreshToken,
    iv: tokenRecord.ivRefreshToken,
    authTag: tokenRecord.authTagRefreshToken,
  });

  try {
    let newAccessToken: string;
    let newRefreshToken: string | undefined;
    let newExpiresAt: Date | undefined;

    switch (integrationType) {
      case "INSTAGRAM":
        const metaResult = await refreshMetaToken(refreshTokenValue);
        newAccessToken = metaResult.accessToken;
        newRefreshToken = metaResult.refreshToken;
        newExpiresAt = metaResult.expiresAt;
        break;

      case "GOOGLE_ANALYTICS":
      case "GOOGLE_BUSINESS":
        const googleResult = await refreshGoogleToken(refreshTokenValue);
        newAccessToken = googleResult.accessToken;
        newExpiresAt = googleResult.expiresAt;
        break;

      default:
        return null;
    }

    // Salva o novo token
    await saveOAuthToken({
      clinicId,
      integrationType,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken || refreshTokenValue,
      expiresAt: newExpiresAt,
    });

    // Atualiza contagem de refresh
    await prisma.oAuthToken.update({
      where: { id: tokenRecord.id },
      data: {
        refreshCount: { increment: 1 },
        lastRefreshAt: new Date(),
      },
    });

    await logAudit({
      clinicId,
      action: AuditActions.INTEGRATION_TOKEN_REFRESHED,
      resource: "oauth_token",
      details: { type: integrationType, refreshCount: tokenRecord.refreshCount + 1 },
    });

    return newAccessToken;
  } catch (error: any) {
    await prisma.oAuthToken.update({
      where: { id: tokenRecord.id },
      data: { status: "REFRESH_FAILED", errorMessage: error.message },
    });

    await logAudit({
      clinicId,
      action: AuditActions.INTEGRATION_ERROR,
      resource: "oauth_token",
      details: { type: integrationType, error: error.message },
    });

    return null;
  }
}

// Refresh token Meta (Instagram)
async function refreshMetaToken(refreshToken: string) {
  const response = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.INSTAGRAM_APP_ID}&client_secret=${process.env.INSTAGRAM_APP_SECRET}&fb_exchange_token=${refreshToken}`
  );
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return {
    accessToken: data.access_token,
    refreshToken: data.access_token, // Meta não retorna novo refresh token
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

// Refresh token Google
async function refreshGoogleToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);

  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

// Revoga token (logout do usuário)
export async function revokeOAuthToken(
  clinicId: string,
  integrationType: string,
  request?: Request
): Promise<void> {
  const tokenRecord = await prisma.oAuthToken.findUnique({
    where: {
      clinicId_integrationType: {
        clinicId,
        integrationType: integrationType as any,
      },
    },
  });

  if (tokenRecord) {
    await prisma.oAuthToken.update({
      where: { id: tokenRecord.id },
      data: { status: "REVOKED" },
    });

    await prisma.integration.updateMany({
      where: { clinicId, type: integrationType as any },
      data: { status: "DISCONNECTED" },
    });

    await logAudit({
      clinicId,
      action: AuditActions.INTEGRATION_DISCONNECTED,
      resource: "oauth_token",
      details: { type: integrationType },
      ipAddress: request ? getClientIp(request) : undefined,
      userAgent: request ? getUserAgent(request) : undefined,
    });
  }
}

// Verifica tokens que estão prestes a expirar (cron job)
export async function checkExpiringTokens(): Promise<void> {
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

  const expiringTokens = await prisma.oAuthToken.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: fiveMinutesFromNow },
      encryptedRefreshToken: { not: null },
    },
  });

  for (const token of expiringTokens) {
    await prisma.oAuthToken.update({
      where: { id: token.id },
      data: { status: "EXPIRING_SOON" },
    });

    // Cria notificação
    await prisma.notification.create({
      data: {
        clinicId: token.clinicId,
        type: "TOKEN_EXPIRING",
        title: "Token prestes a expirar",
        message: `O token da integração ${token.integrationType} está prestes a expirar. Renovação automática em andamento.`,
      },
    });
  }
}
