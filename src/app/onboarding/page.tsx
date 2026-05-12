// Página de onboarding — guia o novo usuário a configurar
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Camera, Globe, MapPin, Music2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    title: "Bem-vindo ao Zuary!",
    description: "Vamos configurar sua empresa em poucos passos.",
    icon: Sparkles,
    color: "#7C3AED",
  },
  {
    title: "Cadastre sua empresa",
    description: "Dê um nome ao seu negócio para começar.",
    icon: Building2,
    color: "#10B981",
    action: "/onboarding/create",
  },
  {
    title: "Conecte suas redes sociais",
    description: "Instagram e TikTok — veja métricas de engajamento, seguidores e alcance em tempo real.",
    icon: Camera,
    color: "#E1306C",
    integrations: ["Instagram", "TikTok"],
  },
  {
    title: "Conecte seu site",
    description: "Google Analytics — sessões, taxa de rejeição, origem do tráfego e páginas mais visitadas.",
    icon: Globe,
    color: "#F59E0B",
    integrations: ["Google Analytics"],
  },
  {
    title: "Google Maps",
    description: "Veja visualizações do seu perfil, avaliações, cliques em ligar e rotas.",
    icon: MapPin,
    color: "#10B981",
    integrations: ["Google Meu Negócio"],
  },
  {
    title: "Pronto!",
    description: "Suas métricas começam a aparecer em até 24 horas. Explore a dashboard!",
    icon: Sparkles,
    color: "#7C3AED",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (current.action) {
      router.push(current.action);
      return;
    }
    if (isLast) {
      router.push("/dashboard/integrations");
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-lg">
        {/* Progresso */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {steps.map((_, i) => (
            <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i <= step ? "w-8 bg-[#7C3AED]" : "w-4 bg-white/10")} />
          ))}
        </div>

        <Card className="border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <motion.div key={step} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${current.color}15` }}>
                <current.icon className="h-8 w-8" style={{ color: current.color }} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.description}</p>

              {current.integrations && (
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {current.integrations.map((integ) => (
                    <Badge key={integ} variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" /> {integ}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>

            <div className="flex gap-3 justify-center">
              {step > 0 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>Voltar</Button>
              )}
              {isLast ? (
                <Button onClick={() => router.push("/dashboard/integrations")} className="gap-2">
                  Ir para Integrações <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  {current.action ? "Começar" : "Próximo"} <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {!isLast && (
              <button onClick={() => router.push("/dashboard")} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Pular onboarding
              </button>
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
