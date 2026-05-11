// Header da dashboard — logo, nome da clínica, período selecionável, notificações
"use client";

import React from "react";
import { Bell, Search, LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  clinicName?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

// Períodos disponíveis para seleção
const periods = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "custom", label: "Personalizado" },
];

export function Header({
  clinicName = "Clínica Sorriso",
  period = "30d",
  onPeriodChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.08] bg-[#0A0A0F]/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        {/* Lado esquerdo — busca */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar métricas..."
              className="h-9 w-64 rounded-lg border border-white/[0.08] bg-white/[0.04] pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] transition-colors"
            />
          </div>
        </div>

        {/* Lado direito — período, notificações, avatar */}
        <div className="flex items-center gap-4">
          {/* Seletor de período */}
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Notificações */}
          <button className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#EF4444] animate-pulse" />
          </button>

          {/* Avatar / Perfil */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">{clinicName}</p>
              <p className="text-xs text-muted-foreground">Plano Premium</p>
            </div>
            <Avatar className="h-9 w-9 border border-white/[0.08]">
              <AvatarFallback className="bg-[#7C3AED]/20 text-[#A78BFA] text-sm font-bold">
                {clinicName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}

// Avatar e Button stubs (Shadcn componentes que usamos)
// Esses estão aqui para evitar imports circulares, mas em produção
// estariam em arquivos separados do Shadcn
