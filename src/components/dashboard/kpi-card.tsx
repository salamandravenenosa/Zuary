// KPI Card — card de métrica com contador animado, tooltip e badge de comparação
"use client";

import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  Trophy,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number;
  previousValue?: number;
  prefix?: string;
  suffix?: string;
  tooltip: string;
  icon: React.ReactNode;
  color?: string;
  goal?: number;
  formatAsDecimal?: boolean;
}

// Componente de número animado — conta de 0 até o valor final
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  formatAsDecimal = false,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  formatAsDecimal?: boolean;
}) {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (latest) => {
    const num = formatAsDecimal
      ? latest.toFixed(1)
      : formatNumber(Math.round(latest));
    return `${prefix}${num}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [value, motionVal]);

  return <motion.span>{display}</motion.span>;
}

// Badge que mostra variação vs período anterior
function ComparisonBadge({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined || previous === null) return null;

  const change = previous === 0
    ? (current > 0 ? 100 : 0)
    : ((current - previous) / previous) * 100;

  const isUp = change > 0;
  const isDown = change < 0;
  const isNeutral = change === 0;

  return (
    <Badge
      variant={isUp ? "up" : isDown ? "down" : "secondary"}
      className="text-xs gap-1"
    >
      {isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : isDown ? (
        <TrendingDown className="h-3 w-3" />
      ) : (
        <Minus className="h-3 w-3" />
      )}
      {Math.abs(change).toFixed(1)}% vs período anterior
    </Badge>
  );
}

export function KpiCard({
  title,
  value,
  previousValue,
  prefix = "",
  suffix = "",
  tooltip,
  icon,
  color = "#7C3AED",
  goal,
  formatAsDecimal = false,
}: KpiCardProps) {
  const achieved = goal ? value >= goal : false;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        achieved &&
          "border-[#10B981]/30 bg-[#10B981]/[0.03]"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          {/* Ícone + Label */}
          <div className="flex items-center gap-2">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <div style={{ color }}>{icon}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground font-medium">
                {title}
              </span>
              {/* Tooltip explicativo */}
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[250px]">
                  <p className="text-xs leading-relaxed">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Ícone de troféu quando atinge meta */}
          {achieved && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="h-8 w-8 rounded-full bg-[#10B981]/15 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-[#10B981]" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Valor principal animado */}
        <div className="mt-4 mb-2">
          <span className="text-3xl font-bold text-white tracking-tight">
            <AnimatedNumber
              value={value}
              prefix={prefix}
              suffix={suffix}
              formatAsDecimal={formatAsDecimal}
            />
          </span>
        </div>

        {/* Badge de comparação */}
        <ComparisonBadge current={value} previous={previousValue} />

        {/* Barra de progresso da meta */}
        {goal && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Meta: {formatNumber(goal)}</span>
              <span>{Math.min(100, Math.round((value / goal) * 100))}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (value / goal) * 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: achieved ? "#10B981" : color,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
