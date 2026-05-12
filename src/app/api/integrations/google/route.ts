// API: Redireciona para Google OAuth
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get("clinicId") || "";

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`,
    scope: "openid email profile https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/business.manage",
    state: clinicId,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
