// Reset password inner — usa useSearchParams
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
        <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-[#EF4444] mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white mb-2">Link inválido</h2>
            <p className="text-sm text-muted-foreground mb-4">O link de redefinição é inválido ou expirou.</p>
            <Link href="/forgot-password"><Button>Solicitar novo link</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("As senhas não coincidem"); return; }
    if (password.length < 8) { setError("Mínimo 8 caracteres"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.error || "Erro ao redefinir");
    } catch { setError("Erro ao redefinir senha"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0"><div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-[#7C3AED] flex items-center justify-center"><Sparkles className="h-6 w-6 text-white" /></div>
          <h1 className="text-2xl font-bold text-white">Zuary</h1>
        </div>
        <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
          <CardHeader className="text-center"><CardTitle>{success ? "Senha redefinida!" : "Nova senha"}</CardTitle></CardHeader>
          <CardContent>
            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-[#10B981] mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Senha redefinida com sucesso.</p>
                <Link href="/login"><Button>Fazer login</Button></Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20"><AlertCircle className="h-4 w-4 text-[#EF4444]" /><p className="text-sm text-[#EF4444]">{error}</p></div>}
                <div><label className="text-sm text-muted-foreground mb-1.5 block">Nova senha</label><Input type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required /></div>
                <div><label className="text-sm text-muted-foreground mb-1.5 block">Confirmar</label><Input type="password" placeholder="Repita a senha" value={confirm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)} required /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Redefinindo...</> : "Redefinir senha"}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
