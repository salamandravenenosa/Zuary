// Utilitários gerais do projeto
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina classes Tailwind sem conflito
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formata números grandes: 1234 → "1.234"
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("pt-BR").format(num);
}

// Formata percentual: 12.34 → "12,3%"
export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}

// Calcula variação percentual entre dois valores
export function calcChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Formata data para pt-BR
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// Formata data curta
export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
}

// Gera range de datas para período
export function getDateRange(period: string): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date();

  switch (period) {
    case "7d":
      from.setDate(to.getDate() - 7);
      break;
    case "30d":
      from.setDate(to.getDate() - 30);
      break;
    case "90d":
      from.setDate(to.getDate() - 90);
      break;
    default:
      from.setDate(to.getDate() - 30);
  }

  return { from, to };
}

// Debounce simples
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
