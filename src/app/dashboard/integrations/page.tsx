// Centro de Integrações — Gerenciar conexões OAuth
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Music2,
  Globe,
  MapPin,
  MessageCircle,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Unplug,
  Shield,
  Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Configuração de todas as integrações suportadas
const integrationConfigs = [
  {
    type: "INSTAGRAM",
    name: "Instagram",
    description: "Métricas de engajamento, seguidores, alcance e posts",
    icon: Camera,
    color: "#E1306C",
    scopes: ["instagram_basic", "instagram_manage_insights", "pages_show_list", "pages_read_engagement"],
    oauthUrl: "/api/integrations/instagram",
    compliance: "Meta Graph API — Acesso read-only para analytics",
  },
  {
    type: "GOOGLE_ANALYTICS",
    name: "Google Analytics 4",
    description: "Sessões, pageviews, taxa de rejeição, origem do tráfego",
    icon: Globe,
    color: "#F59E0B",
    scopes: ["analytics.readonly"],
    oauthUrl: "/api/integrations/google",
    compliance: "GA4 Data API — Acesso read-only para relatórios",
  },
  {
    type: "GOOGLE_BUSINESS",
    name: "Google Meu Negócio",
    description: "Visualizações, avaliações, ações do perfil no Maps",
    icon: MapPin,
    color: "#10B981",
    scopes: ["business.manage"],
    oauthUrl: "/api/integrations/google",
    compliance: "Business Profile API — Acesso read-only para insights",
  },
  {
    type: "TIKTOK",
    name: "TikTok",
    description: "Seguidores, visualizações, curtidas, audiência",
    icon: Music2,
    color: "#000000",
    scopes: ["user.info.basic", "video.list"],
    oauthUrl: null,
    compliance: "Display API — Acesso read-only para analytics",
  },
  {
    type: "META_PIXEL",
    name: "Meta Pixel",
    description: "Conversões server-side via Conversions API",
    icon: Globe,
    color: "#7C3AED",
    scopes: [],
    oauthUrl: null,
    compliance: "Conversions API — Rastreamento de eventos server-side",
  },
  {
    type: "WHATSAPP_BUSINESS",
    name: "WhatsApp Business",
    description: "Mensagens recebidas e tempo de resposta",
    icon: MessageCircle,
    color: "#10B981",
    scopes: [],
    oauthUrl: null,
    compliance: "WhatsApp Business API — Métricas de atendimento",
  },
];

export default function IntegrationsPage() {
  const [statusMap] = useState<Record<string, string>>({
    INSTAGRAM: "CONNECTED",
    GOOGLE_ANALYTICS: "CONNECTED",
    GOOGLE_BUSINESS: "CONNECTED",
    TIKTOK: "DISCONNECTED",
    META_PIXEL: "ERROR",
    WHATSAPP_BUSINESS: "DISCONNECTED",
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return <Badge variant="success"><Check className="h-3 w-3 mr-1" /> Conectado</Badge>;
      case "DISCONNECTED":
        return <Badge variant="secondary"><X className="h-3 w-3 mr-1" /> Desconectado</Badge>;
      case "ERROR":
        return <Badge variant="danger"><AlertTriangle className="h-3 w-3 mr-1" /> Erro</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Centro de Integrações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Conecte suas plataformas de marketing via OAuth seguro
        </p>
      </div>

      {/* Aviso de segurança */}
      <Card className="border-[#10B981]/20 bg-[#10B981]/[0.03]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#10B981]">Segurança OAuth</p>
              <p className="text-xs text-muted-foreground mt-1">
                Todos os tokens são encriptografados com AES-256-GCM. Nenhuma senha é coletada. Você pode revogar o acesso a qualquer momento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de integrações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrationConfigs.map((config, index) => {
          const status = statusMap[config.type] || "DISCONNECTED";
          const isConnected = status === "CONNECTED";
          const hasError = status === "ERROR";

          return (
            <motion.div
              key={config.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`transition-all ${
                  hasError
                    ? "border-[#EF4444]/20 bg-[#EF4444]/[0.03]"
                    : isConnected
                    ? "border-[#10B981]/20 bg-[#10B981]/[0.02]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.12]"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}15` }}
                      >
                        <config.icon className="h-5 w-5" style={{ color: config.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{config.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(status)}
                  </div>

                  {/* Escopos solicitados */}
                  {config.scopes.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Key className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Permissões</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {config.scopes.map((scope) => (
                          <span
                            key={scope}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] border border-white/[0.06] text-muted-foreground"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compliance note */}
                  <p className="text-[11px] text-muted-foreground/60 mb-3">
                    {config.compliance}
                  </p>

                  {/* Botões de ação */}
                  <div className="flex gap-2">
                    {config.oauthUrl ? (
                      <Button
                        variant={isConnected ? "outline" : "default"}
                        size="sm"
                        className="flex-1 gap-2"
                      >
                        {isConnected ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5" />
                            Reconectar
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-3.5 w-3.5" />
                            Conectar via OAuth
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1 gap-2" disabled>
                        <ExternalLink className="h-3.5 w-3.5" />
                        Configurar
                      </Button>
                    )}
                    {isConnected && (
                      <Button variant="ghost" size="sm" className="gap-2 text-[#EF4444]">
                        <Unplug className="h-3.5 w-3.5" />
                        Desconectar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
