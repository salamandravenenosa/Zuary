// Helper de autenticação para API routes — usa cookie correto do NextAuth v5 beta
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  clinicId: string | null;
}

// Pega o token do cookie correto (authjs.session-token)
function getTokenFromRequest(request: NextRequest): string | null {
  return (
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    null
  );
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, name: true, role: true, clinicId: true, active: true },
    });
    if (!user || !user.active) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function hasClinicAccess(user: AuthUser, clinicId: string): boolean {
  if (user.role === "ADMIN") return true;
  return user.clinicId === clinicId;
}
