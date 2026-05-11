// Sidebar colapsável da dashboard — navegação principal
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  Share2,
  MapPin,
  FileText,
  Settings,
  Plug,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// Itens de navegação da sidebar
const navItems = [
  {
    label: "Visão Geral",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Site & Analytics",
    href: "/dashboard/site",
    icon: Globe,
  },
  {
    label: "Redes Sociais",
    href: "/dashboard/social",
    icon: Share2,
  },
  {
    label: "Google Maps",
    href: "/dashboard/google",
    icon: MapPin,
  },
  {
    label: "Relatórios",
    href: "/dashboard/relatorio",
    icon: FileText,
  },
  {
    label: "Integrações",
    href: "/dashboard/integrations",
    icon: Plug,
  },
  {
    label: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Segurança",
    href: "/dashboard/security",
    icon: Shield,
  },
];

const adminItems = [
  {
    label: "Administração",
    href: "/admin",
    icon: Settings,
  },
];

interface SidebarProps {
  userRole?: string;
  clinicName?: string;
}

export function Sidebar({ userRole = "CLINIC", clinicName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-white/[0.08] bg-[#0A0A0F]/95 backdrop-blur-xl flex flex-col"
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-white/[0.08]">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#7C3AED] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="text-sm font-bold text-white leading-none">
                DentalMetrics
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {clinicName || "Sua Clínica"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-[#A78BFA]" : "text-muted-foreground"
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* Separator antes do admin */}
        {userRole === "ADMIN" && (
          <>
            <div className="py-2">
              <Separator className="opacity-50" />
            </div>
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-[#A78BFA]" : "text-muted-foreground"
                    )}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Botão colapsar */}
      <div className="p-3 border-t border-white/[0.08]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
