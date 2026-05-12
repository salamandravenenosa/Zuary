// API: Callback do Google OAuth
import { NextRequest, NextResponse } from "next/server";
import { handleGoogleCallback } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=google_auth_failed`, request.url));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=missing_params`, request.url));
  }

  try {
    await handleGoogleCallback(code, state);
    return NextResponse.redirect(new URL(`/dashboard/integrations?success=google_connected`, request.url));
  } catch (err: any) {
    console.error("Erro no callback Google:", err);
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=${encodeURIComponent(err.message)}`, request.url));
  }
}
