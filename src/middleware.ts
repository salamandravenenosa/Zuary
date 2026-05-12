// Middleware — permite crawlers em rotas públicas
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userAgent = req.headers.get("user-agent") || "";

  // Crawlers do Facebook, Google, TikTok — sempre permite
  const isCrawler = /facebookexternalhit|Googlebot|TikTokBot|Twitterbot|LinkedInBot/i.test(userAgent);
  if (isCrawler) {
    return NextResponse.next();
  }

  // Rotas públicas — sempre permite
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/legal") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/debug") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/sitemap") ||
    pathname === "/" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Só protege /dashboard e /admin
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  if (!isProtected) return NextResponse.next();

  // Verifica sessão
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon-1024.png|apple-touch-icon.png).*)"],
};
