// Layout da dashboard — sidebar + header + conteúdo principal
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [period, setPeriod] = useState("30d");

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Sidebar colapsável */}
      <Sidebar userRole="ADMIN" clinicName="Clínica Sorriso" />

      {/* Área principal — conteúdo + header */}
      <div className="pl-[260px] transition-all duration-200">
        <Header
          clinicName="Clínica Sorriso"
          period={period}
          onPeriodChange={setPeriod}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
