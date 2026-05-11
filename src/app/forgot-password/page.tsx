// Página "Esqueci a senha" — envia link de redefinição
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simula envio — em produção, chama API de email
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-[#7C3AED] flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Zuary</h1>
            <p className="text-sm text-muted-foreground">Recuperar senha</p>
          </div>
        </div>

        <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle>Esqueceu a senha?</CardTitle>
            <CardDescription>
              {sent
                ? "Enviamos um link de redefinição para seu email."
                : "Digite seu email e enviaremos um link para redefinir sua senha."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-[#10B981] mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Verifique sua caixa de entrada em <strong className="text-foreground">{email}</strong>
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enviando...</> : "Enviar link de redefinição"}
                </Button>
              </form>
            )}
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Voltar ao login
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
