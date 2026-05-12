// Página de perfil do usuário
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, Save, Loader2, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setName(data.user.name || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  const handleLogout = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/login";
  };

  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    AGENCY: "Agência",
    CLINIC: "Usuário",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie suas informações pessoais</p>
      </div>

      {/* Card do perfil */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{user?.name || "Usuário"}</CardTitle>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Nome</label>
                <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                <Input value={user?.email || ""} disabled />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" /> {roleLabels[user?.role] || user?.role}
              </Badge>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" /> Sair da conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Informações da conta */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <span className="text-sm text-muted-foreground">Plano</span>
                <Badge variant="success">Grátis</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <span className="text-sm text-muted-foreground">Integrações ativas</span>
                <span className="text-sm font-medium text-foreground">0 de 6</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <span className="text-sm text-muted-foreground">Membro desde</span>
                <span className="text-sm font-medium text-foreground">Maio 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
