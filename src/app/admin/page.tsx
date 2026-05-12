// Página /admin — área da agência: cadastrar clientes, conectar integrações, definir metas
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Plus,
  Camera,
  Music2,
  Globe,
  MapPin,
  MessageCircle,
  Check,
  X,
  Trophy,
  Target,
  Users,
  AlertTriangle,
  ExternalLink,
  Save,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Mapeamento de integrações com ícones e nomes
const integrations = [
  { type: "INSTAGRAM", name: "Instagram", icon: Camera, color: "#E1306C", oauthUrl: "/api/integrations/instagram" },
  { type: "TIKTOK", name: "TikTok", icon: Music2, color: "#000000", oauthUrl: null },
  { type: "GOOGLE_ANALYTICS", name: "Google Analytics", icon: Globe, color: "#F59E0B", oauthUrl: "/api/integrations/google" },
  { type: "GOOGLE_BUSINESS", name: "Google Meu Negócio", icon: MapPin, color: "#10B981", oauthUrl: "/api/integrations/google" },
  { type: "META_PIXEL", name: "Meta Pixel", icon: Globe, color: "#7C3AED", oauthUrl: null },
  { type: "WHATSAPP_BUSINESS", name: "WhatsApp Business", icon: MessageCircle, color: "#10B981", oauthUrl: null },
];

// Métricas disponíveis para definir metas
const metricOptions = [
  { key: "site_sessions", label: "Sessões no Site", icon: Globe },
  { key: "leads", label: "Leads Gerados", icon: Users },
  { key: "instagram_followers", label: "Seguidores Instagram", icon: Camera },
  { key: "tiktok_followers", label: "Seguidores TikTok", icon: Music2 },
  { key: "google_rating", label: "Nota Google", icon: Target },
  { key: "google_reviews", label: "Avaliações Google", icon: Target },
];

// Dados mockados de clientes
const mockClients = [
  {
    id: "1",
    name: "Empresa Sorriso Odontologia",
    slug: "clinica-sorriso",
    integrations: {
      INSTAGRAM: { status: "CONNECTED", platformName: "@clinicasorriso" },
      GOOGLE_ANALYTICS: { status: "CONNECTED", platformName: "GA4 - Sorriso" },
      GOOGLE_BUSINESS: { status: "CONNECTED", platformName: "Empresa Sorriso" },
      TIKTOK: { status: "DISCONNECTED" },
      META_PIXEL: { status: "ERROR", errorMessage: "Token expirado" },
      WHATSAPP_BUSINESS: { status: "CONNECTED" },
    },
    goals: [
      { metric: "site_sessions", target: 5000, current: 4832, month: 4 },
      { metric: "leads", target: 200, current: 187, month: 4 },
      { metric: "instagram_followers", target: 9000, current: 8450, month: 4 },
    ],
  },
  {
    id: "2",
    name: "Odonto Elite",
    slug: "odonto-elite",
    integrations: {
      INSTAGRAM: { status: "CONNECTED", platformName: "@odontoelite" },
      GOOGLE_ANALYTICS: { status: "DISCONNECTED" },
      GOOGLE_BUSINESS: { status: "CONNECTED", platformName: "Odonto Elite" },
      TIKTOK: { status: "DISCONNECTED" },
      META_PIXEL: { status: "DISCONNECTED" },
      WHATSAPP_BUSINESS: { status: "DISCONNECTED" },
    },
    goals: [
      { metric: "site_sessions", target: 3000, current: 2100, month: 4 },
      { metric: "leads", target: 150, current: 89, month: 4 },
    ],
  },
];

