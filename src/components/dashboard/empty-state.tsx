// Componente de estado vazio para telas sem dados
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plug, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel = "Conectar integração", actionHref = "/dashboard/integrations" }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-dashed border-border bg-card/50">
        <CardContent className="p-12 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Plug className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
          <Link href={actionHref}>
            <Button className="gap-2">
              {actionLabel} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
