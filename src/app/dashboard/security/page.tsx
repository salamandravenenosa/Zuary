// Página de Segurança — Logs, sessões, criptografia
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Lock,
  Key,
  Eye,
  Clock,
  Monitor,
  Smartphone,
  AlertTriangle,
  Check,
} from "lucide-react";

// Mock: sessões ativas
const activeSessions = [
  {
    id: "1",
    device: "Chrome em MacOS",
    ip: "189.***.***.42",
    location: "São Paulo, SP",
    lastActive: "Agora",
    current: true,
  },
  {
    id: "2",
    device: "Safari em iPhone",
    ip: "177.***.***.18",
    location: "São Paulo, SP",
    lastActive: "Há 2 horas",
    current: false,
  },
];

// Mock: logs de auditoria recentes
const auditLogs = [
  { action: "Login realizado", time: "Hoje, 09:15", ip: "189.***.***.42", status: "success" },
  { action: "Instagram conectado", time: "Ontem, 14:30", ip: "189.***.***.42", status: "success" },
  { action: "Token Instagram renovado", time: "Ontem, 14:30", ip: "sistema", status: "success" },
  { action: "Tentativa de login falhou", time: "10/05, 22:10", ip: "201.***.***.55", status: "error" },
  { action: "Google Analytics conectado", time: "10/05, 10:00", ip: "189.***.***.42", status: "success" },
  { action: "Relatório mensal gerado", time: "09/05, 16:45", ip: "189.***.***.42", status: "success" },
];

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Segurança</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sessões, logs de auditoria e configurações de segurança
        </p>
      </div>

      {/* Status de segurança */}
      <Card className="border-[#10B981]/20 bg-[#10B981]/[0.03]">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#10B981]/15 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#10B981]">Sua conta está segura</p>
              <p className="text-xs text-muted-foreground">
                Todos os tokens estão encriptografados (AES-256-GCM). Última revisão de segurança: há 7 dias.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessões ativas */}
        <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4 text-[#7C3AED]" />
              Sessões Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {session.device}
                        {session.current && (
                          <Badge variant="success" className="ml-2 text-[10px]">Atual</Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.ip} · {session.location} · {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-[#EF4444] text-xs">
                      Revogar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações de criptografia */}
        <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#10B981]" />
              Criptografia & Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Tokens OAuth", detail: "AES-256-GCM", status: "active" },
                { label: "Senhas", detail: "bcrypt (salt rounds: 12)", status: "active" },
                { label: "Comunicação", detail: "TLS 1.3 / HTTPS", status: "active" },
                { label: "Sessões", detail: "JWT com expiração 24h", status: "active" },
                { label: "Rate Limiting", detail: "Upstash Redis (60 req/min)", status: "active" },
                { label: "Isolamento", detail: "Multi-tenant por clinicId", status: "active" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground font-mono">{item.detail}</p>
                  </div>
                  <Check className="h-4 w-4 text-[#10B981]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs de auditoria */}
      <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#F59E0B]" />
              Logs de Auditoria
            </CardTitle>
            <Button variant="outline" size="sm">Exportar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">Ação</th>
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">Data/Hora</th>
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase">IP</th>
                  <th className="text-right py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={index} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-3 text-foreground">{log.action}</td>
                    <td className="py-3 text-muted-foreground">{log.time}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{log.ip}</td>
                    <td className="py-3 text-right">
                      <Badge variant={log.status === "success" ? "success" : "danger"}>
                        {log.status === "success" ? "Sucesso" : "Falha"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
