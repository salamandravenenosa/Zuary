// Página de Configurações do Usuário
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Bell, Palette, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie seu perfil, notificações e preferências
        </p>
      </div>

      {/* Perfil */}
      <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-[#7C3AED]" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Nome</label>
              <Input defaultValue="Dr. João Silva" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Email</label>
              <Input defaultValue="joao@clinicasorriso.com.br" disabled />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Clínica</label>
            <Input defaultValue="Clínica Sorriso Odontologia" />
          </div>
          <Button size="sm" className="gap-2">
            <Save className="h-3.5 w-3.5" />
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#10B981]" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div>
              <p className="text-sm font-medium text-foreground">Senha</p>
              <p className="text-xs text-muted-foreground">Última alteração: há 30 dias</p>
            </div>
            <Button variant="outline" size="sm">Alterar Senha</Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div>
              <p className="text-sm font-medium text-foreground">Sessões Ativas</p>
              <p className="text-xs text-muted-foreground">2 dispositivos conectados</p>
            </div>
            <Button variant="outline" size="sm">Gerenciar</Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div>
              <p className="text-sm font-medium text-foreground">Autenticação em Duas Etapas</p>
              <p className="text-xs text-muted-foreground">Recomendado para maior segurança</p>
            </div>
            <Button variant="outline" size="sm">Ativar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#F59E0B]" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Meta atingida", desc: "Quando uma meta mensal é alcançada", defaultChecked: true },
            { label: "Erro de integração", desc: "Quando uma conexão falha", defaultChecked: true },
            { label: "Relatório pronto", desc: "Quando o relatório mensal é gerado", defaultChecked: true },
            { label: "Dicas de marketing", desc: "Sugestões semanais de melhoria", defaultChecked: false },
          ].map((item) => (
            <label key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={item.defaultChecked}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.04] accent-[#7C3AED]"
              />
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