export default function AdminPage() {
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [saving, setSaving] = useState(false);
  const [goalValues, setGoalValues] = useState<Record<string, number>>(
    selectedClient.goals.reduce((acc, g) => ({ ...acc, [g.metric]: g.target }), {})
  );

  // Salvar metas
  const handleSaveGoals = async () => {
    setSaving(true);
    // Em produção: POST /api/admin/goals
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  // Status da integração
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
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Header admin */}
      <div className="border-b border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#7C3AED] flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Painel Admin</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie clientes, integrações e metas
                </p>
              </div>
            </div>
            <Button onClick={() => setShowNewClient(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Empresa
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Modal nova empresa */}
        <AnimatePresence>
          {showNewClient && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <Card className="border-[#7C3AED]/20 bg-[#7C3AED]/[0.03]">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Cadastrar Nova Empresa
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Nome da empresa"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                    />
                    <Input placeholder="CNPJ (opcional)" />
                    <Input placeholder="Telefone" />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="success" className="gap-2">
                      <Save className="h-4 w-4" />
                      Cadastrar
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowNewClient(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de clientes */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Clientes
            </h2>
            <div className="space-y-2">
              {mockClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client);
                    setGoalValues(
                      client.goals.reduce(
                        (acc, g) => ({ ...acc, [g.metric]: g.target }),
                        {}
                      )
                    );
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedClient.id === client.id
                      ? "border-[#7C3AED]/30 bg-[#7C3AED]/[0.05]"
                      : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">
                    {client.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.values(client.integrations).filter(
                      (i) => i.status === "CONNECTED"
                    ).length}{" "}
                    de {integrations.length} integrações ativas
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Detalhes do cliente selecionado */}
          <div className="lg:col-span-3 space-y-6">
            {/* Integrações */}
            <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">
                  Integrações — {selectedClient.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {integrations.map((integ) => {
                        const status = selectedClient.integrations[
                            integ.type as keyof typeof selectedClient.integrations
                          ] as any;
                        const isConnected = status?.status === "CONNECTED";
                        const hasError = status?.status === "ERROR";

                    return (
                      <div
                        key={integ.type}
                        className={`p-4 rounded-xl border transition-all ${
                          hasError
                            ? "border-[#EF4444]/20 bg-[#EF4444]/[0.03]"
                            : isConnected
                            ? "border-[#10B981]/20 bg-[#10B981]/[0.03]"
                            : "border-white/[0.08] bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-8 w-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: `${integ.color}15`,
                              }}
                            >
                              <integ.icon
                                className="h-4 w-4"
                                style={{ color: integ.color }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {integ.name}
                            </span>
                          </div>
                          {getStatusBadge(status?.status || "DISCONNECTED")}
                        </div>

                        {status?.platformName && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {status.platformName}
                          </p>
                        )}

                        {hasError && status.errorMessage && (
                          <p className="text-xs text-[#EF4444] mb-2">
                            {status.errorMessage}
                          </p>
                        )}

                        {integ.oauthUrl ? (
                          <Button
                            variant={isConnected ? "outline" : "default"}
                            size="sm"
                            className="w-full gap-2 mt-2"
                            onClick={() => {
                              // Em produção: redireciona para OAuth
                              window.location.href = `${integ.oauthUrl}?clinicId=${selectedClient.id}`;
                            }}
                          >
                            {isConnected ? (
                              <>
                                <ExternalLink className="h-3 w-3" />
                                Reconectar
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-3 w-3" />
                                Conectar
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="mt-2">
                            <Input
                              placeholder={
                                integ.type === "META_PIXEL"
                                  ? "Pixel ID"
                                  : integ.type === "TIKTOK"
                                  ? "TikTok Access Token"
                                  : "Token / ID"
                              }
                              className="h-8 text-xs"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Metas Mensais */}
            <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#7C3AED]" />
                    Metas Mensais — Abril 2026
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={handleSaveGoals}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    Salvar Metas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metricOptions.map((metric) => {
                    const goal = selectedClient.goals.find(
                      (g) => g.metric === metric.key
                    );
                    const currentValue = goal?.current || 0;
                    const targetValue = goalValues[metric.key] || goal?.target || 0;
                    const achieved = currentValue >= targetValue;
                    const progress = targetValue > 0
                      ? Math.min(100, (currentValue / targetValue) * 100)
                      : 0;

                    return (
                      <div
                        key={metric.key}
                        className={`p-4 rounded-xl border transition-all ${
                          achieved
                            ? "border-[#10B981]/20 bg-[#10B981]/[0.03]"
                            : "border-white/[0.08] bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <metric.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
                              {metric.label}
                            </span>
                            {achieved && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Trophy className="h-4 w-4 text-[#10B981]" />
                              </motion.div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Atual:{" "}
                            <span className="font-semibold text-foreground">
                              {currentValue.toLocaleString("pt-BR")}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{
                                  backgroundColor: achieved
                                    ? "#10B981"
                                    : "#7C3AED",
                                }}
                              />
                            </div>
                          </div>
                          <input
                            type="number"
                            value={targetValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setGoalValues((prev) => ({
                                ...prev,
                                [metric.key]: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-24 h-8 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 text-sm text-foreground text-right focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
