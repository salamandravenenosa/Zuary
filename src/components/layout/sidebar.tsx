// Sidebar colapsável — mobile + desktop + logout
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Globe, Share2, MapPin, FileText, Settings,
  Plug, Shield, ChevronLeft, ChevronRight, Sparkles, Menu, X, LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Site & Analytics", href: "/dashboard/site", icon: Globe },
  { label: "Redes Sociais", href: "/dashboard/social", icon: Share2 },
  { label: "Google Maps", href: "/dashboard/google", icon: MapPin },
  { label: "Relatórios", href: "/dashboard/relatorio", icon: FileText },
  { label: "Integrações", href: "/dashboard/integrations", icon: Plug },
];

const adminItems = [
  { label: "Administração", href: "/admin", icon: Settings },
];

interface SidebarProps {
  userRole?: string;
  clinicName?: string;
}

export function Sidebar({ userRole = "CLINIC", clinicName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Limpa cookies e redireciona
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/login";
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#7C3AED] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-foreground leading-none">Zuary</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[120px]">{clinicName || "Meu Negócio"}</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
              )}>
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {userRole === "ADMIN" && (
          <>
            <div className="py-2"><div className="h-px bg-border" /></div>
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
                  )}>
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Perfil + Logout */}
      <div className="p-3 border-t border-border space-y-1">
        <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
          <User className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Meu Perfil</span>}
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>

      {/* Botão colapsar (desktop) */}
      <div className="hidden lg:block p-3 border-t border-border">
        <button onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-9 rounded-lg bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Botão hamburger (mobile) */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-lg">
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Sidebar desktop */}
      <motion.aside initial={false} animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen border-r border-border bg-card flex-col">
        <NavContent />
      </motion.aside>

      {/* Sidebar mobile (overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-border bg-card flex flex-col">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
