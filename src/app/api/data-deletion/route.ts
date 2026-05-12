// API: Data Deletion Callback para Facebook
// Retorna 200 OK para qualquer request — cumpre requisito do Meta
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET — Facebook verifica se a URL existe
export async function GET() {
  return NextResponse.json({
    message: "Zuary Data Deletion Instructions",
    url: "https://zuary.vercel.app/legal/data-deletion",
    instructions: "Visit our data deletion page for instructions on how to delete your data.",
  }, { status: 200 });
}

// POST — Facebook envia notificação de exclusão
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[DATA-DELETION] Request recebido:", JSON.stringify(body));

    // Facebook envia: { url, signed_request, ... }
    // Em produção, processar a exclusão aqui

    return NextResponse.json({
      url: "https://zuary.vercel.app/legal/data-deletion",
      confirmation_code: "zuary_deletion_" + Date.now(),
    }, { status: 200 });
  } catch {
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }
}
