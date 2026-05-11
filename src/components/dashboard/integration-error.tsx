// Card de erro de integração com botão de reconectar
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";

interface IntegrationErrorProps {
  type: string;
  errorMessage?: string;
  onReconnect?: () => void;
}

// Mapeamento de nomes amigáveis por tipo de integração
const integrationNames: Record<string, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  GOOGLE_ANALYTICS: "Google Analytics",
  GOOGLE_BUSINESS: "Google Meu Negócio",
  META_PIXEL: "Meta Pixel",
  WHATSAPP_BUSINESS: "WhatsApp Business",
};

export function IntegrationErrorCard({
  type,
  errorMessage = "Não foi possível conectar. Verifique as credenciais.",
  onReconnect,
}: IntegrationErrorProps) {
  return (
    <Card className="border-[#EF4444]/20 bg-[#EF4444]/[0.03]">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-[#EF4444]/15 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {integrationNames[type] || type} — Erro de conexão
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {errorMessage}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReconnect}
            className="flex-shrink-0 gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reconectar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
