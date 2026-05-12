// Header — tema + período + notificações
"use client";

import React from "react";
import { Bell, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  clinicName?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const periods = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
];

export function Header({ clinicName = "Meu Negócio", period = "30d", onPeriodChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Espaço para hamburger no mobile */}
        <div className="w-10 lg:hidden" />

        {/* Busca */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar..."
            className="h-9 w-56 lg:w-64 rounded-lg border border-border bg-accent/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
        </div>

        {/* Direita */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-[140px] lg:w-[180px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ThemeToggle />

          <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
              {clinicName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
