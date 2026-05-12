// Página de cadastro de empresa — bonita e fluida
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Building2, Globe, Phone, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const industries = [
  "Clínica Odontológica", "Estúdio de Beleza", "Restaurante",
  "Loja Virtual", "Escritório Advocacia", "Academia",
  "Pet Shop", "Farmácia", "Consultório", "Outro",
];

export default function CreateBusinessPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) { setError("Nome é obrigatório"); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), industry, phone, website }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard/integrations");
      } else {
        setError(data.error || "Erro ao criar empresa");
      }
    } catch {
      setError("Erro ao criar empresa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-[#7C3AED] flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Zuary</h1>
            <p className="text-sm text-muted-foreground">Crie sua empresa</p>
          </div>
        </div>

        {/* Progresso */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {[1, 2].map((s) => (
            <div key={s} className={cn("h-1.5 rounded-full transition-all duration-300", s <= step ? "w-8 bg-[#7C3AED]" : "w-4 bg-white/10")} />
          ))}
        </div>

        <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
          <CardContent className="p-8">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 mb-4">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-[#7C3AED]/15 flex items-center justify-center mx-auto mb-3">
                    <Building2 className="h-7 w-7 text-[#7C3AED]" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Qual o nome do seu negócio?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Esse nome aparecerá na sua dashboard</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Nome da empresa *</label>
                  <Input placeholder="Ex: Studio Beauty, Clínica Sorriso..." value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} className="h-11" />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Segmento</label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((ind) => (
                      <button key={ind} onClick={() => setIndustry(ind)}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          industry === ind ? "bg-[#7C3AED]/15 border-[#7C3AED]/30 text-[#A78BFA]" : "border-white/[0.08] text-muted-foreground hover:border-white/[0.15]"
                        )}>
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => { if (name.trim()) setStep(2); }} className="w-full h-11 gap-2" disabled={!name.trim()}>
                  Próximo <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-[#10B981]/15 flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-7 w-7 text-[#10B981]" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Informações adicionais</h2>
                  <p className="text-sm text-muted-foreground mt-1">Opcional — pode pular</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Telefone</label>
                  <Input placeholder="(11) 99999-9999" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Website</label>
                  <Input placeholder="https://seusite.com.br" value={website} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)} />
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Voltar</Button>
                  <Button onClick={handleCreate} className="flex-1 gap-2" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Criar Empresa
                  </Button>
                </div>
                <button onClick={handleCreate} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pular esta etapa
                </button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
