// KPI Card — card de métrica com contador animado, tooltip e badge de comparação
"use client";

import React from "react";
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

function FormattedNumber({
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
  const number = formatAsDecimal ? value.toFixed(1) : formatNumber(Math.round(value));
  return <>{prefix}{number}{suffix}</>;
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
        "zuary-panel-hover relative overflow-hidden",
        achieved &&
          "border-[#10B981]/30 bg-[#10B981]/[0.03]"
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
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
            <div className="h-8 w-8 rounded-full bg-[#10B981]/15 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-[#10B981]" />
            </div>
          )}
        </div>

        {/* Valor principal */}
        <div className="mt-4 mb-2">
          <span className="text-3xl font-bold text-foreground tracking-tight">
            <FormattedNumber
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
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (value / goal) * 100)}%`,
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
