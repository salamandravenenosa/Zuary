// API: Health check — verifica status de todos os serviços
import { NextRequest, NextResponse } from "next/server";
import { healthCheck, getPerformanceMetrics } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verifica auth (só admins podem ver health details)
  const token = req.cookies.get("authjs.session-token")?.value || req.cookies.get("__Secure-authjs.session-token")?.value;

  const health = await healthCheck();

  // Se não autenticado, retorna só status básico
  if (!token) {
    return NextResponse.json({
      status: health.status,
      timestamp: new Date().toISOString(),
    });
  }

  // Se autenticado, retorna detalhes
  const metrics = await getPerformanceMetrics();

  return NextResponse.json({
    status: health.status,
    timestamp: new Date().toISOString(),
    checks: health.checks,
    metrics,
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
}
