// API: Redireciona para Instagram OAuth
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get("clinicId") || "";

  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID || "",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/instagram/callback`,
    scope: "instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement",
    state: clinicId,
    response_type: "code",
  });

  return NextResponse.redirect(
    `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`
  );
}
