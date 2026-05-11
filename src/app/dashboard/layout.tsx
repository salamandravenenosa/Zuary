// Layout da dashboard — sidebar + header
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [period, setPeriod] = useState("30d");
  const [clinicName, setClinicName] = useState("Meu Negócio");
  const [userRole, setUserRole] = useState("CLINIC");

  // Busca dados do usuário da sessão
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setClinicName(data.user.name || "Meu Negócio");
          setUserRole(data.user.role || "CLINIC");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Sidebar userRole={userRole} clinicName={clinicName} />
      <div className="pl-[260px] transition-all duration-200">
        <Header
          clinicName={clinicName}
          period={period}
          onPeriodChange={setPeriod}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
