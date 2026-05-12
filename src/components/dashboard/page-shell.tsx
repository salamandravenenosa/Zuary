"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardPageShellProps {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  status?: {
    label: string;
    tone?: "default" | "success" | "warning" | "danger";
  };
  children: React.ReactNode;
}

export function DashboardPageShell({
  eyebrow,
  title,
  description,
  icon,
  status,
  children,
}: DashboardPageShellProps) {
  return (
    <section className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card/45 px-5 py-5 backdrop-blur-xl sm:px-6"
      >
        <div className="metric-grid pointer-events-none absolute inset-0 opacity-35" />
        <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(124,58,237,0.9),rgba(216,180,254,0.72),transparent)]"
          initial={{ opacity: 0, scaleX: 0.45 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [0, 18, 0], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-4">
            {icon ? (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_32px_rgba(124,58,237,0.16)]">
                {icon}
              </div>
            ) : null}
            <div>
              {eyebrow ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
          {status ? (
            <Badge
              variant={status.tone === "default" ? "secondary" : status.tone}
              className="w-fit"
            >
              {status.label}
            </Badge>
          ) : null}
        </div>
      </motion.header>
      {children}
    </section>
  );
}

interface ChannelSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  connected: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ChannelSection({
  title,
  description,
  icon,
  accent,
  connected,
  children,
  className,
}: ChannelSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10"
            style={{ color: accent, boxShadow: `inset 0 0 24px ${accent}14, 0 0 22px rgba(124,58,237,0.12)` }}
          >
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Badge variant={connected ? "success" : "warning"}>
          {connected ? "Conectado" : "Não conectado"}
        </Badge>
      </div>
      {children}
    </section>
  );
}
