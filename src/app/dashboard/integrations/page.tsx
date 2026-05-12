// Centro de Integrações — status real + OAuth flows
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Music2, Globe, MapPin, MessageCircle,
  Check, X, AlertTriangle, ExternalLink, RefreshCw, Unplug, Shield, Key, Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const integrationConfigs = [
  {
    type: "INSTAGRAM",
    name: "Instagram",
    description: "Métricas de engajamento, seguidores, alcance e posts",
    icon: Camera,
    color: "#E1306C",
    scopes: ["instagram_basic", "instagram_manage_insights", "pages_show_list"],
    oauthUrl: "/api/integrations/instagram",
    compliance: "Meta Graph API — Read-only analytics",
  },
  {
    type: "GOOGLE_ANALYTICS",
    name: "Google Analytics 4",
    description: "Sessões, pageviews, taxa de rejeição, tráfego",
    icon: Globe,
    color: "#F59E0B",
    scopes: ["analytics.readonly"],
    oauthUrl: "/api/integrations/google",
    compliance: "GA4 Data API — Read-only reports",
  },
  {
    type: "GOOGLE_BUSINESS",
    name: "Google Meu Negócio",
    description: "Visualizações, avaliações, ações do perfil",
    icon: MapPin,
    color: "#10B981",
    scopes: ["business.manage"],
    oauthUrl: "/api/integrations/google",
    compliance: "Business Profile API — Read-only insights",
  },
  {
    type: "TIKTOK",
    name: "TikTok",
    description: "Seguidores, visualizações, curtidas, audiência",
    icon: Music2,
    color: "#000000",
    scopes: ["user.info.basic", "video.list"],
    oauthUrl: "/api/integrations/tiktok",
    compliance: "Display API — Read-only analytics",
  },
  {
    type: "META_PIXEL",
    name: "Meta Pixel",
    description: "Conversões server-side via Conversions API",
    icon: Globe,
    color: "#7C3AED",
    scopes: [],
    oauthUrl: null,
    compliance: "Conversions API — Server-side tracking",
  },
  {
    type: "WHATSAPP_BUSINESS",
    name: "WhatsApp Business",
    description: "Mensagens recebidas e tempo de resposta",
    icon: MessageCircle,
    color: "#10B981",
    scopes: [],
    oauthUrl: null,
    compliance: "WhatsApp Business API — Metrics",
  },
];

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const [statuses, setStatuses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [clinicId, setClinicId] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Verifica params de sucesso/erro na URL
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success) {
      setNotification({ type: "success", message: `Integração conectada com sucesso!` });
      // Limpa a URL
      window.history.replaceState({}, "", "/dashboard/integrations");
    }
    if (error) {
      setNotification({ type: "error", message: decodeURIComponent(error) });
      window.history.replaceState({}, "", "/dashboard/integrations");
    }
  }, [searchParams]);

  // Busca dados
  const fetchData = () => {
    fetch("/api/integrations/status")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, any> = {};
        data.integrations?.forEach((i: any) => { map[i.type] = i; });
        setStatuses(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.clinicId) setClinicId(data.user.clinicId);
      })
      .catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-refresh após notificação de sucesso
  useEffect(() => {
    if (notification?.type === "success") {
      const timer = setTimeout(() => fetchData(), 1000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONNECTED": return <Badge variant="success"><Check className="h-3 w-3 mr-1" /> Conectado</Badge>;
      case "ERROR": return <Badge variant="danger"><AlertTriangle className="h-3 w-3 mr-1" /> Erro</Badge>;
      default: return <Badge variant="secondary"><X className="h-3 w-3 mr-1" /> Desconectado</Badge>;
    }
  };

  const handleConnect = (oauthUrl: string) => {
    // Adiciona clinicId na URL
    const separator = oauthUrl.includes("?") ? "&" : "?";
    window.location.href = `${oauthUrl}${separator}clinicId=${clinicId}`;
  };

  return (
    <div className="space-y-6">
      {/* Notificação */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border",
              notification.type === "success"
                ? "bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]"
                : "bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]"
            )}
          >
            {notification.type === "success" ? <Check className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrações</h1>
        <p className="text-sm text-muted-foreground mt-1">Conecte suas plataformas via OAuth seguro</p>
      </div>

      <Card className="border-[#10B981]/20 bg-[#10B981]/[0.03]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#10B981]">Segurança OAuth</p>
              <p className="text-xs text-muted-foreground mt-1">
                Todos os tokens são encriptografados com AES-256-GCM. Nenhuma senha é coletada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrationConfigs.map((config, index) => {
          const status = statuses[config.type];
          const isConnected = status?.status === "CONNECTED";
          const hasError = status?.status === "ERROR";

          return (
            <motion.div key={config.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className={`transition-all ${hasError ? "border-[#EF4444]/20 bg-[#EF4444]/[0.03]" : isConnected ? "border-[#10B981]/20 bg-[#10B981]/[0.02]" : "border-border bg-card hover:border-border/60"}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
                        <config.icon className="h-5 w-5" style={{ color: config.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{config.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                      </div>
                    </div>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : getStatusBadge(status?.status || "DISCONNECTED")}
                  </div>

                  {status?.platformName && (
                    <p className="text-xs text-muted-foreground mb-2">Perfil: {status.platformName}</p>
                  )}

                  {config.scopes.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Key className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Permissões</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {config.scopes.map((scope) => (
                          <span key={scope} className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/50 border border-border text-muted-foreground">{scope}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground/60 mb-3">{config.compliance}</p>

                  <div className="flex gap-2">
                    {config.oauthUrl ? (
                      <Button variant={isConnected ? "outline" : "default"} size="sm" className="flex-1 gap-2"
                        onClick={() => handleConnect(config.oauthUrl!)}>
                        {isConnected ? <><RefreshCw className="h-3.5 w-3.5" /> Reconectar</> : <><ExternalLink className="h-3.5 w-3.5" /> Conectar</>}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1 gap-2" disabled>
                        <ExternalLink className="h-3.5 w-3.5" /> Configurar
                      </Button>
                    )}
                    {isConnected && (
                      <Button variant="ghost" size="sm" className="gap-2 text-red-400 hover:text-red-400 hover:bg-red-500/10">
                        <Unplug className="h-3.5 w-3.5" /> Desconectar
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
