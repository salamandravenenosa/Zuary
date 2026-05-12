// Layout da dashboard — responsivo
"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
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
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} clinicName={clinicName} />
      <div className="lg:pl-[260px] transition-all duration-200">
        <Header clinicName={clinicName} period={period} onPeriodChange={setPeriod} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
