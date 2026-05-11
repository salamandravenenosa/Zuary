// API route: OAuth callback do Google (Analytics + Business Profile)
import { NextRequest, NextResponse } from "next/server";
import { handleGoogleCallback } from "@/lib/google-auth";

// GET handler — callback do OAuth
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/admin?error=google_auth_failed`, request.url));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL(`/admin?error=missing_params`, request.url));
  }

  try {
    await handleGoogleCallback(code, state);
    return NextResponse.redirect(new URL(`/admin?success=google_connected`, request.url));
  } catch (err) {
    console.error("Erro no callback Google:", err);
    return NextResponse.redirect(new URL(`/admin?error=google_token_failed`, request.url));
  }
}
