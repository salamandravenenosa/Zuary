// API: Redireciona para TikTok OAuth
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get("clinicId") || "";

  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY || "",
    response_type: "code",
    scope: "user.info.basic,video.list",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/tiktok/callback`,
    state: clinicId,
  });

  return NextResponse.redirect(
    `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  );
}
