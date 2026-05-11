// API route: Callback do OAuth Instagram
import { NextRequest, NextResponse } from "next/server";
import { handleInstagramCallback } from "@/lib/instagram-auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // clinicId
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=instagram_auth_failed`, request.url));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=missing_params`, request.url));
  }

  try {
    await handleInstagramCallback(code, state);
    return NextResponse.redirect(new URL(`/dashboard/integrations?success=instagram_connected`, request.url));
  } catch (err: any) {
    console.error("Erro no callback Instagram:", err);
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=${encodeURIComponent(err.message)}`, request.url));
  }
}
