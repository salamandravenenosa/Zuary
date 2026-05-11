// API route: OAuth callback do Instagram (Meta Graph API)
import { NextRequest, NextResponse } from "next/server";
import { handleInstagramCallback } from "@/lib/instagram-auth";

// GET handler — callback do OAuth
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/admin?error=instagram_auth_failed`, request.url));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL(`/admin?error=missing_params`, request.url));
  }

  try {
    await handleInstagramCallback(code, state);
    return NextResponse.redirect(new URL(`/admin?success=instagram_connected`, request.url));
  } catch (err) {
    console.error("Erro no callback Instagram:", err);
    return NextResponse.redirect(new URL(`/admin?error=instagram_token_failed`, request.url));
  }
}
