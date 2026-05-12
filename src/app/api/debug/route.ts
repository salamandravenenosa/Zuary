// API: Debug — verifica variáveis de ambiente e configuração
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Só retorna em produção se tiver o token correto
  const token = req.headers.get("authorization");
  if (token !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET (len:" + process.env.NEXTAUTH_SECRET.length + ")" : "MISSING",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "MISSING",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING",
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || "MISSING",
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET ? "SET" : "MISSING",
      DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ? "SET" : "MISSING",
      TIKTOK_CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY || "MISSING",
      TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET ? "SET" : "MISSING",
    },
    timestamp: new Date().toISOString(),
  });
}
