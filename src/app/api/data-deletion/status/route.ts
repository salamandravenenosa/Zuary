// Página de exclusão de dados — retorna 200 OK para crawlers
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Retorna HTML simples que qualquer crawler consegue ler
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Data Deletion - Zuary</title>
  <meta name="robots" content="index, follow">
</head>
<body>
  <h1>Data Deletion Instructions</h1>
  <p>To request deletion of your data from Zuary, contact us at privacy@zuary.vercel.app</p>
  <p>Or visit: <a href="https://zuary.vercel.app/legal/data-deletion">https://zuary.vercel.app/legal/data-deletion</a></p>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
