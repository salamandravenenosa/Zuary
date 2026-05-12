// Middleware simplificado — não bloqueia nada além de /dashboard e /admin
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Só protege /dashboard e /admin
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const sessionToken =
      req.cookies.get("authjs.session-token")?.value ||
      req.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Matcher EXPLÍCITO — só aplica middleware em /dashboard e /admin
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
